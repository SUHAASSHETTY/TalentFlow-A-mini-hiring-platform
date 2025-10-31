import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { NormalStage } from "../../components/candidates/normalStage";
import { DraggableProfile } from "../../components/candidates/draggableProfile";
import { DroppableStage } from "../../components/candidates/droppableStage";

export function CandidateTimeline() {
  const candidateId = useParams().id;
  const [hrs, setHrs] = useState([]);
  const [candidate, setCandidate] = useState({});
  const [currentCandidate, setCurrentCandidate] = useState({});
  const [previousCandidate, setPreviousCandidate] = useState({});
  const [notes, setNotes] = useState("");
  const [hrSuggestions, setHrSuggestions] = useState([]);
  const [hrShowSuggestions, setHrShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textAreaRef = useRef(null);
  const [edit, setEdit] = useState("view");
  const [waitingForUpdateSuccess, setWaitingForUpdateSuccess] = useState(false);

  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  function formatDate(date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  }

  function DragEng(event) {
    if (!event.over) return;

    console.log("drag event: ", event.over.id);
    setWaitingForUpdateSuccess(true);
    setPreviousCandidate(currentCandidate);

    setCurrentCandidate({
      ...currentCandidate,
      stage: event.over.id,
      timeline: {
        ...currentCandidate.timeline,
        [event.over.id]: formatDate(new Date()),
      },
    });

    if (stages.indexOf(event.over.id) > stages.indexOf(candidate.stage)) {
      axios
        .patch(`/api/candidates/${candidate.id}`, {
          stage: event.over.id,
          timeline: {
            ...candidate.timeline,
            [event.over.id]: formatDate(new Date()),
          },
        })
        .then((res) => {
          console.log("candidate stage updated successfully: ", res.data);
          setCandidate(res.data);
          setNotes(res.data.notes);
        })
        .catch((err) => {
          setCurrentCandidate(previousCandidate);
          console.log("error when updating candidate stage: ", err);
        })
        .finally(() => {
          setWaitingForUpdateSuccess(false);
        });
    }
  }

  function handleNotesSave() {
    setEdit("updating");
    axios
      .patch(`/api/candidates/${candidate.id}`, {
        notes: notes,
      })
      .then((res) => {
        console.log("notes updated successfully: ", res.data);
        setCandidate(res.data);
        setNotes(res.data.notes);
      })
      .catch((err) => {
        console.log("error when updating notes: ", err);
      })
      .finally(() => {
        setEdit("view");
      });
  }

  function handleNotesChange(e) {
    const text = e.target.value;
    const caret = e.target.selectionStart;
    setNotes(text);

    const match = text.slice(0, caret).match(/@(\w*)$/);

    if (match) {
      const query = match[1].toLowerCase();
      const filtered = hrs.filter((n) => n.name.toLowerCase().startsWith(query));
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

  useEffect(() => {
    axios
      .get("/api/hrs")
      .then((res) => {
        setHrs(res.data);
      })
      .catch((err) => {
        console.log("error when fetching hrs: ", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/api/candidates/${candidateId}`)
      .then((res) => {
        setCandidate(res.data);
        setNotes(res.data.notes);
        setCurrentCandidate(res.data);
      })
      .catch((err) => {
        console.log("error when getting candidate timeline data: ", err);
      });
  }, [candidateId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Candidate Timeline</h1>

        {/* Candidate Info + Notes */}
        <div className="flex flex-wrap justify-center gap-10 w-full mb-10">
          {/* Candidate Info Card */}
          <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 w-[350px]">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-800">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.email}</p>
              <p className="text-gray-600">{candidate.phone}</p>
              <div className="mt-2">
                <span className="font-medium text-gray-700">Stage: </span>
                <span className="capitalize bg-blue-100 text-blue-700 px-2 py-[2px] rounded-md text-sm">
                  {candidate.stage}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 w-[500px] relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
              {edit === "view" && (
                <img
                  src="/edit.png"
                  alt="edit"
                  width={25}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setEdit("edit")}
                />
              )}
            </div>

            {edit === "edit" || edit === "updating" ? (
              <div>
                <div className="relative">
                  <textarea
                    disabled={edit === "updating"}
                    className="w-full h-[160px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    value={notes}
                    onChange={handleNotesChange}
                    ref={textAreaRef}
                  ></textarea>

                  {/* HR mention suggestion dropdown */}
                  {hrShowSuggestions && (
                    <ul className="absolute top-[100%] left-0 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-10 max-h-[200px] overflow-y-auto">
                      {hrSuggestions.length > 0 ? (
                        hrSuggestions.map((hr) => (
                          <li
                            key={hr.id}
                            onClick={() => handleHrSelect(hr.name)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            {hr.name}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">No matches</li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md transition-all"
                    onClick={handleNotesSave}
                    disabled={edit === "updating"}
                  >
                    {edit === "updating" ? "Saving..." : "Save"}
                  </button>
                  {edit !== "updating" && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md transition-all"
                      onClick={() => {
                        setEdit("view");
                        setNotes(candidate.notes);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {candidate.notes || "No notes available."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <DndContext collisionDetection={closestCenter} onDragEnd={DragEng}>
        <div className="flex justify-around w-[95%]">
  {stages.map((stage, index) => {
    // assign different colors per stage
    const stageColors = {
      applied: "bg-blue-100 border-blue-300",
      screen: "bg-yellow-100 border-yellow-300",
      tech: "bg-green-100 border-green-300",
      offer: "bg-purple-100 border-purple-300",
      hired: "bg-teal-100 border-teal-300",
      rejected: "bg-red-100 border-red-300",
    };

    const colorClass = stageColors[stage];

    return (
      <div
        key={stage}
        className={`flex flex-col items-center w-[15%] p-3 rounded-xl border shadow-sm ${colorClass}`}
      >
        {index < stages.indexOf(currentCandidate.stage) ? (
            <NormalStage stageName={stage} date={candidate.timeline[stage] || "nil"} />
            ) : (
            <DroppableStage
                stageName={stage}
                currentStage={stage === currentCandidate.stage}
                date={candidate.timeline?.[stage]}
                disabled={waitingForUpdateSuccess}
            />
            )}
        </div>
        );
        })}
    </div>

      </DndContext>
    </div>
  );
}
