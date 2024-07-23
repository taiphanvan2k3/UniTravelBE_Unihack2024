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

const createStructuredPromptVietnamese = (locations, province) => {
    let prompt = `Hãy trả về một lịch trình du lịch chi tiết cho một ngày tại ${province}, Việt Nam dưới dạng JSON, bao gồm tiêu đề, mô tả, và một lịch trình với các hoạt động chi tiết từ buổi sáng đến buổi tối. Các điểm tham quan gồm:`;
    locations.forEach(loc => {
        prompt += `\n- Tên địa điểm: "${loc.locationName}", Địa chỉ: "${loc.address}", Giờ mở cửa: "${loc.time}"`;
    });
    prompt += `\nCấu trúc JSON nên giống như sau:
{
  "itinerary": {
    "title": "Lịch trình du lịch 1 ngày tại ${province}",
    "description": "Dưới đây là một lịch trình tham quan tối ưu dựa trên các điểm bạn cung cấp, xem xét thời gian di chuyển và giờ mở cửa.",
    "schedule": [
      {
        "time": "Sáng (8:00 - 12:00)",
        "activities": [
          {
            "time": "8:00 - 8:30",
            "description": "Ăn sáng tại một quán ăn địa phương gần nơi ở."
          },
          {
            "time": "8:30 - 12:00",
            "description": "Tham quan Sun World Ba Na Hills.",
            "subActivities": [
              {
                "description": "Đi cáp treo lên núi để tận hưởng khung cảnh hùng vĩ."
              },
              {
                "description": "Khám phá các điểm thu hút với giá trị như Vườn hoa Le Jardin D'Amour, Làng Pháp, Khu vui chơi Fantasy Park."
              }
            ]
          },
          {
            "time": "11:00 - 12:00",
            "description": "Ăn trưa tại nhà hàng nằm trong khu vực Sun World Ba Na Hills."
          }
        ]
      },
      {
        "time": "Chiều (12:00 - 18:00)",
        "activities": [
          // Bổ sung các hoạt động chiều tại đây
        ]
      }
    ]
  }
}
`;
    return prompt;
}

const createPromptForSingleLocation = (location) => {
    return `
Hãy trả về một lịch trình du lịch chi tiết cho một ngày dựa trên địa điểm "${location.locationName}". Lịch trình dưới dạng JSON nên bao gồm tiêu đề, mô tả, và một lịch trình với các hoạt động chi tiết từ buổi sáng đến buổi tối. Cấu trúc JSON đề nghị như sau:
{
  "itinerary": {
    "title": "Lịch trình du lịch 1 ngày tại ${location.locationName}",
    "description": "Dưới đây là một lịch trình tham quan tối ưu dựa trên ${location.locationName}, xem xét thời gian di chuyển và giờ mở cửa của địa điểm.",
    "schedule": [
      {
        "time": "Sáng (8:00 - 12:00)",
        "activities": [
          {
            "time": "8:00 - 8:30",
            "description": "Ăn sáng tại một quán ăn địa phương gần nơi ở."
          },
          {
            "time": "8:30 - 12:00",
            "description": "Tham quan ${location.locationName}, điểm nhấn là các hoạt động có tại địa điểm.",
            "subActivities": [
              {
                "description": "Chi tiết các hoạt động nổi bật tại địa điểm."
              }
            ]
          },
          {
            "time": "11:00 - 12:00",
            "description": "Ăn trưa tại nhà hàng trong hoặc gần địa điểm."
          }
        ]
      },
      {
        "time": "Chiều (12:00 - 18:00)",
        "activities": [
          // Bổ sung các hoạt động chiều tại đây dựa trên địa điểm cụ thể
        ]
      },
      {
        "time": "Tối (18:00 - 22:00)",
        "activities": [
          // Bổ sung các hoạt động tối tại đây
        ]
      }
    ]
  }
}
`;
};


class SchedulesController {
    async getScheduleAI(req, res, next) {
        try {
            const provinceCode = req.params.provinceCode;
            const experienceLocations =
                await listOfExperienceLocationService.getListExperienceLocationsByProvince(provinceCode);
            const provinceName = await listOfProvincesService.getProvinceNameByCode(provinceCode);

            const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", temperature: 0.7 });

            const prompt = createStructuredPromptVietnamese(experienceLocations.map(loc => ({
                locationName: loc.locationName,
                address: loc.address,
                time: loc.time
            })), provinceName);

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
            const experienceLocationId = req.params.experienceLocationId; 

            const experienceLocation = await experienceLocationDetailService.getExperienceLocationsById(experienceLocationId);

            if (!experienceLocation) {
                return res.status(404).json({ error: "Location not found." });
            }

            const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", temperature: 0.5 });

            const prompt = createPromptForSingleLocation(experienceLocation,);

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

