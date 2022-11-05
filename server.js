const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const path = require("path");
require("dotenv").config();
const PORT = 5000;
const cors = require("cors");

// app.use(
//   cors({
//     // 他サーバーのエンドポイントを許可
//     // 語尾にスラッシュいらない
//     origin: "https://react-front-app-six.vercel.app",
//   })
// );

app.use(
  cors({
    // 他サーバーのエンドポイントを許可
    // 語尾にスラッシュいらない
    origin: "https://react-front-ap.vercel.app",
  })
);

// app.use(
//   cors({
//     // 他サーバーのエンドポイントを許可
//     // 語尾にスラッシュいらない
//     origin: "http://localhost:3000",
//   })
// );

//データベース接続
mongoose
  // 隠蔽したパスワード(mongeDB発行のURL)を代入
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DBと接続中・・・");
  })
  // エラーの場合の処理
  .catch((err) => {
    console.log(err);
  });

//全てをJsonにする
app.use(express.json());

//ミドルウェア( 他のファイルを実行 )

// public を省略する記述
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);

// サーバーの起動確認用
app.get("/", (req, res) => {
  res.send("hello EXPRESS");
});

// サーバーの起動確認用
app.listen(process.env.PORT || PORT, () =>
  console.log("サーバーが起動しました")
);

process.env.MONGO_URL; // データベース
