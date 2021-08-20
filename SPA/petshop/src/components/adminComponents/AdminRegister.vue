<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <div id="registerUser">
            <div class="gridCenter" >
                <h1>Register New User</h1>
                <div>
                    <table>
                        <tr>
                            <td>Name: </td>
                            <td>
                                <input type="text"  class="elemStyle" v-model="user">
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
                <div id="radioChoice" >
                    <input type="radio" name="typeUser" value="Client" v-model="type">
                    <p>Client</p>
                    <input type="radio" name="typeUser" value="Admin" v-model="type">
                    <p>Admin</p>
                </div>
                <p class="errmsg" v-if="error">Erro ao cadastrar</p>
                <p class="errmsg" v-if="cadastradao">Cadastrado com sucesso!</p>
                <button class="elemStyle" v-on:click="register()">Register</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'admRegister',
    data() {
        return {
            user: '',
            password: '',
            address: '',
            phone: '',
            email: '',
            type: 'Client',
            error: false,
            cadastradao: false
            
        }
    },
    methods: {
         register(){
             var admin = false;
             if(this.type == 'Admin') admin = true;

            var body = {
                user: this.user,
                address: this.address,
                password: this.password,
                phone: this.phone,
                email: this.email,
                admin: admin
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

/*CSS REGISTER NEW USER*/

#registerUser {
    background-color: #7bcfff;
    position: absolute;
    top:50px;
    left: 0px;
    right: 0px;
    min-width: var(--minwidth);
    min-height: calc(100% - 50px) ;
    justify-content: center;
}

.errmsg{
    justify-self: center;
}

#registerUser *{
    margin: 10px;
    font-size: 25px;
    
}

#registerUser h1{
    font-size: 40px;
    justify-self: center;
}



#registerUser .gridCenter{
    margin-top: 50px;
}

#radioChoice input,#radioChoice p{
    width: 25%;
    margin: 0px;
    float: left;
}
</style>