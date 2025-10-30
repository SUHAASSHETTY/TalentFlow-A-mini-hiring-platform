import { useEffect, useRef, useState } from "react";
import { useRole } from "../../context/useRole"
import axios from 'axios'
import { Link } from "react-router-dom";
// import { JobSort } from "../../components/jobs/jobSort";
import {
  DndContext,closestCenter,KeyboardSensor,PointerSensor,useSensor,useSensors,
  TouchSensor} from '@dnd-kit/core';
import {SortableContext,arrayMove,verticalListSortingStrategy,sortableKeyboardCoordinates} from '@dnd-kit/sortable'
import { JobRow } from '../../components/jobs/jobRow.jsx'

let reorderId = 0;
export function Jobs(){
    const {role,setRole} = useRole();
    const [jobs,setJobs] = useState([]);
    const [sort,setSort] = useState('asc');
    const [activeJobs,setActiveJobs] = useState(true);
    const [archivedJobs,setArchivedJobs] = useState(true);
    const [maxPageNumber,setMaxPageNumber] = useState(4);
    const [pageSize,setPageSize] = useState(10);
    const [pageNumber,setPageNumber] = useState(1);
    const [tags,setTags] = useState([]);
    const waitingReorders = useRef([]);
    const pendingReorders = useRef([]);
    const previousJobs = useRef([]);
    const backendSyncJobs = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor),
        useSensor(TouchSensor),
    );

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
        console.log("handle status click",jobid,status)
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
        console.log("clicked on",tag)
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

    function proceedReorder(op){

        pendingReorders.current.push(op);
        axios.patch(`/api/jobs/${op.jobid}/reorder`,{
            'fromOrder':op.from+1,
            'toOrder':op.to+1,
        })
        .then(res => {
            console.log("successfully reordering:",op.reorderId)
            previousJobs.current = op.proposed;

            // call the next element in waiting array
            if(waitingReorders.current.length){
                let nextOp = waitingReorders.current.shift();
                console.log("calling a next reorder from WAITING REORDERS after successful finish:",nextOp);
                pendingReorders.current = pendingReorders.current.filter(pendingop => pendingop.reorderId!=op.reorderId);
                proceedReorder(nextOp);
            }else{
                //remove the completed one from pendingReorders and update the backendSyncJobs
                pendingReorders.current = pendingReorders.current.filter(pendingop => pendingop.reorderId!=op.reorderId);
            }

        })
        .catch(err => {
            alert("error when updating op");
            console.log("error when trying to reorder jobs", err,op.previous);
            previousJobs.current = [];
            setJobs(op.previous);

            // remove the op from pendingReorders
            pendingReorders.current = pendingReorders.current.filter(pendingop => pendingop.reorderId!=op.reorderId);

            //remove the waitingReorders which directly or indirectly overlap with this
            waitingReorders.current = [];

            // rollback to previous state
        })
    }

    function jobsCopier(){
        let copy = [];
        jobs.forEach(job => {
            copy.push(structuredClone(job));
        });
        return copy;
    }

    function handleDragEnd(event) {       
        
        const { active, over } = event;
        
        if(!event.over||active.id==over.id) return;
        
        console.log("drag end event:", event.active.id, event.over.id);
        
        let oldIndex;
        let newIndex;
        if(previousJobs.current.length==0){
            console.log("previousJobs is still empty")
            oldIndex = jobs.findIndex((job) => job.jobid === active.id);
            newIndex = jobs.findIndex((job) => job.jobid === over.id);
        }else{
            console.log("previousJobs is not empty")
            oldIndex = previousJobs.current.findIndex((job) => job.jobid === active.id);
            newIndex = previousJobs.current.findIndex((job) => job.jobid === over.id);
        }
        
        // console.log("moved_array ",arrayMove(jobs, oldIndex, newIndex));
        console.log("oldIndex: ",oldIndex," newIndex:",newIndex);

        let updatedJobs;
        let jobsCopy = jobsCopier();
        setJobs((prevJobs) => {
            updatedJobs = arrayMove(prevJobs, oldIndex, newIndex);
            return updatedJobs;
        });
        
        console.log("event sort : old and new job ,",jobs[oldIndex].title,jobs[newIndex].title);

        let op = {
            'reorderId':reorderId++,
            'jobid':active.id,
            'from':oldIndex,
            'to':newIndex,
            'previous':previousJobs.current.length?previousJobs.current:jobsCopy,
            'proposed':updatedJobs,
        }

        // check the pendingReorders
        if(pendingReorders.current.length>0){
            console.log("pendingOrders is not empty and adding op to waiting order",op.reorderId)            
            waitingReorders.current.push(op);
        }else{    
            console.log("empty pending array and proceeding to call")     //empty pendingArray 
            // call the api 
            proceedReorder(op);
        }

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
                                <div className="bg-blue-400 pl-3 pr-1 py-[1px] text-white rounded-xl flex gap-2 items-center" key={selectedTag}>
                                    <p>{selectedTag}</p>
                                    <button onClick={()=>{handleTagCancel(selectedTag)}}><img src="/close.png" width={30} height={10} /></button>
                                </div>
                            )
                        })}
                    </div>
                        

                    

                    <select onChange={(e)=>{
                        handleTagClick(e.target.value)
                    }}>
                        <option value="select tags">--Select tags--</option>
                        {
                            allTags.filter(tag => !tags.includes(tag)).map(tag => {
                                return(
                                    <option className="flex gap-2" key={tag}>
                                        {tag}
                                    </option>
                                )
                            }
                        )}
                    </select>

                    

                    <div className="flex gap-2 flex-wrap items-center justify-center w-[100%]">
                        
                    </div>
                </div>


            </div>
        
            <div className="flex flex-col items-center justify-center self-start w-[80%] mb-20">
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

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                
                    <SortableContext items={jobs.map(job => job.jobid)} strategy={verticalListSortingStrategy}>   
                        <ul className="flex flex-col gap-7 border p-5 w-[80%] rounded-xl my-6 items-center">
                            {
                                jobs.length
                                ?jobs.map(job => {
                                    return(
                                        <JobRow key={job.jobid} job={job} handleStatusClickFunction={handleStatusClick}/>
                                    )
                                })
                                :<div>
                                    No jobs with given filters exist.Try changing the filters to view jobs.
                                </div>
                            }
                        </ul>
                    </SortableContext>
        
                </DndContext>

                
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
