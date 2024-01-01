import { TbMapSearch } from "react-icons/tb";
import { useReducer, useState } from "react";

interface imageForm  {
  imageName: string,
  imageDate: Date,
  imageLat: number,
  imageLon: number
}


function AttQuery({
  modalAcc,
  children,
}: {
  modalAcc: string;
  children: string;
}) {

  const [showModal, setShowModal] = useState<boolean>(false);

  const imageForm : imageForm = {
    imageName: "",
    imageDate: new Date("2024-01-01"),
    imageLat: 0,
    imageLon: 0
  }
  
  const queryReducer = (state:any,action:any) => {
    switch(action.type){
      case "INPUT":
       return {
        ...state, [action.field] : action.payload
      }
      case "RESET":
        return imageForm
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(queryReducer, imageForm);

  const addOperator = (e:any) => {
    dispatch({
      type: "INPUT",
      field: e.target.name,
      payload: e.target.value
    })
  }

  return (
    <>
      {/* <!-- Modal toggle --> */}
        <button className="bg-white p-2 rounded-lg z-20 absolute left-5 top-44 hover:bg-sky-300"
        onClick={() => setShowModal(true)}
      >
        <TbMapSearch size={26}/>
      </button>

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-md"
          >
            <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {children}
                  </h3>
                  <button
                    className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  > 
                    <span className=" text-black text-2xl block rounded-lg hover:bg-red-200 px-2">
                      X
                    </span>
                  </button>


                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Image Name
                      </label>
                      <input className="rounded border-2 w-full py-2 px-3 text-black" type="text"
                      name="imageName" value={state.imageName} onChange={(e)=>addOperator(e)}/>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Date Image
                      </label>
                      <input className="rounded border-2 w-full py-2 px-3 text-black" type="date"
                      name="imageDate" value={state.imageDate} onChange={(e)=>addOperator(e)}/>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Latitude
                      </label>
                      <input className="rounded border-2 w-full py-2 px-3 text-black" type="number" step="0.001" 
                      name="imageLat" value={state.imageLat} onChange={(e)=>addOperator(e)}/>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Longitude
                      </label>
                      <input className="rounded border-2 w-full py-2 px-3 text-black" type="number" step="0.001" 
                      name="imageLon" value={state.imageLon} onChange={(e)=>addOperator(e)}/>
                    </div>
                  </form>
                </div>



                {/*footer*/}
                <div className="flex items-center justify-start p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="bg-sky-500 text-white font-bold uppercase rounded-lg px-3 py-2 text-sm hover:bg-blue-500"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {modalAcc}
                  </button>
                  <div className="ms-5">
                    <p>{JSON.stringify(state)}</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      
      
    </>
  )
}

export default AttQuery