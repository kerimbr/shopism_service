const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");
const { getImageUrlWithId } = require("../utils/Utils");

router.get("/", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    let productsQuery = await pool.request().query(
      `
            SELECT TOP 50
                Products.product_id,
                Products.category_id,
                Products.image_id,
                Products.brand_id,
                Products.product_name,
                Products.product_price,
                Products.product_description,
                Products.product_discount_rate,
                Categories.category_name,
                Categories.category_image_id,
                Brands.brand_image_id,
                Brands.brand_name,
                Brands.brand_description,
                Images.image_url,
                Images.image_description
            FROM Products 
                INNER JOIN Categories ON Products.category_id = Categories.category_id
                INNER JOIN Images ON Products.image_id = Images.image_id
                INNER JOIN Brands ON Products.brand_id = Brands.brand_id
            `
    );
    let productRecordSets = productsQuery.recordsets[0];
    let productsList = [];
    let product = {};

    for (let i = 0; i < productRecordSets.length; i++) {
      let productSet = productRecordSets[i];

      let categoryImageId = await getImageUrlWithId(
        productSet.category_image_id
      );
      let brandImageId = await getImageUrlWithId(productSet.brand_image_id);

      product = {
        product_id: productSet.product_id,
        category: {
          id: productSet.category_id,
          name: productSet.category_name,
          imageId: productSet.category_image_id,
          imageUrl: categoryImageId,
        },
        product_image: {
          id: productSet.image_id,
          url: productSet.image_url,
          description: productSet.image_description,
        },
        brand: {
          id: productSet.brand_id,
          name: productSet.brand_name,
          description: productSet.brand_description,
          image_id: productSet.brand_image_id,
          image_url: brandImageId,
        },
        product_name: productSet.product_name,
        product_price: productSet.product_price,
        product_description: productSet.product_description,
        product_discount_rate: productSet.product_discount_rate,
      };
      productsList.push(product);
    }
    return res.status(200).send(productsList);
  } catch (e) {
    return res.status(503).json({
      message: "API Error",
      error: e,
    });
  }
});

router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;

  try {
    let pool = await sql.connect(config);
    let productsQuery = await pool.request().query(
      `
            SELECT 
                Products.product_id,
                Products.category_id,
                Products.image_id,
                Products.brand_id,
                Products.product_name,
                Products.product_price,
                Products.product_description,
                Products.product_discount_rate,
                Categories.category_name,
                Categories.category_image_id,
                Brands.brand_image_id,
                Brands.brand_name,
                Brands.brand_description,
                Images.image_url,
                Images.image_description
            FROM Products 
                INNER JOIN Categories ON Products.category_id = Categories.category_id
                INNER JOIN Images ON Products.image_id = Images.image_id
                INNER JOIN Brands ON Products.brand_id = Brands.brand_id
            WHERE product_id = ${pid}    
            `
    );
    let productSet = productsQuery.recordsets[0][0];

    let product = {};

    let categoryImageId = await getImageUrlWithId(productSet.category_image_id);
    let brandImageId = await getImageUrlWithId(productSet.brand_image_id);

    product = {
      product_id: productSet.product_id,
      category: {
        id: productSet.category_id,
        name: productSet.category_name,
        imageId: productSet.category_image_id,
        imageUrl: categoryImageId,
      },
      product_image: {
        id: productSet.image_id,
        url: productSet.image_url,
        description: productSet.image_description,
      },
      brand: {
        id: productSet.brand_id,
        name: productSet.brand_name,
        description: productSet.brand_description,
        image_id: productSet.brand_image_id,
        image_url: brandImageId,
      },
      product_name: productSet.product_name,
      product_price: productSet.product_price,
      product_description: productSet.product_description,
      product_discount_rate: productSet.product_discount_rate,
    };
    return res.status(200).send(product);
  } catch (e) {
    return res.status(503).json({
      message: "API Error",
      error: e,
    });
  }
});

router.get("/category/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {

    let pool = await sql.connect(config);
    let productsQuery = await pool.request().query(
      `
        SELECT * FROM Products WHERE category_id=${cid}    
        `
    );
    return res.status(200).send(productsQuery.recordsets[0]);

  } catch (e) {
    return res.status(503).json({
        message: "API Error",
        error: e,
      });
  }
});


router.get("/brand/:bid", async (req, res) => {
    const bid = req.params.bid;
  
    try {
  
      let pool = await sql.connect(config);
      let productsQuery = await pool.request().query(
        `
          SELECT * FROM Products WHERE brand_id=${bid}    
          `
      );
      return res.status(200).send(productsQuery.recordsets[0]);
  
    } catch (e) {
      return res.status(503).json({
          message: "API Error",
          error: e,
        });
    }
  });

module.exports = router;
