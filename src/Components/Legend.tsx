import '../App.css';

function Legend({activateLegend}:{activateLegend:boolean}) {
  return (
    <div className='z-20 rounded-md py-2 px-4 bg-white/80 absolute bottom-14 left-4'>

        {activateLegend && activateLegend === true ? 
        <>
        <div className='flex flex-col justify-start space-y-4 '>
            <h1 className='text-2xl font-semibold text-black'>Legend</h1>
            <div>
            <div className='inline-block w-4 h-4 mr-2 rounded-md'  style={{backgroundColor:"#16a34a"}}></div>
            <span className='inline'>Restaurant</span>
            </div>
            <div>
            <div className='inline-block w-4 h-4 mr-2 rounded-md'  style={{backgroundColor:"#a7f3d0"}}></div>
            <span className='inline'>Bar</span>
            </div>
            <div>
            <div className='inline-block w-4 h-4 mr-2 rounded-md'  style={{backgroundColor:"#34d399"}}></div>
            <span className='inline'>Cafe</span>
            </div>
            <div>
            <div className='inline-block w-4 h-4 mr-2 rounded-md'  style={{backgroundColor:"#065f46"}}></div>
            <span className='inline'>Shop</span>
            </div>
            <div>
            <div className='inline-block w-4 h-4 mr-2 rounded-md'  style={{backgroundColor:"#0e7490"}}></div>
            <span className='inline'>Hospital</span>
            </div>
            <div>
            <div className='inline-block w-4 h-4 mr-2 rounded-md'  style={{backgroundColor:"#1d4ed8"}}></div>
            <span className='inline'>School</span>
            </div>
            
           
        </div>
        </>
        : ""}
    </div>
  )
}

export default Legend