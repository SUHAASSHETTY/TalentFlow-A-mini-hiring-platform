import { useEffect, useState } from "react";
import { useRole } from "../context/useRole"
import axios from 'axios'
import { Link } from "react-router-dom";

export function Jobs(){
    const {role,setRole} = useRole();
    const [jobs,setJobs] = useState([]);

    const [activeJobs,setActiveJobs] = useState(true);

    function handleStatusClick(jobid,status){
        let newStatus = '';
        if(status=='archived'){
            newStatus='active'
        }else if(status=='active'){
            newStatus='archived'
        }
        
        axios.patch(`/api/jobs/${jobid}`,{
            'status':newStatus
        })
        .then(res => {
            console.log(res.data," job's status was successfully updated");
            setJobs(jobs.map(job => {
                if(job['jobid']==jobid){
                    let newJob = {...job}
                    newJob['status']=newStatus;
                    return newJob;
                }else{
                    return job;
                }
            }))
        })
        .catch(err => {
            console.log("error when trying to update status of job", err)
        })
    }


    useEffect(()=>{
        axios.get('api/jobs',{
            params:{
                'status':activeJobs?'active':'archived'
            }
        })
        .then((res)=>{
            console.log("Jobs: ",res.data);
            setJobs(res.data);
        })
        .catch(err => {console.log("error when trying to get data: ", err)})
    },[])

    return(
        <div className="flex flex-col items-center justify-center">
            <h1>Jobs</h1>
            {
                role=='recruiter'
                ?<div>
                    <Link to={'/jobadd'}>
                        Create Job
                    </Link>
                </div>
                :<></>    
            }
            <div className="flex items-center gap-2">
                <label htmlFor="">Active</label>
                <input type="checkbox" checked={activeJobs} onChange={(e)=>{setActiveJobs(e.target.checked)}}/>
            </div>
            <ul>
                {jobs.map(job => {
                    // console.log(job);
                    return(
                        <div key={job.title} className="flex gap-5">
                            <li className="flex gap-3 items-center justify-center">
                                <p>{job.title}</p>
                                <div>{job.tags.join(', ')}</div>
                                <button onClick={()=>{handleStatusClick(job.jobid,job.status)}}>{job.status=='archived'?'Unarchive':'Archive'}</button>
                            </li>     
                            <Link to={`/editjob/${job.jobid}`}>Edit</Link>
                        </div>
                    )
                })}
            </ul>

        </div>
    )
}
