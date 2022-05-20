const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");


router.get("/",async(req,res)=>{
   try {
    let pool = await sql.connect(config);

    let query = await pool.request().query(
        `   
        SELECT 
            Delivery.delivery_id,
            Delivery.logo_id,
            Delivery.name,
            Images.image_url,
            Images.image_description
        FROM Delivery
        INNER JOIN Images ON Delivery.logo_id = Images.image_id;
        `
      );

      return res.send(query.recordsets[0]);

   } catch (e) {
        return res.status(503).json({
            message: "API Error",
            error: e,
        });
   }
})



module.exports = router;
