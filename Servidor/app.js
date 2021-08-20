//Felipe Guilermmo Santuche Moleiro - 10724010

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//permitir request de qqr site
const cors=require('cors');
app.use(cors({origin:true,credentials: true}));




//conectar ao banco
mongoose.Promise = global.Promise;
const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};
mongoose.connect(config.connectionString, mongooseConfig ).then(()=>{
    console.log("Connected to database");
}).catch(e=>{
    console.log("Erro ao se conectar ao banco: " + e);
});

//carrega model
const Product = require('./models/product')
const User = require('./models/user')
//const Order = require('./models/order')
const Service = require('./models/service')


//carrega rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/products-route');
const userRoute = require('./routes/user-route');
const serviceRoute = require('./routes/services-route');

app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/users', userRoute);
app.use('/services', serviceRoute);

app.use('/uploads/productImgs', express.static('uploads/productImgs'))
app.use('/uploads/profileImgs', express.static('uploads/profileImgs'))
app.use('/uploads/petImgs', express.static('uploads/petImgs'))

module.exports = app;