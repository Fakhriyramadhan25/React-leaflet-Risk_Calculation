
import { useState, useEffect } from 'react';
import { executeSQL } from "@carto/react-api";

export interface credentials {
  // username: string,
  // apiKey: string,
  accessToken: string,
  apiBaseUrl:string,
  apiVersion: any,
  // connection: string
}

function Dashboard() {
        const [pop, setPop] =useState<any>();
        const [test,setTest] = useState<any>();
    

const credentials:credentials = {
  accessToken: import.meta.env.VITE_accessToken,
  apiBaseUrl: import.meta.env.VITE_BASEURL,
  apiVersion: 'v3',
};

const connection= 'carto_dw';

const query = 
"SELECT count(*) "+
"FROM carto-data.ac_u9791539.sub_worldpop_geography_nld_grid1km_v1 "+ 
"WHERE ST_INTERSECTSBOX(geom, 5.114748441755855, 52.09123574714653, 6.083640580404145,52.51829468259318);";


const fetchData = async () => {
  const result = await executeSQL({credentials, connection, query});
  return result;
};

useEffect(()=>{
  fetchData().then(rows => {
  console.log(rows);
  setTest(rows);
});
}, [])


    return (
        <div>
            <h2>Population within the specified geometry bounds:</h2>
            {pop !== null ? (
                // <p>{JSON.stringify(pop)}</p>
               ""
            ) : (
                <p>Loading...</p>
            )}
            <button className='p-2 bg-blue-300 rounded-lg' onClick={fetchData}>initiate</button>
             {/* <p>rows: {JSON.stringify(rows)}</p> */}
             <p>test: {JSON.stringify(test)}</p>
        </div>
    );
}

export default Dashboard