const puppeteer = require("puppeteer");
const fs = require("fs");

/**
 * @param {String} pageUrl : URL của trang web cần crawl
 * @param {String} targetResponseUrl : URL của response mà trang web cần lắng nghe
 * @param {String} folderPath : Đường dẫn đến thư mục chứa file json sau khi crawl
 * @param {String} extractImportantFieldsFunc : Hàm trích xuất thông tin quan trọng từ response
 */
const crawlData = async (
    pageUrl,
    targetResponseUrl,
    fileOutputPath,
    extractImportantFieldsFunc
) => {
    console.log("Crawling data from: ", pageUrl);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Thực hiện việc chặn tất cả các request từ trang web
    await page.setRequestInterception(true);

    // Xử lý request, với mỗi request mà trang này gửi đi thì sự kiện này sẽ được kích hoạt
    // Tại đây có thể thay đổi request, chẳng hạn như chặn request, thay đổi header, ...
    // hoặc chỉ đơn giản là log ra url của request và tiếp tục request
    page.on("request", (request) => {
        request.continue();
    });

    // Lắng nghe response từ server, với mỗi response mà trang này nhận được thì sự kiện này sẽ được kích hoạt
    page.on("response", async (response) => {
        const url = response.url();
        if (url.includes(targetResponseUrl)) {
            const data = await response.json();

            const extractedData = extractImportantFieldsFunc(data.data);
            console.log("Extracted data: ", extractedData);

            fs.writeFile(
                fileOutputPath,
                JSON.stringify(extractImportantFieldsFunc(data.data), null, 2),
                (err) => {
                    if (err) {
                        console.error("Error writing to file", err);
                    } else {
                        console.log("Successfully wrote to api_response.json");
                    }
                }
            );
        }
    });

    // Điều hướng đến trang cần crawl, waitUntil: "networkidle0" để chờ cho đến khi không còn request nào nữa
    await page.goto(pageUrl, { waitUntil: "networkidle0" });
    await browser.close();
};

module.exports = crawlData;
