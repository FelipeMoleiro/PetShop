//Felipe Guilermmo Santuche Moleiro - 10724010

const mongoose = require('mongoose');
const Service = mongoose.model('Service')
const User = mongoose.model('User')

exports.post = (req,res,next) =>{
    var service = new Service(req.body);
    service.save().then((data)=>{
        res.status(201).send({message: 'Serviço cadastrado com sucesso!', data: data});
    }).catch(e => {
        res.status(400).send({
            message: 'Falha ao cadastrar serviço',
            data: e}
        );
    });
    
}

exports.put = (req,res,next) =>{
    const id = req.params.id;
    Service.findByIdAndUpdate(id, {
        $set: {
            price: req.body.price,
            hours: req.body.hours,
            days: req.body.days
        }
    }).then(x=>{
        if(!x){
            res.status(404).send({message: "Serviço nao encontrado"});
        }else{
            res.status(200).send({
                message: 'Serviço atualizado com sucesso!',
                data: x
            });
        }
        
    }).catch(e => {
        res.status(400).send({
            message: 'Falha ao atualizar serviço',
            data: e
        });
    });
}

exports.delete = (req,res,next) =>{
    const id = req.body.id;
    Service.findByIdAndRemove(id).then(x=>{
        if(!x){
            res.status(404).send({message: "Serviço nao encontrado"});
        }else{
            res.status(200).send({message: 'Serviço removido com sucesso!'})
        }
    }).catch(e => {
        res.status(400).send({
            message: 'Falha ao remover serviço',
            data: e
        });
    });
}

exports.get = (req,res,next) =>{
    Service.find({}).then((data)=>{
        res.status(200).send(data);
    }).catch(e => {
        res.status(400).send(e);
    });
    
}


exports.getById = (req,res,next) =>{
    Service.findById(req.params.id).then((data)=>{
        if(!data){
            res.status(404).send({message: "Serviço nao encontrado"});
        }else{
            res.status(200).send(data);
        }
    }).catch(e => {
        res.status(400).send(e);
    });
}

function equalDates(date1,date2){
    return (date1.getFullYear() === date2.getFullYear()
    && date1.getDate() === date2.getDate()
    && date1.getMonth() === date2.getMonth());
}

function avaliableHours(day,data){
    var newDate = day.split('-').join('/')
    var dateSchedule = new Date(newDate)

    //se a data é do passado
    if(dateSchedule < new Date()){
        return [];
    }

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var dayWeek = weekday[dateSchedule.getDay()];

    

    if(data.days.includes(dayWeek)){
        
        var hours = data.hours;
        var scheduled = data.scheduled;
        
        //remove horarios ja marcados em certa data
        for(var i=0;i<scheduled.length;i++){
            //onsole.log(scheduled[i].date)
            if(equalDates(scheduled[i].date,dateSchedule)){
                scheduled[i].date
                //console.log('equal')
                hours = hours.filter(hoursItem => hoursItem !== scheduled[i].time );
                //console.log(hours)
            }
        }

        return hours;
    }else{
        return [];
    }
}

exports.getHours = (req,res,next) =>{
    //console.log(req.query.id)
    Service.findById(req.query.id).then((data)=>{
        if(!data){
            res.status(404).send({message: "Serviço nao encontrado"});
        }else{
            
            var hours = avaliableHours(req.query.day,data)
            res.status(200).send({hours: hours});
        }
        
    }).catch(e => {
        res.status(400).send(e);
    });
}

exports.schedule = (req,res,next) =>{
    User.findOne({
        user: req.body.user,
        password: req.body.password
    }).then(dataUser => {
        if(!dataUser){
            res.status(404).send({message: "Usuario nao encontrado"});
        }else{
            Service.findById(req.body.id).then((data)=>{
                if(!data){
                    res.status(404).send({message: "Serviço nao encontrado"});
                }else{
                    var hours = avaliableHours(req.body.day,data)
                    if(hours.includes(req.body.time)){
            
                        var newDate = req.body.day.split('-').join('/')
                        var dateSchedule = new Date(newDate)

                        var timeTemp = newDate.split('/');
                        var timeTemp2 = req.body.time.split(':')
                        var dayA = new Date(timeTemp[0],timeTemp[1]-1,timeTemp[2],timeTemp2[0],timeTemp2[1]);
                        //console.log(dayA)
                        //console.log(new Date())
                        if(dayA >= new Date()){
                            Service.findByIdAndUpdate(data._id,{
                                $push: {
                                    scheduled:{
                                        date: dateSchedule,
                                        time: req.body.time,
                                        userId: dataUser._id,
                                        animalId: req.body.animalId 
                                    }
                                },
                                $inc: {sold: 1}
                            }).then(data2 =>{
                                res.status(200).send({message: 'scheduled'});
                            }).catch(e =>{
                                res.status(400).send(e);
                            })
                        }else{
                            res.status(400).send({message: 'Agendando horario no passado'});
                        }
                        
                    }else{
                        res.status(400).send({message: 'horario indisponivel'});
                    }
                }
            }).catch(e => {
                res.status(400).send(e);
            });
        }
    }).catch(e =>{
        res.status(400).send(e);
    });
    
}


exports.getSchedule = (req,res,next) =>{
    User.findOne({
        user: req.body.user,
        password: req.body.password
    }).then(data => {
        if(!data){
            res.status(400).send({message: 'usuario nao encontrado'});
        }else{
            Service.find({
                "scheduled.userId": data._id
            },'name price scheduled').then((data2)=>{
                for(var i=0;i<data2.length;i++){
                    data2[i].scheduled = data2[i].scheduled.filter(schedule => {return schedule.userId.equals(data._id)});
                }
                res.status(200).send(data2);
            }).catch(e => {
                res.status(400).send(e);
            });
            
        }
    }).catch(e => {
        res.status(400).send(e);
    });
    
}