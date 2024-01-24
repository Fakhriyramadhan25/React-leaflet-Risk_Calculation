const express = require('express');
const bodyparser = require ('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const privateKey = require('./key/privateKey.json');
const ee = require('@google/earthengine');
const db = require('./models/config.js');
const geeController = require('./controllers/geeController.js');
const PointController = require('./controllers/PointController.js');

dotenv.config();

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(cors());

db.authenticate()
    .then(()=> console.log('Database Connected...'))
    .catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.json({'mssg':'Hi there'})
})

app.listen(process.env.PORT,()=>{
    console.log("Working right at port "+process.env.PORT);
})

ee.data.authenticateViaPrivateKey(privateKey, ()=>{
    ee.initialize( null, null,
        () => {
          console.log('GEE is successfully initialized');
        },
        (err) => {
          console.log(err);
          console.log(
              `There is a problem with Oauth 2, kindly check the guidance again.`);
        });
})


app.use('/GEE', cors(), geeController);
// app.use('/Point',cors(), PointController);
