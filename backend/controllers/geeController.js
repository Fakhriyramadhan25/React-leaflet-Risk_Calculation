const express = require('express');
const router = express.Router();
const db = require('../models/config.js');
const ee = require('@google/earthengine');

router.post('/', async (req, res)=>{
    const {polygon, startDate, endDate} = req.body;

    const fetchAOI = ee.Geometry.Polygon(
        {polygon}
    )

    const fetchImage = ee.ImageCollection('LANDSAT/LC8_L1T_TOA')
    .filterBounds(fetchAOI).filterDate({startDate}, {endDate})
    .sort('CLOUD_COVER').first();

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

    res.status(200).json(mapInfo.urlFormat);
}

)

module.exports = router;