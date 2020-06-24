import React, { createContext, useContext, useReducer, useEffect } from "react";


const initialForms = {
  jwt: "",
  user: {
    username: "",
    email: "",
    role:{
      name:"",
      type:"",
      description:""
    }
  },
};

export const UserContext = createContext({ });

/* TYPES */
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
/* END */

/* REDUCERS */
const reducer = (state, { type, payload }) => {
  switch (type) {
    case LOGOUT:
      return {
        ...state,
        ...initialForms,
      };
    case LOGIN: {
      const { jwt, user } = payload;
      return {
        ...state,
        jwt,
        user,
      };
    }
    default:
      //return state;
      throw new Error(`Unhandled action type: ${type}`)
  }
};
/* END */


//let token=''

export const UserContextProvider = (props) => {
  //const initialState = useContext(UserContext);
  let localState = null

  if(typeof localStorage !== "undefined" && localStorage.getItem("userInfo")){
    localState = JSON.parse(localStorage.getItem("userInfo") || "")
  }
  
  const [state, dispatch] = useReducer(reducer, localState||initialForms);

  if (typeof localStorage!=="undefined"){
    useEffect(()=>{
      localStorage.setItem("userInfo", JSON.stringify(state))
    }, [state])
  }

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

//export default UserContextProvider;
export const useAuth = () =>useContext(UserContext)