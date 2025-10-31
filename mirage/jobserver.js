import {Server} from "miragejs" 
import { db } from "../extendedDB/jobstore"
import JobRoutes from "./routes/jobRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";

export async function JobServer(){
    return new Server({
        routes(){
            this.namespace='api'
            JobRoutes(this);
            candidateRoutes(this);
            assessmentRoutes(this);
        }
    })
}