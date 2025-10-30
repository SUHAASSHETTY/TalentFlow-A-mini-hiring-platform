import { Link } from "react-router-dom";

export const CandidateRow = ({ index, candidates, style }) => (
    <Link to={`/candidates/${candidates[index].id}`} key={candidates[index].id}>
        <div style={style} className="flex flex-col gap-1 px-4 py-2 hover:bg-gray-100 items-center ">
            <div className="flex justify-between w-[100%]">
                <div className="text-[18px] font-[500]">{candidates[index].name}</div>
                <div>Stage: <p className="inline capitalize">{candidates[index].stage}</p></div>
            </div>
            <div className="flex self-start gap-2">
                <div>{candidates[index].email}</div>
                <div className="text-[14px] font-[500]">{candidates[index].phone}</div>
            </div>
        </div>
    </Link>
);
