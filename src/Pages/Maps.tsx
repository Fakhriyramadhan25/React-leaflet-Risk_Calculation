import { MapContainer, TileLayer, Marker, Popup, FeatureGroup} from 'react-leaflet';
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
  const opassURL = 'https://overpass-api.de/api/interpreter';

    const viewMaps : viewMaps = {
      centerObj: {lat: -6.90208974723932, lng: 107.61861026284961},
      zoom: 17,
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
           way(${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng})["building"="house"];
        );
        (._;>;);
        out;
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
        .then(data=>{
          const dataFetched = data.elements.map((eachData:any)=>{
            return eachData.tags
          })
          console.log(dataFetched);
        })
        .catch((error)=>console.log(error))
      }

      fetchingData(rectangles);

    },[rectangles])

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
      <Marker position={viewMaps.centerObj}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            {JSON.stringify(rectangles)}
          </Popup>
        </Marker>
    
    </MapContainer>

</>
  )
}

export default Maps