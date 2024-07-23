const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const { logInfo, logError } = require("../logger.service.js");

const { GoogleAIFileManager } = require("@google/generative-ai/server");
const vietnamesePrompt =
    "Translate the name of dishes in the menu into Vietnamese. If the dishes have prices, display the prices in VND, with the currency included. In addition, if the dishes have descriptions, display them as well. Return json as an array of items with the following properties:\noriginalName (name before translating into Vietnamese), name (after translating), price (convert to Vietnam dong), description (translate to Vietnamese)\n";
const englishPrompt =
    "Translate the name of dishes in the menu into English. If the dishes have prices, display the prices in USD, with the currency included. In addition, if the dishes have descriptions, display them as well. Return json as an array of items with the following properties:\noriginalName (name before translating into English), name (after translating), price (convert to USD), description (translate to English)\n";

class MenuExtractionService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.fileManager = new GoogleAIFileManager(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        logInfo("MenuExtractionService", "Initialized");
    }

    async uploadToGemini(path, mimeType) {
        try {
            const uploadResult = await this.fileManager.uploadFile(path, {
                mimeType,
                displayName: path,
            });
            const file = uploadResult.file;

            logInfo("uploadToGemini", `Uploaded file ${file.displayName}`);
            return file;
        } catch (error) {
            logError("uploadToGemini", error.message);
            throw error;
        }
    }

    async translateMenu(path, mimeType, language) {
        try {
            logInfo("translateMenu", `Start processing file ${path}`);
            const file = await this.uploadToGemini(path, mimeType);
            const generationConfig = {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
            };

            const chatSession = this.model.startChat({
                generationConfig,
                history: [
                    {
                        role: "user",
                        parts: [
                            {
                                fileData: {
                                    mimeType: file.mimeType,
                                    fileUri: file.uri,
                                },
                            },
                            {
                                text:
                                    language === "vi"
                                        ? vietnamesePrompt
                                        : englishPrompt,
                            },
                        ],
                    },
                ],
            });

            const result = await chatSession.sendMessage("INSERT_INPUT_HERE");

            // Lưu vào 1 file JSON
            const fs = require("fs");
            fs.writeFileSync(
                "menu-translation-output.json",
                result.response.text().replace("```json", "").replace("```", "")
            );

            logInfo("translateMenu", "Processed file successfully");
            return JSON.parse(
                result.response.text().replace("```json", "").replace("```", "")
            );
        } catch (error) {
            logError("processFileWithGemini", error.message);
            throw error;
        }
    }
}

// (async () => {
//     const menuExtractionService = new MenuExtractionService(
//         "AIzaSyDnK-VUFpDgdK6hWq-F5XYPQ-xg1CeLzsY"
//     );
//     await menuExtractionService.processFileWithGemini(
//         "demo2.jpg",
//         "image/jpeg"
//     );
// })();

module.exports = new MenuExtractionService(process.env.GEMINI_API_KEY);
