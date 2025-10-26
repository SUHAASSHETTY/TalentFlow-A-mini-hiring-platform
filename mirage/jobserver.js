import {Server} from "miragejs" 
import { db } from "../extendedDB/jobstore"

export async function JobServer(){

    return new Server({
        routes(){
            this.namespace='api'

            this.get('/job/:id',async (schema,request)=>{
                let jobid = Number(request.params.id);
                // console.log("job id recieved",jobid,request.params)
                try{
                    let job = await db.jobs.get(jobid);
                    console.log("job getted: ",job)
                    return job
                }catch(err){
                    console.log("error when trying to get a job: ",err)
                }
            })

            this.get('/jobs',async (schema,request)=>{
                let status = request.queryParams.status;
                try{
                    let jobs = await db.jobs.where('status').equals(status).toArray();
                    console.log('jobs in mirage',jobs)
                    return jobs;
                }catch(err){
                    console.log("error when trying to get all jobs: ",err)
                }          
            })

            this.post('/jobadd', async(schema,request)=>{
                let newJob = JSON.parse(request.requestBody);
                db.jobs.add(newJob);
                return newJob;
            })

            this.patch('/jobs/:id',async(schema,request)=>{
                let updateJobId = Number(request.params.id);
                let updatedJob = JSON.parse(request.requestBody);
                // console.log("updatedJob: ",updatedJob);
                delete updateJobId['jobid'];
                
                let updatedDocs = await db.jobs.update(updateJobId,updatedJob);
                console.log("updated number of records: ",updatedDocs);
                updatedJob['jobid']=updateJobId;
                return updatedJob
            })
        }
    })
}