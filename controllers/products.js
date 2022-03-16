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

    Category.updateOne(
                { name: saveProduct.category}, 
                { 
                    $push: {
                        products: saveProduct._id
                    }
                }, 
                function (err, raw) {
                    if (err) return err;
                    console.log('The raw response from Mongo was ', raw);
                }
            )
        res.json(saveProduct)
    }) // Then we save our product in DB and save is a promise so we can res the new product
    
})

// delete a product itself and from his category
productRoute.delete('/delete/:id', async (req, res)=>{
    const { id } = req.params;

    const saveProd = await Product.findById(id);
    const cate = saveProd.category
    await Product.deleteOne({_id: id}).then(prod => console.log(`Product deleted`)).catch(err => console.log(`Error deleting Product: `, err))


    await Category.updateOne({name: cate}, {
        
        $pullAll: {
                products: [id]
            },
        },
    )

    res.sendStatus(201)
    })

    
module.exports = productRoute