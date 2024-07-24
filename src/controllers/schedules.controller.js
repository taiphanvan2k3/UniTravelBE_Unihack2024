const { GoogleGenerativeAI } = require("@google/generative-ai");
const { logError } = require("../services/logger.service");
const listOfExperienceLocationService = require("../services/experience-location/list-of-experience-locations.service.js");
const listOfProvincesService = require("../services/province/list-of-provinces.service.js");
const experienceLocationDetailService = require("../services/experience-location/experience-location-detail.service.js");

const extractJsonFromText = (text) => {
    try {
        // Tìm đoạn bắt đầu bằng ```json và kết thúc bằng ```
        const regex = /```json\s+([\s\S]*?)\s+```/;
        const match = text.match(regex);

        if (!match) {
            throw new Error("No JSON found in the text.");
        }

        // Đoạn JSON được tìm thấy nằm ở vị trí đầu tiên của mảng kết quả
        const jsonString = match[1];
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to extract and parse JSON:", error.message);
        return null;
    }
}

const createStructuredPromptVietnamese = (locations, province, numDays) => {
  let prompt = `Hãy trả về một lịch trình du lịch chi tiết cho ${numDays} ngày tại ${province}, Việt Nam dưới dạng JSON, bao gồm tiêu đề, mô tả, và một lịch trình với các hoạt động chi tiết từng ngày. Các điểm tham quan gồm:`;
  locations.forEach(loc => {
      prompt += `\n- Tên địa điểm: "${loc.locationName}", Địa chỉ: "${loc.address}", Giờ mở cửa: "${loc.time}"`;
  });
  prompt += `\nCấu trúc JSON nên giống như sau:\n{\n  "itinerary": {\n    "title": "Lịch trình du lịch ${numDays} ngày tại ${province}",\n    "description": "Dưới đây là một lịch trình tham quan tối ưu dựa trên các điểm bạn cung cấp, xem xét thời gian di chuyển và giờ mở cửa.",\n    "schedule": [\n`;

  // Loop through each day to generate the daily schedule
  for (let i = 0; i < numDays; i++) {
      prompt += `      {\n        "day": ${i + 1},\n        "activities": [\n          // Bổ sung các hoạt động cho ngày thứ ${i + 1} tại đây\n        ]\n      },\n`;
  }

  prompt = prompt.slice(0, -2); // Remove the last comma for proper JSON formatting
  prompt += `\n    ]\n  }\n}\n`;

  return prompt;
}


const createPromptForSingleLocation = (location, numDays) => {
  let activities = [];
  for (let day = 1; day <= numDays; day++) {
      activities.push(`
    {
      "day": ${day},
      "activities": [
        {
          "time": "8:00 - 9:00",
          "description": "Ăn sáng tại một quán ăn gần ${location.locationName}."
        },
        {
          "time": "9:30 - 11:30",
          "description": "Tham quan các điểm nổi bật tại ${location.locationName}, bao gồm các hoạt động và điểm tham quan chính."
        },
        {
          "time": "12:00 - 13:00",
          "description": "Ăn trưa tại nhà hàng địa phương."
        },
        {
          "time": "14:00 - 16:00",
          "description": "Tiếp tục tham quan hoặc tham gia vào các hoạt động giải trí."
        },
        {
          "time": "17:00 - 19:00",
          "description": "Thư giãn tại ${location.locationName} hoặc tham gia các sự kiện buổi tối."
        }
      ]
    }`);
  }

  return `
Hãy trả về một lịch trình du lịch chi tiết cho ${numDays} ngày tại "${location.locationName}". Lịch trình dưới dạng JSON nên bao gồm tiêu đề, mô tả, và các hoạt động chi tiết từ buổi sáng đến buổi tối như sau:
{
"itinerary": {
  "title": "Lịch trình du lịch ${numDays} ngày tại ${location.locationName}",
  "description": "Dưới đây là một lịch trình tham quan tối ưu dựa trên địa điểm ${location.locationName} cho ${numDays} ngày.",
  "schedule": [${activities.join(',')}
  ]
}
}`;
};  


class SchedulesController {
    async getScheduleAI(req, res, next) {
        try {
            const { provinceCode, numDays } = req.params;
            const experienceLocations =
                await listOfExperienceLocationService.getListExperienceLocationsByProvince(provinceCode);
            const provinceName = await listOfProvincesService.getProvinceNameByCode(provinceCode);

            const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", temperature: 0.7 });

            const prompt = createStructuredPromptVietnamese(experienceLocations.map(loc => ({
                locationName: loc.locationName,
                address: loc.address,
                time: loc.time
            })), provinceName, numDays);

            const result = await model.generateContent(prompt);
            const response = result.response;

            return res.send(extractJsonFromText(response.text()));
        } catch (error) {
            logError("getScheduleAI", error.message);
            next(error);
        }
    }

    async getScheduleForSpecificLocation(req, res, next) {
        try {
            const { experienceLocationId, numDays } = req.params;

            const experienceLocation = await experienceLocationDetailService.getExperienceLocationsById(experienceLocationId);

            if (!experienceLocation) {
                return res.status(404).json({ error: "Location not found." });
            }

            const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", temperature: 0.5 });

            const prompt = createPromptForSingleLocation(experienceLocation, numDays);

            const result = await model.generateContent(prompt);
            const response = result.response;

            return res.send(extractJsonFromText(response.text()));
        } catch (error) {
            logError("getScheduleForSpecificLocation", error.message);
            next(error);
        }
    }
}

module.exports = new SchedulesController();

