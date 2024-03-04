const express = require('express');
const router = express.Router();
const Usermodel = require('../models/Usermodel.js');
const db = require('../models/config.js');


router.get('/',(req,res)=>{
    res.json({"trial":"texting"});
    console.log("testing");
})

router.get('/getall', async (req,res)=>{
   await Usermodel.findAll()
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch(err=>console.log(err));
})


router.get('/getone', async (req,res)=>{
    const {username} = req.body;
    await Usermodel.findOne({where: {username: username}})
     .then((data)=>{
         res.status(200).send(data);
     })
     .catch(err=>console.log(err));
 })

router.post('/create', async (req,res)=>{
    const {username, firstname, lastname, email, password} = req.body;
    await Usermodel.create({ firstName: firstname, lastName: lastname, username: username, email:email, password:password})
    .then(res.status(200).json({'mssg':'The data successfully uploaded'}))
    .catch(err=>console.log(err))
})

// router.delete('/delete:id', async (req,res)=>{
//     const {id} = req.body.id;
//     await DashboardModel.delete({id})
//     .then(res.status(200).json({'mssg':'The data sucessfully deleted'}))
//     .catch(err=>console.log(err))
// })

// router.update('/update:id'), async(req,res)=>{
//     const{id}=req.body.id;
//     await solarModel.update({id})
//     .then(res.status(200).json({'mssg':'The data successfully updated'}))
// }

module.exports = router;