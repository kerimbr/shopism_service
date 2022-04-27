const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");


router.get("/add",async(req,res)=>{
    return res.status(200).json({
        message: "Örnek Body Gönderimi",
        body:{
            productId: "<product_id>",
            quantity: "<quantity_id>",
            email: "<example>@<host>.<domain>"
        }
    });
})


router.post("/add", async(req,res)=>{
    try {

        if (
            req.body.productId === undefined ||
            req.body.quantity === undefined ||
            req.body.email === undefined 
          )
            return res.status(404).json({
              message: "productId and quantity and email not be null",
            });

        const cartDetails = {
            productId: req.body.productId,
            quantity: req.body.quantity,
            email: req.body.email
        };
        
        let pool = await sql.connect(config);

        let query1 = await pool.request().query(
            `   
            INSERT INTO CartItems (cart_item_id,product_id,quantity,price)
                VALUES (
                    (SELECT 1 + (SELECT MAX(CartItems.cart_item_id) FROM CartItems)),
                    ${cartDetails.productId},
                    ${cartDetails.quantity},
                    ( SELECT (${cartDetails.quantity}) * (SELECT SUM(Products.product_price) FROM Products WHERE product_id = ${cartDetails.productId}) ) 
                       )
            `
          );
      
          if (query1.rowsAffected.length !== 0 ) {
            let query2 = await pool.request().query(
                `   
                INSERT INTO UserCart (user_email, cart_item)
                    VALUES (
                    '${cartDetails.email}',
                    (SELECT MAX(CartItems.cart_item_id) FROM CartItems)
                           )
                `
              );
              if(query2.rowsAffected.length !== 0){
                return res.send("Success");
              }else{
                return res.status(403).send("Failed");
              }
          } else {
            return res.status(403).send("Failed");
          }

    } catch (e) {
        return res.status(503).json({
            message: "API Error",
            error: e,
          });
    }
});


router.get("/mycart",async(req,res)=>{
    return res.status(200).json({
        message: "Örnek Body Gönderimi",
        body:{
            email: "<example>@<host>.<domain>"
        }
    });
})

router.post("/mycart",async(req,res)=>{
    try {
        if (req.body.email === undefined) {
            return res.status(404).json({
                message: "email not be null",
              });
        }

        const email = req.body.email;

        let pool = await sql.connect(config);

        let query = await pool.request().query(
            `   
            SELECT 
                UserCart.*,
                CartItems.product_id,
                CartItems.quantity,
                CartItems.price,
				Products.product_name,
				Products.product_description,
				Products.image_id,
				Images.image_url
            From UserCart 
            INNER JOIN CartItems ON UserCart.cart_item = CartItems.cart_item_id
            INNER JOIN Products ON CartItems.product_id = Products.product_id
			INNER JOIN Images ON Products.image_id = Images.image_id
			WHERE user_email = '${email}'
            `
          );

          return res.send(query.recordsets[0]);

        
    } catch (e) {
        return res.status(503).json({
            message: "API Error",
            error: e,
          });
    }
});




module.exports = router;
