const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// 投稿を作成する
router.post("/", async (req, res) => {
  // スキームをインスタンス化してリクエスト情報を代入
  const newPost = new Post(req.body);
  try {
    // インスタンスをセーブ
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    // newPost.save()のエラー
    return res.status(500).json(err);
  }
});

// 投稿を更新する
router.put("/:id", async (req, res) => {
  try {
    // DBのオブジェクトをオブジェクトIDを元に取得
    const post = await Post.findById(req.params.id);

    // パラメーターとボディの id を比較
    if (post.userId === req.body.userId) {
      // 情報を一括更新 $setを使用 ( 一部はpushを使用 )
      await post.updateOne({
        $set: req.body,
      });
      // 正常な場合の処理
      return res.status(200).json("投稿編集に成功しました");
    } else {
      // IDが違った場合の処理
      return res.status(403).json("あなたは他の人のIDを編集できません");
    }
  } catch (err) {
    // findById のエラー
    return res.status(403).json(err);
  }
});

// 投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    // DBのオブジェクトをオブジェクトIDを元に取得
    const post = await Post.findById(req.params.id);
    console.log(req.params.id);
    console.log(req.body.userId);
    // パラメーターとボディの id を比較
    if (post.userId === req.body.userId) {
      await post.deleteOne();

      // 正常な場合の処理
      return res.status(200).json("投稿削除に成功しました");
    } else {
      // IDが違った場合の処理
      return res.status(403).json("あなたは他の人のIDを削除できません");
    }
  } catch (err) {
    // findById が起動しなかった時のエラー
    return res.status(403).json(err);
  }
});

// 特定の投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    // postオブジェクトをuserのオブジェクトIDを元に取得
    const post = await Post.findById(req.params.id);
    console.log(req.params.id);

    // 正常な場合の処理
    return res.status(200).json(post);
  } catch (err) {
    // findById が起動しなかった時のエラー
    return res.status(403).json(err);
  }
});

// 特定のフォロワーにいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    // いいねされているPostを検索
    // DBのオブジェクトを取得
    const post = await Post.findById(req.params.id);

    // すでにいいねされているかどうか調べる
    // req.body.userId ( userのid )= currentUser
    // post._id ( 投稿のid ) = req.params.id
    if (!post.likes.includes(req.body.userId)) {
      // フォロワーにidを登録
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });

      // 正常の場合のリターン
      return res.status(200).json("投稿にいいねを押しました！");

      // 既にいいねが押されていた場合
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿にいいねを外しました！");
    }
  } catch (err) {
    // findById のエラー処理
    return res.status(500).json(err);
  }
});

// プロフィール専用のタイムライン
router.get("/profile/:username", async (req, res) => {
  try {
    //自分の内容を取得
    const user = await User.findOne({ username: req.params.username });
    // _idはオブジェクトのidのこと
    const posts = await Post.find({ userId: user._id });

    return res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// タイムラインの投稿を取得
router.get("/timeline/:userId", async (req, res) => {
  try {
    //自分の内容を取得
    const currentUser = await User.findById(req.params.userId);
    // _idはオブジェクトのidのこと
    const userPosts = await Post.find({ userId: currentUser._id });

    // 友達の内容を取得
    // Promis.allは非同期処理後に実行させるため
    const friendPosts = await Promise.all(
      // followingsのidを配列で回して検索
      currentUser.followings.map((friendId) => {
        // friendIdと一致するオブジェクトを返す
        return Post.find({ userId: friendId });
      })
    );
    // フォローさんと自分のタイムラインをconcatで統合
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
