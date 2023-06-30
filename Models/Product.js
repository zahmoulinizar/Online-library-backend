const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  title: {
    type: String ,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    //required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required:true ,
   
  },
  state: {
    type: String,
    //required: true
    default:'Available',
  },
  author: {
    type: String,
    required :true
  },
  category : {
    type:String,
    required:true,
  },
  editionYear :{
    type:Number,
    required:true,
  },
  image: {
    type: Object,
    //required: true
    },
  codPromo : {
    type:Number,
  }

});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
