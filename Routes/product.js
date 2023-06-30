const express = require("express");
const cloudinary = require("../Utils/cloudinary");
const Product = require("../Models/Product");
const isAuth = require("../Midellwaires/isAuth");
const isAdmin = require("../Midellwaires/isAdmin");
const router = express.Router();

// create product
// http://localhost:8000/product/add-product
router.post("/newProd",isAuth ,isAdmin , async (req, res) => {
  const { title, genre, desc,quantity, price, editionYear,author,state,category,publisher,codPromo,image } = req.body;
  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "online-librairie",
      });
      if (uploadRes) {
        const product = new Product({
          title,
          genre,
          desc,
          quantity, 
          price,
          editionYear,
          author,
          state,
          category, 
          publisher,
          codPromo,
          image: {
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          },
        });
        const productRes = await product.save();
        res.status(201).json(productRes);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// getting single product
// http://localhost:8000/product/getProd/
router.get("/getProd/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message:error.message});
  }
});

// getting all product
// http://localhost:8000/product/all-products

router.get("/allProd", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});
// update product 
// http://localhost:8000/product/update-prod
router.put("/updateProd/:id" ,isAuth ,isAdmin , async(req,res) => {
  const id = req.params.id
  const {title, genre, desc,quantity, price, editionYear,author,state,category,publisher,codPromo,image } = req.body;
  try {
    const product = await Product.findById(id)
    product.title = title || product.title
    product.genre = genre || product.genre
    product.desc =  desc|| product.desc
    product.quantity = quantity || product.quantity
    product.price = price || product.price
    product.editionYear = editionYear || product.editionYear
    product.author= author || product.author
    product.state= state || product.state
    product.category= category || product.category
    product.publisher= publisher || product.publisher
    product.codPromo= codPromo || product.codPromo
    if(image){
      const uploadRes =  await cloudinary.uploader.upload(image , {
           upload_preset:"online-librairie"
       })
      const {public_id, url} = uploadRes
      product.image = {public_id, url}
  
    } else {
      req.body.image = product.image
    }
    
    await product.save()
    res.status(200).json({message:'product updated with success' , product})
  } catch (error) {
    res.status(500).json({message:error.message})
    console.log(error.message)
  }
});

// delete product
// http://localhost:8000/product/delete/:id
   router.delete('/delete/:id',isAuth ,isAdmin , async(req,res)=>{
    try {
        await Product.deleteOne({
            _id:req.params.id
        })
        const prod = await Product.find()
        res.status(200).json({message:'product deleted with success' , prod})
      } catch (error) {
        res.status(500).json({message:error.message})
      }
} )
// getting unique category 
router.get('/unique-values',async (req, res) => {
  try {
    // Use the appropriate MongoDB query to retrieve unique category
    const uniqueCategory = await Product.distinct('category');

    res.json(uniqueCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
//
router.get('/sumCategory', async (req, res) => {
  try {
    // Use the appropriate MongoDB aggregation pipeline to calculate sums
    const sums = await Product.aggregate([
      { $group: { _id: '$category', total: { $sum: '$quantity' } } }
    ]);

    res.json(sums);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
//search by category
router.get('/search-by-category', async (req, res) => {
  try {
    const { category } = req.query;

    // Use the appropriate MongoDB query to search for data matching the category
    const searchResults = await Product.find({ category });

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/search-by-title', async (req, res) => {
  try {
    const { title } = req.query;

    // Use the appropriate MongoDB query to search for data matching the category
    const searchResults = await Product.find({ title });

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;
