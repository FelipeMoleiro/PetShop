<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
  <div>
      <div id="calendar">

        <div id="newSchedule">
            <h1>Schedule New Service</h1>
            <p>Choose The Pet:</p>
            <div>
                <select id="schedulePets" class="elemStyle scheduleProp" v-model="petSelected">
                    <option value="-- --">-- --</option>
                    <option :value="index" v-for="(pet,index) in pets" :key="pet._id">{{pet.name}}</option>
                </select>
            </div>
            
            <p>Choose The service:</p>
            <div>
                <select id="services" class="elemStyle scheduleProp" v-model="serviceSelected" @change="getHours()">
                    <option value="-- --">-- --</option>
                    <option :value="index" v-for="(service,index) in services" :key="service._id">{{service.name}} - R${{service.price}}</option>
                </select>
            </div>
            
            <p>Service Avaliable these days:<br>{{listDays}}</p>
            <p>Choose The Date:</p>
            <div>
                <input type="date" class="elemStyle scheduleProp" v-model="selectedDate" @change="getHours()">
            </div>
            
            <p>Choose One of the avaliabe times:</p>
            <div>
                <select id="timesAvaliable" class="elemStyle scheduleProp" v-model="selectedTime" >
                    <option v-if="horarios.length == 0" value="-- --">Sem horarios disponiveis</option>
                    <option :value="index" v-for="(horario,index) in horarios" :key="index">{{horario}}</option>
                </select>
            </div>

            <br/>
            <p>Cartão:(nao é necessario inserir)</p>
            <div class="gridCenter" style="margin-bottom: 30px">
                <input type="text" placeholder="numero cartao(nao é necessario)" class="elemStyle numCartao">
                <input type="text" placeholder="npme cartao(nao é necessario)" class="elemStyle nomeCartao">
                <div>
                    <input type="text" placeholder="validade cartao(nao é necessario)" class="elemStyle validadeCartao">
                    <input type="text" placeholder="codigo segurança(nao é necessario)" class="elemStyle codigoCartao">
                </div>
            </div>
            <div>
                <button type="submit" class="elemStyle scheduleProp" @click="schedule()">Schedule</button>
            </div>
            <p v-if="adicionado">Adicionado com sucesso</p>
            <p v-if="erro">Erro ao adicionar</p>
        </div>

        <div id="scheduleList">
            <h1>List Of Scheduled Services</h1>

            <div class="schedItem" v-for="(sched,index) in listScheduled" :key="index">
                <h1>{{sched.petName}} - {{sched.name}}</h1>
                <p>Date:<br/>{{sched.day}}</p>
                <p>Time:<br/>{{sched.time}}</p>
                <p>Price:<br/>R${{sched.price}}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'ClientSchedule',
    props: {
        user: String,
        password: String
    },
    data() {
        return{
            name: 'clint',
            pets: [],
            petSelected: '-- --',
            services: [],
            serviceSelected: '-- --',
            selectedDate: '',
            horarios: [],
            selectedTime: '-- --',
            scheduled: [],
            adicionado: false,
            erro: false
        }
    },
    methods: {
        getHours() {
            if(this.serviceSelected != '-- --' && this.selectedDate != ''){
                var body = {
                    id: this.services[this.serviceSelected]._id,
                    day: this.selectedDate
                }
                axios.get(API_URL + '/services/getHours',{params: body}).then((response) => {
                    if(response.status == 200){
                        this.horarios = response.data.hours
                        if(response.data.hours.length != 0) this.selectedTime = 0
                        else this.selectedTime = '-- --';
                        
                    }
                }).catch(() =>{
                    this.horarios = []
                    this.selectedTime = '-- --'
                })
            }else{
                this.horarios = []
                this.selectedTime = '-- --'
            }
            this.adicionado = false
            this.erro = false
        },
        schedule(){
           
            if(this.petSelected != '-- --' && this.serviceSelected != '-- --' && this.selectedDate != '' && this.selectedTime != '-- --'){
                var horarioIndex = this.selectedTime;
                var service = this.services[this.serviceSelected];
                var dia = new Date(this.selectedDate.split('-').join('/'))
                var body = {
                    id: this.services[this.serviceSelected]._id,
                    day: this.selectedDate,
                    time: this.horarios[this.selectedTime],
                    user: this.user,
                    password: this.password,
                    animalId: this.pets[this.petSelected]._id
                }
                axios.post(API_URL + '/services/schedule',body).then((response) => {
                    if(response.status == 200){
                        this.horarios.splice(horarioIndex,1)
                        if(this.horarios.length != 0) this.selectedTime = 0
                        else this.selectedTime = '-- --';
                        
                        this.scheduled.push({
                            petId: body.animalId,
                            name: service.name,
                            price: service.price,
                            day: dia,
                            time: body.time,
                        })
                        this.adicionado = true
                        this.erro = false
                    }else{
                        this.adicionado = false
                        this.erro = true
                    }
                }).catch(() =>{
                    this.adicionado = false
                    this.erro = true
                })
            }else{
                this.adicionado = false
                this.erro = true
            }
        }
    },
    computed: {
        listDays(){
            if(this.serviceSelected != '-- --'){
                var str = '';
                this.services[this.serviceSelected].days.forEach(element => {
                    if(str.length != 0) str += ', '
                    str += element
                });
                return str
            }else{
                return '...';
            }
        },
        listScheduled(){
            var res = [];
            for(var i=0;i<this.scheduled.length;i++){
                var temp = {};
                temp.name = this.scheduled[i].name;
                var pet = this.pets.find(element => {return element._id == this.scheduled[i].petId})
                if(pet != undefined){
                    temp.petName = pet.name;
                    var day = new Date(this.scheduled[i].day)
                    
                    temp.day = day.getDate() + '/' + (day.getMonth()+1) + '/' + day.getFullYear()
                    temp.price = this.scheduled[i].price
                    temp.time = this.scheduled[i].time

                    //console.log(new Date())
                    var timeTemp = temp.day.split('/');
                    var timeTemp2 = temp.time.split(':')
                    var dayA = new Date(timeTemp[2],timeTemp[1]-1,timeTemp[0],timeTemp2[0],timeTemp2[1]);
                    console.log(dayA)
                    if(dayA >= new Date()){
                        res.push(temp)
                    }
                }
              
            }
            res.sort((a,b)=>{
                var temp = a.day.split('/');
                var temp2 = a.time.split(':')
                var dayA = new Date(temp[2],temp[1]-1,temp[0],temp2[0],temp2[1]);
                temp = b.day.split('/');
                temp2 = b.time.split(':')
                var dayB = new Date(temp[2],temp[1]-1,temp[0],temp2[0],temp2[1]);
                //console.log(dayA < dayB)
                return dayA > dayB? 1: -1
            })
            return res
        }
    },
    created(){
        var body = {
            user: this.user,
            password: this.password
        }
        axios.post(API_URL + '/users/getPets', body).then((response) => {
            if(response.status == 200){
                //console.log(response)
                this.pets = response.data.pets
            }
        }).catch(() =>{
        })

        axios.get(API_URL + '/services').then((response) => {
            if(response.status == 200){
                //console.log(response)
                this.services = response.data
            }
        }).catch(() =>{
        })

        axios.post(API_URL + '/services/getSchedule', body).then((response) => {
            if(response.status == 200){
                for(var i=0;i<response.data.length;i++){
                    //console.log()
                    for(var j=0;j<response.data[i].scheduled.length;j++){
                        //console.log('puus')
                        this.scheduled.push({
                            petId: response.data[i].scheduled[j].animalId,
                            name: response.data[i].name,
                            price: response.data[i].price,
                            day: response.data[i].scheduled[j].date,
                            time: response.data[i].scheduled[j].time
                        })
                    }
                }
                //console.log('1dsf')
            }
        }).catch((e) =>{
            console.log(e)
        })
    }
}
</script>

<style>

/*CSS DA PARTE DE SCHEDULE*/

.numCartao, .nomeCartao {
    width: 300px;
    margin: 5px;
}
.validadeCartao,.codigoCartao {
    width: 133.33px;
    margin: 5px;
}


#calendar {
    position: absolute;
    min-width: var(--minwidth);
    top:50px;
    left: 0px;
    width: 100%;
    text-align: center;
}

#newSchedule {
    min-width: 700px;
    min-height: 400px;
    width:100%;
    display: grid;
    align-content: center;
    justify-content: center;
}

.scheduleProp {
    width:300px;
}

#newSchedule P{
    font-size: 20px;
    text-align: center;
}

#scheduleList {
    min-width: 700px;
    min-height: 400px;
    width:100%;
    display: grid;
    align-content: center;
    justify-content: center;
}

#scheduleList h1{
    text-align: center;
}

.schedItem {
    min-width: 700px;
    height: 150px;
    margin: 20px;
    background-color: #3ecdf1;
    border-radius: 20px;
    border-style: inset;
    border-width: 4px;
    border-color: teal;
    text-align: center; 
}

.schedItem p{
    margin: 0px;
    text-align: center;
    font-size: 30px;
    display: inline-block;
    width: 30%;
    padding: 0px;
}

.schedItem h1{
    margin: 15px;
    text-align: center;
    font-size: 30px;
}

#calendario{
    font-size: 40px;
    text-align: center;
    border-radius: 10px;
}

#calendario > div{
    margin-top: 5px;
}

#setaEsqd {
    width: 40px;
    float: left;
}


#setaEsqd:hover,#setaDir:hover {
    background-color: #4d7788;
    cursor: pointer;
    
}

#setaDir {
    width: 40px;
    float: left;
}

#nameMonth {
    float: left;
    width: 300px;
}

#calendario > table{
    font-size: 20px;
}

#calendario table, #calendario tbody{
    width: 380px;
}


#calendario td{
    width: calc(100%/7);
}

.clickable td:hover,.selectedCalendar{
    background-color: #0279a8;
    cursor: pointer;
}

</style>