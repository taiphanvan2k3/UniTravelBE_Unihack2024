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
            };
        }),
    };
};

const pageUrl =
    "https://www.traveloka.com/vi-vn/activities/vietnam/region/ba-ria-vung-tau-province-10009889/attraction";
const targetResponseUrl =
    "https://www.traveloka.com/api/v2/experience/searchV2";

const fileOutputPath = path.join(
    __dirname,
    "../../results/traveloka",
    "BaRia-VungTau.json"
);

createFolderIfNotExist(path.dirname(fileOutputPath));

(async () => {
    await crawlData(
        pageUrl,
        targetResponseUrl,
        fileOutputPath,
        extractImportantFields
    );
})();
