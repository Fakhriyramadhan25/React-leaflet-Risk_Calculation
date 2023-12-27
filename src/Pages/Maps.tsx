import { MapContainer, TileLayer, Marker, Popup, FeatureGroup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw';
window.type = true;



interface viewMaps  {
  centerObj: {lat: number, lng: number},
  zoom: number, 
  scrollWheelZoom: boolean,
  zoomControl: boolean,
}



export const Maps: React.FC = () => {
  
    const onCreated = (e: any): void => {
      let type = e.layerType;
      let layer = e.layer;
      if (type === "marker") {
        // Do marker specific actions
        console.log("_onCreated: marker created", e);
      } else {
        console.log("_onCreated: something else created:", type, e);
      }

      console.log("Geojson", layer.toGeoJSON());
      console.log("coords", layer.getLatLngs());
      // Do whatever else you need to. (save to db; etc)
      // this._onChange();
    };

    const onEdited = function(e: any): void{
      let numEdited = 0;
      e.Layer.eachLayer(() => {
        numEdited += 1;
      });
      console.log(`_onEdited: edited ${numEdited} layers`, e);
  
      // this._onChange();
     ;
    }

    const onDeleted = (e: any): void => {
      let numDeleted = 0;
      e.layers.eachLayer(() => {
        numDeleted += 1;
      });
      console.log(`onDeleted: removed ${numDeleted} layers`, e);
  
      // this._onChange();
    };

  const viewMaps : viewMaps = {
    centerObj: {lat: -6.90208974723932, lng: 107.61861026284961},
    zoom: 17,
    scrollWheelZoom: true,
    zoomControl: true
  }


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
          </Popup>
        </Marker>
    
    </MapContainer>

</>
  )
}

export default Maps