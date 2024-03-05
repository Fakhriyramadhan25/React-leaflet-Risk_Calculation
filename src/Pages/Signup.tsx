import { useReducer, useState } from "react";


interface UserForm {
    username: string,
    password: string, 
    email: string,
    firstName: string,
    lastName: string
  }

  interface ValidatorForm {
    passwordError: boolean
  }

function Signup() {

    // reducer part for signing up 
  const UserForm : UserForm = {
    username: "",
    password: "", 
    email: "",
    firstName: "",
    lastName: ""
  }
  
  const formReducer = (state:any,action:any) => {
    switch(action.type){
      case "INPUT":
       return {
        ...state, [action.field] : action.payload
      }
      case "RESET":
        return UserForm
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(formReducer, UserForm);

  const addOperator = (e:any) => {
    dispatch({
      type: "INPUT",
      field: e.target.name,
      payload: e.target.value
    })
  }

//   reducer part for validating the form 
const ValidatorForm: ValidatorForm = {
    passwordError: false
}

const validReducer = (state:any, action: any) => {
    let isValid = false;
    switch(action.type) {
        case "Validate_password": 
            isValid = action.payload.length > 9 ? true: false
        return {
            ...state,  ...({passwordError: isValid})
        } 
    }
}

const [formValidity, dispatchValidity] = useReducer(validReducer, ValidatorForm);

const validOperator = (e:any) => {
    dispatchValidity({
      type: "Validate_password",
      payload: e.target.value
    })
  }

const handleSubmit = async () => {
//    if(formValidity == true) {
        await fetch("http://localhost:5000/User/create", {
          method: "POST",
          mode: "cors",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            },
          body: JSON.stringify({
            username: state.username,
            password: state.password, 
            email: state.email,
            firstName: state.firstname,
            lastName: state.lastname
            })  
        })
    // }
}
  
  return (
    <>

        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-10 outline-none focus:outline-none shadow-md "
        >
          <div className="">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white/80 outline-none focus:outline-none w-[560px]">
              <div className="flex items-start justify-start p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-4xl font-semibold">
                Sign up
                </h3>
              </div>
              
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <form>
                  <div className="mb-4 space-x-8">
                    <input className="rounded border-2  py-2 px-2 w-60 text-black inline" type="name" placeholder="Firstname"
                    name="firstname" value={state.firstname} onChange={(e)=>addOperator(e)}/>
                     <input className="rounded border-2 py-2 px-2 w-60 text-black inline" type="name" placeholder="Lastname"
                    name="lastname" value={state.lastname} onChange={(e)=>addOperator(e)}/>
                    
                  </div>
                  <div className="mb-4">
                    <input className="rounded border-2 w-full py-2 px-3 text-black" type="username" placeholder="Username"
                    name="username" value={state.username} onChange={(e)=>addOperator(e)}/>
                  </div>
                  <div className="mb-4">
                    <input className="rounded border-2 w-full py-2 px-3 text-black" type="email" placeholder="Email Address"
                    name="email" value={state.email} onChange={(e)=>addOperator(e)}/>
                  </div>
                  <div className="mb-4">
                    <input className="rounded border-2 w-full py-2 px-3 text-black" type="password" placeholder="Password"
                    name="password" value={state.password} onChange={(e)=>addOperator(e)} onBlur={(e)=>{validOperator(e)}}/>
                    <label>{formValidity.passwordError === true ? "success" : "failed"}</label>
                  </div>
                  <div >
                    <input className="rounded border-2 w-full py-2 px-3 text-black" type="password" placeholder="Confirm Password Password"/>
                  </div>
                
                </form>
              </div>



              {/*footer*/}
              <div className="flex items-center justify-center p-6 border-t border-solid border-blueGray-200">
                <button
                  className="bg-sky-500 text-white font-bold uppercase rounded-md px-12 py-2 text-sm hover:bg-blue-500"
                  type="button"
                  onClick={handleSubmit}
                >
                    Submit
                </button>
                <br/>
                {/* <span>
               {JSON.stringify(state)}
                </span> */}
              </div>
            </div>
          </div>
        </div>


        <div className="opacity-25 fixed inset-0 z-0 bg-black"></div>

  </>
  )

}

export default Signup
