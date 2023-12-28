const express = require('express');
const bodyparser = require ('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
// const DashboardControl = require('./controllers/DashboardController.js');

const db = require('./models/config.js');

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

// app.use('/dashboard', DashboardControl)

app.listen(process.env.PORT,()=>{
    console.log("Working right at port "+process.env.PORT);
})

