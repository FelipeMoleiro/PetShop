<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <nav id="navega">
        <div class="navButton" v-on:click="page='register'" >Register New User</div>
        <div class="navButton" v-on:click="page='manage'">Manage Services</div>
        <div class="navButton" v-on:click="page='newProduct'">Add Product</div>
        <div class="navButton" v-on:click="page='invMan'">Inventory Management</div>
        <div class="navButton" v-on:click="page='earn'">Earnings</div>
        <div class="navButton fright" v-on:click="logOff()">Log Out</div>
    </nav>

    <div id="empty" v-if="page=='empty'">
        <p>Selecione Alguma das Opções</p>
    </div>
    
    <AdminRegister v-if="page=='register'"/>
    <AdminManage v-if="page=='manage'"/>
    <AdminAddProduct v-if="page=='newProduct'"/>
    <AdminInvManage v-if="page=='invMan'"/>
    <AdminEarn v-if="page=='earn'"/>


    </div>
</template>

<script>
import AdminRegister from "./adminComponents/AdminRegister"
import AdminManage from "./adminComponents/AdminManage"
import AdminAddProduct from "./adminComponents/AdminAddProduct"
import AdminInvManage from "./adminComponents/AdminInvManage"
import AdminEarn from "./adminComponents/AdminEarn"

export default {
    name: 'Admin',
    data() {
        return {
            page: 'empty'
        }
    },
    components: {
        AdminRegister,
        AdminManage,
        AdminAddProduct,
        AdminInvManage,
        AdminEarn
    },
    methods: {
        logOff(){
            this.$emit('logOff')
        }
    }

}
</script>

<style scoped>

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

</style>