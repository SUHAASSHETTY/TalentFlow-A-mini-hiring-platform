import { useDroppable } from "@dnd-kit/core";
import { DraggableProfile } from "./draggableProfile";

export function DroppableStage({stageName,currentStage=false,date=null,disabled=false}){
    const {setNodeRef} = useDroppable({
        id: stageName,
    });
    return(
        <div className="text-xl font-[600] border border-gray-300 rounded-md px-4 py-2 w-[100%] flex flex-col items-center gap-2 min-h-[280px] capitalize">
            {stageName}
            <div ref={setNodeRef}>
                {
                    currentStage 
                    ?<>
                        {date}
                        <DraggableProfile disabled={disabled}/>
                    </>
                    :""
                }
            </div>
        </div>
    )
}