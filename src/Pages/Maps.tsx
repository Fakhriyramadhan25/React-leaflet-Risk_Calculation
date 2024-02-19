import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, GeoJSON, LayersControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw';
import { useCallback, useEffect, useState, useMemo} from 'react';
import { VscClearAll } from "react-icons/vsc";
import AttQuery from '../Components/AttQuery';
import $ from 'jquery';
import { SlLayers } from "react-icons/sl";
import QueryResult from '../Components/QueryResult';


// map features 
// import { GetLatLong } from '../Components/GetLatLong';
import SearchBar from '../Components/SearchBar';

declare global {
  interface Window { type: any; }
}

window.type = true;

interface viewMaps  {
  centerObj: {lat: number, lng: number},
  zoom: number, 
  scrollWheelZoom: boolean,
  zoomControl: boolean,
}


export const Maps: React.FC = () => {
  const [rectangles, setRectangles] = useState<string>();
  const [dataAcquired, setDataAcquired] = useState<any[]>([]);
  const [polygonAcq, setPolygonAcq] = useState<any>({
    "type":"FeatureCollection","features":[]
  })
  const [boundAOI, setBoundAOI] = useState<any[]>([]);
  const [layerSwitcher, setLayerSwitcher] = useState<boolean>(true);
  const [amenities, setAmenities]=useState<any[]>([]);
  const [res, setResult] = useState<number>();
  const[recWay, setRecWay] = useState<string>();

  const opassURL = 'https://overpass-api.de/api/interpreter?data=';
  
    const setColor = () => {
      return { 
        weight: 5,
        fillColor: 'blue',
        fillOpacity: 1,
        color: 'red'
      };
    };

    const BuildingPops = (feature:any, layer:any)=>{
      layer.bindPopup("name:" + (feature.properties.building)
      , {permanent: true, 
          direction: "left"});
  }

    const viewMaps : viewMaps = {
      centerObj: {lat:48.824592829935014 , lng: 9.261474609375002},
      zoom: 10,
      scrollWheelZoom: true,
      zoomControl: false
    }
  
    const onCreated = (e: any): void => {
      let layer = e.layer;
      const bounds = layer.getBounds();

      const latlonpoint = layer.getLatLngs();
      const latlong = latlonpoint[0].map((data:any)=>{
        return [data.lng, data.lat]})

        // ["amenity"="restaurant"]
      
      setBoundAOI(latlong);
      const rectangleQuery = 
      `
        [out:json];
        (
           node(${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng})["amenity"~"restaurant|cafe|bar|food_court"];
           
        );
        (._;>;);
        out geom;
     `;

     setRectangles(rectangleQuery);

     const recWayQuery = 
     `
     [out:json];
        (
     way(${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng})["building"~"house|residential"];
     );
     (._;>;);
     out geom;
     `;

    
     setRecWay(recWayQuery)

    };



    const onEdited = (e: any): void=>{
      console.log(e);
    }

    const onDeleted = (e: any): void => {
      console.log(e)
    };

    useEffect(()=> {
      // fetching data from overpass turbo 
      const fetchingData = async (opURL:any) => {
       await fetch(opassURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(({data: opURL}))
        }).then(res=>res.json())
        .then((data)=>{
          const dataFetched = data.elements.map((eachData:any)=>{
            if(eachData.type === 'node'){
              setAmenities((prevData:any)=> [...prevData, eachData.tags.amenity]);
              return eachData
            }
          });

          setDataAcquired((prevData)=> [...prevData, ...dataFetched]);
        })
        .catch((error)=>console.log(error))
      }

      // fetchingData(rectangles);
      

    },[rectangles])


    useEffect(()=>{
         // fetching data from overpass turbo 
         const fetchingWay = async (opURL:any) => {
          await fetch(opassURL, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
             },
             body: new URLSearchParams(({data: opURL}))
           }).then(res=>res.json())
           .then((data)=>{
             const wayOnly = data.elements.filter((data:any)=>{
               if (data.type === 'way'){
                 return true;
               }
               return false;
             })
             const wayFetched = wayOnly.map((eachData:any)=>{
               if(eachData.type === 'way'){
                   const coordinates = eachData.geometry.map((coord:any) => 
                     ([coord.lon, coord.lat])
                 )
                 return {
                   type: "Feature",
                   id: `${eachData.id}`,
                   properties: eachData.tags,
                   geometry: {
                     type: "Polygon",
                     coordinates: [coordinates]
                   }
                 }
               }
             })
   
             setPolygonAcq({...polygonAcq, features: wayFetched});

             setPolygonAcq((prevState:any) => ({
              ...prevState,
              features: [...prevState.features, ...wayFetched]
            }));

            console.log(wayFetched);
 
           })
           .catch((error)=>console.log(error))
         }
   
        // fetchingWay(recWay);

    },[recWay])

    const handleHide = useCallback(() => {
      setLayerSwitcher(!layerSwitcher)
      if(layerSwitcher === false) {
        $('.leaflet-control-layers').hide();
      }
      else {
       $('.leaflet-control-layers').toggle();
       $('.leaflet-control-layers').css('top','25px');
       $('.leaflet-control-layers').css('right','62px');
      }

    },[layerSwitcher])

    useEffect(()=>{
      
    })

    useEffect(()=>{
      let result = 0;
      for(let i = 0; i<amenities.length;i++){
        amenities[i] = amenities[i].toLowerCase();
        if(amenities[i] == 'restaurant'){
          result += 1;
        }
      }
      setResult(result);
    },[amenities])

    // calculating result 
    const CountPoints = useMemo(()=>{
      const Restaurant = dataAcquired.length;
      const building = polygonAcq.features.length;
      return [Restaurant,building];
    },[dataAcquired, amenities, polygonAcq])



    const handleClearAll = () => {
      setDataAcquired([]);
      setAmenities([]);
      // setPolygonAcq([""]);
      // setRectangles("");
    }




  return (
  <>
    
    <div className='z-10'>
      <button className='bg-white p-2 rounded-lg z-20 absolute left-5 top-72 hover:bg-sky-300' onClick={handleClearAll}><VscClearAll size={26}/></button>
    </div>

    <div className='z-10'>
      <AttQuery 
      modalAcc='Run'
      >
        Imagery Satellite Query
      </AttQuery>
    </div>

    <div className='z-10'>
      count: {JSON.stringify(CountPoints)} {res}
      amenities: {JSON.stringify(amenities)}
      {polygonAcq && JSON.stringify(polygonAcq)}
    </div>

    <div className='z-10'>
    <QueryResult bounds={boundAOI}/>
    </div>
    
    <div className='z-10 absolute right-8 top-4'><button className='bg-white font-bold p-2 rounded-xl hover:bg-sky-300' onClick={handleHide}>
      <SlLayers size={25}/>
      </button>
    </div>

    <MapContainer zoom={viewMaps.zoom} center={viewMaps.centerObj} scrollWheelZoom={viewMaps.scrollWheelZoom} zoomControl={viewMaps.zoomControl}>
    {/* <GetLatLong/> */}
    <SearchBar/>
    <FeatureGroup>
      <EditControl position="topleft" 
      onEdited={onEdited}
      onDeleted={onDeleted}
      onCreated={onCreated}
                  draw={
                    {
                    rectangle: 
                    {
                    shapeOptions: {
                      color: "red",
                      weight: 3
                    }
                    },
                    polygon: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false, 
                    }
                  }/>
    </FeatureGroup>

    {dataAcquired !== null ? (
        dataAcquired.map((data:any)=>{
          return (
          <Marker key={data.id} position={[data.lat,data.lon]}>
            <Popup>
              Name: {data.tags.name} <br/>
              Amenity: {data.tags.amenity}
            </Popup>
          </Marker>
          )
        })
      ): ""}

    
    <LayersControl position='topright' collapsed={false}>
      
      <LayersControl.BaseLayer checked name="OpenStreet Basemap">
      <TileLayer
              attribution='false'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
      </LayersControl.BaseLayer>
      
      <LayersControl.BaseLayer name="Carto Basemap">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='false'
          />
        </LayersControl.BaseLayer>

      
        <LayersControl.BaseLayer name="Imagery Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='false'
          />
        </LayersControl.BaseLayer>

        {/* <LayersControl.Overlay name="GEE" checked>
          <QueryResult bounds={boundAOI}/>
      </LayersControl.Overlay> */}


      <LayersControl.Overlay name="marker" checked>
        <Marker position={viewMaps.centerObj}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
      </LayersControl.Overlay>

      {/* <LayersControl.Overlay name="Restaurants" checked>
      
      </LayersControl.Overlay> */}

    <LayersControl.Overlay name="Buildings" checked> 

    {polygonAcq.features && Object.keys(polygonAcq.features).length !== 0 ? ( 
      polygonAcq.features.map((data:any) => {
      return (<GeoJSON data={data} style={setColor} onEachFeature={BuildingPops}/> )
    })
        
      ): ""}
    </LayersControl.Overlay>

      </LayersControl>
      
    </MapContainer>

</>
  )
}

export default Maps