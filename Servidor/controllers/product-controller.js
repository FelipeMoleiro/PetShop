//Felipe Guilermmo Santuche Moleiro - 10724010

const mongoose = require('mongoose');
const Product = mongoose.model('Product')
const User = mongoose.model('User')

const fs =  require('fs');


exports.post = (req,res,next) =>{
    if(req.file == undefined){
        res.status(400).send({message: 'sem Imagem'})
        return;
    }
    if(req.body.name.length > 15 ){
        // Deleta Imagen se der erro ao cadastrar
        fs.unlinkSync(req.file.path);
        res.status(400).send({message: 'nome maior que o permitido'})
        return;
    }
    var product = new Product({
        imgPath: req.file.path,
        name: req.body.name,
        price: req.body.price,
        quantity_stock: req.body.quantity_stock
    });
    product.save().then(()=>{
        res.status(201).send({message: 'Produto cadastrado com sucesso!'});
    }).catch(e => {
        // Deleta Imagen se der erro ao cadastrar
        fs.unlinkSync(req.file.path);
        res.status(400).send({
            message: 'Falha ao cadastrar produto',
            data: e}
        );
    });
    
}

exports.put = (req,res,next) =>{
    const id = req.params.id;

    Product.findByIdAndUpdate(id, {
        $set: {
            name: req.body.name,
            price: req.body.price,
            quantity_stock: req.body.quantity_stock
        }
    }).then(x=>{
        if(!x){
            res.status(404).send({
                message: 'Produto nao encontrado!'
            });
        }else{
            res.status(200).send({
                message: 'Produto atualizado com sucesso!'
            });
        }
        
    }).catch(e => {
        res.status(400).send({
            message: 'Falha ao atualizar produto',
            data: e
        });
    });
}


exports.delete = (req,res,next) =>{
    const id = req.body.id;

    //remove produto do carrinho de todos os usuarios
    User.updateMany({
        "cart.product": id
    },{
        "$pull": { "cart": {"product": id}}
    }).then((data) =>{
        //remove o produto
        Product.findByIdAndRemove(id).then(x=>{
            if(!x){
                res.status(404).send({
                    message: 'Produto nao encontrado!'
                });
            }else{
                // Deleta Imagem
                if (fs.existsSync(x.imgPath)) {
                    fs.unlinkSync(x.imgPath)
                }
                res.status(200).send({
                    message: 'Removido Com Sucesso'
                });
            }
        }).catch(e => {
            res.status(400).send({
                message: 'Falha ao remover produto',
                data: e
            });
        });
    }).catch((e)=>{
        res.status(400).send({
            message: 'Falha ao remover produto',
            data: e
        });
    })
}

exports.get = (req,res,next) =>{
    Product.find({}).then((data)=>{
        res.status(200).send(data);
    }).catch(e => {
        res.status(400).send(e);
    });
    
}

exports.getById = (req,res,next) =>{
    Product.findById(req.params.id).then((data)=>{
        res.status(200).send(data);
    }).catch(e => {
        res.status(400).send(e);
    });
}

