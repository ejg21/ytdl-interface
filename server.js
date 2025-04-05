const express = require("express");
const { exec } = require("child_process"); // Import child_process
const { getVideoInfo, download } = require("./ytdl.js");

const app = express();
let videoId = "";

// Serve static files
app.use(express.static("./public"));

// Handle video info query
app.get("/videoInfo/query", (req, res) => {
  const { url } = req.query;
  console.log('Received video URL:', url);

  try {
    const ytThumbnail = getVideoInfo(url);
    videoId = ytThumbnail.videoId;
    console.log("Video ID:", videoId);
    res.status(200).json({ success: true, data: ytThumbnail });
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ success: false, message: 'Error processing video URL' });
  }
});

// Handle download options
app.get("/options/:opt", (req, res) => {
  const opt = req.params.opt;
  console.log('Download option received:', opt);

  if (!videoId) {
    console.error("No video ID found, returning 400 error.");
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

// Run yt-dlp to get the direct video URL and redirect
app.get("/video/:url", (req, res) => {
  const videoUrl = req.params.url;
  console.log("Running yt-dlp on URL:", videoUrl);

  exec(`yt-dlp --get-url "${videoUrl}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing yt-dlp: ${error}`);
      return res.status(500).json({ success: false, message: 'Error executing yt-dlp' });
    }

    const videoUrl = stdout.trim();
    console.log("Video URL from yt-dlp:", videoUrl);

    // Redirect to video page with the direct URL
    res.redirect(`/play?videoUrl=${encodeURIComponent(videoUrl)}`);
  });
});

// Video player page with video.js
app.get("/play", (req, res) => {
  const { videoUrl } = req.query;
  if (!videoUrl) {
    return res.status(400).send("No video URL provided");
  }
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Video Player</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.10.2/video-js.min.css" rel="stylesheet">
      </head>
      <body>
        <div style="text-align: center; padding: 20px;">
          <h1>Video Player</h1>
          <video id="video-player" class="video-js vjs-default-skin" controls preload="auto" width="600">
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.10.2/video.min.js"></script>
        <script>
          var player = videojs('video-player');
        </script>
      </body>
    </html>
  `);
});

// 404 for undefined routes
app.all("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000....");
});
