import React, { createContext, useContext, useReducer } from "react";

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
      return state;
  }
};
/* END */

export const UserContext = createContext({ ...initialForms });

//let token=''

const UserContextProvider = (props) => {
  const initialState = useContext(UserContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
