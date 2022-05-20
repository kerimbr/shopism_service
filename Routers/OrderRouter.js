const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");

const {viewTableConvertToObj} = require("../utils/Utils");


router.get("/:ID",async(req,res)=>{
   try {

    let id = req.params.ID;

    let pool = await sql.connect(config);
    let query = await pool.request().query(
        `   
        SELECT 
            OD.*,
            CI.*,
            P.*,
            Images.image_url,
            A.country,
            A.city,
            A.district,
            A.address_first,
            OS.status,
            DS.delivery_status,
            Delivery.name,
            Delivery.logo_id,
            PO.*
        FROM OrderDetails AS OD
        INNER JOIN CartItems AS CI On OD.cart_item = CI.cart_item_id
        INNER JOIN Products AS P ON CI.product_id = P.product_id
        INNER JOIN Images On P.image_id = Images.image_id
        INNER JOIN Addresses AS A On OD.order_adress = A.address_id
        INNER JOIN OrderStatus AS OS On OD.order_status_id = OS.order_status_id
        INNER JOIN DeliveryStatus AS DS On OD.delivery_status_id = DS.delivery_status_id
        INNER JOIN Delivery On DS.delivery_id = Delivery.delivery_id
        INNER JOIN PaymentOptions AS PO On OD.payment_option_id = PO.payment_options_id
        WHERE OD.order_id = ${id};
        `
      );

      let viewTable = query.recordsets[0][0];
      let orderDetail = viewTableConvertToObj(viewTable);

      return res.send(orderDetail);

   } catch (e) {
        return res.status(503).json({
            message: "API Error",
            error: e,
        });
   }
});





module.exports = router;
