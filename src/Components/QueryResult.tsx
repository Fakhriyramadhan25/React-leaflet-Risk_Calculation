import { useEffect, useState } from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

function QueryResult() {
    const [queryRes, setQueryRes] = useState<string>('');
    const [test, setTest] = useState<boolean>(false);

    useEffect(()=>{

        const fetchingData = async () => { 
          await fetch("http://localhost:5000/GEE", {
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
              setQueryRes(mapid);
              console.log(mapid);
            });
          }

          fetchingData();
    },[test])

  return (
    <>

    {queryRes !== null ? 
    (

      <TileLayer
          attribution='false'
          url={queryRes}
          />

  ) :
  ""
    }
      
      
    </>
  )
}

export default QueryResult