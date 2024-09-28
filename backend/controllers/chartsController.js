const asyncHandler = require('../middleware/asyncHandler');
const Category = require('../models/categoryModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');



const getProducts = asyncHandler(async (req, res) => {
    try {
        
        // get the top 5 most sold products

        let products = await Product.aggregate([
            {
                $addFields: {
                    soldAsNumber: { $toInt: '$sold' }
                }
            },
            {
                $sort: { soldAsNumber: -1 }
            }, 
            {
                $limit: 5
            }
        ])

        products = products.sort((a, b) => a.createdAt - b.createdAt)

        return res.status(200).json(products)

    } catch (error) {
        return res.status(500).json(error)
    }
})



const getCategories = asyncHandler(async (req, res) => {

    try {
        const categories = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ])
        
        let names = []
        // get the names of the categories
        for(let i = 0; i < categories.length; i++) {
            const category = await Category.findById(categories[i]._id)
            names.push(category.name)
        }

    
        return res.status(200).json({categories, names})
    } catch (error) {
        return res.status(500).json(error)
    }

})


const getUsers = asyncHandler(async (req, res) => {
    // get the top 5 most active users based on number of orders

    try {
        
        const users = await Order.aggregate([
            {
                $group: {
                    _id: '$user',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ])
    
        console.log(users)

        let names = []
        // get the names of the users
        for(let i = 0; i < users.length; i++) {
            const user = await User.findById(users[i]._id)
            names.push(user.firstName + ' ' + user.lastName)
        }
        return res.status(200).json({users, names})


    } catch (error) {
        return res.status(500).json(error)
    }

})




module.exports = {
    getProducts,
    getCategories,
    getUsers
}