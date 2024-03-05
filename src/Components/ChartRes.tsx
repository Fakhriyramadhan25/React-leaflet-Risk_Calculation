import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { IoPeople } from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa";

import { useState, useEffect, useMemo } from 'react';
import { executeSQL } from "@carto/react-api";
import { FaHouseUser } from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";


export interface credentials {
  // username: string,
  // apiKey: string,
  accessToken: string,
  apiBaseUrl:string,
  apiVersion: any,
  // connection: string
}


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

// bar 
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Damages Buildings',
    },
  },
};

const labels = ['Commercial', 'Hospital', 'School', 'Residential'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Classification of the Amenities',
      // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      data: [337, 289, 350, 247],
      backgroundColor: [
      'rgba(255, 99, 132, 0.6)',      
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)'
    ]
    },
  ],
};


// bar 
export const options2 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Commercial Buildings',
    },
  },
};

// const labels2 = ['Bar', 'Cafe', 'Restaurant', 'shops'];

// export const data2 = {
//   labels: labels2,
//   datasets: [
//     {
//       label: 'Classification of the Building',
//       // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       data: [4319,1890, 2444, 3555],
//       backgroundColor: [
//       'rgba(255, 99, 132, 0.6)',      
//       'rgba(54, 162, 235, 0.6)',
//       'rgba(255, 206, 86, 0.6)',
//       'rgba(75, 192, 192, 0.6)'
//     ]
//     },
//   ],
// };


export const options3 = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Classification of Residential',
    },
  },
};

// const labels3 = ['House', 'Houseboat', 'Apartment', 'Residential'];

// export const data3 = { 
//   labels: labels3 ,
//   datasets: [
//     {
//       label: 'Residential',
//       data: [4319,1890, 2444, 3555],
//       backgroundColor: [
//       'rgba(255, 99, 132, 0.6)',      
//       'rgba(54, 162, 235, 0.6)',
//       'rgba(255, 206, 86, 0.6)',
//       'rgba(75, 192, 192, 0.6)'
//     ],
//       borderColor: 'rgb(53, 162, 235)',

//     },
//   ],
// };


export default function App({popBounds, house, amenities, total}:any) {
  const [pop, setPop] =useState<any>();

  const credentials:credentials = {
    accessToken: import.meta.env.VITE_accessToken,
    apiBaseUrl: import.meta.env.VITE_BASEURL,
    apiVersion: 'v3',
  };

  const connection= 'carto_dw';

  // const query = 
  // "SELECT round(sum(pops),0) as result "+
  // "FROM carto-dw-ac-n02zhz31.shared_us.indonesia_100m_pops "+ 
  // "WHERE ST_INTERSECTSBOX(geom, 107.6186336220735, -6.901765693859082, 107.63105942056383, -6.891783114843436);";

  // const query = 
  // "SELECT pops "+
  // "FROM carto-dw-ac-n02zhz31.shared_us.indonesia_100m_pops "+ 
  // "WHERE geoid= 'wpqwk8ydf8yf';";

  // -6.901765693859082, 107.6186336220735  ;  ; -6.891783114843436, 107.63105942056383


    const query = `SELECT round(sum(pops),0) as result FROM carto-dw-ac-n02zhz31.shared_us.indonesia_100m_pops WHERE ST_INTERSECTSBOX(geom, ${popBounds[0]}, ${popBounds[1]}, ${popBounds[2]}, ${popBounds[3]});`;

  const fetchData = async () => {
    const result = await executeSQL({credentials, connection, query});
    return result;
  };
  
  useEffect(()=>{
    if(popBounds[0] && popBounds[0] != null) {
      fetchData().then(rows => {
        console.log(rows);
        setPop(rows);
      });
    }
    
  }, [popBounds])
  
  const Commercial = useMemo(()=>{
    const sumup1 = amenities[3] + amenities[4] + amenities[0] + amenities[5];
    return sumup1
  },[amenities])
  
  const Amenities = useMemo(()=>{
    const sumup2 = amenities.reduce((acc:any, cVal:any)=>
    acc + cVal, 0
  )
    return sumup2
  },[amenities])

  const Residents = useMemo(()=>{
    const sumup3 = house.reduce((acc:any, cVal:any)=>
      acc + cVal, 0
    )
    return sumup3
  },[house])

  const labels = ['Commercial', 'Hospital', 'School'];

 const data = {
  labels,
  datasets: [
    {
      label: 'Classification of the Building',
      // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      data: [Commercial, amenities[2], amenities[1]],
      backgroundColor: [
      'rgba(13, 148, 136, 0.6)',      
      'rgba(14, 116, 144, 0.6)',
      'rgba(29, 78, 216, 0.6)',
    ]
    },
  ],
};

  const labels2 = ['Bar', 'Cafe', 'Restaurant', 'shops'];

  const data2 = {
    labels: labels2,
    datasets: [
      {
        label: 'Classification of the Building',
        // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        data: [amenities[3], amenities[4], amenities[0], amenities[5]],
        backgroundColor: [
        'rgba(167, 243, 208, 0.6)',      
        'rgba(52, 211, 153, 0.6)',
        'rgba(22, 163, 74, 0.6)',
        'rgba(6, 95, 70, 0.6)'
      ]
      },
    ],
  };


  const labels3 = ['House', 'Houseboat', 'Apartment', 'Residential'];

    const data3 = { 
    labels: labels3 ,
    datasets: [
      {
        label: 'Residential',
        data: house,
        backgroundColor: [
        'rgba(239, 68, 68, 0.6)',      
        'rgba(249, 115, 22, 0.6)',
        'rgba(253, 224, 71, 0.6)',
        'rgba(67, 20, 7, 0.6)'
      ],
        borderColor: 'rgb(53, 162, 235)',

      },
    ],
  };


  return (
  <>
  <div>
    <div className='text-2xl font-semibold text-center mb-4'>
      Information: Risk Calculation
    </div>
    {/* <div className='flex flex-row justify-center space-x-6'> */}
    <div className='flex justify-between rounded-lg bg-lime-200/80 px-8 py-3 mb-6 border-2 border-lime-400'>
      <div>
      <IoPeople className="inline align-top text-lime-600" size={44}/>
      </div>

      <div className='inline'>
      <span className='font-bold text-3xl inline-block ml-4 text-lime-800'>{pop && pop !== null ? pop[0].result : 0 } <span className='font-medium text-xs block'>Cassualties</span></span>
      
      </div>
    </div>

    <div className='flex justify-between rounded-lg bg-green-200/80 px-8 py-3 mb-6 border-2 border-green-400'>
      <FaRegBuilding className="inline align-top text-green-600" size={44}/>

      <div className='inline'>
      <span className='font-bold text-3xl inline-block ml-4 text-green-800'>{total && total}<span className='font-medium text-xs block'>Buildings</span></span>
      
      </div>
      
      {/* <span>
        {JSON.stringify(amenities)}
      </span> */}
    </div>

    <div className='flex flex-row space-x-6 ms-3'>

    <div className='flex justify-between rounded-lg bg-emerald-200/80 px-6 py-3 mb-6 border-2 border-emerald-400 inline-block'>
      <FaHouseUser className="inline align-top text-emerald-600" size={44}/>

      <div className='inline'>
      <span className='font-bold text-3xl inline-block ml-4 text-emerald-800'>{Residents && Residents}<span className='font-medium text-xs block'>Residentials</span></span>
      
      </div>
    </div>

    <div className='flex justify-between rounded-lg bg-emerald-200/80 px-6 py-3 mb-6 border-2 border-emerald-400 inline'>
    <IoIosBusiness className="inline align-top text-emerald-600" size={44}/>
    <div className='inline'>
      <span className='font-bold text-3xl inline-block ml-4 text-emerald-800'>{Amenities && Amenities}<span className='font-medium text-xs block'>amenities</span></span>
      </div>

    </div>
    
    </div>


    {/* </div> */}
    

  <Bar options={options} data={data}/>
  <Bar options={options3} data={data3}/>

  <Pie data={data2} options={options2}/>
  </div>
  </>

  );
}
