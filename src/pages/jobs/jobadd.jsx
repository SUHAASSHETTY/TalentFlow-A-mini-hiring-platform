import axios from "axios";
import { useState } from "react"

export function JobAdd(){
    const [jobName,setJobName] = useState(jobName);
    const [companyName,setCompanyName] = useState(companyName);

    function handleClick(e){
        e.preventDefault();
        axios.post('api/jobadd',{
            name:jobName,
            companyName,
        })
        .then((res)=>{
            console.log(res, "was successfully added as a job")
        })
        .catch(err => {
            console.log(err, " error when trying to add job")
        })
    }

    return(
        <form onSubmit={(e) => (handleClick(e))}>
            <label>Company Title</label>
            <input type="text" value={companyName} onChange={(e)=> {setCompanyName(e.target.value)}}/>

            <label>Job Title</label>
            <input type="text" value={jobName} onChange={(e)=> {setJobName(e.target.value)}}/>

            <button>
                Submit
            </button>
        </form >
    )
}