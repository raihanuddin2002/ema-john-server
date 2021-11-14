const express = require("express");
const app = express();
const {MongoClient} = require("mongodb");
const cors = require("cors");
const { parse } = require("dotenv");
const dotEnv = require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DATABASE
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svqjf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("onlineShop");
        const productsCollection = database.collection("products");

        // GET API
        app.get("/products", async (req,res) => {
            console.log(req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const cursor = productsCollection.find({});
            const count = await cursor.count();
            let products;
            if(page){
                products = await cursor.skip(page*size).limit(size).toArray();
            }else{
                products = await cursor.toArray();
            }
            
            res.send({
                count,
                products
            });
        }) 
    }finally{

    }
}
run().catch(console.dir);
// Base setup
app.get("/", (req, res) => {
    res.send("Ema-John Server running...");
});

app.listen(port, () => {
    console.log("Listening to server port:", port);
});