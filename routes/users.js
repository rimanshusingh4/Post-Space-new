const dotenv = require('dotenv')
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

dotenv.config({path: './config.env'})

mongoose.connect(String(process.env.DATABASE)).then(() =>
console.log("Mongodb connected")
);

const userSchema = mongoose.Schema({
  fullname: String,
  username: String,
  email: String,
  password: String,
  profileImage: String,
  boards: {
    type: Array,
    default: []
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ]

})

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);