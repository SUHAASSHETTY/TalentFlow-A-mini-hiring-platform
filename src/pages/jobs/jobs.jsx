import { useEffect, useState } from "react";
import { useRole } from "../../context/useRole"
import axios from 'axios'
import { Link } from "react-router-dom";

export function Jobs(){
    const {role,setRole} = useRole();
    const [jobs,setJobs] = useState([]);

    const [sort,setSort] = useState('asc');
    const [activeJobs,setActiveJobs] = useState(true);
    const [archivedJobs,setArchivedJobs] = useState(false);
    const [maxPageNumber,setMaxPageNumber] = useState(4);
    const [pageSize,setPageSize] = useState(10);
    const [pageNumber,setPageNumber] = useState(1);
    const [tags,setTags] = useState([]);

    let pageNumbers = [];
    for(let i=1;i<=maxPageNumber;i++){pageNumbers.push(i)}

    const allTags = ['React', 'JavaScript', 'UI', 'CSS', 'Node.js', 'API', 'Databases', 'Go', 'SQL', 'Python', 'Visualization', 'Excel', 'TensorFlow', 'AI', 'Data', 'MongoDB', 'AWS', 'Kubernetes', 'DevOps', 'Networking', 'Docker', 'CI/CD', 'Linux', 'HTML', 'Teamwork', 'Testing', 'Automation', 'Selenium', 'Agile', 'Roadmap', 'Leadership', 'Communication', 'ETL', 'Pipelines', 'Figma', 'Prototyping', 'Accessibility', 'React Native', 'Android', 'iOS', 'Security', 'Monitoring', 'Network', 'Threat Detection', 'TypeScript', 'Performance', 'PostgreSQL', 'Microservices', 'Architecture', 'Scalability', 'Deep Learning', 'Research', 'Routers', 'TCP/IP', 'Terraform', 'MySQL', 'Backup', 'Documentation', 'Writing', 'Editing', 'Unity', 'C#', '3D', 'Graphics', 'Customer Support', 'Troubleshooting', 'ML', 'Statistics', 'Planning', 'Solidity', 'Ethereum', 'Smart Contracts', 'Web3', 'C++', 'IoT', 'Microcontrollers', 'Hardware', 'Cloud', 'Pandas', 'Support'];

    function archiveStateConsistency(jobid,newStatus){
        if(activeJobs&&archivedJobs){
            setJobs(jobs.map(job => {
                if(job['jobid']==jobid){
                    let newJob = {...job}
                    newJob['status']=newStatus;
                    return newJob;
                }else{
                    return job;
                }
            }))
        }else if(activeJobs){
            setJobs(jobs.filter(job=>job['jobid']!=jobid));
        }else if(archivedJobs){
            setJobs(jobs.filter(job=>job['jobid']!=jobid));
        }
    }

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
            archiveStateConsistency(jobid,newStatus);
        })
        .catch(err => {
            console.log("error when trying to update status of job", err)
        })
    }

    function handlePageNumber(pageNumber){
        setPageNumber(pageNumber);
    }

    function handleTagClick(tag){
        if(tags.includes(tag)){
            setTags(tags.filter(eachtag => eachtag!=tag))
        }else{
            console.log(Array.from(new Set([...tags,tag])))
            setTags(Array.from(new Set([...tags,tag])));
        }
    }

    function handleTagCancel(selectedTag){
        setTags(tags.filter(tag=>tag!=selectedTag))
    }

    function statusArray(){
        let statusArray = [];
        if(activeJobs){
            statusArray.push('active')
        }
        if(archivedJobs){
            statusArray.push('archived')
        }
        return statusArray;
    }

    useEffect(()=>{
        axios.get('api/jobs',{
            params:{
                'status':statusArray(),
                'tags':tags,
                'sort':sort,
                'pageNumber':pageNumber,
                'pageSize':pageSize,
            }
        })
        .then((res)=>{
            console.log("Jobs: ",res.data);
            if(pageNumber>res.data.maxPageNumber){
                setPageNumber(res.data.maxPageNumber);
            }
            setMaxPageNumber(res.data.maxPageNumber);
            setJobs(res.data.records);
        })
        .catch(err => {console.log("error when trying to get data: ", err)})
    },[activeJobs,archivedJobs,tags,pageNumber,pageSize,sort])

    return(
        <div className="flex justify-center ">

            <div className="w-[20%] flex flex-col gap-[10px]">

                <div className="flex flex-col items-center gap-1">
                    <label htmlFor="ordersort">Sort</label>
                    <select id="ordersort" value={sort} onChange={(e)=>{setSort(e.target.value)}}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <h3>Status</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <label htmlFor="">Active</label>
                            <input type="checkbox" checked={activeJobs} onChange={(e)=>{
                                setActiveJobs(e.target.checked)}}/>
                        </div>
                        <div className="flex items-center gap-1">
                            <label htmlFor="">Archived</label>
                            <input type="checkbox" checked={archivedJobs} onChange={(e)=>{setArchivedJobs(e.target.checked)}}/>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                    <p >Tags</p>
                    <div className="flex flex-wrap gap-1">
                        {tags.map(selectedTag => {
                            return(
                                <div className="bg-blue-400 pl-3 pr-1 py-[1px] text-white rounded-xl flex gap-2 items-center">
                                    <p>{selectedTag}</p>
                                    <button onClick={()=>{handleTagCancel(selectedTag)}}><img src="/close.png" width={30} height={10} /></button>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex gap-2 flex-wrap items-center justify-center w-[100%]">
                        {
                            allTags.map(tag => {
                                return(
                                    <div className="flex gap-2">
                                        <label htmlFor="">{tag}</label>
                                        <input type="checkbox" checked={tags.includes(tag)} onChange={(e)=>{handleTagClick(tag)}} className="border"/>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
            
                


            </div>
        
            <div className="flex flex-col items-center justify-center self-start w-[80%]">
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
                <div className="flex gap-1">
                    <label htmlFor="pageSize">PageSize:</label>
                    <input type="number" min={1} className="border w-[45px] pl-2 rounded-[5px]" id="pageSize" value={pageSize} onChange={(e)=>{setPageSize(e.target.value)}}/>
                </div>


                <ul>
                    {jobs.length
                    ?jobs.map(job => {
                        // console.log(job);
                        return(
                            <div key={job.jobid} className="flex gap-5">
                                <li className="flex gap-3 items-center justify-center">
                                    <p>{job.title}</p>
                                    <div>{job.tags.join(', ')}</div>
                                    <button onClick={()=>{handleStatusClick(job.jobid,job.status)}}>{job.status=='archived'?'Unarchive':'Archive'}</button>
                                </li>     
                                <Link to={`/editjob/${job.jobid}`}>Edit</Link>
                            </div>
                        )
                    })
                    :<div>
                        No jobs with given filters exist.Try changing the filters to view jobs.
                    </div>
                    }
                </ul>

                <div className="flex gap-2">
                    {
                        pageNumbers.map(pgNo=>{
                            return(
                                <button onClick={()=>{handlePageNumber(pgNo)}} className={`border px-[8px] py-[1px] rounded-[10px] ${pageNumber==pgNo?'bg-blue-400 text-white':''}`}>
                                    {pgNo}
                                </button>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}
