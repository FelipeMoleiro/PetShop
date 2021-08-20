<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <h1 id="titulo">Pet Shack</h1>

        <div id="separa"></div>


        <div id="corpo">
            <div class="blueBox">
                <h1>Register</h1>
                <div>
                    <table>
                        <tr>
                            <td>User: </td>
                            <td>
                                <input type="text" class="elemStyle" v-model="user">
                            </td>
                        </tr>
                        <tr>
                            <td>Password: </td>
                            <td>
                                <input type="password" class="elemStyle" v-model="password">
                            </td>
                        </tr>
                        <tr>
                            <td>Address: </td>
                            <td>
                                <input type="text" class="elemStyle" v-model="address">
                            </td>
                        </tr>
                        <tr>
                            <td>Phone: </td>
                            <td>
                                <input type="text" class="elemStyle" v-model="phone">
                            </td>
                        </tr>
                        <tr>
                            <td>Email: </td>
                            <td>
                                <input type="text" class="elemStyle" v-model="email">
                            </td>
                        </tr>
                    </table>
                </div>
                <button class="elemStyle" v-on:click="backHome()">Home</button>
                &nbsp;
                <button class="elemStyle" v-on:click="register()">Register</button>
                <p v-if="error">Erro ao cadastrar</p>
                <p v-if="cadastradao">Cadastrado com sucesso!</p>
            </div>
            
        </div>

    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../config').API_URL

export default {
    name: 'register',
    data() {
        return {
            user: '',
            password: '',
            address: '',
            phone: '',
            email: '',
            error: false,
            cadastradao: false
        }
    },
    methods: {
        backHome(){
            this.$emit('changePage',"Home")
        },
        register(){
            var body = {
                user: this.user,
                address: this.address,
                password: this.password,
                phone: this.phone,
                email: this.email
            }

            axios.post(API_URL + '/users/create', body).then(response => {
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

<style scoped>
/*Felipe Guilermmo Santuche Moleiro - 10724010*/

.elemStyle {
    border-radius: 10px;
    background-color: deepskyblue;
    border-color: black;
    border-style: solid;
}

button.elemStyle:hover {
    background-color: #0081ac;
}

button.elemStyle:active {
    background-color: #c3ebf8;
}

#titulo {
    text-align: center;
    font-size: 100px;
    background-image: url(../assets/pets.jpg);
    background-attachment: fixed;
    background-position: center;
    image-rendering: auto;
    margin: 0px;
    height: 200px;
    background-position-y: inherit;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: yellow;
    color: black;
}

#separa {
    height: 10px;
    width: 100%;
    background-color: black;
}

#corpo {
    background-color: #7bcfff;
    min-height: calc(100% - 210px);
    display: grid;
    align-content: center;
    justify-content: center;
}

.blueBox{
    background-color: #29a7f0;
    border-width: 10px;
    border-style: double;
    border-color: skyblue;
    min-width: 300px;
    max-width: 500px;
    padding: 50px;
    border-width: 10px;
    margin: 50px 0px;
}

#corpo h1{
    font-size: 40px;
    text-align: center;
}

#corpo *{
    font-size: 25px;
    text-align: center;
}


#corpo table *{
    margin: 10px 0px;
}
</style>