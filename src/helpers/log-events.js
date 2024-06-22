const fs = require("fs").promises;
const path = require("path");
const { format } = require("date-fns");

const logDirectory = path.join(__dirname, "../logs");

const createLogDirectory = async () => {
    try {
        await fs.mkdir(logDirectory, { recursive: true });
    } catch (err) {
        console.error("Error creating log directory:", err);
    }
};

const manageLogFiles = async (logDirectory, maxFiles) => {
    try {
        const files = await fs.readdir(logDirectory);
        const logFiles = files
            .map((file) => ({
                name: file,

                // Lấy thời gian sửa file cuối cùng để sắp xếp các file theo thời gian
                time: fs
                    .statSync(path.join(logDirectory, file))
                    .mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time)
            .map((file) => file.name);

        // Xóa các file log cũ nếu vượt quá số file tối đa
        if (logFiles.length > maxFiles) {
            const filesToDelete = logFiles.slice(maxFiles);
            for (const file of filesToDelete) {
                await fs.unlink(path.join(logDirectory, file));
            }
        }
    } catch (err) {
        console.error("Error managing log files:", err);
    }
};

const logEvents = async (msg) => {
    await createLogDirectory();

    const dateTime = `${format(new Date(), "dd-MM-yyyy\tHH:mm:ss")}`;
    const logFileName = `${format(new Date(), "dd-MM-yyyy")}.log`;
    const fileName = path.join(logDirectory, logFileName);
    const contentLog = `${dateTime} ----- ${msg}\n`;

    try {
        await fs.appendFile(fileName, contentLog);

        // Quản lý các file log và xóa file cũ nếu cần
        await manageLogFiles(logDirectory, 10);
    } catch (error) {
        console.error("Error logging event:", error);
    }
};

module.exports = logEvents;
