import { useContext } from "react";
import roleContext from "./roleContext";

export function useRole(){
    return useContext(roleContext)
} 