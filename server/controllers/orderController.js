var Order = require("../models/orderModel");
var Address = require("../models/addressModal");
var User = require("../models/userModel");
var Category = require("../models/categoryModel");
var Product = require("../models/productModel");
var Option = require("../models/productOption");
// CREATE A NEW ORDER
exports.CREATE_NEW_ORDER = async (req, res) => {
  try {
    let newOrder = new Order({
      user: req.body.user,
      phone: req.body.phone,
      email: req.body.email,
      billingAddress: req.body.billingAddress,
      note: req.body.note,
      payment: req.body.payment,
      coupons: req.body.coupon,
      products: req.body.products,
      shipping: {
        address: req.body.shipping.address,
        method: req.body.shipping.method,
        cost: req.body.shipping.cost,
      },
      discount: req.body.discount,
      tax: req.body.tax,
      total: req.body.total,
    });
    let savedOrder = await newOrder.save();
    let order = await savedOrder.populate([
      {
        path: "user",
      },
      {
        path: "billingAddress",
      },
      {
        path: "payment",
      },
      {
        path: "shipping",
        populate: {
          path: "address",
        },
      },
      {
        path: "products",
        populate: [
          {
            path: "product",
          },
          {
            path: "option",
          },
        ],
      },
    ]);
    changeProductsQyt(req.body.products)
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

const changeProductsQyt = async (products) => {
  try {
    products.forEach(async (product) => {
      if (product.option) {
     await Option.findByIdAndUpdate(product.option, [
        {
          $set: {
            "total_stock": {
              $max: [
                0,
                {
                  $subtract: [
                    "$total_stock",
                    product.quantity
                  ]
                }
              ]
            }
          }
        }
      ]);
      }else{ 
        

        await Product.findByIdAndUpdate(product.product, [
          {
            $set: {
              "total_stock": {
                $max: [
                  0,
                  {
                    $subtract: [
                      "$total_stock",
                      product.quantity
                    ]
                  }
                ]
              }
            }
          }
        ]);
      }
    });
  } catch (error) { 
    throw new Error()
  }
};

// GET ORDERS BY USER ID
exports.GET_ORDERS_BY_USER_ID = async (req, res) => {
  try {
    let id = req.body.userId;
    let orders = await Order.find({ user: id })
      .populate([
        {
          path: "user",
        },
        {
          path: "billingAddress",
        },
        {
          path: "payment",
        },
        {
          path: "shipping",
          populate: {
            path: "address",
          },
        },
        {
          path: "products",
          populate: [
            {
              path: "product",
            },
            {
              path: "option",
            },
          ],
        },
      ])
      .sort({ createAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

// GET ALL ORDERS

exports.GET_ALL_ORDERS = async (req, res) => {
  try {
    let orders = await Order.find({}).populate([
      {
        path: "user",
      },
      {
        path: "billingAddress",
      },
      {
        path: "payment",
      },
      {
        path: "shipping",
        populate: {
          path: "address",
        },
      },
      {
        path: "products",
        populate: [
          {
            path: "product",
          },
          {
            path: "option",
          },
        ],
      },
    ]);

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};


// GET BEST SELLER PRODUCTS 
exports.BEST_SELLER_PRODUCTS =async( req, res) => {
  try{
    let productsData = await Order.aggregate([
   /*   {
        "$match": {
          "key": 2
        }
      },*/
      {
        "$unwind": "$products"
      },
      {
        "$group": {
          "_id": {
            "$cond": {
              "if": "$products.option",
              "then": "$products.option",
              "else": "$products.product"
            }
          },
          "count": {
            "$sum": {
              "$cond": {
                "if": "$products.option",
                "then": "$products.quantity",
                "else": "$products.quantity"
              }
            }
          },

          "status" :{
            "$sum": {
            "$cond": {
              "if": "$products.option",
              "then": 0,    //  if status == 0   ====>> option
              "else": 1     //  id status > 0  ====>> main
            }
          }
        }
        },
       
      }
    ]);
     
    const populateProducts = async() => {
      
      try{
        let products = []
        if(productsData.length>0){
         await Promise.all( productsData.map(async(product) => {
            if (product.status ===0){
              let _product = await Option.findById(product._id).populate("product");
              let savedProduct = {..._product._doc, sold:product.count, status:"option"}
              products.push(savedProduct);
            }else{
              let _product = await Product.findById(product._id);
              _product.sold =await product.count
              let savedProduct = {..._product._doc, sold:product.count, status:"main"}
              products.push(savedProduct)
            }
          }))
        }
        return products
      }catch(error){ 
        throw new Error 
      }
    }
    let products = await populateProducts();
    products = products.sort((a,b)=>b.sold-a.sold)
   
    return res.status(200).json({success:true, products})
  }catch(error){
    return res.status(401).json({ success: false, error });
  }
}

// Get Categories percentage of sold product 
exports.GET_CAT_PERCENT = async(req, res) =>{
  try{
    let categoriesData = await Order.aggregate([
      /*   {
           "$match": {
             "key": 2
           }
         },*/
         {
           "$unwind": "$products"
         },
        
         { "$lookup": {
          "from": "products",
          "localField": "products.product",
          "foreignField": "_id",
          pipeline: [ {$project: {category: 1} } ],
          "as": "product_detail"
        }},
        
        {
          "$unwind":"$product_detail"
        },{
          "$group": {
            "_id": "$product_detail.category",
            "soldProducts": {
              "$sum": 
                "$products.quantity"
            },
          },
        }
       ]);
       let categories = [];
       if(categoriesData.length >0 ){
        await Promise.all(categoriesData.map(async(cat) => {
          let category = await Category.findById(cat._id);
          let _category = {...category._doc, soldProducts:cat.soldProducts};
          categories.push(_category);
        }))
      }
       return res.status(200).json({success:true, categories})

  }catch(error){
    console.log(error)
    return res.status(401).json({ success: false, error });
  }
}