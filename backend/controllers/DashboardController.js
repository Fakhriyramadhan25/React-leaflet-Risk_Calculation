const express = require('express');
const router = express.Router();
const DashboardModel = require('../models/Dashboard.js');
const db = require('../models/config.js');


router.get('/',(req,res)=>{
    res.json({"trial":"texting"});
    console.log("testing");
})

router.get('/getall', async (req,res)=>{
   await DashboardModel.findAll()
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch(err=>console.log(err));
})

router.post('/create', async (req,res)=>{
    const {id, title, publisher} = req.body;
    await db.query('SELECT * FROM booksdata',{
        type: db.QueryTypes.SELECT
      })
    .then(res.status(200).json({'mssg':'The data successfully uploaded'}))
    .catch(err=>console.log(err))
})

router.delete('/delete:id', async (req,res)=>{
    const {id} = req.body.id;
    await DashboardModel.delete({id})
    .then(res.status(200).json({'mssg':'The data sucessfully deleted'}))
    .catch(err=>console.log(err))
})

router.update('/update:id'), async(req,res)=>{
    const{id}=req.body.id;
    await solarModel.update({id})
    .then(res.status(200).json({'mssg':'The data successfully updated'}))
}

module.exports = router;