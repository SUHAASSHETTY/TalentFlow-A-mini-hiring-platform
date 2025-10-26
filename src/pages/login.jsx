import { Link } from "react-router-dom";
import { useRole } from "../context/useRole";

export function Login(){
    let {role,setRole} = useRole();
    return(
        <div className="flex flex-col gap-10 pt-10">
            <h1 className="text-4xl font-[700] text-center">
                Talent Flow
            </h1>
            <div className="flex flex-col gap-4 items-center">
                <Link className="border w-fit rounded-xl px-3 py-1" to={'/jobs'} onClick={()=>{setRole('jobseeker')}}>
                    Employee / Job Seeker 
                </Link>
                <Link className="border w-fit rounded-xl px-3 py-1" to={'/jobs'} onClick={()=>{setRole('recruiter')}}>
                    Employer / Recruiter
                </Link>
            </div>
        </div>
    )
}