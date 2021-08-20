<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <h1 id="titulo">Pet Shack</h1>

        <div id="separa"></div>

        <div id="corpo">

            <div class="blueBox">
                <div class="alignText">
                    <h1 id="bemvindo">Welcome!</h1>
                </div>
                <div class="alignText">
                    <p class="textolog">Log In:</p>
                    <div id="logInput">
                        
                        <input class="campoDigitar elemStyle" type="text" placeholder="user" v-model="user" >
                        <input class="campoDigitar elemStyle" type="password" placeholder="password" v-model="password">
                        
                        <button class="elemStyle" id="LogIn" v-on:click="LogIn()">Log In</button>
                        <p v-if="error" style="font-size: 25px">Erro ao fazer login</p>
                        <p class="textolog">Or</p>
                        <button class="elemStyle" id="LogIn" v-on:click="changePage('Register')">Register Now</button>
                    </div>
                </div>
            </div>
            <div class="blueBox">
                <div id="texto">
                    <p id="parag">About Us: In this site we provide you services such as Pet Cleaning and sell products for your Pet such as Food, Clothes, etc in the easiest way possible! Register Now to enjoy everything we have to offer!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../config').API_URL

export default {
    name: 'Home',
    data() {
        return {
            user: '',
            password: '',
            error: false
        }
    },
    methods: {
        changeUser(){
            this.$emit('userChanged',this.user)
        },
        changePassword(){
            this.$emit('passwordChanged',this.password)
        },
        changePage(Page){
            this.$emit('changePage',Page)
        },
        LogIn(){
            axios.post(API_URL + '/users/login',{user: this.user,password: this.password}).then(response => {
                //console.log(response)
                if(response.status == 200){
                    this.$emit('LogInEvent',{user: this.user,password: this.password,admin: response.data.admin})
                    this.error = false
                }else{
                    this.error = true
                }
            }).catch(() =>{
                this.error = true
            })
            
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

button.elemStyle {
    font-size: 20px;
}

button.elemStyle:hover {
    background-color: #0081ac;
}

button.elemStyle:active {
    background-color: #c3ebf8;
}

input[type="text"].elemStyle::placeholder{
    color: hsla(224, 41%, 38%, 0.705);
}

input[type="password"].elemStyle::placeholder{
    color: hsla(224, 41%, 38%, 0.705);
}

input[type="text"].elemStyle{
    padding: 2px 10px;
    font-size: 20px;
}

input[type="password"].elemStyle{
    padding: 2px 10px;
    font-size: 20px;
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

#titulo h1{
    margin: 0px;
}

.alignText{
    text-align: center;
}

#texto{
    text-align: justify;
    font-size: 40px;
}
#parag {
    min-width: 200px;
    max-width: 1200px;
    margin: 0px;
}

#bemvindo {
    font-size: 60px;
}

#corpo {
    background-color: #7bcfff;
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

.textolog {
    text-align: center;
    font-size: 50px;
    margin: 20px;
}

#separa {
    height: 10px;
    width: 100%;
    background-color: black;
}

.campoDigitar {
    width: 300px;
    height: 40px;
    display: block;
    margin: 20px;
}

#logInput{
    display: grid;
    align-content: center;
    justify-content: center;
}

#LogIn {
    width: 320px;
    height: 50px;
    display: block;
    margin: 20px;
}
</style>