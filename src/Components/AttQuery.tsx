import { TbMapSearch } from "react-icons/tb";
import { useReducer, useState } from "react";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { update} from '../redux/counter'

interface imageForm  {
  imageName: string,
  dateStart: Date,
  dateEnd: Date,
}


function AttQuery({
  modalAcc,
  children,
}: {
  modalAcc: string;
  children: string;
}) {

  const img = useAppSelector(state=>state.counter)
  const useDispatch = useAppDispatch()

  const [showModal, setShowModal] = useState<boolean>();

  const imageForm : imageForm = {
    imageName: "",
    dateStart: new Date("2015-12-01"),
    dateEnd: new Date("2015-12-31"),
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

  const handleImage = () => {
    useDispatch(update(
      {
      imageName: state.imageName,
      imageStart: String(state.dateStart), 
      imageEnd: String(state.dateEnd)
    }
      ))
  }

  return (
    <>
      {/* <!-- Modal toggle --> */}
        <button className="bg-white p-2 rounded-lg z-20 absolute left-[230px] top-5 hover:bg-sky-300"
        onClick={() => setShowModal(true)}
      >
        <TbMapSearch className="inline" size={26}/> <span className="inline">Imagery Satellite</span>
      </button>

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-md "
          >
            <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white/80 outline-none focus:outline-none ">
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
                      <select className="rounded border-2 w-full py-2 px-3 text-black" name="imageName"
                        onChange={(e)=>addOperator(e)}>
                          <option value="" disabled selected>Select Image</option>
                          <option value="LANDSAT/LC08/C02/T1_TOA">Landsat 8</option>
                          <option value="LANDSAT/LC09/C02/T1_TOA">Landsat 9</option>
                          <option value="COPERNICUS/S2">Sentinel 2</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Date Start
                      </label>
                      <input className="rounded border-2 w-full py-2 px-3 text-black" type="date"
                      name="dateStart" value={state.dateStart} onChange={(e)=>addOperator(e)}/>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Date End
                      </label>
                      <input className="rounded border-2 w-full py-2 px-3 text-black" type="date"
                      name="dateEnd" value={state.dateEnd} onChange={(e)=>addOperator(e)}/>
                    </div>
                  </form>
                </div>



                {/*footer*/}
                <div className="flex items-center justify-start p-6 border-t border-solid border-blueGray-200">
                  <button
                    className="bg-sky-500 text-white font-bold uppercase rounded-lg px-3 py-2 text-sm hover:bg-blue-500"
                    type="button"
                    onClick={handleImage}
                  >
                    {modalAcc}
                  </button>
                  {/* <div className="ms-5">
                    <p>{JSON.stringify(state)}</p>
                    <p>{img.imageName}, {img.imageStart}, {img.imageEnd}</p>
                  </div> */}

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