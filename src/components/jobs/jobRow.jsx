import { Link } from "react-router-dom"
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';


export function JobRow({job,handleStatusClickFunction}){
    const {attributes,listeners,setNodeRef,transform,transition,isDragging} = useSortable({id:job.jobid});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging?0.4:1,
    };
    return(
        <li className="flex justify-between w-[80%] border border-gray-300 rounded-xl px-4 py-2" ref={setNodeRef} style={style} {...attributes} {...listeners}>

            <div className="flex flex-col justify-between">
                <div className="font-600 text-xl">
                    {job.title}
                </div>
                <div>
                    {job.tags.join(', ')}
                </div>
            </div>

            <div className="self-end flex w-[20%] items-center justify-around">
                <Link to={`/editjob/${job.jobid}`} className="flex flex-col items-center">
                    <div>
                        Edit
                    </div>
                    <div>
                        <img src="/edit.png" alt="" width={30}/>
                    </div>
                </Link>
                <button 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={()=>{
                    handleStatusClickFunction(job.jobid,job.status);
                    console.log("fuafab")
                }} className="flex flex-col items-center">
                    <div>
                        {job.status=='archived'?'Unarchive':'Archive'}
                    </div>
                    <div>
                        {
                            job.status=='archived'
                            ?<img src="/unarchive.png" alt="" width={35}/>
                            :<img src="/archive.png" alt="" width={38}/>
                        }
                    </div>
                </button>
            </div>

        </li>
    )
}