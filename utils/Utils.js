
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