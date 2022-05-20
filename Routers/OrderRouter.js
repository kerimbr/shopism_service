const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");

const { viewTableConvertToObj } = require("../utils/Utils");


router.get("/:ID", async (req, res) => {
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

router.get("/create/example", async (req, res) => {

    return res.status(200).json({
        message: "Örnek Body Gönderimi",
        body:{
            "userEmail": "<user_email_address>",
            "cartItem": "<cart_item_id>",
            "orderAddress": "<order_address_id>",
            "deliveryId": "<delivery_id>",
            "paymentType": "Kredi Kartı | Havale/EFT",
            "totalPrice": "<total_price>",
            "installment": "<installment>",
            "installmentPrice": "<installmentPrice>"
        }
    });

});

router.post("/create", async (req, res) => {
    try {

        if (
            req.body.userEmail === undefined || req.body.cartItem === undefined ||
            req.body.orderAddress === undefined || req.body.deliveryId === undefined ||
            req.body.paymentType === undefined || req.body.totalPrice === undefined ||
            req.body.installment === undefined || req.body.installmentPrice === undefined) {
            return res.status(404).json({
                message: "userEmail or cartItem or orderAddress or orderStatusId or paymentType or deliveryId or totalPrice or installment or installmentPrice not be null",
            });
        }


        let orderDetails = {
            userEmail: req.body.userEmail,
            cartItem: req.body.cartItem,
            orderAddress: req.body.orderAddress,
            deliveryId: req.body.deliveryId,
            paymentType: req.body.paymentType,
            totalPrice: req.body.totalPrice,
            installment: req.body.installment,
            installmentPrice: req.body.installmentPrice
        };


        let pool = await sql.connect(config);

        let deliveryStatusQuery = await pool.request().query(
            `   
            INSERT INTO DeliveryStatus
                ([delivery_status_id]
                ,[delivery_id]
                ,[delivery_status])
            VALUES
                ((SELECT MAX(delivery_status_id) FROM DeliveryStatus) + 1
                ,${orderDetails.deliveryId}
                ,'Kargolanmayı Bekliyor')
            `
        );

        if (deliveryStatusQuery.rowsAffected.length === 1) {

            let paymentQuery = await pool.request().query(
                `   
                INSERT INTO PaymentOptions
                    (payment_options_id
                    ,payment_type
                    ,total_price
                    ,installment
                    ,installment_amount)
                VALUES
                    ((SELECT MAX(payment_options_id) FROM PaymentOptions) + 1
                    ,'${orderDetails.paymentType}'
                    ,${orderDetails.totalPrice}
                    ,${orderDetails.installment}
                    ,${orderDetails.installmentPrice})

                `
            );

            if (paymentQuery.rowsAffected.length === 1) {

                let query = await pool.request().query(
                    `   
                    INSERT INTO OrderDetails
                        (order_id
                        ,user_email
                        ,cart_item
                        ,order_adress
                        ,order_status_id
                        ,delivery_status_id
                        ,payment_option_id
                        ,order_date)
                    VALUES
                        ((SELECT MAX(order_id) FROM OrderDetails) + 1
                        ,'${orderDetails.userEmail}'
                        ,${orderDetails.cartItem}
                        ,${orderDetails.orderAddress}
                        ,2
                        ,(SELECT MAX(delivery_status_id) FROM DeliveryStatus)
                        ,(SELECT MAX(payment_options_id) FROM PaymentOptions)
                        ,(SELECT CAST( GETDATE() AS datetime ))
                        )
    
                    `
                );

                if(query.rowsAffected.length !== 0){
                    return res.status(200).send("Order Created!")
                }else{
                    return res.status(409).send("Order Failed!");
                }

            }

        } else {
            return res.status(501).json({
                message: "Server Error",
                error: "deliveryStatusQuery not affected",
            });
        }



    } catch (e) {
        console.log(e);
        return res.status(503).json({
            message: "API Error",
            error: e.toString(),
        });
    }
});





module.exports = router;
