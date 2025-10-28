import axios from "axios"
import { use, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { DndContext,closestCenter } from "@dnd-kit/core";
import { NormalStage } from "../../components/normalStage";
import { DraggableProfile } from "../../components/draggableProfile";
import { DroppableStage } from "../../components/droppableStage";

export function CandidateTimeline(){
    const candidateId = useParams().id;
    const [hrs,setHrs] = useState([]);
    const [candidate,setCandidate] = useState({});
    const [currentCandidate,setCurrentCandidate] = useState({});
    const [previousCandidate,setPreviousCandidate] = useState({});
    const [notes,setNotes] = useState("");
    const [hrSuggestions,setHrSuggestions] = useState([]);
    const [hrShowSuggestions,setHrShowSuggestions] = useState(false);
    const [cursorPosition,setCursorPosition] = useState(0);
    const textAreaRef = useRef(null);
    const [edit,setEdit] = useState('view');
    const [waitingForUpdateSuccess,setWaitingForUpdateSuccess] = useState(false);

    
    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

    function formatDate(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    };
    

    function DragEng(event){

        // optimistic rollback
        console.log("drag event: ",event.over.id);
        setWaitingForUpdateSuccess(true);
        setPreviousCandidate(currentCandidate);
        setCurrentCandidate({...currentCandidate,stage:event.over.id,timeline:{
            ...currentCandidate.timeline,
            [event.over.id]:formatDate(new Date())
        }});

        if(stages.indexOf(event.over.id)>stages.indexOf(candidate.stage)){
            axios.patch(`/api/candidates/${candidate.id}`,{
                'stage':event.over.id,
                'timeline':{
                    ...candidate.timeline,
                    [event.over.id]:formatDate(new Date())
                }
            }).then(res=>{
                console.log("candidate stage updated successfully: ",res.data);
                setCandidate(res.data);
                setNotes(res.data.notes);
                setWaitingForUpdateSuccess(false);
            }).catch(err=>{
                setCurrentCandidate(previousCandidate);
                console.log("error when updating candidate stage: ",err)
                setWaitingForUpdateSuccess(false);
            })
        }
    }

    function handleNotesSave(){
        setEdit('updating');
        axios.patch(`/api/candidates/${candidate.id}`,{
            'notes':notes
        }).finally(()=>{
            setEdit('view');
        }).then(res=>{
            console.log("notes updated successfully: ",res.data);
            setCandidate(res.data);
            setNotes(res.data.notes);
        }).catch(err=>{
            console.log("error when updating notes: ",err)
        })
    }

    function handleNotesChange(e){
        const text = e.target.value;
        const caret = e.target.selectionStart;
        setNotes(text);

        // find @ + text right before caret
        const match = text.slice(0, caret).match(/@(\w*)$/);

        if (match) {
            const query = match[1].toLowerCase();
            const filtered = hrs.filter((n) =>
                n.name.toLowerCase().startsWith(query)
            );
            setHrSuggestions(filtered);
            setHrShowSuggestions(true);
            setCursorPosition(caret);
        } else {
            setHrShowSuggestions(false);
        }
    }

    function handleHrSelect(name) {
        if (!cursorPosition) return;
        const text = notes;
        const before = text.slice(0, cursorPosition).replace(/@(\w*)$/, `@${name}`);
        const after = text.slice(cursorPosition);
        const newText = before + after;

        setNotes(newText);
        setHrShowSuggestions(false);
        textAreaRef.current.focus();
    }
    
    useEffect(()=>{
        axios.get('/api/hrs')
        .then(res => {
            setHrs(res.data);
            console.log("fetched hrs: ",res.data);
        }).catch(err => {
            console.log("error when fetching hrs: ",err)
        })
    },[])


    useEffect(()=>{
        axios.get(`/api/candidates/${candidateId}`).then(res=>{
            console.log("candidate timeline data: ",res.data);
            setCandidate(res.data);
            setNotes(res.data.notes);
            setCurrentCandidate(res.data);
        }).catch(err=>{
            console.log("error when getting candidate timeline data: ",err)
        })
    },[])

    return(
        <div>
            <div className="flex flex-col items-center">

                <h1>
                    Candidate Timeline 
                </h1>

                <div className="w-[80%] flex justify-center items-center gap-8 mt-4 mb-8">                
                    <div className="flex flex-col gap-2 px-4 py-2 items-center border border-gray-300 rounded-md mb-4 w-fit">
                        <div className="flex justify-between w-[100%]">
                            <div className="text-[18px] font-[500]">{candidate.name}</div>
                            <div>Stage: <p className="inline capitalize">{candidate.stage}</p></div>
                        </div>
                        <div className="flex self-start gap-2">
                            <div>{candidate.email}</div>
                            <div className="text-[14px] font-[500]">{candidate.phone}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-gray-300 rounded-md px-4 py-2">
                        <h3 className="font-[500]">Notes:</h3>
                        {
                            edit=='edit'||edit=='updating' 
                            ?<div>
                                <div className="relative">
                                    <textarea disabled={edit=='updating'} className="border p-2 rounded-md w-[400px] h-[150px]
                                    p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" value={notes} onChange={(e)=>{handleNotesChange(e)}} ref={textAreaRef}></textarea>
                                    {hrShowSuggestions && (
                                        <ul className="absolute top-[100%] left-3 bg-white border border-gray-200 rounded-lg shadow-lg w-56 z-10 max-h-[200px] overflow-y-scroll">
                                        {hrSuggestions.length > 0 ? (
                                            hrSuggestions.map((hr) => (
                                            <li
                                                key={hr.id}
                                                onClick={() => handleHrSelect(hr.name)}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                            >
                                                {hr.name}
                                            </li>
                                            ))
                                        ) : (
                                            <li className="px-3 py-2 text-gray-500">No matches</li>
                                        )}
                                        </ul>
                                    )}

                                </div>
                                <div className="flex justify-end gap-4 mt-2">

                                    <button className="border px-3 py-1 rounded-md bg-green-500 text-white" onClick={()=>{handleNotesSave()}} disabled={edit=='updating'}>{edit=='updating'?'saving...':'Save'}</button>
                                    {
                                        edit=='updating'
                                        ?<></>
                                        :<button className="border px-3 py-1 rounded-md bg-red-500 text-white" onClick={()=>{setEdit('view'); setNotes(candidate.notes)}}>Cancel</button>
                                    }
                                </div>
                                
                            </div>
                            :<div className="flex gap-4">
                                <div>
                                    {candidate.notes || "No notes available."}
                                </div>
                                <img src="/edit.png" alt="" width={25} className="hover:scale-[1.1] cursor-pointer"
                                onClick={()=>{setEdit('edit')}}/>    
                            </div>
                        }
                        
                    </div>
                </div>

            </div>

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={DragEng}
            >
                <div className="flex justify-around">
                {
                    stages.map((stage,index) => {
                        if(index<stages.indexOf(currentCandidate.stage)){
                            return(
                                <NormalStage stageName={stage} date={candidate.timeline[stage]||'nil'}/>
                            )
                        }else{
                            return(
                                <DroppableStage stageName={stage} currentStage={stage==currentCandidate.stage} date={candidate.timeline?.[stage]} disabled={waitingForUpdateSuccess}/>
                            )
                        } 
                    })
                }
                </div>
            </DndContext>
        </div>
    )
}