var express = require('express');
var router = express.Router();
var localStrategy = require('passport-local');
var userModel = require('./users');
var passport = require('passport');
var multer = require('multer');
var path = require('path');

passport.use(new localStrategy(userModel.authenticate()));
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/pdffolder', isLoggedIn,function(req, res,next) {
  res.render('pdffolder');
});

router.get('/form', function(req, res) {
  res.render('form');
});
router.get('/signup', function(req, res) {
  res.render('signup');
});

router.get('/explore',isLoggedIn, function(req, res,next) {
    res.render('explore');

});

// .............................................................
//  multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    var dt=new Date();
    var fn = dt.getTime()+ Math.floor(Math.random()*100000)+ path.extname(file.originalname);
    cb(null,fn);
  }
})

const upload = multer({ storage: storage,fileFilter: fileFilter })

function fileFilter (req, file, cb) {

  if (file.mimetype === 'image/jpg' || file.mimetype ==='image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {

    cb(null, true)
    
  }
else{

  cb(new Error('bsdk image lagani hai '))
}
}

// .............................................................
router.post("/uploads",isLoggedIn,upload.single('image'),function(req,res,next){
  userModel.findOne({username:req.session.passport.user})
  .then(function(logguser){
    logguser.image = req.file.filename;
    logguser.save()
    .then(function(){
      res.redirect("back");
    })
  })
  })




router.get('/profile',function(req,res,next){
  userModel.findOne({username:req.session.passport.user})
  .then(function(foundeUser){
    res.render("profile",{user:foundeUser});
  })

})
router.post('/register',function(req,res){
  var newUser = new userModel(
    {
      username : req.body.username,
      email : req.body.email,
      number : req.body.number,
    }
  )
  userModel.register(newUser,req.body.password)
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/form');
      console.log("Account created");
    })
  })
});



// 

router.post('/login',passport.authenticate('local',
{
  successRedirect: '/',
  failureRedirect: '/',
  
}),function(req,res){
  console.log("Logged in");
});





router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



function isLoggedIn(req,res,next)
{
  if(req.isAuthenticated()){
    return next();
    console.log("login");
  }
  else{
    res.redirect('/');
  }
}


module.exports = router;
