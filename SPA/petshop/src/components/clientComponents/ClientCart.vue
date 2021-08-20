<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <div id="cartPage">
            <h1>Total: R${{totalCart}}</h1>
            <div class="gridCenter">
                <input type="text" placeholder="numero cartao(nao é necessario)" class="elemStyle numCartao">
                <input type="text" placeholder="npme cartao(nao é necessario)" class="elemStyle nomeCartao">
                <div>
                    <input type="text" placeholder="validade cartao(nao é necessario)" class="elemStyle validadeCartao">
                    <input type="text" placeholder="codigo segurança(nao é necessario)" class="elemStyle codigoCartao">
                </div>
            </div>
            <div class="gridCenter">
                <button id="finishPurchase" class="elemStyle" @click="finishPurchase()">Finish Purchase</button>
            </div>
            <h1>Cart Item List:</h1>
            <div id="itemListCart">
                <div class="itemQnty" v-for="(item,index) in itemCart" :key="item._id">
                    <div class="itemCart">
                        <h1>{{item.product.name}}</h1>
                        <div class="imgContainer">
                            <img :src="imgSrc(item.product.imgPath)"/>
                        </div>

                        <p>Stock: {{item.product.quantity_stock}}</p>
                        <p>R$ {{item.product.price}}</p>
                    </div>
                    <h1 id="qtty">x{{item.quantity}}</h1>
                    <button class="elemStyle" @click="upProduct(index)">Up</button>
                    <button class="elemStyle" @click="downProduct(index)">Down</button>
                    <button class="elemStyle" @click="removeProduct(index)">Remove From Cart</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'ClientCart',
    props: {
        user: String,
        password: String
    },
    data(){
        return {
            itemCart: []
        }
    },
    methods: {
        upProduct(index){
            var body = {
                user: this.user,
                password: this.password,
                productid: this.itemCart[index].product._id,
                quantity: 1
            }
            axios.post(API_URL + '/users/addToCart', body).then((response) => {
                if(response.status == 200){
                    this.itemCart[index].quantity += 1;
                }
            })
        },
        downProduct(index){
            if(this.itemCart[index].quantity > 1){
                var body = {
                    user: this.user,
                    password: this.password,
                    productid: this.itemCart[index].product._id,
                    quantity: 1
                }
                axios.post(API_URL + '/users/removeNFromCart', body).then((response) => {
                    if(response.status == 200){
                        this.itemCart[index].quantity -= 1;
                    }
                }).catch(() =>{

                })
            }
            
        },
        removeProduct(index){
            var body = {
                user: this.user,
                password: this.password,
                productid: this.itemCart[index].product._id
            }
            axios.post(API_URL + '/users/removeItemCart', body).then((response) => {
                if(response.status == 200){
                    this.itemCart.splice(index,1);
                }
            }).catch(() =>{

            })
            
            
        },
        finishPurchase(){
            var body = {
                user: this.user,
                password: this.password
            }
            axios.post(API_URL + '/users/finishPurchase', body).then((response) => {
                if(response.status == 200){
                    this.itemCart = []
                }
            }).catch((e) =>{
                console.log(e)
            })
        },
        imgSrc(relativePath){
            return API_URL + '/' + relativePath;
        }
    },
    computed: {
        totalCart(){
            var tot = 0;
            for(var i=0;i<this.itemCart.length;i++){
                tot += this.itemCart[i].quantity * this.itemCart[i].product.price
            }
            return tot.toFixed(2);
        }
    },
    created(){
        var body = {
            user: this.user,
            password: this.password
        }
        axios.post(API_URL + '/users/getCart',body).then((response) => {
            if(response.status == 200){
                this.itemCart = response.data.cart
                //this.atualizado = true;
                //this.erro = false;
            }
        }).catch(() => {
            //this.atualizado = false;
            //this.erro = true;
        })
    }
}
</script>

<style scoped>
/*----------CSS DA PAGINA DO CART----------------------*/

.numCartao, .nomeCartao {
    width: 300px;
    margin: 5px;
}
.validadeCartao {
    width: 133px;
    margin: 5px;
}

.codigoCartao{
    width: 133px;
    margin: 5px;
}   



#cartPage{
    position: absolute;
    min-width: var(--minwidth);
    top:50px;
    left: 0px;
    right: 0px;
    justify-content: center;
    display: grid;
}

#cartPage h1 {
    text-align: center;
    overflow: hidden;
}

#finishPurchase {
    width: 300px;
    height: 50px;
    border-color: black;
    border-radius: 10px;
    border-style: solid;
}




.itemCart {
    text-align: center;
    height: 300px;
    width: 300px;
    margin: 20px;
    background-color: #3ecdf1;
    border-style: solid;
    border-width: 3px;
    border-radius: 30px;
    border-color: teal;
    display: grid;
    justify-content: center;

    
}

.itemQnty {
    clear: both;
}

.itemQnty input{
    width: 30px;
    height: 30px;
    margin-top: 137px;
    margin-right: 30px;
    margin-left: 10px;
}

#qtty{
    margin-top: 137px;
    margin-left: 30px;
    font-size: 30px;
}

.itemQnty button{
    margin-top: 137px;
    margin-left: 20px;
    height: 30px;
}

.itemQnty *{
    float: left;
}

.itemCart img{
    width: 120px;
    height: 120px;
    border-style: solid;
    border-radius: 40px;
    border-width: 3px;
    border-color: slategray;
}

.itemCart h1{
    margin: 3px 10px ;
}

.itemCart * {
    margin: 5px;
}

.itemCart p{
    font-size: 30px;
}

.itemQnty button {
    border-radius: 10px;
    background-color: deepskyblue;
    border-color: black;
}

.imgContainer {
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>