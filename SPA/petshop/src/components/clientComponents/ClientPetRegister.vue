<!-- Felipe Guilermmo Santuche Moleiro - 10724010 -->
<template>
    <div>
        <div id="petRegister">
         
            <h1>Register new Pet:</h1>
            <div class="gridCenter">
                <div id="newPet">
                    <table>
                        <tr>
                            <td>Name: </td>
                            <td>
                                <input type="text" class="elemStyle" v-model="newName">
                            </td>
                        </tr>
                        <tr>
                            <td>Animal: </td>
                            <td>
                                <input type="text" class="elemStyle" v-model="newAnimal">
                            </td>
                        </tr>
                        <tr>
                            <td>Breed: </td>
                            <td>
                                <input type="text" class="elemStyle" v-model="newBreed">
                            </td>
                        </tr>
                        <tr>
                            <td>Age: </td>
                            <td>
                                <input type="text" class="elemStyle" v-model="newAge">
                            </td>
                        </tr>
                    </table>
                    <div class="gridCenter" style="margin-top: 10px;">
                        <button class="elemStyle" id="regNewPet" @click="registerNew()">Register New Pet</button>
                         
                    </div>
                    <p v-if="registrado">Registrado</p>
                    <p v-if="erro">Erro ao Registrar</p>
                
                </div>
            </div>
            
            
            <h1>Edit Existing Pet:</h1>
            <div class="gridCenter">
                <select id="petList" class="elemStyle" v-model="petSelected" @change="displayAtual()">
                    <option value="-- --">-- --</option>
                    <option :value="index" v-for="(pet,index) in pets" :key="pet._id">{{pet.name}}</option>
                </select>
            </div>

            <div v-if="petSelected != '-- --'">
                <h1>Pet Profile</h1>
                <div class="gridCenter imgContainer">
                    <img :src="imgSrc(pets[petSelected].imgPath)"/>
                </div>
                
                <div class="gridCenter">
                    <input class="elemStyle" id="fileInput" type="file" accept="image/*" @change="onFileSelected">
                </div>
                <br>
                <div class="gridCenter">
                    <button class="elemStyle" id="changeImgPet" @click="enviarImg(petSelected)">Upload Image</button>
                </div>
                    
                
                <div id="petProf">
                    <div class="gridCenter">
                        <h1>Name:</h1>
                        <input type="text" class="elemStyle" v-model="atual.name">
                    </div>
                    <div class="gridCenter">
                        <h1>Animal:</h1>
                        <input type="text" class="elemStyle" v-model="atual.animal">
                    </div>
                    <div class="gridCenter">
                        <h1>Breed:</h1>
                        <input type="text" class="elemStyle" v-model="atual.breed">
                    </div>
                    <div class="gridCenter">
                        <h1>Age:</h1>
                        <input type="text" class="elemStyle" v-model="atual.age">
                    </div>
                    <div class="gridCenter">
                        <br><br>
                        <button class="elemStyle" @click="editPet(petSelected)">Edit</button>
                        <br>
                        <button class="elemStyle" @click="deletePet(petSelected)">Delete</button>
                    </div>
                    <div class="gridCenter">
                        <p v-if="editado">Editado</p>
                        <p v-if="erroEditar">Erro ao Editar</p>
                    </div>
                    
                </div>

                <div id="scheduleList">
                    <h1>List Of Scheduled Services</h1>

                    <div class="schedItem" v-for="(sched,index) in listScheduled(petSelected)" :key="index">
                        <h1>{{sched.petName}} - {{sched.name}}</h1>
                        <p>Date:<br/>{{sched.day}}</p>
                        <p>Time:<br/>{{sched.time}}</p>
                        <p>Price:<br/>R${{sched.price}}</p>
                    </div>
                    
                </div>
            </div>
            
            
        </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = require('../../config').API_URL

export default {
    name: 'ClientPetRegister',
    props: {
        user: String,
        password: String
    },
    data(){
        return {
            newName: '',
            newAnimal: '',
            newBreed: '',
            newAge: '',
            pets: [],
            petSelected: '-- --',
            atual: {},
            scheduled: [],
            registrado: false,
            erro: false,
            editado: false,
            erroEditar: false
        }
    },
    methods: {
        registerNew(){
            var body = {
                user: this.user,
                password: this.password,
                name: this.newName,
                animal: this.newAnimal,
                breed: this.newBreed,
                age: this.newAge
            }
            axios.post(API_URL + '/users/addPet', body).then((response) => {
                if(response.status == 200){
                    //console.log(response)
                    this.pets = response.data.data.pets
                    this.registrado = true;
                    this.erro = false;
                }else{
                    this.registrado = false;
                    this.erro = true;
                }
            }).catch(() =>{
                this.registrado = false;
                this.erro = true;
            })
        },
        displayAtual() {
            if(this.petSelected == '-- --'){
                this.atual = {
                    name: '',
                    breed: '',
                    age: '',
                    animal: ''
                }
            }else{
                this.atual = {
                    name: this.pets[this.petSelected].name,
                    breed: this.pets[this.petSelected].breed,
                    age: this.pets[this.petSelected].age,
                    animal: this.pets[this.petSelected].animal
                }
            }
            this.editado = false
            this.erroEditar = false
        },
        editPet(index){
            var body = {
                user: this.user,
                password: this.password,
                petId: this.pets[index]._id,
                ...this.atual
            }
            axios.put(API_URL + '/users/editPet', body).then((response) => {
                //console.log(response)
                if(response.status == 200){
                    this.pets[index].name = body.name
                    this.pets[index].breed = body.breed
                    this.pets[index].age = body.age
                    this.pets[index].animal = body.animal

                    this.editado = true
                    this.erroEditar = false
                }else{
                    this.editado = false
                    this.erroEditar = true
                }
            }).catch(() =>{
                this.editado = false
                this.erroEditar = true
            })
        },
        deletePet(index){
            var body = {
                user: this.user,
                password: this.password,
                id: this.pets[index]._id
            }
            axios.delete(API_URL + '/users/deletePet', {data: body}).then((response) => {
                //console.log(response)
                if(response.status == 200){
                    this.pets.splice(index,1);
                    this.petSelected = '-- --';
                    this.displayAtual()
                }else{
                    this.editado = false
                    this.erroEditar = true
                }
            }).catch(() =>{
                this.editado = false
                this.erroEditar = true
            })
        },
        listScheduled(petSel) {
            var res = [];
            if(petSel != '-- --'){
                var pet = this.pets[petSel]
                
                for(var i=0;i<this.scheduled.length;i++){

                    if(this.scheduled[i].petId == pet._id){
                        var temp = {};
                        temp.name = this.scheduled[i].name;
                        temp.petName = pet.name;
                        var day = new Date(this.scheduled[i].day)
                        temp.day = day.getDate() + '/' + (day.getMonth()+1) + '/' + day.getFullYear()
                        temp.price = this.scheduled[i].price
                        temp.time = this.scheduled[i].time

                        //mostrar apenas serviços que ainda nao aconteceram
                        //console.log(new Date())
                        if(day >= new Date()){
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
                    return dayA > dayB? 1: -1
                })
                
            }
            return res
            
        },
        imgSrc(relativePath){
            return API_URL + '/' + relativePath;
        },
        onFileSelected(event){
            this.selectedFile = event.target.files[0]
        },
        enviarImg(index){
            if(this.selectedFile == undefined) return;
            const fd = new FormData();
            fd.append('petImage',this.selectedFile,this.selectedFile.name);
            fd.append('user', this.user);
            fd.append('password', this.password);
            fd.append('petId', this.pets[index]._id);
            axios.put(API_URL + '/users/editImgPet', fd).then((response) => {
                if(response.status == 200){
                    this.pets[index].imgPath = response.data.imgPath
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
        axios.post(API_URL + '/users/getPets', body).then((response) => {
            if(response.status == 200){
                //console.log(response)
                this.pets = response.data.pets
            }
        }).catch(() =>{

        })

        axios.post(API_URL + '/services/getSchedule', body).then((response) => {
            if(response.status == 200){
                for(var i=0;i<response.data.length;i++){
                    for(var j=0;j<response.data[i].scheduled.length;j++){
                        this.scheduled.push({
                            petId: response.data[i].scheduled[j].animalId,
                            name: response.data[i].name,
                            price: response.data[i].price,
                            day: response.data[i].scheduled[j].date,
                            time: response.data[i].scheduled[j].time
                        })
                    }
                }
            }
        }).catch((e) =>{
            console.log(e)
        })
    }
}
</script>

<style scoped>


/*CSS DA PAGINA PETREGISTER*/

#newPet p {
    text-align: center;
}

#petRegister {
    position: absolute;
    min-width: var(--minwidth);
    top:50px;
    left: 0px;
    right: 0px;
    min-height: calc(100% - 50px) ;
    justify-content: center;

}

#petRegister h1{
    padding: 0px;
    text-align: center;
}

#regNewPet {
    width: 200px;
    height: 50px;

    
}

#petRegister img {
    height: 150px;
    width: 150px;
}

.imgContainer{
    height: 150px;
    margin: 30px;
}

#petProf h1{
    margin-bottom: 0px;
}

#changeImgPet{
    margin: 0px;
    width: 200px;
}

#petProf div{
    height: 100px;
}

#newPet *{
    font-size: 20px;
}

#petProf input {
    margin: 10px 0px 0px;
    height: 30px;
    width: 300px;
    font-size: 25px;
    text-align: center;
}

#petProf button {
    height: 40px;
    width: 200px;
    font-size: 25px;
}

</style>