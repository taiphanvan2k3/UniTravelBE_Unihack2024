const { logInfo, logError } = require("../../services/logger.service.js");
const Badge = require("../../models/badge.model");

const seedBadges = async () => {
    try {
        // Kiểm tra xem có voucher nào trong hệ thống chưa
        const badges = await Badge.find();
        if (badges.length > 0) {
            logInfo("seedBadges", "Badges already initialized");
            return;
        }

        // Khởi tạo danh sách badges
        const badgeData = [
            {
                type: "traveler_sage",
                upvoteCountMilestone: 10,
                imageUrl:
                    "https://firebasestorage.googleapis.com/v0/b/travelunihack.appspot.com/o/default%2Facheivements%2Fbronze_traveler.jpg?alt=media&token=4168622b-b4ac-47e8-b259-c3c3b95cad37",
            },
            {
                type: "traveler_sage",
                upvoteCountMilestone: 25,
                imageUrl:
                    "https://firebasestorage.googleapis.com/v0/b/travelunihack.appspot.com/o/default%2Facheivements%2Fsilver_traveler.jpg?alt=media&token=57874f57-1832-41d0-8934-339203700047",
            },
            {
                type: "traveler_sage",
                upvoteCountMilestone: 40,
                imageUrl:
                    "https://firebasestorage.googleapis.com/v0/b/travelunihack.appspot.com/o/default%2Facheivements%2Fgold_traveler.jpg?alt=media&token=a6f48088-d7e7-4aea-bacc-b072ba0cb5f5",
            },
            {
                type: "traveler_sage",
                upvoteCountMilestone: 60,
                imageUrl:
                    "https://firebasestorage.googleapis.com/v0/b/travelunihack.appspot.com/o/default%2Facheivements%2Fdinamon_traveler.jpg?alt=media&token=1b4cfc1f-c617-4036-84dc-55b8f53f42e1",
            },
            {
                type: "traveler_sage",
                upvoteCountMilestone: 80,
                imageUrl:
                    "https://firebasestorage.googleapis.com/v0/b/travelunihack.appspot.com/o/default%2Facheivements%2Fmaster_traveler.jpg?alt=media&token=64691712-bc25-4e43-91e5-fb531ec08df8",
            },
        ];

        await Badge.insertMany(badgeData);
        logInfo("seedBadges", "Badges are successfully initialized");
    } catch (error) {
        logError("seedBadges", error);
    }
};

module.exports = seedBadges;
