const router = require("express").Router();
const multer = require("multer");

// どこに保存するか指定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({
  storage: storage,
});

// 画像アップロードAPI
// fileはkeyの指定と関係ある
router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("画像のアップロードに成功しました");
  } catch (err) {
    console.log(err);
    console.log("アップロードに失敗しました");
  }
});

module.exports = router;
