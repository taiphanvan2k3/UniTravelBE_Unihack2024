const menuExtractionService = require("../services/gemini/menu-translation.service.js");
const fs = require("fs");

class GeminiController {
    async translateMenu(req, res, next) {
        try {
            const { images } = req.files;
            const { language } = req.body;

            if (images && images.length === 0) {
                return res.status(400).json({
                    error: "No image uploaded",
                });
            }

            const content = await menuExtractionService.translateMenu(
                images[0].path,
                images[0].mimetype,
                language
            );

            // Xoá file sau khi dịch xong
            fs.unlinkSync(images[0].path);
            res.status(200).json(content);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GeminiController();
