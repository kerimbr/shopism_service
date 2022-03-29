const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");
const { getImageUrlWithId } = require("../utils/Utils");

router.get("/", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let brandQuery = await pool.request().query(
      `  
        SELECT TOP 50
            Brands.brand_id,
            Brands.brand_name,
            Brands.brand_image_id,
            Images.image_url
        FROM Brands 
            INNER JOIN Images ON Brands.brand_image_id = Images.image_id
            ORDER BY Brands.brand_id
        `
    );
    return res.status(200).send(brandQuery.recordsets[0]);
  } catch (e) {
    return res.status(503).json({
      message: "API Error",
      error: e,
    });
  }
});

router.get("/:bid", async (req, res) => {
  try {
    const bid = req.params.bid;
    let pool = await sql.connect(config);
    let brandQuery = await pool.request().query(
      `
        SELECT TOP 50
            Brands.brand_id,
            Brands.brand_name,
            Brands.brand_image_id,
            Images.image_url
        FROM Brands 
            INNER JOIN Images ON Brands.brand_image_id = Images.image_id
        WHERE brand_id = ${bid}  
            ORDER BY Brands.brand_id   
          `
    );
    return res.status(200).send(brandQuery.recordsets[0]);
  } catch (e) {
    return res.status(503).json({
      message: "API Error",
      error: e,
    });
  }
});

module.exports = router;
