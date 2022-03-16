const categoryRouter = require('express').Router();
const Category = require('../models/products/Category')

categoryRouter.get('/', async (req, res)=>{
    const response = await Category.find()
                .populate({
                    path: 'products',
                    model: 'Product',
                })
                .exec();

        res.send(response);
})

categoryRouter.get('/:name', async (req, res) => {
    const { name } = req.params;
        
        const responseMap = await Category.find({name})
                .populate({
                    path: 'products',
                    model: 'Product',
                })
                .exec();

        res.send(responseMap);
})

categoryRouter.post('/create', async (req, res) => {
    const categoryToCreate = req.body;

    if(!categoryToCreate){
        return res.status(400).json({message: `We could't process your require`})
    }

    const categoryCreated = new Category(categoryToCreate);

    categoryCreated.save().then(category => {
        res.status(200).send(category)
    })
    .catch(err => {
        console.log(err)
    })
    
})

    

module.exports = categoryRouter;




















// Category.findOne({ name })
        // .then(products =>{
        //     if(products) {
        //         return res.json(products)
        //     } else {
        //         res.status(404).end()
        //     }
        // })// busca nota por id mas facil xd