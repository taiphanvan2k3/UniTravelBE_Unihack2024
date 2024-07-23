// geminiService.js

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const userPrompt =
    "Translate the name of dishes in the menu into Vietnamese. If the dishes have prices, display the prices in VND, with the currency included. In addition, if the dishes have descriptions, display them as well. Return json as an array of items with the following properties:\noriginalName (name before translating into Vietnamese), name (after translating), price (convert to Vietnam dong), description (translate to Vietnamese)\n";

class MenuExtractionService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.fileManager = new GoogleAIFileManager(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
    }

    async uploadToGemini(path, mimeType) {
        try {
            const uploadResult = await this.fileManager.uploadFile(path, {
                mimeType,
                displayName: path,
            });
            const file = uploadResult.file;
            console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
            return file;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

    async processFileWithGemini(path, mimeType) {
        try {
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
                                text: userPrompt,
                            },
                        ],
                    },
                ],
            });

            const result = await chatSession.sendMessage("INSERT_INPUT_HERE");

            // Lưu vào 1 file JSON
            const fs = require("fs");
            fs.writeFileSync(
                "output.json",
                result.response.text().replace("```json", "").replace("```", "")
            );
            return result.response.text();
        } catch (error) {
            console.error("Error processing file with Gemini:", error);
            throw error;
        }
    }
}

(async () => {
    const menuExtractionService = new MenuExtractionService(
        "AIzaSyDnK-VUFpDgdK6hWq-F5XYPQ-xg1CeLzsY"
    );
    await menuExtractionService.processFileWithGemini("demo2.jpg", "image/jpeg");
})();
