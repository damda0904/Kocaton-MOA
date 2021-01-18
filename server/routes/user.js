const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

const { auth } = require('../middleware/auth')



router.get('/auth', auth, (req, res) => {

  return res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

router.post('/getUser', (req, res) => {
  User.findOne({_id : req.body.userId}, (err, user) =>{
    if(err) return res.json({success: false, err})

    console.log("성공!");
    return res.status(200).json({
      
      success: true, user
    })
  })  
})


router.post('/register', (req, res) => {

  const user = new User(req.body);
  console.log(req.body)

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })

})


router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) return res.json({ loginSuccess: false, message: "이메일 정보를 다시 확인해 주세요" });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호 정보를 다시 확인해 주세요" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('w_authExp', user.tokenExp);
        res
          .cookie('w_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      });
    });
  });
});


router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '', tokenExp: '' }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    })
  })
})

//프로필 저장
router.post('/saveProfile', (req, res) => {

  User.updateOne(
    { _id: req.body.id },
    {
      $set: {
        "nickName": req.body.nickName,
        "image": req.body.image,
        "content": req.body.content,
      }
    }, (err, User) => {
      if (err) return res.json({ success: false, err })

      console.log("바뀐 프로필", User)
      return res.status(200).json({
        success: true
      })
    })
})

//프로필 가져오기
router.post('/getProfile', (req, res) => {
  User.findOne({ "_id": req.body.id })
  .exec((err, User) => {

    //console.log("프로필 가져오기", User)
    if (err) {
      return res.json({
        findSuccess: false,
        message: "프로필을 찾을 수 없습니다."
      })
    }

    res.status(200).json({ findSuccess: true, User })
  })
})

// router.post('/updateProfile', (req, res) => {
//     Profile.updateOne(
//       { id: req.body.id },
//       {
//         $set: {
//           "nickName": req.body.nickName,
//           "profileImg": req.body.profileImg,
//           "content": req.body.content,
//         }
//       }, (err, profile) => {
//         if (err) return res.json({ success: false, err })

//         return res.status(200).json({
//           success: true
//         })
//       })

//   })

module.exports = router;