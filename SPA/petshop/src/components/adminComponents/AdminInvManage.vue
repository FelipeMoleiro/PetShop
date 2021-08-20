<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>

        <div id="invManPag">
            <h1>Inventory management</h1>
            <div class="gridCenter" >
                <div>
                    <div class="esq">
                        <div class="gridCenter">
                            <input type="text" name="search" id="invSearchbar" placeholder="search" v-model="searchTerm">
                            <!-- <button id="invSearch">Search</button> -->
                        </div>
                        <div class="espacoTabela">
                            <div id="teste" class="itemInv" :class="{invSelected: item.realIndex == selected}" v-for="item in filteredResults" v-bind:key="item.realIndex" @click="select(item.realIndex)">
                                <div>
                                    <img :src="imgSrc(item.imgPath)"/>
                                </div>
                                <div>
                                    <p>Name:<br>{{item.name}}</p>
                                </div>
                                <div>
                                    <p>Price:<br>R${{item.price}}</p>
                                </div>
                                <div>
                                    <p>Quantity:<br>{{item.quantity_stock}}</p>
                                </div>
                                 
                            </div>
                        </div>
                        
                    </div>
                    <div class="dir" v-if="selected != 'empty'">
                        <table id="editInvTable">
                            <tbody>
                                <tr>
                                    <td>
                                        <img :src="imgSrc(atual.imgPath)">
                                    </td>
                                    <td>
                                        <!-- <button class="elemStyle">Change Image</button> -->
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Name(Até 15 letras):</p>
                                    </td>
                                    <td>
                                        <input type="text" class="elemStyle" v-model="atual.name">
                                    </td>

                                </tr>
                                <tr>
                                    <td>
                                        <p>Price(R$):</p>
                                    </td>
                                    <td>
                                            <input type="text" class="elemStyle" v-model="atual.price">
                                    </td>

                                </tr>
                                <tr>
                                    <td>
                                        <p>Quantity:</p>
                                    </td>
                                    <td>
                                        <input type="text" class="elemStyle" v-model="atual.quantity_stock">
                                        <!-- <p>{{atual.quantity_stock}}</p> -->
                                    </td>

                                </tr>
                                <tr>
                                    <td>
                                        <p v-if="atualizado" style="font-size:20px;margin: 0px">Atualizado!</p>
                                        <p v-else-if="erro" style="font-size:20px;margin: 0px">Erro</p>
                                    </td>
                                    <td>
                                        <button class="elemStyle" @click="updateItem(selected,atual)">Edit</button>
                                        &nbsp;
                                        <button class="elemStyle" @click="deleteItem(selected,atual)">Remove</button>
                                        
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'invManage',
    data(){
        return {
            items: [],
            selected: 'empty',
            atual: {},
            searchTerm: '',
            atualizado: false,
            erro: false
        }
    },
    methods: {
        select(index){
            if(this.selected == index){
                this.selected = 'empty'
            }
            else{
                this.selected = index
                this.atual = {
                    ...this.items[index]
                }
            }
            this.atualizado = false
            this.erro = false
        },
        updateItem(index,Item){
            if(index != 'empty'){
                var body = {
                name: Item.name,
                price: Item.price,
                quantity_stock: Item.quantity_stock
                }
                axios.put(API_URL + '/products/admin/' + Item._id, body).then((response) => {
                    if(response.status == 200){
                        this.items[index] = {
                            ...Item
                        }
                        this.items.splice(0,0)
                        this.atualizado = true
                        this.erro = false
                    }else{
                        this.atualizado = false
                        this.erro = true
                    }
                }).catch(() =>{
                    this.atualizado = false
                    this.erro = true
                })
            }
           
        },
        deleteItem(index,Item){
            axios.delete(API_URL + '/products', {data: {id: Item._id}}).then((response) => {
                if(response.status == 200){
                    this.items.splice(index,1)
                    this.selected = 'empty'
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
                if(this.items[i].name.toLowerCase().includes(this.searchTerm.toLowerCase())){
                    filteredItems.push({...this.items[i],realIndex: i});
                }
            }
            return filteredItems;
        }
    },
    created() {
        axios.get(API_URL + '/products').then((response) => {
            if(response.status == 200){
                this.items = response.data
            }
        })
    }
}
</script>

<style scoped>


/*CSS Inventory Management*/

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

#invManPag {
    background-color: #7bcfff;
    position: absolute;
    top:50px;
    left: 0px;
    right: 0px;
    min-width: var(--minwidth);
    min-height: calc(100% - 50px) ;
    text-align: center;
}

#invManPag > div{
    margin-bottom: 40px;
}

#invSearchbar {
    margin-top: 10px;
    height: 30px;
    width: 300px;
    border-color: black;
    border-radius: 10px;
    border-style: solid;
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

.itemInv:hover , .invSelected{
    background-color: #0087b4;
    border-color: #1a70a1;
    cursor: pointer;
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

#editInvTable{
    margin-top: 56px;
    border: 3px double black;
    background-color: deepskyblue;
    padding: 0px;
    border-spacing:0 15px;
    width: 599px;
    height: calc(100% - 86px);
}

#editInvTable img{
    width: 150px;
    height: 150px;
    border: 2px solid black;
    border-radius: 10px;
}


#editInvTable p{
    font-size: 30px;
}

#editInvTable button{
    width: 150px;
    height: 30px;
    
}

#editInvTable input {
    height: 30px;
    width: 300px;
    font-size: 20px;
}

</style>