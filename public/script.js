function searchVideo() {
  const videoUrl = document.getElementById("userInput").value;
  console.log('Video URL:', videoUrl);  // Debugging line
  fetch(`/videoInfo/query?url=${videoUrl}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const ytThumbnail = data.data.ytThumbnail;
        let downloadBox = document.getElementsByClassName("downloadBox")[0];
        let downOption = `
          <img class="thumbnailImage" src="${ytThumbnail}" alt="example">
          <div class="buttonInfo">
              <button class="searchButton downloadButton" onclick="getAudio()">audio</button>
              <button class="searchButton downloadButton" onclick="getVideo()">video</button>
              <button class="searchButton downloadButton" onclick="getBoth()">download</button>
          </div>
        `;
        downloadBox.innerHTML = downOption;
      } else {
        console.error("Error:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getAudio() {
  alert("Check your download folder!!!");
  fetch(`/options/mp3`);
}

function getVideo() {
  alert("Check your download folder!!!");
  fetch(`/options/mp4`);
}

function getBoth() {
  alert("Check your download folder!!!");
  fetch(`/options/both`);
}
