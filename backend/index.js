const express = require('express');
const bodyparser = require ('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
// const DashboardControl = require('./controllers/DashboardController.js');
const privateKey = require('./key/privateKey.json');
const clientID = require('./key/clientID.json')
const ee = require('@google/earthengine');
const disasterKey = require('./key/disasterKey.json');

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


app.post('/mapid', cors(), (request, response) => {
    const srtm = ee.Image('CGIAR/SRTM90_V4');
    const slope = ee.Terrain.slope(srtm);
    slope.getMap({min: 0, max: 60}, ({mapid}) => response.send(mapid));
  });

app.post('/GEE', cors(), (req, res)=>{
    const {polygon, rangeDate} = req.body;

    const AOI = ee.Geometry.Polygon(
        [
            [9.261474609375002, 48.824592829935014], 
            [9.261474609375002, 48.75217601689752],
            [9.151611328125002, 48.75217601689752], 
            [9.151611328125002, 48.824592829935014]
        ])

    const imageRaw = ee.ImageCollection('LANDSAT/LC8_L1T_TOA');
    const imageQuery = imageRaw.filterBounds(AOI).filterDate('2015-12-01', '2015-12-31')
    .sort('CLOUD_COVER').first();

    const visualParams = {
        'bands': ['B5', 'B4', 'B3'],
        'min': 0,
        'max': 0.5,
        'gamma': [0.95, 1.1, 1]
    }

    const eeImage = ee.Image(imageQuery);
    const mapInfo = eeImage.getMapId(visualParams);
    // const urldata = {
    //     'url': mapInfo.urlFormat
    // }

    // try{
    //     const eeImage = ee.Image(imageQuery);
    //     const mapInfo = eeImage.getMapId(visualParams);
    //     return{
    //         'url': ee.data.getTileUrl(mapInfo)
    //     }
    // }
    // catch (error) {
    //     console.log('Data acquisition failed');
    //     return {
    //         'errorMessage': "Data Acquisition from GEE Fails"
    //     }
    // }

    res.status(200).json(mapInfo.urlFormat);

})
