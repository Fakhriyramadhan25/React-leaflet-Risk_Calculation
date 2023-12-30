import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, GeoJSON} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw';
import { useEffect, useState } from 'react';


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
      centerObj: {lat: 34.124869, lng: -85.431413},
      zoom: 4,
      scrollWheelZoom: true,
      zoomControl: true
    }
  
    const onCreated = (e: any): void => {
      let layer = e.layer;
      const bounds = layer.getBounds();
      const rectangleQuery = 
      `
        [out:json];
        (
           node(${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng})["amenity"="restaurant"];
           way["building"~""](${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng});
        );
        (._;>;);
        out geom;
     `;

     setRectangles(rectangleQuery);
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
              return eachData
            }
          });
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
          // setDataAcquired((prevData)=> [...prevData, ...dataFetched]);
          setPolygonAcq({...polygonAcq, features: wayFetched});

        })
        .catch((error)=>console.log(error))
      }

      fetchingData(rectangles);

    },[rectangles, polygonAcq])

  return (
  <>
    <MapContainer zoom={viewMaps.zoom} center={viewMaps.centerObj} scrollWheelZoom={viewMaps.scrollWheelZoom} zoomControl={viewMaps.zoomControl} >
    <FeatureGroup>
      <EditControl position="topright" 
      onEdited={onEdited}
      onDeleted={onDeleted}
      onCreated={onCreated}
                  draw={
                    {
                    rectangle: true,
                    polygon: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false, 
                    }
                  }/>
    </FeatureGroup>
    <TileLayer
            attribution='false'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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


    {Object.keys(polygonAcq.features).length !== 0 ? (
        <GeoJSON data={polygonAcq} style={setColor} onEachFeature={BuildingPops}/>
      ): ""}

    </MapContainer>

    <div>
      Hasil bro: {JSON.stringify(polygonAcq)}
    </div>

</>
  )
}

export default Maps