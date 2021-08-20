<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <nav id="navega">
            <div class="navButton" v-on:click="page = 'buy'">Buy Items</div>
            <div class="navButton" v-on:click="page = 'schedule'">Schedule Time</div>
            <div class="navButton" v-on:click="page = 'edit'">Edit Profile</div>
            <div class="navButton" v-on:click="page = 'register'">Register/Edit Pets</div>
            <div class="navButton fright"  v-on:click="logOff()">Log Out</div>
            <div class="navButton fright"  v-on:click="page = 'cart'">Cart</div>
        </nav>

        <div v-if="page == 'empty' " id="empty">
            <p>Selecione Alguma das Opções</p>
        </div>

        <ClientBuy v-if="page == 'buy'" v-bind:user="user" v-bind:password="password"/>

        <ClientSchedule v-if="page == 'schedule'" v-bind:user="user" v-bind:password="password"/>

        <ClientEdit v-if="page == 'edit'" v-bind:user="user" v-bind:password="password" @editUser="updateUser($event)"/>

        <ClientPetRegister v-if="page == 'register'" v-bind:user="user" v-bind:password="password"/>

        <ClientCart v-if="page == 'cart'" v-bind:user="user" v-bind:password="password"/>


    </div>
</template>

<script>
import ClientBuy from "./clientComponents/ClientBuy"
import ClientSchedule from "./clientComponents/ClientSchedule"
import ClientEdit from "./clientComponents/ClientEdit"
import ClientPetRegister from "./clientComponents/ClientPetRegister"
import ClientCart from "./clientComponents/ClientCart"

export default {
    name: 'Client',
    props: {
        user: String,
        password: String
    },
    data() {
        return {
            page: 'empty'
        }
    },
    components: {
        ClientBuy,
        ClientSchedule,
        ClientEdit,
        ClientPetRegister,
        ClientCart
    },
    methods: {
        logOff(){
            this.$emit('logOff')
        },
        updateUser(event){
            this.$emit('editUser',event)
        }
    }

}
</script>

<style>

/*CSS BARRA DE NAVEGAÇÃO*/
#navega {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 1;
    background-color: #29a7f0;
    width: 100%;
    height: 50px;
    min-width: var(--minwidth);
}

.navButton {
    float: left;
    color: black;
    text-align: center;
    padding: 14px 30px;
    text-decoration: none;
    font-size: 20px;
}

.fright {
    float: right;
}

.navButton:hover {
    background-color: #4d7788;
    color: white;
    cursor: pointer;
}

/*CSS PARTE DE PAGINA VAZIA*/
#empty{
    position: absolute;
    top:50px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    min-width: var(--minwidth);

    display: grid;
    align-content: center;
    justify-content: center;
}

#empty p{
    text-align: center;
    font-size: 40px;
}
</style>