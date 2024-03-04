import { useEffect, useState } from 'react';
import {  TileLayer } from 'react-leaflet';
import { useAppSelector } from '../redux/hooks';



interface imgParam {
  imageName: string,
  imageStart:string, 
  imageEnd: string,
  imageBounds: any
}



function QueryResult(props:any) {
    const [queryRes, setQueryRes] = useState<string[]>([]);
    // const [ imgParam, setImgParam ] = useState<imgParam>({
    //   imageName: 'LANDSAT/LC8_L1T_TOA',
    //   imageStart:'2015-12-01', 
    //   imageEnd: '2015-12-31',
    //   imageBounds: [
    //     [9.261474609375002, 48.824592829935014], 
    //     [9.261474609375002, 48.75217601689752],
    //     [9.151611328125002, 48.75217601689752], 
    //     [9.151611328125002, 48.824592829935014]
    // ]
    // });
    const [iBounds, setIBounds] = useState<any>(
      [
        [8.642120361328127,48.84837497332759],
    [8.642120361328127,48.928788498394496],
    [8.898925781250002,48.928788498394496],
    [8.898925781250002,48.84837497332759]
  ]
    )

    // const imageName = 'LANDSAT/LC8_L1T_TOA';
    // const imageStart = '2015-12-01';
    // const imageEnd = '2015-12-31';

    const bounds =  [[8.642120361328127,48.84837497332759],
    [8.642120361328127,48.928788498394496],
    [8.898925781250002,48.928788498394496],
    [8.898925781250002,48.84837497332759]];

    const img = useAppSelector(state=>state.counter)
    
    // console.log(iBounds);
    // const bounds = props.bounds;

    useEffect(()=>{
      if(props.bounds && props.bounds != null){
        setIBounds(props.bounds);
      }
  
    },[ props.bounds ])

    useEffect(()=>{
        const fetchingData = async () => { 
          await fetch("http://localhost:5173/GEE", {
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              imageName: img.imageName,
              imageStart: img.imageStart,
              imageEnd: img.imageEnd,

              // imageName: imageName,
              // imageStart: imageStart,
              // imageEnd: imageEnd,
              imageBounds: iBounds})
        
          })
            .then((response) => response.json())
            .then((mapid) => {
              setQueryRes((prev:string[])=>[...prev, mapid.url]);
              console.log(mapid);
            }).catch(err=>{console.log(err)});
            
          }

          if(img && img.imageName != "LANDSAT/LC8_L1T_TOA" && props.ActivateIS && props.ActivateIS === true) {
            fetchingData();
          }
          
          
    },[ img])

  return (
    <>
    {/* <div>
      <p>bound: {JSON.stringify(iBounds)}</p>
      <p>image details: {JSON.stringify(img)}</p>
      <p>fetch result {JSON.stringify(queryRes)}</p>
    </div> */}

{/* <div> */}
    {/* {queryRes && queryRes !== null ? 
    ( queryRes.map((item:string)=>{
      return (
        <TileLayer
        attribution='false'
        url={item}
        />
      )
    })
  ) :
  ""
    } */}
    {/* </div> */}
      
    </>
  )
}

export default QueryResult