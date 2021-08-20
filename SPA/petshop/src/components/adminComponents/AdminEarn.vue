<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <div id="earningsPage">
            <h1>Earnings Page</h1>
                

            <div class="gridCenter" >
                <div>
                    <div class="esq">
                        <h1>List of sold Products</h1>
                        <div class="espacoTabela">
                            <div id="teste" class="itemInv" v-for="item in soldItems" v-bind:key="item._id">
                                <div>
                                    <img :src="imgSrc(item.imgPath)"/>
                                </div>
                                <div>
                                    <p>Product:<br>{{item.name}}</p>
                                </div>
                                <div>
                                    <p>Price:<br>R${{item.price}}</p>
                                </div>
                                <div>
                                    <p>Sold:<br>{{item.quantity_sold}}</p>
                                </div>
                                 
                            </div>
                        </div>
                        <h1>Earnings Products: R${{totalItemsSold}}</h1>
                    </div>
                    <div class="dir">
                        <h1>List of sold Services</h1>
                        <div class="espacoTabela">
                            <div id="teste2" class="itemInv" v-for="service in soldServices" v-bind:key="service._id">
                                <div>
                                    <p>Product:<br>{{service.name}}</p>
                                </div>
                                <div>
                                    <p>Price:<br>R${{service.price}}</p>
                                </div>
                                <div>
                                    <p>Sold:<br>{{service.sold}}</p>
                                </div>
                                 
                            </div>
                            
                        </div>
                        <h1>Earnings Services: R${{totalServicesSold}}</h1>
                    </div>
                </div>
            </div>
            <br><br><br>
            <h1>Total Earnings: R$ {{totalCompleto }}</h1>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'AdmEarnings',
    data() {
        return {
            soldItems: [],
            soldServices: []
        }
    },
    methods: {
        imgSrc(relativePath){
            return API_URL + '/' + relativePath;
        }
    },
    computed: {
        totalItemsSold(){
            var tot = 0;
            for(var i=0;i<this.soldItems.length;i++){
                tot += this.soldItems[i].quantity_sold * this.soldItems[i].price
            }
            return tot.toFixed(2);
        },
        totalServicesSold(){
            var tot = 0;
            for(var i=0;i<this.soldServices.length;i++){
                tot += this.soldServices[i].sold * this.soldServices[i].price
            }
            return tot.toFixed(2);
        },
        totalCompleto(){
            var tot = parseFloat(this.totalItemsSold) + parseFloat(this.totalServicesSold);
            return tot.toFixed(2);
        }
    },
    created() {
        axios.get(API_URL + '/products').then((response) => {
            if(response.status == 200){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].quantity_sold > 0){
                        this.soldItems.push(response.data[i]);
                    }
                }
            }
        })

        axios.get(API_URL + '/services').then((response) => {
            if(response.status == 200){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].sold > 0){
                        this.soldServices.push(response.data[i]);
                    }
                }
            }
        })

        
    }

}
</script>

<style scoped>

/*CSS EARNINGS PAGE*/
#teste > div {
    width: 140px;
    height: 110px;
    float: left;
    overflow: hidden;
}

#teste {
    margin-left: 1px;
    width: 584px;
    height: 110px;
    word-break: break-all;
}



#teste2 > div {
    width: 190px;
    height: 110px;
    float: left;
    overflow: hidden;
}

#teste2 {
    margin-left: 1px;
    width: 584px;
    height: 110px;
    word-break: break-all;
}

#teste2 p{
    margin: 20px 0px;

}

#earningsPage {
    background-color: #7bcfff;
    position: absolute;
    top:50px;
    left: 0px;
    right: 0px;
    min-width: var(--minwidth);
    min-height: calc(100% - 50px) ;
    text-align: center;
}



.itemEarn{
    margin-top: 10px;
    padding: 2px;
    background-color: deepskyblue;
    border: 5px solid #29a7f0;
    border-radius: 10px;
    
}

.itemEarn *{
    vertical-align: middle;
}

.itemEarn img{
    height: 100px;
    width: 100px;
    border: 2px solid black;
    border-radius: 10px;
}

.itemEarn p{
    margin: 0px 15px;
    font-size: 25px;
}
.esq {
    width: 630px;
    height: 700px;
    float: left;
    
}



.itemInv{
    margin-top: 10px;
    padding: 2px;
    background-color: deepskyblue;
    border: 5px solid #29a7f0;
    border-radius: 10px;
    
}

.itemInv *{
    vertical-align: middle;
}

.itemInv img{
    height: 100px;
    width: 100px;
    border: 2px solid black;
    border-radius: 10px;
}

.itemInv p{
    font-size: 25px;
}

.espacoTabela {
    margin-right: 0px;
    margin-top: 10px;
    height: calc(100% - 92px);
    overflow: auto;
    overflow-y: scroll;
    margin-right: 5px;
    border: 3px double black;
}

.espacoTabela::-webkit-scrollbar {
    width: 20px;
}
.espacoTabela::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    border-radius: 10px;
}

.espacoTabela::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
}


.dir {
    width: 630px;
    height: 700px;
    float: right;
}

</style>