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

const labels = ['Commercial', 'Hospital', 'Education', 'Residential'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Classification of the Building',
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

const labels2 = ['Bar', 'Cafe', 'Restaurant', 'shops'];

export const data2 = {
  labels: labels2,
  datasets: [
    {
      label: 'Classification of the Building',
      // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      data: [4319,1890, 2444, 3555],
      backgroundColor: [
      'rgba(255, 99, 132, 0.6)',      
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)'
    ]
    },
  ],
};


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
      text: 'Types of Residential',
    },
  },
};

const labels3 = ['House', 'Residential', 'Apartment', 'Flat'];

export const data3 = {
  labels: labels3 ,
  datasets: [
    {
      label: 'Residential',
      data: [4319,1890, 2444, 3555],
      backgroundColor: [
      'rgba(255, 99, 132, 0.6)',      
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)'
    ],
      borderColor: 'rgb(53, 162, 235)',

    },
  ],
};





export default function App() {
  return (
  <>
  <div>
    <div className='text-2xl font-semibold text-center mb-4'>
      Information: Risk Calculation
    </div>
    {/* <div className='flex flex-row justify-center space-x-6'> */}
    <div className='flex justify-between rounded-xl bg-sky-200/80 px-8 py-3 mb-6 border-2 border-sky-400'>
      <div>
      <IoPeople className="inline align-top text-blue-600" size={44}/>
      </div>

      <div className='inline'>
      <span className='font-bold text-3xl inline-block ml-4 text-blue-800'>24 <span className='font-medium text-xs block'>Cassualties</span></span>
      
      </div>
    </div>

    <div className='flex justify-between rounded-xl bg-emerald-200/80 px-8 py-3 mb-6 border-2 border-emerald-400'>
      <FaRegBuilding className="inline align-top text-green-600" size={44}/>

      <div className='inline'>
      <span className='font-bold text-3xl inline-block ml-4 text-green-800'>1500 <span className='font-medium text-xs block'>Buildings</span></span>
      
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
