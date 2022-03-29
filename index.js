let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let path = require('path');

let app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api',router);

// MiddleWare
router.use((request,response,next)=>{
    console.log('middleware');
    next();
});


// Main Route
 app.get('/',(req,res)=>{
     return res.status(200).sendFile('./utils/mainPage.html', {root: __dirname});
 });

// Routers Imports
 const productsRouter = require("./Routers/ProductRouter");
 const categoryRouter = require("./Routers/CategoryRouter");
//const brandsRouter = require("./Routers/Brandsrouter");


// // Inıt. Routers
 app.use('/products',productsRouter);
 app.use('/categories',categoryRouter);
// app.use('/brands',brandsRouter);



let port = process.env.PORT || 4004;
app.listen(port);
console.log('API is running at '+port);



