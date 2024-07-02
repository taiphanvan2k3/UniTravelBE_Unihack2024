const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Thực hiện việc chặn tất cả các request từ trang web
    await page.setRequestInterception(true);

    // Xử lý request, với mỗi request mà trang này gửi đi thì sự kiện này sẽ được kích hoạt
    // Tại đây có thể thay đổi request, chẳng hạn như chặn request, thay đổi header, ...
    // hoặc chỉ đơn giản là log ra url của request và tiếp tục request
    page.on("request", (request) => {
        console.log("Request url: ", request.url());
        request.continue();
    });

    // Lắng nghe response từ server, với mỗi response mà trang này nhận được thì sự kiện này sẽ được kích hoạt
    page.on("response", async (response) => {
        const url = response.url();
        if (
            url.includes("https://www.traveloka.com/api/v2/experience/searchV2")
        ) {
            const data = await response.json();
            fs.writeFile(
                "api_response.json",
                JSON.stringify(data.data, null, 2),
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
    await page.goto(
        "https://www.traveloka.com/vi-vn/activities/vietnam/region/da-nang-10010083/attraction",
        { waitUntil: "networkidle0" }
    );

    await browser.close();
})();

// obj.data.sections[0].items.forEach(ele => {console.log(ele.link)})
