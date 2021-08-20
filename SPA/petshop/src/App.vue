<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
  <div id="app">
    <Home v-if="page == 'Home'" @changePage="page = $event" @LogInEvent="logInn($event)"/>
    <Register v-if="page == 'Register'" @changePage="page = $event"/>
    <client v-if="page == 'Client'" @logOff="logOff()" v-bind:user="user" v-bind:password="password" @editUser="updateUser($event)"> </client>
    <Admin v-if="page == 'Admin'" @logOff="logOff()"> </Admin>
  </div>
  
</template>

<script>
import Home from './components/Home.vue'
import Register from './components/Register.vue'
import Client from './components/Client.vue'
import Admin from './components/Admin.vue'

export default {
  name: 'App',
  components: {
    Home,
    Register,
    Client,
    Admin
  },
  data() {
    return {
      user: '',
      password: '',
      logged: false,
      admin: false,
      page: 'Home'
    }
  },
  methods: {
    logInn($event) {
      //console.log('oi')
      this.user = $event.user
      this.password = $event.password
      this.admin = $event.admin
      this.logged = true
      if(this.admin == true){
        this.page = 'Admin'
      }else{
        this.page = 'Client'
      }
    },
    logOff() {
      this.user = ''
      this.password = ''
      this.logged = false
      this.admin = false
      this.page = 'Home'
    },
    updateUser(event){
      this.user = event.user
      this.password = event.password
    }
  }
}
</script>

<style>


.gridCenter{
    display: grid;
    align-content: center;
    justify-content: center;
}

.elemStyle {
    border-radius: 10px;
    background-color: deepskyblue;
    border-color: black;
    border-style: solid;
}

.elemStyle2 {
    background-color: #3ecdf1;
    border-style: solid;
    border-width: 3px;
    border-radius: 30px;
    border-color: teal;
}

button.elemStyle:hover {
    background-color: #0081ac;
}

button.elemStyle:active {
    background-color: #c3ebf8;
}

input[type="text"].elemStyle{
    padding: 2px 10px;
}

input[type="password"].elemStyle{
    padding: 2px 10px;
}

input[type="file"].elemStyle{
    border-radius: inherit;
    background-color: inherit;
    border-color: inherit;
    border-style: inherit;
}

input[type="text"].elemStyle::placeholder{
    color: hsla(224, 41%, 38%, 0.705);
}

input[type="text"].elemStyle{
    padding: 2px 10px;
}

input[type="file"].elemStyle::-webkit-file-upload-button{
    border-radius: 10px;
    background-color: deepskyblue;
    border-color: black;
    border-style: solid;
}

input[type="file"].elemStyle::-webkit-file-upload-button:hover{
    background-color: #0081ac;
}
input[type="file"].elemStyle::-webkit-file-upload-button:active {
    background-color: #c3ebf8;
}
</style>
