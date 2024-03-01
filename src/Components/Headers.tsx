import spade from '../assets/spade.png';


function Headers() {
  return (<>

<div className='absolute w-full h-20 align-bottom z-30 bg-white/20 backdrop-blur-sm'>
    <div className='flex flex-row justify-between px-48 '>
        <div className='h-4'>
        <img src={spade} alt="Logo" className='object-cover h-16 w-auto '/>
        </div>
    
    <div className='grid grid-cols-3 gap-x-24 my-auto text-white font-semibold text-xl mt-5'>
        <div>
            <button>About</button>
        </div>
        <div>
            <button>Method</button>
        </div>
        <div>
            <button>FAQ</button>
        </div>
    </div>
    
    <div className='text-black text-2xl text-white font-semibold text-xl mt-4'>
     <button className='py-2 px-4 bg-emerald-400 rounded-md'>Login</button>
    </div>

    </div>
    
</div>
  </>
    
  )
}

export default Headers