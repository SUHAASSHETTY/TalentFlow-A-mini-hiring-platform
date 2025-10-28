import {Server} from "miragejs" 
import { db } from "../extendedDB/jobstore"
import JobRoutes from "./routes/jobRoutes";
import candidateRoutes from "./routes/candidateRoutes";

export async function JobServer(){
    return new Server({
        routes(){
            this.namespace='api'
            JobRoutes(this);
            candidateRoutes(this);
        }
    })
}