const productRoute = require('express').Router();
const Product = require('../models/products/Product');
const Category = require('../models/products/Category')

productRoute.get('/', (req, res) => {
    Product.find({ }).then((products) =>{
        
        res.json(products)
            })
    .catch(err => res.status(err))
})

productRoute.get('/:id', (req, res) => {
const { id } = req.params;
    Product.findById(id)
    .then(products =>{
        if(products) {
            return res.json(products)
        } else {
            res.status(404).end()
        }
    })// busca nota por id mas facil xd
})



productRoute.post('/create', async (req, res) => {

const product = req.body;

    if(!product){
        return res.status(400).json({message: `We could't process your require`})
    }

const newProduct = await new Product(product); // We create a new instance of Product 

    
    newProduct.save().then(async (saveProduct)=> {
        const cateID = await Category.find({ name: saveProduct.category})
            await Category.updateOne(
                { _id: cateID}, 
                { 
                    $push: {
                        products: saveProduct._id
                    }
                }, 
                function (err, raw) {
                    if (err) return handleError(err);
                    console.log('The raw response from Mongo was ', raw);
                }
            )
        res.json(saveProduct)
    }) // Then we save our product in DB and save is a promise so we can res the new product



})

module.exports = productRoute;