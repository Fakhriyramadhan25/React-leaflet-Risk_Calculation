import { useEffect, useState } from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

function QueryResult() {
    const [queryRes, setQueryRes] = useState<any>();
    const [test, setTest] = useState<boolean>(false);

    useEffect(()=>{

        fetch("http://localhost:5000/GEE", {
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          })
            .then((response) => response.json())
            .then((mapid) => {
              // setQueryRes(mapid);
              console.log(mapid);
            });

            // fetch("http://localhost:5000/mapid", {
            //   method: "GET",
            //   mode: "cors",
            //   credentials: "same-origin",
            //   headers: {
            //     "Content-Type": "application/json",
            //     "Access-Control-Allow-Origin": "*",
            //   },
            // })
            //   .then((response) => response.text())
            //   .then((mapid) => {
            //     // setQueryRes(mapid);
            //     console.log(mapid);
            //   });

    },[test])

  return (
    <>
    <button className='rounded-lg p-4 bg-white ms-8' onClick={()=>setTest(!test)}>
      testing
    </button>
    <div>
      {JSON.stringify(queryRes)}
    </div>
      {/* <LayersControl.Overlay checked name="Landsat">
        <TileLayer
            attribution='false'
            url={queryRes}
            />
      </LayersControl.Overlay> */}
      
    </>
  )
}

export default QueryResult