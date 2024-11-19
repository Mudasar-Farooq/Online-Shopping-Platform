import mongoose from "mongoose";
// const { boolean } = require("webidl-conversions");
let schema= new mongoose.Schema({
    id: Number,
    Name: String,
    price: Number,
    quantity: Number,
});

let buy_cart=mongoose.model('store',schema);

export default buy_cart;