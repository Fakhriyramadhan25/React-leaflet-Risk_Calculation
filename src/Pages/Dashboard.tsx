import React, { useState, useEffect } from 'react';
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

        const cartoAPIKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfdTk3OTE1MzkiLCJqdGkiOiIxN2NlZGJjMCJ9.5K1tO_5R99Va8SE_QejpadbpErxJmtm55IV7wvJNkHg';
        // const url = `https://gcp-asia-northeast1.api.carto.com/v3/sql/:connection/query?q=SELECT * FROM carto-demo-data.demo_tables.populated_places where name="Sydney"`;
        // const fetchURL = 'http://localhost:5173/Query/:connection/query?q=SELECT * FROM carto-demo-data.demo_tables.populated_places where name="Sydney"';
        // const trial= 'https://gcp-asia-northeast1.api.carto.com/v3/sql/:connection/query?q=SELECT * FROM carto-demo-data.demo_tables.populated_places where name="Sydney"';
        const exchange= 'https://gcp-asia-northeast1.api.carto.com/v3/sql/carto-dw/query?q=SELECT * FROM carto-dw-ac-u9791539.shared.Amenities where id="node/8459295146"';
        // const url = 'http://localhost:5173/Query?q=SELECT * FROM carto-dw-ac-u9791539.shared.Amenities where id="node/8459295146"';
        // const fQuery = 'SELECT * FROM carto-demo-data.demo_tables.populated_places where name="Sydney"';

// const result= "carto-dw-ac-u9791539.shared_us.usapops"; 


    useEffect(() => {
      const fetchingData = async () => { 
        await fetch(exchange, {
          method: "GET",
          mode: "cors",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${cartoAPIKey}`,
          }
        })
          .then((response:any) => response.json())
          .then((data:any) => {
            // setPop(data);
            console.log(data);
          }).catch((err:any)=>{console.log(err)});
          
        }
        
        // fetchingData();
    }, []);
    

const credentials:credentials = {
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfdTk3OTE1MzkiLCJqdGkiOiIxN2NlZGJjMCJ9.5K1tO_5R99Va8SE_QejpadbpErxJmtm55IV7wvJNkHg',
  apiBaseUrl: 'https://gcp-asia-northeast1.api.carto.com',
  apiVersion: 'v3',
};

const connection= 'carto_dw';

// const query = `SELECT count(*) FROM carto-dw-ac-u9791539.shared_us.usapops`;

const query = 
"SELECT SUM(new_pops) "+
"FROM carto-dw-ac-u9791539.shared_us.usapops " +
"WHERE ST_INTERSECTSBOX(geom,"+" -118.304, 33.798, -117.37, 34.351);"
// " ST_GEOGFROMTEXT('POLYGON((-118.30352783203126 33.798111622497906, "+
// "-118.30352783203126 34.35068712457662, -117.36968994140626 34.35068712457662, -117.36968994140626 33.798111622497906, -118.30352783203126 33.798111622497906))'))";

// [[-118.30352783203126,33.798111622497906],[-118.30352783203126,34.35068712457662],[-117.36968994140626,34.35068712457662],[-117.36968994140626,33.798111622497906]]

// ST_MakeEnvelope(-118.19, 33.93, -117.75, 34.48, 4326)

// SELECT SUM(new_pops) as goodresult FROM `$b` WHERE ST_INTERSECTSBOX(geom,-118.304, 33.798, -117.37, 34.351)

const fetchData = async () => {
  const result = await executeSQL({credentials, connection, query});
  return result;
};

// fetchData().then(rows => {
//   console.log(rows);
//   setTest(rows);
// });


// SELECT SUM(new_pops)
// FROM carto-dw-ac-u9791539.shared_us.usapops
// WHERE ST_Intersects(geom, ST_MakeEnvelope(-118.19138427202748, 33.926558906588745, -117.7454649241739, 34.47517819347562, 4326));

// los angeles  33.926558906588745, -118.19138427202748
//  mount pasadena 34.47517819347562, -117.7454649241739



    return (
        <div>
            <h2>Population within the specified geometry bounds:</h2>
            {pop !== null ? (
                <p>{JSON.stringify(pop)}</p>
               
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