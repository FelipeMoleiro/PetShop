//Felipe Guilermmo Santuche Moleiro - 10724010

const mongoose = require('mongoose');
const User = mongoose.model('User')
const Product = mongoose.model('Product')
const Service = mongoose.model('Service')

const fs =  require('fs');

//cria usuario
exports.createUser = (req,res,next) =>{
    var user = new User(req.body);
    user.save().then(()=>{
        res.status(201).send({message: 'User cadastrado com sucesso!'});
    }).catch(e => {
        res.status(400).send({
            message: 'Falha ao cadastrar User',
            data: e}
        );
    });
    
}

//edita usuario
exports.editUser = (req,res,next) =>{
    User.findOneAndUpdate({
        user: req.body.user,
        password: req.body.password
    },{
        $set: {
            user: req.body.newUser,
            password: req.body.newPassword,
            address: req.body.newAddress,
            phone: req.body.newPhone,
            email: req.body.newEmail
        }
    }).then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            res.status(200).send({message: "OK"});
        }
    }).catch(e => {
        res.status(400).send(e);
    });
    
}

//passa por todos os produtos removendo do estoque
async function updateListProducts(list) {
    for(var i=0;i< list.length;i++){
        await Product.findByIdAndUpdate(list[i].id,{
            $inc: { quantity_stock: -list[i].quantity,quantity_sold: list[i].quantity}
        });
    }
    return {message: 'OK'};
}

//finalisa a compra
exports.finishPurchase = (req,res,next) =>{
    
    User.findOne({
        user: req.body.user,
        password: req.body.password
    }).populate('cart.product').then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            var erro = false;
            var listId = []
            for(var i=0;i<data.cart.length;i++){
                listId.push({id: data.cart[i].product._id, quantity: data.cart[i].quantity})
                if(data.cart[i].quantity > data.cart[i].product.quantity_stock){
                    erro = true;
                }
            }
            
            if(!erro){
                updateListProducts(listId).then((response)=>{
                    User.findByIdAndUpdate(data._id,{
                        $set: {cart: []}
                    }).then(()=>{
                        res.status(200).send({message: 'Compra Finalizada'});
                    }).catch((e)=>{
                        res.status(400).send({
                            message: "erro",
                            data: e
                        });
                    });
                    
                }).catch((e)=>{
                    res.status(400).send({
                        message: "erro",
                        data: e
                    });
                })
            }else{
                res.status(400).send({
                    message: "Nao disponivel no estoque",
                });
            }
            
        }
    }).catch(e => {
        res.status(400).send(e);
    });
}


//faz logn(verifica se usuario é valido)
exports.login = (req,res,next) =>{
    User.findOne({
        user: req.body.user,
        password: req.body.password
    }).then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            res.status(200).send({message: "OK", admin: data.admin});
        }
    }).catch(e => {
        res.status(400).send(e);
    });
    
}

//retorna o carrinho de um usuario
exports.getCart = (req,res,next) =>{
    User.findOne({
        user: req.body.user,
        password: req.body.password
    }).populate('cart.product').then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            res.status(200).send({
                message: "OK",
                cart: data.cart
            });
        }
    }).catch(e => {
        res.status(400).send(e);
    });
}

//retorna a info de um usuario
exports.getInfo = (req,res,next) =>{
    User.findOne({
        user: req.body.user,
        password: req.body.password
    }).then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            res.status(200).send({data});
        }
    }).catch(e => {
        res.status(400).send(e);
    });
}

//retorna os pets de um usuario
exports.getPets = (req,res,next) =>{
    User.findOne({
        user: req.body.user,
        password: req.body.password
    }).then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            res.status(200).send({
                message: "OK",
                pets: data.pets
            });
        }
    }).catch(e => {
        res.status(400).send(e);
    });
}

//remove item do carrinho
exports.removeItemCart = (req,res,next) =>{
    //acha e atualiza
    User.findOne({
        user: req.body.user,
        password: req.body.password
    }).then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            var existe = false;
            for(var i=0;i<data.cart.length;i++){
                if(data.cart[i].product == req.body.productid){
                    existe = true;
                    data.cart.splice(i,1);
                    break;
                }
            }

            if(existe){
                User.findByIdAndUpdate(data._id
                ,{
                    $set: {cart: data.cart}
                }).then((data2) =>{
                    if(!data){
                        res.status(404).send({message: "Usuario nao encontrado"});
                    }else{
                        res.status(200).send({message: "carrinho atualizado"})
                    }
                }).catch(e => {
                    res.status(400).send(e);
                })
            }else{
                res.status(404).send({message:'Produto nao encontrado'});
            }
        }
    }).catch(e => {
        res.status(400).send(e);
    });
}

//remove N quantidade de um item do carrinho
exports.removeNFromCart = (req,res,next) =>{
    //verifica se quantia valida
    var quantia_valida = false
    try {
        if(parseInt(req.body.quantity,10) > 0)
            quantia_valida = true;
    } catch (error) {}

    if(quantia_valida){

        //acha e atualiza
        User.findOne({
            user: req.body.user,
            password: req.body.password
        }).then((data)=>{
            if(!data){
                res.status(404).send({message: "Usuario nao encontrado"});
            }else{
                var existe = false;
                var error = false;
                //procura produto
                for(var i=0;i<data.cart.length;i++){
                    if(data.cart[i].product == req.body.productid){
                        existe = true;
                        //verifica se tem o suficiente para remover
                        if(data.cart[i].quantity <= parseInt(req.body.quantity,10)){
                            error = true;
                        }else{
                            data.cart[i].quantity -= parseInt(req.body.quantity,10);
                        }
                        break;
                    }
                }

                if(existe){
                    if(error){
                        res.status(400).send({message: 'quantidade invalida'});
                    }else{
                        User.findByIdAndUpdate(data._id
                        ,{
                            $set: {cart: data.cart}
                        }).then((data2) =>{
                            if(!data){
                                res.status(404).send({message: "Usuario nao encontrado"});
                            }else{
                                res.status(200).send({message: "carrinho atualizado"})
                            }
                        }).catch(e => {
                            res.status(400).send(e);
                        })
                    }
                }else{
                    res.status(404).send({message: "Produto no carrinho nao encontrado"});
                }
            }
        }).catch(e => {
            res.status(400).send(e);
        });
    }else{
        res.status(400).send({message: 'Quantia invalida'});
    }
}

//adiciona produto ao carrinho
exports.addToCart = (req,res,next) =>{

    //verifica se a quantia fornecida é valida
    var quantia_valida = false
    try {
        if(parseInt(req.body.quantity,10) > 0)
            quantia_valida = true;
    } catch (error) {}

    if(quantia_valida){
        //acha e atualiza
        User.findOne({
            user: req.body.user,
            password: req.body.password
        }).then((data)=>{
            if(!data){
                res.status(404).send({message: "Usuario nao encontrado"});
            }else{
                var existe = false;
                for(var i=0;i<data.cart.length;i++){
                    if(data.cart[i].product == req.body.productid){
                        existe = true;
                        data.cart[i].quantity += parseInt(req.body.quantity,10);
                        break;
                    }
                }
    
                if(existe){
                    User.findByIdAndUpdate(data._id
                    ,{
                        $set: {cart: data.cart}
                    }).then((data2) =>{
                        if(!data){
                            res.status(404).send({message: "Usuario nao encontrado"});
                        }else{
                            res.status(200).send({message: "carrinho atualizado"})
                        }
                    }).catch(e => {
                        res.status(400).send(e);
                    })
                }else{
                    User.findByIdAndUpdate(data._id
                    ,{
                        $push: {
                            cart: {product: req.body.productid, quantity: req.body.quantity}
                        }
                    }).then((data2) =>{
                        if(!data){
                            res.status(404).send({message: "Usuario nao encontrado"});
                        }else{
                            res.status(200).send({message: "carrinho atualizado"})
                        }
                    }).catch(e => {
                        res.status(400).send(e);
                    })
                }
            }
        }).catch(e => {
            res.status(400).send(e);
        });
    }else{
        res.status(400).send({message: 'Quantia invalida'});
    }
    
}

//adiciona pet
exports.addPet = (req,res,next) =>{

    if(req.body.name == '' || req.body.age == '' ||
        req.body.animal == '' || req.body.breed == ''){

        res.status(400).send({message: 'formataçao incorreta'});
        return;
    }

    User.findOneAndUpdate({
        user: req.body.user,
        password: req.body.password
    },{
        $push: {
            pets: {
                name: req.body.name,
                animal: req.body.animal,
                breed: req.body.breed,
                age: req.body.age
            }
        }
    },{new: true}).then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            res.status(200).send({message: 'adicionado', data: data});
        }
    }).catch(e => {
        res.status(400).send(e);
    });
}

//edita pet
exports.editPet = (req,res,next) =>{

    if(req.body.name == '' || req.body.age == '' ||
        req.body.animal == '' || req.body.breed == ''){

        res.status(400).send({message: 'formataçao incorreta'});
        return;
    }

    User.findOneAndUpdate({
        user: req.body.user,
        password: req.body.password,
        pets: {$elemMatch: {_id: req.body.petId}}

    },{
        $set: {
            "pets.$.name": req.body.name,
            "pets.$.animal": req.body.animal,
            "pets.$.breed": req.body.breed,
            "pets.$.age": req.body.age
            
        }
    },{new: true}).then((data)=>{
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            res.status(200).send({message: 'atualizado', data: data});
        }
    }).catch(e => {
        res.status(400).send(e);
    });
}

//deleta pet
exports.deletePet = (req,res,next) =>{
    const id = req.body.id;

    User.findOneAndUpdate({
        user: req.body.user,
        password: req.body.password
    },{
        "$pull": { "pets": {"_id": id}}
    }).then((data)=>{
        //console.log('oi')
        if(!data){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            //console.log(data)
            //deleta imagem do pet que foi apagado
            var antigoPath = '';
            for(var i=0;i<data.pets.length;i++){
                if(data.pets[i]._id.equals(req.body.id)){
                    antigoPath = data.pets[i].imgPath;
                    break;
                }
            }
            if(antigoPath != '' && antigoPath != 'uploads/petImgs/default-pet.jpg'){
                if (fs.existsSync(antigoPath)) {
                    fs.unlinkSync(antigoPath)
                }
            }

            //remove serviços relacionados ao pet
            Service.updateMany({
                "scheduled.animalId": id,
                "scheduled.userId": data._id
            },{
                "$pull": { "scheduled": {"animalId": id,"userId": data._id}}
            }).then((data) =>{
                res.status(200).send({
                    message: 'Removido Com Sucesso'
                });
            }).catch((e)=>{
                res.status(400).send({
                    message: 'Falha ao remover serviços',
                    data: e
                });
            })
        }
    }).catch(e => {
        res.status(400).send(e);
    });

    
}


exports.editImgProfile = (req,res,next) =>{
    if(req.file == undefined){
        res.status(400).send({message: 'sem Imagem'})
        return;
    }
    User.findOneAndUpdate({
        user: req.body.user,
        password: req.body.password
    },{
        $set: {
            imgPath: req.file.path 
        }
    }).then((data)=>{
        if(!data){
            // Deleta Imagem
            if (fs.existsSync(req.file.path )) {
                fs.unlinkSync(req.file.path )
            }
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            //deleta imagem antiga
            if(data.imgPath != 'uploads/profileImgs/default-user-image.png'){
                if (fs.existsSync(data.imgPath)) {
                    fs.unlinkSync(data.imgPath)
                }
            }
            res.status(200).send({message: "OK", imgPath: req.file.path});
        }
    }).catch(e => {
        // Deleta Imagem
        if (fs.existsSync(req.file.path )) {
            fs.unlinkSync(req.file.path )
        }
        res.status(400).send(e);
    });    
}


exports.editImgPet = (req,res,next) =>{
    if(req.file == undefined){
        res.status(400).send({message: 'sem Imagem'})
        return;
    }
    User.findOneAndUpdate({
        user: req.body.user,
        password: req.body.password,
        pets: {$elemMatch: {_id: req.body.petId}}
    },{
        $set: {
            "pets.$.imgPath": req.file.path,
        }
    }).then((data)=>{
        if(!data){
            // Deleta Imagem
            if (fs.existsSync(req.file.path )) {
                fs.unlinkSync(req.file.path )
            }
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            //deleta imagem antiga
            var antigoPath = '';
            for(var i=0;i<data.pets.length;i++){
                if(data.pets[i]._id.equals(req.body.petId)){
                    antigoPath = data.pets[i].imgPath;
                    break;
                }
            }
            if(antigoPath != '' && antigoPath != 'uploads/petImgs/default-pet.jpg'){
                if (fs.existsSync(antigoPath)) {
                    fs.unlinkSync(antigoPath)
                }
            }
            res.status(200).send({message: "OK", imgPath: req.file.path});
        }
    }).catch(e => {
        // Deleta Imagem
        if (fs.existsSync(req.file.path )) {
            fs.unlinkSync(req.file.path )
        }
        res.status(400).send(e);
    });    
}