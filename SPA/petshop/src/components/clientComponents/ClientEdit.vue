<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <div id="profile">   
            <h1>Profile</h1>
            <div class="gridCenter imgContainer">
                    <img :src="imgSrc(imgPath)"/>
                </div>
                <br>
                <div class="gridCenter">
                    <input class="elemStyle" id="fileInput" type="file" accept="image/*" @change="onFileSelected">
                </div>
                <br>
                <div class="gridCenter">
                    <button class="elemStyle" id="changeImgPet" @click="enviarImg()">Upload Image</button>
                </div>
                <br><br>
            <table>
                <tr>
                    <td>User: </td>
                    <td>
                        <input type="text" class="elemStyle" v-model="editUser">
                    </td>
                </tr>
                <tr>
                    <td>Password: </td>
                    <td>
                        <input v-bind:type="passwordType" class="elemStyle" v-model="editPassword">
                        
                    </td>
                    <td>
                        <button class="elemStyle" @click="showHidePasswod()">Show/Hide</button>
                    </td>
                </tr>
                <tr>
                    <td>Email: </td>
                    <td>
                        <input type="text" class="elemStyle" v-model="editEmail">
                    </td>
                </tr>
                <tr>
                    <td>Address: </td>
                    <td>
                        <input type="text" class="elemStyle" v-model="editAddress">
                    </td>
                </tr>
                <tr>
                    <td>Phone: </td>
                    <td>
                        <input type="text" class="elemStyle" v-model="editPhone">
                    </td>
                </tr>
                
            </table>
            <div class="btnDiv">
                <button class="elemStyle editBtn" @click="edit()">Edit</button>

            </div>
            <p v-if="erro">Erro ao editar usuario!</p>
            <p v-if="atualizado">Usuario Atualizado!</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'ClientEdit',
    props: {
        user: String,
        password: String
    },
    data(){
        return {
            editUser: '',
            editPassword: '',
            editAddress: '',
            editPhone: '',
            editEmail: '',
            imgPath: '',
            erro: false,
            atualizado: false,
            passwordType: 'password',
            selectedFile: undefined
        }
    },
    methods: {
        edit(){
            var body = {
                user: this.user,
                password: this.password,
                newUser: this.editUser,
                newPassword: this.editPassword,
                newAddress: this.editAddress,
                newPhone: this.editPhone,
                newEmail: this.editEmail
            }
            axios.put(API_URL + '/users/edit',body).then((response) => {
                //console.log(response.data)
                if(response.status == 200){

                    this.$emit('editUser',{
                        user: body.newUser,
                        password: body.newPassword
                    })
                    this.atualizado = true;
                    this.erro = false;
                }else{
                    this.atualizado = false;
                    this.erro = true;
                }
            }).catch(() => {
                this.atualizado = false;
                this.erro = true;
            })
        },
        showHidePasswod(){
            if(this.passwordType == 'password'){
                this.passwordType = 'text';
            }else{
                this.passwordType = 'password'
            }
        },
        imgSrc(relativePath){
            return API_URL + '/' + relativePath;
        },
        onFileSelected(event){
            this.selectedFile = event.target.files[0]
        },
        enviarImg(){
            if(this.selectedFile == undefined) return;
            const fd = new FormData();
            fd.append('profileImage',this.selectedFile,this.selectedFile.name);
            fd.append('user', this.user);
            fd.append('password', this.password);
            axios.put(API_URL + '/users/editImgProfile', fd).then((response) => {
                if(response.status == 200){
                    this.imgPath = response.data.imgPath
                }
            }).catch(()=>{

            })
        }
    },
    created(){
        var body = {
            user: this.user,
            password: this.password
        }
        axios.post(API_URL + '/users/getInfo',body).then((response) => {
            //console.log(response.data)
            if(response.status == 200){
                this.editUser = response.data.data.user
                this.editPassword = response.data.data.password
                this.editAddress = response.data.data.address
                this.editPhone = response.data.data.phone
                this.editEmail = response.data.data.email,
                this.imgPath = response.data.data.imgPath
            }
        })
    }
}
</script>

<style scoped>


/*CSS PROFILE PAGE*/


#profile {

    position: absolute;
    min-width: var(--minwidth);
    top:50px;
    left: 0px;
    right: 0px;
    justify-content: center;
    display: grid;
}

#profile img {
    height: 200px;
    width: 200px;
}

#profile h1,#profile button {
    text-align: center;
}

#profile P {
    text-align: center;
    font-size: 20px;
}

#profile div{
    display: flex;
}

#changeImg{
    margin: 0px;
    width: 200px;
}

.editBtn{
    margin-top: 25px;
    height: 30px;
    width: 200px
}

table {
    font-size: 30px;
}


table input{
    font-size: 20px;
    height: 25px;
    width: 200px;
    margin: 10px 0px;
}

table button{
    height: 25px;
    margin: 10px 0px;
}

.btnDiv{
    display: flex;
    align-items: center;
    justify-content: center;
}


</style>