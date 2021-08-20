<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <div id="newProdPage">
            <h1>Add a product</h1>
            <p>Select Image(png or jpeg):</p>
            <input class="elemStyle" id="fileInput" type="file" accept="image/*" @change="onFileSelected">
            <br><br><br>
            <div class="gridCenter">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Name(Até 15 letras): 
                            </td>
                            <td>
                                <input class="elemStyle" type="text" placeholder="name" v-model="name">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Price(R$): 
                            </td>
                            <td>
                                <input class="elemStyle" type="text" placeholder="price" v-model="price">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Quantity: 
                            </td>
                            <td>
                                <input class="elemStyle" type="text" placeholder="quantity" v-model="quantity">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br>
                <button class="elemStyle" v-on:click="addProduct()">Add</button>
                <p class="errmsg" v-if="error">Erro ao cadastrar</p>
                <p class="errmsg" v-if="cadastradao">Cadastrado com sucesso!</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'AdminAddProduct',
    data() {
        return {
            name: '',
            price: '',
            quantity: '',
            picture: '',
            selectedFile: undefined,
            error: false,
            cadastradao: false
        }
    },
    methods: {
        onFileSelected(event){
            this.selectedFile = event.target.files[0]
        },
        addProduct() {
            if(this.selectedFile == undefined) return;
            const fd = new FormData();
            fd.append('productImage',this.selectedFile,this.selectedFile.name);
            fd.append('name', this.name);
            fd.append('price', this.price);
            fd.append('quantity_stock', this.quantity);

            axios.post(API_URL + '/products', fd).then((response) => {
                if(response.status == 201){
                    this.cadastradao = true
                    this.error = false
                }else{
                    this.cadastradao = false
                    this.error = true
                }
            }).catch(() => {
                this.cadastradao = false
                this.error = true
            });
        }
    }
}
</script>

<style>
/*CSS ADD PRODUCT*/

#newProdPage {
    background-color: #7bcfff;
    position: absolute;
    top:50px;
    left: 0px;
    right: 0px;
    min-width: var(--minwidth);
    min-height: calc(100% - 50px) ;
    text-align: center;

    
}

#newProdPage *{
    font-size: 20px;
}

#newProdPage h1{
    font-size: 50px;
}

#newProdPage p{
    font-size: 30px;
}

#newProdPage table{
    border-spacing: 0 15px; 
}
</style>