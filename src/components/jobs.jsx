import { useRole } from "../context/useRole"

export function Jobs(){
    const {role,setRole} = useRole();
    
    return(
        <div>
            
            <h1>Jobs</h1>
            {
                role=='recruiter'
                ?<div>
                    <button>
                        Create Job
                    </button>
                </div>
                :<></>    
            }
            <ul>
                <li></li>
            </ul>

        </div>
    )
}