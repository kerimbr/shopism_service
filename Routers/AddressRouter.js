const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");


router.get("/:id",async(req,res)=>{
    try {

        let addressId = req.params.id;

        let pool = await sql.connect(config);

        let query = await pool.request().query(
            `   
            SELECT *
            FROM Addresses
            WHERE address_id = ${addressId};
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


router.get("/add",async(req,res)=>{
    return res.status(200).json({
        message: "Örnek Body Gönderimi",
        body:{
            country: "<Ülke> <ZORUNLU>",
            city: "<Şehir/İl> <ZORUNLU>",
            district: "<İlçe/Kasaba> <ZORUNLU>",
            first: "<Açık Adres> <ZORUNLU>"
        }
    });
})


router.post("/add", async(req,res)=>{
    try {

        if (
            req.body.country === undefined ||
            req.body.city === undefined ||
            req.body.district === undefined ||
            req.body.first === undefined 
          )
            return res.status(404).json({
              message: "country or city or district or first not be null",
            });

        const addressDetails = {
            country: req.body.country,
            city: req.body.city,
            district: req.body.district,
            first: req.body.first
        };
        
        let pool = await sql.connect(config);

        let query1 = await pool.request().query(
            `   
            INSERT INTO Addresses
                (address_id
                ,country
                ,city
                ,district
                ,address_first)
            VALUES
                ((SELECT MAX(address_id) FROM Addresses) + 1
                ,'${addressDetails.country}'
                ,'${addressDetails.city}'
                ,'${addressDetails.district}'
                ,'${addressDetails.first}')

            `
          );
      
          if (query1.rowsAffected.length !== 0 ) {
            return res.send("Success");
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





module.exports = router;
