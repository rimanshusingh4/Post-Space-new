var express = require('express');
var router = express.Router();
const userModel = require('./users'); // import from users.js
const postModel = require('./post')
const passport = require('passport');
const localStrategy = require('passport-local')
const upload = require('./multer')


passport.use(new localStrategy(userModel.authenticate()))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav: true, log: false});
});

router.get('/login', function(req, res, next) {
  res.render('login',{nav: false});
});
router.get('/register', function(req, res) {
  res.render('register', {nav: false});
});

router.post('/fileupload', isLoggedIn, upload.single("image") ,async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user})
  user.profileImage = req.file.filename;
  await user.save();
  res.render("profile", { user,nav: true , log: true});
});

router.get('/profile', isLoggedIn ,async function(req, res){
  const user = await userModel
  .findOne({username: req.session.passport.user})
  .populate("posts")
  res.render("profile", {user, nav: true, log: true});
})

router.get('/addpost', isLoggedIn ,async function(req, res){
  const user = await userModel.findOne({username: req.session.passport.user})
  res.render("addpost", {user, nav: true, log: true});
})

router.get('/show/posts', isLoggedIn ,async function(req, res){
  const user = await userModel
  .findOne({username: req.session.passport.user})
  .populate("posts")
  res.render("show", {user, nav: true, log: true});
})

router.get('/feed' ,async function(req, res){
  // const user = await userModel
  // .findOne({username: req.session.passport.user})
  const posts = await postModel.find()
  .populate("user")
  res.render("feed", {posts ,nav: true, log: false});
})

router.post('/createpost', isLoggedIn, upload.single('postimage') ,async function(req, res){
  const user = await userModel.findOne({username: req.session.passport.user})
  const post =await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post('/login', passport.authenticate("local", {
  failureRedirect: '/',
  successRedirect: "profile",
}) ,function(req, res){
  
})

router.post('/register', function(req,res){
  const data = new userModel({
    fullname: req.body.fullname, // edhar ka name mtlb userSchema me jo naam hai : edhar ka mtlb page form me jo input me name diya hai uska.
    username: req.body.username,
    email: req.body.email,
  })
  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate('local')(req, res, function(){
      res.redirect("/profile");
    })
  })
})

router.get("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('http://localhost:3000/login');
}

module.exports = router;
