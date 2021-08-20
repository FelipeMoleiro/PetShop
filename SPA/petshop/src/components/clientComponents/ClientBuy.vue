<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <div id="shopping">
            <div class="gridCenter">
                <input type="text" name="search" id="searchbar" placeholder="search" v-model="search">
            </div>
            <div class="gridCenter">
                <div id="itemList">
                    <div class="item elemStyle2" v-for="realIndex in filteredResults" v-bind:key="realIndex" >
                        <h1>{{items[realIndex].name}}</h1>
                        <div>
                            <img :src="imgSrc(items[realIndex].imgPath)"/>
                        </div>
                        <p class="price">R$ {{items[realIndex].price}}</p>
                        <p class="stock">Stock: {{items[realIndex].quantity_stock}}</p>
                        <div class="divQ">
                            <p class="quantity">Quantity:</p>
                            <input type="text" class="numInput" v-model="items[realIndex].quantity_selected">
                            <button class="elemStyle" @click="addToCart(realIndex)">Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="popup" @click="adicionado=false" v-if="adicionado" >
                <p>Produto adicionado ao carrinho</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'clientBuy',
    props: {
        user: String,
        password: String
    },
    data(){
        return {
            search: '',
            items: [],
            adicionado: false
        }
    },
    methods: {
        sleep (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },
        popUp(){
            this.adicionado = true;
            this.sleep(1000).then(()=>{
                this.adicionado = false;
            })
        },
        addToCart(index){
            var body = {
                user: this.user,
                password: this.password,
                productid: this.items[index]._id,
                quantity: this.items[index].quantity_selected
            }
            axios.post(API_URL + '/users/addToCart', body).then((response) => {
                if(response.status == 200){
                    this.popUp()
                }
            })
        },
        imgSrc(relativePath){
            return API_URL + '/' + relativePath;
        }
    },
    computed: {
        filteredResults(){
            var filteredItems = [];
            for(var i=0;i<this.items.length;i++){
                if(this.items[i].name.toLowerCase().includes(this.search.toLowerCase())){
                    filteredItems.push(i);
                }
            }
            return filteredItems;
        }
    },
    created() {
        axios.get(API_URL + '/products').then((response) => {
            if(response.status == 200){
                for(var i=0;i<response.data.length;i++){
                    this.items.push({...response.data[i],quantity_selected: 1});
                }
            }
        })
    }
}
</script>

<style>



/*CSS DA PARTE DE SHOPPING*/

#popup {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 400px;
    height: 90px;
    background: rgb(39, 182, 182);
    border-radius: 10px;
    

}
#popup p {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 29px;
}

#shopping{
    position: absolute;
    min-width: var(--minwidth);
    top:50px;
    left: 0px;
    width: 100%;
    min-height: calc(100% - 50px) ;
    justify-content: center;
}


#searchbar {
    margin-top: 10px;
    height: 30px;
    width: 300px;
    border-color: black;
    border-style: solid;
    border-radius: 10px;
}

#itemList {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    
    width: calc(386px*3);
}


.item {
    text-align: center;
    height: 340px;
    width: 340px;
    margin: 20px;
    display: grid;
    justify-content: center;
}

.item {
    overflow: hidden;
}

.item img{
    width: 150px;
    height: 150px;
    border-style: solid;
    border-radius: 40px;
    border-width: 3px;
    border-color: slategray;
}

.item * {
    margin: 5px;
}

.price{
    font-size: 30px;
}

.item button {
    border-radius: 10px;
    background-color: deepskyblue;
    border-color: black;
}

.stock {
    font-size: 20px;
    margin: 0px;
}

.quantity {
    font-size: 20px;
    float: left;
    margin: 3px 0px;
}

.numInput {
    border-radius: 10px;
    background-color: deepskyblue;
    border-color: black;
    border-style: solid;
    margin: 0px;          
    width: 22px;
    padding: 0px 3px;
    margin-left: 5px;
    text-align: center;
}

.divQ{
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>