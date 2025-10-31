

export function NormalStage({stageName,date}){
   
    return(
        <div className="text-xl font-[600] border border-gray-300 rounded-md px-4 py-2 w-[100%] flex flex-col items-center gap-2 min-h-[280px] capitalize">
            {stageName}
            <div className="text-l font-[400] text-gray-500">
                {date}
            </div>
        </div>
    )
}