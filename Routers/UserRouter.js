const express = require("express");
const router = express.Router();

let config = require("../DBConfig");
const sql = require("mssql");

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Örnek Body Gönderimi",
    body: {
      email: "<example>@<host>.<domain>",
      password: "<password>",
    },
  });
});

router.post("/", async (req, res) => {
  try {
    if (req.body.email === undefined || req.body.password === undefined)
      return res.status(404).json({
        message: "email and password not be null",
      });

    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    let pool = await sql.connect(config);

    let query = await pool.request().query(
      `  
        SELECT 
            Users.*,
            Addresses.country,
            Addresses.city,
            Addresses.district,
            Addresses.address_first,
            Addresses.address_second
        FROM Users 
        INNER JOIN Addresses ON Users.address_id = Addresses.address_id
            WHERE email = '${user.email}' AND password = '${user.password}'
          `
    );

    if (query.recordsets[0].length === 0) {
      return res.status(403).json({
        message: "wrong email or password",
      });
    }

    return res.status(200).send(query.recordsets[0][0]);
  } catch (e) {
    return res.status(503).json({
      message: "API Error",
      error: e,
    });
  }
});


router.get("/signup", (req, res) => {
    return res.status(200).json({
      message: "Örnek Body Gönderimi",
      body: {
        "email": "<example>@<host>.<domain>",
        "password": "<password>",
        "name": "<name>",
        "surname": "<surname>",
        "phone": "<phone_number> [can be null]",
        "tcno": "<tcno> [can be null]"
      },
    });
  });

router.post("/signup", async (req, res) => {
  try {
    if (
      req.body.email === undefined ||
      req.body.password === undefined ||
      req.body.name === undefined ||
      req.body.surname === undefined
    )
      return res.status(404).json({
        message: "email and password and name and surname not be null",
      });

    const user = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
      tcno: req.body.tcno,
    };

    let pool = await sql.connect(config);

    let query = await pool.request().query(
      `  
          INSERT INTO 
	        Users (email,password,address_id,name,surname,phone,identification_number)
	        VALUES ('${user.email}','${user.password}',0,'${user.name}','${user.surname}','${user.phone}','${user.tcno}')
      `
    );

    if (query.rowsAffected.length !== 0) {
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
