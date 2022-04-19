const request = require("request");
const join = require("join-images");
const argv = require("minimist")(process.argv.slice(2));

const {
  url = "https://cataas.com/cat/says/",
  text_greeting = "Hello",
  text_who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
  encoding = "binary",
} = argv;

function combineImages(firstImgBuf, secondImgBuf) {
  join
    .joinImages([firstImgBuf, secondImgBuf], { direction: "horizontal" })
    .then((img) => {
      img.toFile("./cat-card.png");
      console.log("The file was saved!");
    });
}

function generateRequestUrl(imageText) {
  const requestUrl = {
    url:
      url +
      imageText +
      "?width=" +
      width +
      "&height=" +
      height +
      "&color" +
      color +
      "&s=" +
      size,
    encoding: encoding,
  };

  return requestUrl;
}

function fetchImagesFromServer() {
  const firstReq = generateRequestUrl((imageText = text_greeting));
  const secondReq = generateRequestUrl((imageText = text_who));

  request.get(firstReq, (err, res, firstBody) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Received response with status:" + res.statusCode);

    request.get(secondReq, (err, res, secondBody) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log("Received response with status:" + res.statusCode);

      const firstImgBuf = Buffer.from(firstBody, "binary");
      const secondImgBuf = Buffer.from(secondBody, "binary");

      combineImages(firstImgBuf, secondImgBuf);
    });
  });
}

fetchImagesFromServer();
