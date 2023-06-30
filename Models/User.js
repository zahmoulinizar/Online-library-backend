const mongoose = require('mongoose')

const userShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
        unique: true,
      },
      address: {
        type: String,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: "user",
      },
      image: {
        type: Object,
        required: true
        },
        code: {
          type : String,

        }
    
})
module.exports = User = mongoose.model('User' , userShema)