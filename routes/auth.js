const router = require("express").Router();
const User = require("../models/User");
const { route } = require("./users");

//ユーザー登録 ( postがフロントから送られた時の処理 )
router.post("/register", async (req, res) => {
  try {
    // ① ユーザースキムをインスタンス化
    // ② currentValueのリクエスト情報(オブジェクト)をスキームに代入する
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // インスタンスのセーブ
    const user = await newUser.save();

    // 正常な場合のリターン
    return res.status(200).json(user);
  } catch (err) {
    //エラーの場合の処理
    return res.status(500).json(err);
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try {
    // 一致するスキーマーを獲得
    const user = await User.findOne({ email: req.body.email });

    // 一致するアドがない場合の処理
    if (!user) return res.status(404).send("ユーザーが見つかりません");

    // 登録したスキーマーパスとログインのパスを確認
    const vailedPassword = req.body.password === user.password;

    // パスが合わない場合の処理
    if (!vailedPassword) return res.status(400).json("パスワードが違います。");

    // 正常な場合にはuserのオブジェクトを返す
    return res.status(200).json(user);
  } catch (err) {
    // エラーの場合の処理
    return res.status(500).json(err);
  }
});

// ルーターのエクスポート
module.exports = router;
