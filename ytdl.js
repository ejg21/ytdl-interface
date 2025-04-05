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
  // Use the current directory (.) for downloads
  const downloadPath = path.resolve('.'); // This is the current directory

  // Generate the output file path with the current directory
  const outputFilePath = `${downloadPath}/${videoId}.${fileFormat}`;

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
    console.error("Error:", error);
  });
};

module.exports = { getVideoInfo, download };
