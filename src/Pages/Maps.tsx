import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, GeoJSON, LayersControl, ScaleControl} from 'react-leaflet';
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
import { MdOutlineSpaceDashboard } from "react-icons/md";
import ChartRes from '../Components/ChartRes';
import { IoMdSwitch } from "react-icons/io";
import L from 'leaflet';
import pinBar from '../assets/pinBar.png';
import pinHospital from '../assets/pinHospital.png';
import pinRestaurant from '../assets/pinRestaurant.png';
import pinCafe from '../assets/pinCafe.png';
import pinShop from '../assets/pinShop.png';
import pinEducation from '../assets/pinEducation.png';

import Legend from '../Components/Legend';

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
  const [shops, setShops]=useState<any[]>([]);
  const [result, setResult] = useState<any>();
  const[recWay, setRecWay] = useState<string>();
  const[dashboardAct, setDashboardAct] = useState<boolean>(false);
  const[HouseAct,setHouseAct] = useState<boolean>(false);
  const[houseData, setHouseData] = useState<any[]>([]);
  const[countHouse, setCountHouse] = useState<any>();
  const [activateIS, setActivateIS] =useState<boolean>(true);
  const [activateDB, setActivateDB] = useState<boolean>(false);
  const [popBound, setPopBound ] = useState<any[]>([]);
  const [activateLegend, setActivateLegend]= useState<boolean>(false);


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
      centerObj: {lat:-6.901765693859082 , lng: 107.6186336220735},
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
      
      setBoundAOI(latlong);


      setPopBound([bounds.getSouthWest().lng,bounds.getSouthWest().lat,bounds.getNorthEast().lng,bounds.getNorthEast().lat]);
      
      const rectangleQuery = 
      `
        [out:json];
        (
          node(${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng})["amenity"~"restaurant|cafe|bar|hospital|school"];
          node(${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng})["shop"="supermarket"];
        );
        (._;>;);
        out geom;
     `;

     setRectangles(rectangleQuery);

     const recWayQuery = 
     `
     [out:json];
        (
     way(${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng})["building"~"house|residential|apartments|houseboat"];
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
              if(eachData.tags.amenity && eachData.tags.amenity!= null) {
                setAmenities((prevData:any)=> [...prevData, eachData.tags.amenity]);
              }
              else if(eachData.tags.shop && eachData.tags.shop != null) {
                setShops((prevData:any)=> [...prevData, eachData.tags.shop]);
              }
              
              return eachData
            }
          });
          // console.log(dataFetched);
          setDataAcquired((prevData)=> [...prevData, ...dataFetched]);
         
        })
        .catch((error)=>console.log(error))
      }
      if(activateDB === true){
      fetchingData(rectangles);
      }
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

                if(eachData.tags && eachData.tags != null) {
                setHouseData((prevData:any)=> [...prevData, eachData.tags.building]);
                  }

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
   
            //  setPolygonAcq({...polygonAcq, features: wayFetched});
            //  console.log(wayFetched);

             setPolygonAcq((prevState:any) => ({
              ...prevState,
              features: [...prevState.features, ...wayFetched]
            }));

            
 
           })
           .catch((error)=>console.log(error))
         }

         
         if(activateDB === true){
          fetchingWay(recWay);
         }
        

    },[recWay])

    const handleHide = useCallback(() => {
      setLayerSwitcher(!layerSwitcher)
      if(layerSwitcher === false) {
        $('.leaflet-control-layers').hide();
      }
      else {
       $('.leaflet-control-layers-expanded').toggle();
       $('.leaflet-control-layers-expanded').css('top','8px');
       $('.leaflet-control-layers-expanded').css('right','144px');
       $('.leaflet-control-layers-expanded').css('transition','transform 2s');

       $('.leaflet-control-layers').css('padding','10px');
       $('.leaflet-control-layers').css('background-color','rgba(76, 175, 80, 0.6)');
       $('.leaflet-control-layers').css('color','white');
       $('.leaflet-control-layers').css('font-weight','bold');
      }

    },[layerSwitcher])


    useEffect(()=>{
      let result:any = [0, 0, 0, 0]
      if(houseData && houseData != null) {
      for(let i = 0; i<houseData.length;i++){
        houseData[i] = houseData[i].toLowerCase();
        if(houseData[i] == 'house'){
          result[0] += 1;
        }
        else if(houseData[i] == 'houseboat'){
          result[1] += 1;
        }
        else if(houseData[i] == 'apartments'){
          result[2] += 1;
        }
        else if(houseData[i] == 'residential'){
          result[3] += 1;
        }
      }}

      setCountHouse(result);
    }, [houseData])

    useEffect(()=>{
      let result:any = [0,0,0,0,0,0];
      if(amenities && amenities != null) {
      for(let i = 0; i<amenities.length;i++){
        amenities[i] = amenities[i].toLowerCase();
        if(amenities[i] == 'restaurant'){
          result[0] += 1;
        }
        else if(amenities[i] == 'school'){
          result[1] += 1;
        }
        else if(amenities[i] == 'hospital'){
          result[2] += 1;
        }
        else if(amenities[i] == 'bar'){
          result[3] += 1;
        }
        else if(amenities[i] == 'cafe' || amenities[i] == 'internet_cafe'){
          result[4] += 1;
        }
        else{
          result[1] += 1;
        }
      }
    }

      if(shops && shops != null) {
        for(let i = 0; i<shops.length;i++){
          result[5] += 1;
        }
      }

      setResult(result);

    },[amenities, shops])

    useEffect(()=>{
      if(dataAcquired[0] && dataAcquired !== null){
        setActivateLegend(true);
      }
      else {
        setActivateLegend(false);
      }
    },[dataAcquired])


    const totBuilding:any = useMemo(()=>{
      let sumbuilding = 0
      if(result && countHouse) {
      const build1 = result.reduce((acc:any, cVal:any) => acc + cVal ,
      0)
      const build2 = countHouse.reduce((acc:any, cVal:any) => acc + cVal ,
      0)

      sumbuilding = build1 + build2;

    }
      // const good = [1,2,3,4]
      // let test = good.reduce((acc, val)=> acc+val, 0)

      return sumbuilding
    },[result, countHouse])



    const handleClearAll = () => {
      setDataAcquired([]);
      setAmenities([]);
      setResult([]);
      setShops([]);
      setCountHouse([]);
    }

    const handleDashboard = (e:any) => {
      e.preventDefault();
      setDashboardAct(!dashboardAct);
    }

    const handleSwitch = () => {
      setHouseAct(!HouseAct);
    }

    const handleSwitchID = () => {
      setActivateDB(!activateDB);
      setActivateIS(!activateIS);
    }


      // Define marker icons for different categories
  const iconOptions:any = {
    restaurant: new L.Icon({ iconUrl: pinRestaurant, iconSize: [60, 60] }),
    school: new L.Icon({ iconUrl: pinEducation, iconSize: [60, 60] }),
    hospital: new L.Icon({ iconUrl: pinHospital, iconSize: [60, 60] }),
    bar: new L.Icon({ iconUrl: pinBar, iconSize: [60, 60] }),
    shop: new L.Icon({ iconUrl: pinShop, iconSize: [60, 60] }),
    cafe: new L.Icon({ iconUrl: pinCafe, iconSize: [60, 60] }),
    default: new L.Icon({ iconUrl: pinCafe, iconSize: [60, 60] }),


    // red: new L.Icon({ iconUrl: pinRestaurant, iconSize: [60, 60] }), 
    // blue: new L.Icon({ iconUrl: pinEducation, iconSize: [60, 60] }),
    // green: new L.Icon({ iconUrl: pinCafe, iconSize: [60, 60] })
  };

  // const data = [
  //   { lat: 51.505, lng: -0.09, category: 'red' },
  //   { lat: 51.51, lng: -0.1, category: 'blue' },
  //   { lat: 51.515, lng: -0.11, category: 'green' },
  //   { lat: 51.52, lng: -0.12}
  // ];


  return (
  <>
  <div className='z-20'>
    <Legend activateLegend={activateLegend}/>
  </div>
    
    <div className='z-10'>
      <button className='bg-white p-2 rounded-lg z-20 absolute left-[400px] top-5 hover:bg-red-300' onClick={handleClearAll}>
        <VscClearAll className="inline" size={26}/> <span className='inline'>Clear All</span>
        </button>
    </div>

    <div className='z-20 absolute left-[132px] top-5'><button className='bg-sky-100 font-medium p-2 rounded-lg hover:bg-sky-300' onClick={handleSwitch}>
      <IoMdSwitch className="inline" size={26}/> <span className='inline' onClick={handleSwitchID}>{activateIS === true ? "Imagery Satellite":"Building Data"}</span>
  
      </button>
    </div>


    <div className='z-10'>
      <AttQuery 
      modalAcc='Run'
      >
        Imagery Satellite Query
      </AttQuery>
    </div>

    {/* <div className='z-10'>
    <br/><br/><br/><br/>
    {JSON.stringify(dataAcquired)}
    total building: {totBuilding}
      count: {JSON.stringify(countHouse)} 
      <br/>
      result: {JSON.stringify(result)}
      <br/>
      shop: {JSON.stringify(houseData)}
      amenities: {JSON.stringify(amenities)}
      {polygonAcq && JSON.stringify(polygonAcq)}
    </div> */}

    {/* <div className='z-10'>
    <QueryResult bounds={boundAOI}/>
    </div> */}
    
    <div className='z-10 absolute right-28 top-16'><button className='bg-white font-bold p-2 rounded-lg hover:bg-sky-300' onClick={handleHide}>
      <SlLayers size={25}/>
      </button>
    </div>

    <div className='z-20 absolute right-16 top-16'><button className='bg-white font-bold p-2 rounded-lg hover:bg-sky-300' onClick={handleDashboard}>
      <MdOutlineSpaceDashboard size={25}/>
      </button>
    </div>


    {dashboardAct && 
    <div className='z-10 absolute right-16 top-28 bg-white/70 px-8 py-4 rounded-lg transition ease-in-out transform translate-y-1 overflow-y-scroll h-3/4 w-1/4'>
      <ChartRes popBounds={popBound} house={countHouse} amenities={result} total={totBuilding}/>
    </div>
    }
    
    <MapContainer zoom={viewMaps.zoom} center={viewMaps.centerObj} scrollWheelZoom={viewMaps.scrollWheelZoom} zoomControl={viewMaps.zoomControl}>
    {/* <GetLatLong/> */}
    <SearchBar />
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

    {/* {data!== null ? (
        data.map((data:any)=>{
          const icon = iconOptions[data.category] || iconOptions.default;
          return (
          <Marker position={[data.lat,data.lng]} icon={icon}>
            <Popup>
              Name: hi there

            </Popup>
          </Marker>
          )
        })
      ): ""} */}

    {dataAcquired !== null ? (
        dataAcquired.map((data:any)=>{
          const icon = iconOptions[data.tags.amenity] || iconOptions.default;
          return (
          <Marker key={data.id} position={[data.lat,data.lon]} icon={icon}>
            <Popup>
              Name: {data.tags.name} <br/>
  

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

        <LayersControl.Overlay name="GEE" checked>
          <QueryResult bounds={boundAOI} ActivateIS={activateIS}/>
      </LayersControl.Overlay>


      <LayersControl.Overlay name="marker" checked>
        <Marker position={viewMaps.centerObj}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
      </LayersControl.Overlay>

      {/* <LayersControl.Overlay name="Restaurants" checked>
      
      </LayersControl.Overlay> */}

    {/* <LayersControl.Overlay name="Buildings" checked> 

    {polygonAcq.features && Object.keys(polygonAcq.features).length !== 0 ? ( 
      polygonAcq.features.map((data:any) => {
      return (<GeoJSON data={data} style={setColor} onEachFeature={BuildingPops}/> )
    })
        
      ): ""}
    </LayersControl.Overlay> */}

      </LayersControl>
      <ScaleControl position="bottomleft" />
    </MapContainer>

</>
  )
}

export default Maps