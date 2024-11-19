//  This file is for backend java script


import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app=express();

// cors is use to allow the server accept the request and express.json is use to convert the upcoming data
// into json format
app.use(cors({
  origin: 'http://127.0.0.1:3000', // Specify the exact origin of your frontend
  methods: ['GET', 'POST','DELETE'],        // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

app.use(express.json());


  // connecting with the db
 mongoose.connect("mongodb://localhost:27017/store");


 import buy_cart from "./schema.js";

//  just a simple route
app.get('/', (req, res) => {
  res.send("Welcome to the Commerce API!");
});

//  storing the data into database
app.post('/add-to-cart', async (req, res) => {
    let {id,Name,price,quantity}= req.body;

    // checking is the upcoming requests's cart already have some products
    const existingProduct = await buy_cart.findOne({ id });
    if (existingProduct) { 
        existingProduct.quantity += quantity;  // If it exists, increment quantity
        await existingProduct.save();
        return res.status(200).json({ message: 'Product quantity updated' });
    }
    else {
      const newProduct=await buy_cart.create({
        id,
        Name,
        price,
        quantity,
      });
      await newProduct.save();
      return res.status(200).json({ message: 'Product quantity added' });
    }
 })

//  getting the database from db
app.get('/get-data',async (req,res)=>{
  try {
    const items = await buy_cart.find();
    res.json(items);
  } 
  catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server error');
  }
})

// remove single card functionality
app.delete('/remove',async (req,res)=>{
  const {id}= req.body;
  try{
      const del= await buy_cart.deleteOne({id:id});

      if(del.deletedCount===1)
          res.status(200).send(`Item removed successfully`);
  }
  catch{
    res.status(500).send(`Error deleting message : ${error.message}`);
  }

});

// remove all card functionality
app.delete('/remove-all',async (req,res)=>{
  const {id}= req.body;
  console.log("remove run");
  try{
      const del= await buy_cart.deleteMany({});

      if(del.deletedCount>0)
          res.status(200).send(`Items Ordered successfully`);
  }
  catch{
    res.status(500).send(`Error deleting message : ${error.message}`);
  }

});


 app.listen(3007, () => {
  console.log("Server is running on http://localhost:3006/");
});
 console.log("hyy");