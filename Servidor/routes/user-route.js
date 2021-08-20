//Felipe Guilermmo Santuche Moleiro - 10724010

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

const mime = require('mime-types')
const multer = require('multer')
const storageProfile = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/profileImgs')
    },
    filename: function(req,file,cb){
        cb(null,  new Date().toISOString().replace(/:/g, '-') + '.' + mime.extension(file.mimetype))
    }
})
const storagePet = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads/petImgs')
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
const uploadProfile = multer({
    storage: storageProfile,
    fileFilter: fileFilter
})

const uploadPet = multer({
    storage: storagePet,
    fileFilter: fileFilter
})


//sao usados post ate nos metodos get pois é necessario
//e a senha como parametros, por esse motivo é mais seguro
//manda-los no body
router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.post('/getInfo', userController.getInfo);
router.put('/edit', userController.editUser)
router.post('/getCart', userController.getCart);
router.post('/addToCart', userController.addToCart);
router.post('/removeNFromCart', userController.removeNFromCart)
router.post('/removeItemCart', userController.removeItemCart)
router.post('/finishPurchase', userController.finishPurchase)
router.post('/getPets', userController.getPets);
router.post('/addPet', userController.addPet);
router.put('/editPet', userController.editPet);
router.delete('/deletePet', userController.deletePet);
router.put('/editImgProfile', uploadProfile.single('profileImage'),userController.editImgProfile)
router.put('/editImgPet', uploadPet.single('petImage'),userController.editImgPet)

module.exports = router;
