const path = require("path");
const { createFolderIfNotExist } = require("../../../helpers/utils.js");
const crawlData = require("./base-crawl.js");

const extractImportantFields = (data) => {
    return {
        provinceName: data.geoName
            .replace("Tỉnh ", "")
            .replace("Thành phố ", ""),
        country: data.countryName,
        experienceLocations: data.results?.map((location) => {
            return {
                locationId: `traveloka_${location.experienceId}`,
                locationName: location.experienceName,
                address: `${location.shortGeoName},${location.cityName}`,
                thumbnailUrl: location.imageUrl,
                detailedPageUrl: `https://www.traveloka.com/vi-vn/activities/vietnam/product/${location.experienceNameEn
                    .trim()
                    .toLowerCase()
                    .replace(/ /g, "-")}-${location.experienceId}`,
                price: {
                    originalPrice: `${location.basePrice.originalPrice.currencyValue.amount} ${location.basePrice.originalPrice.currencyValue.currency}`,
                    discountedPrice: `${location.basePrice.discountedPrice.currencyValue.amount} ${location.basePrice.discountedPrice.currencyValue.currency}`,
                },
                score: Number.parseFloat(location.score),
                totalReview: Number.parseInt(location.totalReview),
            };
        }),
    };
};

const targetResponseUrl =
    "https://www.traveloka.com/api/v2/experience/searchV2";

const provincePath = path.join(
    __dirname,
    "../../results/traveloka/available-provinces.json"
);

const provinces = require(provincePath).provinces;
const crawlAllProvinces = async () => {
    for (const province of provinces) {
        const pageUrl = province.attractionsLink;
        const fileOutputPath = path.join(
            __dirname,
            "../../results/traveloka/locations",
            `${province.name}.json`
        );

        console.log(`Crawling ${province.name}...`);
        createFolderIfNotExist(path.dirname(fileOutputPath));
        await crawlData(
            pageUrl,
            targetResponseUrl,
            fileOutputPath,
            extractImportantFields
        );
    }
};

(async () => {
    await crawlAllProvinces();
})();
