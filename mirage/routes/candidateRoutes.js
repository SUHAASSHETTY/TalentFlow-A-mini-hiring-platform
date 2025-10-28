import { db } from "../../extendedDB/jobstore";

export default function candidateRoutes(server){

    server.get('/candidates',async (schema,request)=>{
        let {stage} = request.queryParams;
        try{
            let candidates;
            console.log("status filter: ",stage,request.queryParams)
            if(!stage||stage.length==0){
                candidates = await db.candidates.toArray();
            }else{
                candidates = await db.candidates.where('stage').anyOf(stage).toArray();
                console.log("filtered candidates: ",candidates)
            }

            return candidates;

        }catch(err){
            console.log("error when getting candidates: ",err)
        }
    })

    server.get('/candidates/:id',async (schema,request)=>{
        let {id} = request.params;
        try{
            let candidate = await db.candidates.get(Number(id));
            return candidate;
        }catch(err){
            console.log("error when getting candidate : ",err)
        }
    })

    server.patch('/candidates/:id',async (schema,request)=>{
        let {id} = request.params;
        let attrs = JSON.parse(request.requestBody);
        try{
            await db.candidates.update(Number(id),attrs);
            let updatedCandidate = await db.candidates.get(Number(id));
            return updatedCandidate;
        }catch(err){
            console.log("error when updating candidate: ",err)
        }
    },{timing:4000})

    server.get('/hrs',async (schema,request)=>{
        try{
            let hrs = await db.hrs.toArray();
            return hrs;
        }catch(err){
            console.log("error when getting hrs: ",err)
        }
    })
}