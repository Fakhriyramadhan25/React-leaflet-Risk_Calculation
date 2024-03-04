const express = require('express');
const router = express.Router();

const ee = require('@google/earthengine');

router.post('/', async (req, res)=>{
    const {imageBounds, imageName, imageStart, imageEnd} = req.body;

  
        const fetchAOI = ee.Geometry.Polygon(
            [imageBounds]
        )
    
    
        const AOI = ee.Geometry.Polygon(
        [
            [9.261474609375002, 48.824592829935014], 
            [9.261474609375002, 48.75217601689752],
            [9.151611328125002, 48.75217601689752], 
            [9.151611328125002, 48.824592829935014]
        ])

    const fetchImage = ee.ImageCollection(imageName)

    const fetchQuery = fetchImage
    .filterBounds(fetchAOI).filterDate(imageStart, imageEnd)
    .sort('CLOUD_COVER').first();

    

    // const imageRaw = ee.ImageCollection('LANDSAT/LC8_L1T_TOA');
    // const imageQuery = imageRaw.filterBounds(AOI).filterDate('2013-12-01', '2013-12-31')
    // .sort('CLOUD_COVER').first();

    const visualParams = {
        'bands': ['B5', 'B4', 'B3'],
        'min': 0,
        'max': 0.5,
        'gamma': [0.95, 1.1, 1]
    }

    // let mapInfo = "";
    
    // if(imageName!== null ){
    // const eeImage = ee.Image(fetchQuery);
    // mapInfo = eeImage.getMapId(visualParams);
    // }

    let eeImage = ee.Image(fetchQuery);
    
    let urlMaps = "";

    if(eeImage == null || eeImage == "" || !eeImage){
        urlMaps = "good";
    }
    else{
        let mapInfo = eeImage.getMapId(visualParams);
        urlMaps = mapInfo.urlFormat;
    }


    const result = {
        url: urlMaps,
        Bound: imageBounds,
        name: imageName,
        start: imageStart,
        end: imageEnd
    }

    res.status(200).json(result);
}

)

module.exports = router;