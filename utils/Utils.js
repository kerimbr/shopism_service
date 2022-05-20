
let config = require('../DBConfig');
const sql = require('mssql');


exports.getImageUrlWithId = async(imageId)=>{
    try {
        let pool = await sql.connect(config);
        let query = await pool.request().query(
            `select image_url from Images Where image_id = ${imageId}`
        );
        return query.recordsets[0][0].image_url;
    } catch (error) {
        
    }
}


exports.viewTableConvertToObj = (viewTable) => {
    let obj = {
        BasicDetails:{
            orderId: viewTable.order_id,
            userEmail: viewTable.user_email,
            cartItemId: viewTable.cart_item,
            orderAddressId: viewTable.order_address,
            orderStatusId: viewTable.order_status,
            deliveryStatusId: viewTable.delivery_status_id,
            paymentOptionsId: viewTable.payment_options_id,
            orderDate: viewTable.order_date
        },
        CartItemDetails:{
            cartItemId: viewTable.cart_item_id,
            itemQuantity: viewTable.quantity,
            totalPrice: viewTable.total_price,
            product: {
                productId: viewTable.productId,
                productName: viewTable.product_name,
                productImage: viewTable.image_url,
                productPrice: viewTable.product_price
            }
        },
        AddressDetails:{
            addressId: viewTable.order_address,
            country: viewTable.country,
            city: viewTable.city,
            district: viewTable.district,
            firstAddress: viewTable.address_first
        },
        StatusDetails:{
            orderStatusId: viewTable.order_status_id,
            orderStatus: viewTable.status,
            deliveryStatusId: viewTable.delivery_status_id,
            deliveryStatus: viewTable.delivery_status,
            deliveryName: viewTable.name
        },
        PaymentDetails:{
            paymentOptionsID: viewTable.payment_options_id,
            paymentType: viewTable.payment_type,
            totalPrice: viewTable.total_price,
            installmentPrice: viewTable.installment_amount,
            installment: viewTable.installment
        }

    };

    return obj;
}


