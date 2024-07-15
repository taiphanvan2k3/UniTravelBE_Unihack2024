const path = require("path");
const { createFolderIfNotExist } = require("../../../helpers/utils.js");
const crawlData = require("./base-crawl.js");

const extractImportantFields = (data) => {
    return {
        provinces: data.sections[0].items.map((item) => {
            return {
                name: item.attributes.descriptionObject.title
                    .replace("Thành phố", "")
                    .replace("Tỉnh", "")
                    .trim(),
                thumbnailUrl: item.attributes.backgroundImage,
                attractionsLink: `${item.itemDetail.deeplink}/attraction`,
            };
        }),
    };
};

const pageUrl = "https://www.traveloka.com/vi-vn/activities";

const targetResponseUrl =
    "https://www.traveloka.com/api/v2/merchandising/page/content";

const fileOutputPath = path.join(
    __dirname,
    "../../results/traveloka",
    "available-provinces_2.json"
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
