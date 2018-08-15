const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
  email:{
      type: String,
      required: true

  },

  password:{
    type: String,
    required: true
  }
});


const User = module.exports = mongoose.model('User', UserSchema);





// var userSchema = new Schema({
//
//     full_name: { type: String,  required: [true, 'Full name must be provided'] },
//
//     email:    {
//
//         type: String,
//
//         Required:  'Email address cannot be left blank.',
//         validate: [validateEmail, 'Please fill a valid email address'],
//         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
//         index: {unique: true, dropDups: true}
//     },
//
//     password: { type: String , required: [true,  'Password cannot be left blank']},
//
//
// });