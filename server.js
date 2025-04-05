const { getVideoInfo, download } = require("./ytdl.js");
const express = require("express");
const app = express();

var videoId = "";

// Serve static files
app.use(express.static("./public"));

// Handle video info query
app.get("/videoInfo/query", (req, res) => {
  const { url } = req.query;
  console.log('Received video URL:', url);  // Debugging line

  try {
    const ytThumbnail = getVideoInfo(url);
    videoId = ytThumbnail.videoId;
    res.status(200).json({ success: true, data: ytThumbnail });
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ success: false, message: 'Error processing video URL' });
  }
});

// Handle download options
app.get("/options/:opt", (req, res) => {
  const opt = req.params.opt;
  if (!videoId) {
    return res.status(400).json({ success: false, message: 'No video ID found' });
  }

  try {
    if (opt === "mp3") download(videoId, "audioonly", "highestaudio", "mp3");
    if (opt === "mp4") download(videoId, "videoonly", "highestvideo", "mp4");
    if (opt === "both") download(videoId, "videoandaudio", "highest", "mp4");
    res.status(200).send("Received the request...");
  } catch (error) {
    console.error('Error during download:', error);
    res.status(500).json({ success: false, message: 'Error during download' });
  }
});

// 404 for undefined routes
app.all("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(5000, () => {
  console.log("server is listening on port 5000....");
});
