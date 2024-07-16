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

const crawlDataPageDetail = async (
    pageUrl,
    targetResponseUrl,
    fileOutputPath,
    extractImportantFieldsFunc
) => {
    console.log("Crawling data from: ", pageUrl);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try
    {

        // Thực hiện việc chặn tất cả các request từ trang web
        await page.setRequestInterception(true);

        page.on("request", request => {
            if (["image", "stylesheet", "font"].includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });

        await page.goto(pageUrl, { waitUntil: "networkidle2" });

        await page.waitForSelector("div[data-testid='btnReadMore']");
        
        await page.click('.css-1dbjc4n.r-1ihkh82.r-18u37iz.r-1777fci');
        await page.waitForSelector('.css-1dbjc4n.r-d9fdf6', { visible: true });

        await new Promise((resolve) => setTimeout(resolve, 100));

        // Get address and time from HTML
        const { address, time, content  } = await page.evaluate(() => {
            const divs = Array.from(document.querySelectorAll('.css-901oao.css-bfa6kz.r-13awgt0.r-t1w4ow.r-ubezar.r-majxgm.r-135wba7.r-fdjqy7'));
            console.log("Divs: ", divs);

            const elements = document.querySelectorAll('.css-1dbjc4n.r-d9fdf6');
            const result = [];

            function traverse(element) {
                element.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'text') {
                        const textContent = child.textContent.trim();
                        if (textContent !== '') {
                            result.push(`<span>${textContent}</span>`);
                        }
                    }

                    if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'p') {
                        const pContent = child.textContent.trim();
                        if (pContent !== '') {
                            result.push(`<p>${pContent}</p>`);
                        }
                    }

                    if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'img') {
                        result.push(child.outerHTML);
                    }

                    traverse(child);
                });
            }

            elements.forEach(element => {
                traverse(element);
            });

            return {
                address: divs[0] ? divs[0].innerText : '',
                time: divs[1] ? divs[1].innerText : '',
                content: result.join("")
            };
        });

        console.log("Address: ", address);
        console.log("Time: ", time);
        console.log("Content: ", content);

        // Lắng nghe response từ server, với mỗi response mà trang này nhận được thì sự kiện này sẽ được kích hoạt
        page.on("response", async (response) => {
            const url = response.url();
            if (url.includes(targetResponseUrl)) {
                const data = await response.json();
                let extractedData = extractImportantFieldsFunc(data.data);

                // Append the HTML extracted data to the JSON data
                extractedData.address = address;
                extractedData.time = time;
                extractedData.content = content;

                console.log("Extracted data: ", extractedData);

                fs.writeFile(
                    fileOutputPath,
                    JSON.stringify(extractedData, null, 2),
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
    } catch (error) {
        console.log("Error crawl page detail: ", error);
    } finally {
        await browser.close();        
    }
};

module.exports = 
{
    crawlData,
    crawlDataPageDetail
}
