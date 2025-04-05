const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

const getVideoInfo = (videoUrl) => {
  const videoId = ytdl.getVideoID(videoUrl);
  const ytThumbnail = {
    ytThumbnail: "https://img.youtube.com/vi/" + videoId + "/sddefault.jpg",
    videoId: videoId,
  };
  return ytThumbnail;
};

const download = (videoId, filter, quality, fileFormat) => {
  // Define the Downloads directory
  const downloadDir = path.join(process.env.HOME || process.env.USERPROFILE, "Downloads");

  // Check if the Downloads directory exists, and create it if not
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
    console.log("Created 'Downloads' folder.");
  }

  // Generate output file path
  const randomNumber = Math.floor(Math.random() * 10);
  const outputFilePath = path.join(downloadDir, `${randomNumber}towtin-${videoId}.${fileFormat}`);

  const options = {
    highWaterMark: 5 * 1024 * 1024,
    quality: quality,
    filter: filter,
  };

  const videoStream = ytdl(videoId, options);
  const fileStream = fs.createWriteStream(outputFilePath);

  videoStream.pipe(fileStream);

  videoStream.on("end", () => {
    console.log("Download complete!");
  });

  videoStream.on("error", (error) => {
    console.error("Error downloading video:", error);
    fileStream.close();  // Close the stream if there's an error
  });

  fileStream.on("error", (error) => {
    console.error("Error writing to file:", error);
  });
};

module.exports = { getVideoInfo, download };
