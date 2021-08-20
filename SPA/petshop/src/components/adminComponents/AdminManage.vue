<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <div id="ManServ">
            <div class="gridCenter newServicesContainer" >
                <h1>Register New Service</h1>
                <input class="elemStyle" type="text" placeholder="Service" v-model="nameNew">
                <input class="elemStyle" type="text" placeholder="Price" v-model="priceNew">
                <div>
                    Days of Week: 
                    <input type="checkbox" v-model="mondayNew"> Monday
                    <input type="checkbox" v-model="tuesdayNew"> Tuesday
                    <input type="checkbox" v-model="wednesdayNew"> Wednesday
                    <input type="checkbox" v-model="thursdayNew"> Thursday
                    <input type="checkbox" v-model="fridayNew"> Friday
                    <input type="checkbox" v-model="saturdayNew"> Saturday
                    <input type="checkbox" v-model="sundayNew"> Sunday
                </div>
                <div class="gridCenter timeContainer">
                    <p style="margin:0px">Add Time:</p>
                    <div>
                        <input class="elemStyle" type="time" v-model="timeNew">
                        <button class="elemStyle" v-on:click="addTime()">Add</button>
                    </div>
                    <ul style="list-style-type: none;padding: 0px;">
                        <li v-for="(time,index) in timeVectorNew" v-bind:key="time">{{time}}&nbsp;<button class="elemStyle" v-on:click="removeTime(index)">remove</button></li>
                    </ul>
                </div>
                <button class="elemStyle" v-on:click="registerService()">Register</button>
                <p class="errmsg" v-if="error">Erro ao cadastrar</p>
                <p class="errmsg" v-if="cadastradao">Cadastrado com sucesso!</p>
            </div>

            <div class="gridCenter editServicesContainer">
                <h1>Edit Services</h1>
                <select class="elemStyle" v-model="option" @change="displayAtual()">
                    <option value='empty'>-- --</option>
                    <option  v-for="(service,index) in services" v-bind:key="index" v-bind:value="index">{{service.name}}</option>
                </select>
                <br/>
                <input class="elemStyle" type="text" placeholder="Price" v-model="atual.price">
                <br/>
                <div>
                    Days of Week: 
                    <input type="checkbox" v-model="atual.monday"> Monday
                    <input type="checkbox" v-model="atual.tuesday"> Tuesday
                    <input type="checkbox" v-model="atual.wednesday"> Wednesday
                    <input type="checkbox" v-model="atual.thursday"> Thursday
                    <input type="checkbox" v-model="atual.friday"> Friday
                    <input type="checkbox" v-model="atual.saturday"> Saturday
                    <input type="checkbox" v-model="atual.sunday"> Sunday
                </div>
                <div class="gridCenter timeContainer">
                    <p style="margin:0px">Add Time:</p>
                    <div>
                        <input class="elemStyle" type="time" v-model="tempTime">
                        <button class="elemStyle" @click="addHourAtual()">Add</button>
                    </div>
                    <ul style="list-style-type: none;padding: 0px;">
                        <li v-for="(time,index) in atual.hours" v-bind:key="time">{{time}}&nbsp;<button class="elemStyle" @click="removeHourAtual(index)">remove</button> </li>
                    </ul>
                </div>
                <button class="elemStyle" @click="UpdateService(option,atual)">Edit</button>
                <button class="elemStyle" @click="deleteService(option)">Remove Service</button>
                <p class="errmsg" v-if="errorUpdate">Erro ao atualizar</p>
                <p class="errmsg" v-if="Updated">Atualizado com sucesso!</p>
                <p class="errmsg" v-if="errorRemove">Erro ao remover</p>
                <p class="errmsg" v-if="Removed">Removido com sucesso!</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'AdminServices',
    data() {
        return {
            //variaveis cadastro novo serviço
            nameNew: '',
            priceNew: '',
            mondayNew: false,
            tuesdayNew: false,
            wednesdayNew: false,
            thursdayNew: false,
            fridayNew: false,
            saturdayNew: false,
            sundayNew: false,
            timeNew: '',
            timeVectorNew: [],
            error: false,
            cadastradao: false,
            //variaveis editar serviço
            services: [],
            option: 'empty',
            atual: {},
            tempTime: '',
            errorUpdate: false,
            Updated: false,
            errorRemove: false,
            Removed: false


        }
    },
    methods: {
        addTime(){
            if(this.timeNew != '')
                this.timeVectorNew.push(this.timeNew)
        },
        removeTime(index){
            this.timeVectorNew.splice(index,1);
        },
        registerService(){
            var days = []
            if(this.mondayNew) days.push('Monday')
            if(this.tuesdayNew) days.push('Tuesday')
            if(this.wednesdayNew) days.push('Wednesday')
            if(this.thursdayNew) days.push('Thursday')
            if(this.fridayNew) days.push('Friday')
            if(this.saturdayNew) days.push('Saturday')
            if(this.sundayNew) days.push('Sunday')

            var body = {
                name: this.nameNew,
                price: this.priceNew,
                hours: this.timeVectorNew,
                days: days
            }
            axios.post(API_URL + '/services', body).then((response) => {
                if(response.status == 201){
                    this.services.push(response.data.data)
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
        },
        displayAtual() {
            if(this.option == 'empty'){
                this.atual = {
                    name: '',
                    price: '',
                    hours: [],
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false
                }
            }else{
                this.atual = {
                    name: this.services[this.option].name,
                    price: this.services[this.option].price,
                    hours: [...this.services[this.option].hours],//cria uma copia
                    monday: this.services[this.option].days.includes("Monday"),
                    tuesday: this.services[this.option].days.includes("Tuesday"),
                    wednesday: this.services[this.option].days.includes("Wednesday"),
                    thursday: this.services[this.option].days.includes("Thursday"),
                    friday: this.services[this.option].days.includes("Friday"),
                    saturday: this.services[this.option].days.includes("Saturday"),
                    sunday: this.services[this.option].days.includes("Sunday")
                }
            }
            this.errorUpdate = false;
            this.Updated = false;
            this.errorRemove = false;
            this.Removed = false;
        },
        removeHourAtual(index){
            this.atual.hours.splice(index,1);
        },
        addHourAtual(){
            if(this.tempTime != '' && this.option != 'empty')
                this.atual.hours.push(this.tempTime)
        },
        UpdateService(option,atual) {
            if(option != 'empty'){
                var days = []
                if(atual.monday) days.push('Monday')
                if(atual.tuesday) days.push('Tuesday')
                if(atual.wednesday) days.push('Wednesday')
                if(atual.thursday) days.push('Thursday')
                if(atual.friday) days.push('Friday')
                if(atual.saturday) days.push('Saturday')
                if(atual.sunday) days.push('Sunday')

                var body = {
                    price: atual.price,
                    hours: atual.hours,
                    days: days
                }
                axios.put(API_URL + '/services/update/' + this.services[option]._id, body).then((response) => {
                    if(response.status == 200){
                        this.services[option].days = days
                        this.services[option].hours = atual.hours
                        this.services[option].price = atual.price
                        this.errorUpdate = false;
                        this.Updated = true;
                    }else{
                        this.errorUpdate = true;
                        this.Updated = false;
                    }
                }).catch(() => {
                    this.errorUpdate = true;
                    this.Updated = false;
                });
                
            }
            
        },
        deleteService(optionAtual){
            if(optionAtual != 'empty'){
                axios.delete(API_URL + '/services', { data: {id: this.services[optionAtual]._id}}).then((response) =>{
                    if(response.status == 200){
                        this.services.splice(optionAtual,1)
                        this.option = 'empty';
                        
                        this.displayAtual()
                        this.errorRemove = false;
                        this.Removed = true;
                    }else{
                        this.errorRemove = true;
                        this.Removed = false;
                    }
                }).catch(()=>{
                    this.errorRemove = true;
                    this.Removed = false;   
                })
            }
            
        }
    },
    created(){
        axios.get(API_URL + '/services').then((response) => {
            if(response.status == 200){
                this.services = response.data
            }
        }).catch(() => {

        });
    }
}
</script>

<style>

/*CSS REGISTER NEW USER*/

#ManServ {
    background-color: #7bcfff;
    position: absolute;
    top:50px;
    left: 0px;
    right: 0px;
    min-width: var(--minwidth);
    min-height: calc(100% - 50px) ;
    text-align: center;
}

#ManServ *{
    font-size: 20px;
}

#ManServ h1{
    font-size: 40px;
}

.timeContainer *{
    margin: 0px;
    margin-top: 3px;
}

.newServicesContainer > *{
    margin-top: 8px;
}

.editServicesContainer {
    margin-top: 100px;
}

.editServicesContainer > *{
    margin-top: 8px;
}
</style>