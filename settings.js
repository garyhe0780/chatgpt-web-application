const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

// Set up Multer to handle file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      const filename = uuidv4() + extension;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB
  fileFilter: function (req, file, cb) {
    const allowedExtensions = [
      ".mp3",
      ".mp4",
      ".mpeg",
      ".mpga",
      ".m4a",
      ".wav",
      ".webm",
    ];
    const extension = path.extname(file.originalname);
    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
});

module.exports = function (app) {
  // define your route map here
  app.post("/transcribe", upload.single("audio"), require("./app/routes/transcribe"));

  app.get("/get-prompt-result", require("./app/routes/get-prompt-result"));
  app.get("/get-prompt-result/add", require("./app/routes/get-prompt-result/add"));
};
