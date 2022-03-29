const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");
const { getImageUrlWithId } = require("../utils/Utils");

router.get("/", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let categoryQuery = await pool.request().query(
      `
        SELECT TOP 50
            Categories.category_id,
            Categories.category_name,
            Categories.category_image_id,
            Images.image_url
        FROM Categories 
            INNER JOIN Images ON Categories.category_image_id = Images.image_id
        ORDER BY Categories.category_id   
        `
    );
    return res.status(200).send(categoryQuery.recordsets[0]);
  } catch (e) {
    return res.status(503).json({
      message: "API Error",
      error: e,
    });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    let pool = await sql.connect(config);
    let categoryQuery = await pool.request().query(
      `
          SELECT TOP 50
              Categories.category_id,
              Categories.category_name,
              Categories.category_image_id,
              Images.image_url
          FROM Categories 
              INNER JOIN Images ON Categories.category_image_id = Images.image_id
          WHERE category_id=${cid}    
          ORDER BY Categories.category_id   
          `
    );
    return res.status(200).send(categoryQuery.recordsets[0]);
  } catch (e) {
    return res.status(503).json({
      message: "API Error",
      error: e,
    });
  }
});

module.exports = router;
