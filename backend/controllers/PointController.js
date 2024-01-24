const express = require('express');
const router = express.Router();
const Pointmodel = require('../models/Pointmodel.js');
const db = require('../models/config.js');


router.get('/getall', async(req,res)=>{
    await Pointmodel.findAll()
    .then((data)=>{
        res.status(200).send(data);
    }).
    catch(err=>console.log(err));
});

router.get('/getall:id', async(req,res)=>{
    const {name} = req.body;
    await Pointmodel.findOne({name})
    .then((data)=>{
        res.status(200).send(data);
    }).
    catch(err=>console.log(err));
});

router.post('/create', async(req,res)=>{
    const {type, tags, latitude,  longitude} = req.body;
    const PostQuery = `INSERT INTO "PointData" (type,tags,latitude, longitude, geom) VALUES (${type}, ${tags}, ${latitude}, ${longitude}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))`;
    await db.query(PostQuery, {
        type: db.QueryTypes.INSERT
        }).then(res.status(200).json({'message':'Data Successfully Uploaded'}))
        .catch(err=>res.status(404).json({'message':err}))
});

router.delete('/delete', async (req,res)=>{
    await Pointmodel.delete({id})
    .then(res.status(200).json({'mssg':'The data sucessfully deleted'}))
    .catch(err=>res.status(404).json({'message':err}))
})

router.delete('/delete:id', async (req,res)=>{
    const {id} = req.body.id;
    await Pointmodel.delete({id})
    .then(res.status(200).json({'mssg':'The data sucessfully deleted one data'}))
    .catch(err=>res.status(404).json({'message':err}))
})

router.put('/update:id'), async(req,res)=>{
    const{id}=req.body.id;
    await Pointmodel.update({id})
    .then(res.status(200).json({'mssg':'The data successfully updated'}))
    .catch(err=>res.status(404).json({'message':err}))
}

module.exports = router;