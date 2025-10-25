import { useState } from "react";
import { createContext } from "react";

let roleContext = createContext('')

export default roleContext;

export function RoleContextWrapper({children}){
    let [role,setRole] = useState(roleContext);
    return(
        <roleContext.Provider value={{role,setRole}}>
            {children}
        </roleContext.Provider>   
    )
} 
