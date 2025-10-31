import { Response } from "miragejs";
import { db } from "../../extendedDB/jobstore";

function paginationIndex(pageSize,pageNumber){
    if(pageNumber==1){
        return [0,pageSize];
    }else{
        return [pageSize*(pageNumber-1)-1,pageSize*(pageNumber)];
    }
}

export default function JobRoutes(server){

    server.get('/job/:id',async (schema,request)=>{
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

    server.get('/jobs',async (schema,request)=>{
        const {status:statusArray,tags:tagsArray,title,pageSize,pageNumber,sort} = request.queryParams
        try{
            let jobs;
            if(tagsArray && tagsArray.length){
                let jobsRaw=await db.jobs.where('tags').anyOf(tagsArray).toArray();
                // console.log("before set:",jobsRaw);
                jobs = Array.from(new Map(jobsRaw.map(job => [job.jobid, job])).values()); //dexie gives duplicate records if the records matches more than one condition
                jobs.filter(job => statusArray.includes(job.status))
                // console.log("after set:",jobs)
            }else{
                jobs = await db.jobs.where('status').anyOf(statusArray).toArray();
            }

            console.log("title at backend:",title);
            if(title.length){
                jobs = jobs.filter(job => title.includes(job.title))
            }

            //sort 
            if(sort=='asc'){
                jobs.sort((a,b)=>a.order-b.order);
            }else if(sort=='desc'){
                jobs.sort((a,b)=>b.order-a.order);
            }

            let response = {
                'maxPageNumber':Math.ceil(jobs.length/pageSize)
            }

            //pagination
            console.log(jobs.length,pageSize,jobs.length/pageSize)
            if(pageNumber>Math.ceil(jobs.length/pageSize)){
                console.log("trying to get a page whose pageNumber doesn't exist for query")
                response['records'] = [];
            }else{
                console.log('jobs in mirage',jobs)
                let [startIndex,endIndex] = paginationIndex(pageSize,pageNumber)
                response['records'] = jobs.slice(startIndex,endIndex);
            }
            console.log('jobs in backend:',jobs)
            return response;
            
        }catch(err){
            console.log("error when trying to get all jobs: ",err)
        }          
    })

    server.post('/jobadd', async(schema,request)=>{
        let newJob = JSON.parse(request.requestBody);
        let allslugs = await db.jobs.toArray();
        allslugs=allslugs.map(job => job.slug);
        if(allslugs.includes(newJob.slug)){
            return new Response(400,{},{ error: "slug already exists for another job.change the slug" })
        }
        db.jobs.add(newJob);
        return newJob;
        
    })

    server.patch('/jobs/:id',async(schema,request)=>{
        let updateJobId = Number(request.params.id);
        let updatedJob = JSON.parse(request.requestBody);

        let allslugs = await db.jobs.toArray();
        allslugs=allslugs.map(job => job.slug);
        if(allslugs.includes(updatedJob?.slug)){
            return new Response(400,{},{ error: "slug already exists for another job.change the slug" })
        }
        // console.log("updatedJob: ",updatedJob);
        delete updateJobId['jobid'];
        
        let updatedDocs = await db.jobs.update(updateJobId,updatedJob);
        console.log("updated number of records: ",updatedDocs);
        updatedJob['jobid']=updateJobId;
        return updatedJob
    })

    server.patch("/jobs/:id/reorder", async(schema, request) => {
    if (Math.random() < 0.05){
        return new Response(500, {}, { error: "Reorder failed" });
    }
        const id = Number(request.params.id);
        let { fromOrder, toOrder } = JSON.parse(request.requestBody);
        // const movedJob = await db.jobs.get(id);
        const normaljobs = await db.jobs.orderBy('order').toArray();
        const allJobs = await db.jobs.orderBy('order').toArray();

        
        console.log("normal sorted jobs:",normaljobs);
        let [movedJob] = allJobs.splice(fromOrder-1, 1);
        // console.log("alljobs after removing one item:",allJobs)
        if(toOrder>fromOrder){
            allJobs.splice(toOrder-1,0,movedJob)
        }else{
            allJobs.splice(toOrder-1,0,movedJob)
        }  
        console.log("alljobs before:",allJobs)
        
        for(let i=0;i<allJobs.length;i++){
            try{
                await db.jobs.update(Number(allJobs[i]['jobid']),{'order':i+1})
            }catch(err){
                console.log("error when updating",i,allJobs[i]['jobid'],Number(allJobs[i]['jobid']));
            }
        }

        const updatedJob = await db.jobs.get(id);
        return updatedJob;
    },{
        timing:100*(30+(Math.ceil(Math.random()*5)))
    });

}