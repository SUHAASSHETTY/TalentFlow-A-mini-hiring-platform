import axios from "axios"
import {List} from "react-window"
import { useEffect, useState } from "react"
import { CandidateRow } from "../../components/candidateRow";

export function Candidates(){
    const [candidates, setCandidates] = useState([]);
    const [stage,setStage] = useState([]);
    const [searchOptions,setSearchOptions] = useState([]);
    const [searchQuery,setSearchQuery] = useState("");
    const [appliedSearchQuery,setAppliedSearchQuery] = useState("");
    

    let possibleStage = ["applied","screen","tech","offer","hired","rejected"];


    function handleStageCancel(selectedStage){
        setStage(stage.filter(s => s !== selectedStage))
    }

    function handleStageClick(eachStage){
        if(stage.includes(eachStage)){
            setStage(stage.filter(s => s !== eachStage))
        }else{
            setStage([...stage,eachStage])
        }
    }   

    function searchOptionsandAppliedSearch(searchOptionList,appliedSearch){
        setSearchOptions(searchOptionList);
        setAppliedSearchQuery(appliedSearch);
    }
    
    function matchingCandidates(candidatesList,searchString){
        let matchingIds = new Set();
        let matches = [];

        candidatesList.forEach(candidate => {
            if(candidate.name.toLowerCase().startsWith(searchString.toLowerCase()) || candidate.email.toLowerCase().startsWith(searchString.toLowerCase())){
                if(!matchingIds.has(candidate.id)){
                    matches.push(candidate);
                }
                matchingIds.add(candidate.id);
            }
        })

        candidatesList.forEach(candidate => {
            if((candidate.name.toLowerCase().includes(searchString.toLowerCase()) || candidate.email.toLowerCase().includes(searchString.toLowerCase())) && !matchingIds.has(candidate.id)){
                if(!matchingIds.has(candidate.id)){
                    matches.push(candidate);
                }
                matchingIds.add(candidate.id);
            }
        });
         
        return matches;
    }

    useEffect(()=>{
        let debounceTimeout;
        if(searchQuery==""){
            searchOptionsandAppliedSearch([], "");
            return;
        }else{
            debounceTimeout = setTimeout(()=>{
                searchOptionsandAppliedSearch(matchingCandidates(candidates,searchQuery),searchQuery)
            },2000)
        }
        return ()=>{
            clearTimeout(debounceTimeout);
        }
    },[searchQuery])

    useEffect(()=>{
        if(searchQuery==""){
            searchOptionsandAppliedSearch([], "");
            return;
        }else{
            searchOptionsandAppliedSearch(matchingCandidates(candidates,searchQuery),searchQuery);
        }
    },[candidates])

    useEffect(()=>{
        axios.get('/api/candidates',{
            params:{
                'stage':stage,
            }
        })
        .then(res => {
            console.log("fetched candidates ", res.data)
            setCandidates(res.data)
        })
        .catch(err => {
            console.log("error when fetching candidates ", err)
        })
    },[stage])
    
    

    return(
        <div className="flex items-center py-5">

            <div className="flex flex-col items-center gap-1 w-[20%] self-start">
                <p >Stage</p>
                <div className="flex flex-wrap gap-1">
                    {stage.map(selectedStage => {
                        return(
                            <div className="bg-blue-400 pl-3 pr-1 py-[1px] text-white rounded-xl flex gap-2 items-center">
                                <p>{selectedStage}</p>
                                <button onClick={()=>{handleStageCancel(selectedStage)}}><img src="/close.png" width={30} height={10} /></button>
                            </div>
                        )
                    })}
                </div>

                <div className="flex gap-2 flex-wrap items-center justify-center w-[100%]">
                    {
                        possibleStage.map(eachStage => {
                            return(
                                <div className="flex gap-2">
                                    <label htmlFor="">{eachStage}</label>
                                    <input type="checkbox" checked={stage.includes(eachStage)} onChange={(e)=>{handleStageClick(eachStage)}} className="border"/>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>

            <div className="w-[80%] flex flex-col items-center gap-14">

                <div className="w-[100%] flex flex-col items-center gap-4">
                    <h1 className="text-center text-2xl font-bold mb-4">Candidates</h1>
                    
                    <div className="flex items-center gap-2 w-[100%] self-center justify-center">
                        <label htmlFor="candidateSearchbar">Search:</label>

                        <div className="w-[40%] relative">

                            <div className="w-[100%] bg-[rgb(233,240,242)] flex justify-between items-center rounded-xl border relative">
                                
                                <input type="text" id="candidateSearchbar" className="w-full rounded-xl px-4 py-2" value={searchQuery} onChange={(e)=>{setSearchQuery(e.target.value)}}/>
                                
                                <img src="/searchicon.png" alt="" width={20} className="absolute right-5 z-2"/>
                            </div>

                            <div className="absolute bg-white text-center border w-[100%] rounded-md">
                                {searchOptions.length==0
                                ?"No matching candidates"
                                :`${searchOptions.length} matching candidates`}
                            </div>
                
                        </div>
                    </div>
                </div>
                
                {
                    searchOptions.length==0 && appliedSearchQuery!=""
                    ?<div>Try searching for something else</div>
                    :<div className="w-[100%] max-w-3xl border rounded-lg shadow-sm p-2">
                        {console.log("rendering list with ", appliedSearchQuery)}
                        <List
                            rowComponent={CandidateRow}
                            rowCount={appliedSearchQuery==""? candidates.length : searchOptions.length }
                            rowHeight={65}
                            rowProps={appliedSearchQuery==""?{ candidates }:{ candidates: searchOptions }}
                            />
                    </div>
                }
            </div>
        </div>
    )
}