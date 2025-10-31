import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities";

export function DraggableProfile({disabled=false}){
    let {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: 'draggable-profile',
        disabled: disabled
    });
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    return(
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="text-xl font-[600] border rounded-[20%] px-4 py-2 w-[100%] flex flex-col items-center gap-2 capitalize mt-10">
            <img src="/profile.jpg" width={40} className="rounded-full"/>
        </div>
    )
}