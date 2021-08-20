//Felipe Guilermmo Santuche Moleiro - 10724010

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');


const mime = require('mime-types')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/productImgs')
    },
    filename: function(req,file,cb){
        cb(null,  new Date().toISOString().replace(/:/g, '-') + '.' + mime.extension(file.mimetype))
    }
})

const fileFilter = (req,file,cb) =>{
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true);
    }else{
        cb(null,false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

router.post('/',upload.single('productImage'), productController.post);

router.get('/', productController.get);

router.delete('/', productController.delete);

router.put('/admin/:id', productController.put);

router.get('/admin/:id', productController.getById);

module.exports = router;