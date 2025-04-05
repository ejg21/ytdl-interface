const ytdl = require("ytdl-core");
const fs = require("fs");

const getVideoInfo = (videoUrl) => {
  try {
    const videoId = ytdl.getVideoID(videoUrl);
    if (!videoId) {
      throw new Error('No video ID found');
    }
    const ytThumbnail = {
      ytThumbnail: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      videoId: videoId,
    };
    return ytThumbnail;
  } catch (error) {
    console.error('Error getting video info:', error);
    throw new Error('Error processing the video URL');
  }
};

const download = (videoId, filter, quality, fileFormat) => {
  // Create a download folder if it doesn't exist
  const downloadFolder = `${process.env.HOME || process.env.USERPROFILE}/Downloads/ytdl`;
  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder);
  }

  const outputFilePath = `${downloadFolder}/towtin-${videoId}.${fileFormat}`;

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
