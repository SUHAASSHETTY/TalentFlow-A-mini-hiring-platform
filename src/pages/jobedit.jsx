import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

export function JobEdit(){
    
    const [jobName,setJobName] = useState('');
    const [companyName,setCompanyName] = useState('');
    const {id} = useParams();
    const jobid = id;
    console.log("jobid :", jobid);

    function handleClick(e){
        e.preventDefault();
        axios.patch(`/api/jobs/${jobid}`,{
            name:jobName,
            companyName,
        })
        .then((res)=>{
            console.log(res, "was successfully updated as a job")
        })
        .catch(err => {
            console.log(err, " error when trying to update job")
        })
    }

    useEffect(()=>{
        axios.get(`/api/job/${jobid}`)
        .then(res => {
            let job = res.data;
            setJobName(job?.name);
            setCompanyName(job?.companyName);
        })
    },[])

    return(
        <form onSubmit={(e) => (handleClick(e))}>
            <label>Company Title</label>
            <input type="text" value={companyName} onChange={(e)=> {setCompanyName(e.target.value)}}/>

            <label>Job Title</label>
            <input type="text" value={jobName} onChange={(e)=> {setJobName(e.target.value)}}/>

            <button>
                Confirm
            </button>
        </form >
    )
}