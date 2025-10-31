import axios from "axios";
import { List } from "react-window";
import { useEffect, useState } from "react";
import { CandidateRow } from "../../components/candidates/candidateRow";

export function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [stage, setStage] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");

  const possibleStage = ["applied", "screen", "tech", "offer", "hired", "rejected"];

  function handleStageCancel(selectedStage) {
    setStage(stage.filter((s) => s !== selectedStage));
  }

  function handleStageClick(eachStage) {
    if (stage.includes(eachStage)) {
      setStage(stage.filter((s) => s !== eachStage));
    } else {
      setStage([...stage, eachStage]);
    }
  }

  function searchOptionsandAppliedSearch(searchOptionList, appliedSearch) {
    setSearchOptions(searchOptionList);
    setAppliedSearchQuery(appliedSearch);
  }

  function matchingCandidates(candidatesList, searchString) {
    const matchingIds = new Set();
    const matches = [];

    candidatesList.forEach((candidate) => {
      if (
        candidate.name.toLowerCase().startsWith(searchString.toLowerCase()) ||
        candidate.email.toLowerCase().startsWith(searchString.toLowerCase())
      ) {
        if (!matchingIds.has(candidate.id)) matches.push(candidate);
        matchingIds.add(candidate.id);
      }
    });

    candidatesList.forEach((candidate) => {
      if (
        (candidate.name.toLowerCase().includes(searchString.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchString.toLowerCase())) &&
        !matchingIds.has(candidate.id)
      ) {
        matches.push(candidate);
        matchingIds.add(candidate.id);
      }
    });

    return matches;
  }

  useEffect(() => {
    let debounceTimeout;
    if (searchQuery === "") {
      searchOptionsandAppliedSearch([], "");
      return;
    } else {
      debounceTimeout = setTimeout(() => {
        searchOptionsandAppliedSearch(matchingCandidates(candidates, searchQuery), searchQuery);
      }, 800);
    }
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery === "") {
      searchOptionsandAppliedSearch([], "");
      return;
    } else {
      searchOptionsandAppliedSearch(matchingCandidates(candidates, searchQuery), searchQuery);
    }
  }, [candidates]);

  useEffect(() => {
    axios
      .get("/api/candidates", {
        params: {
          stage: stage,
        },
      })
      .then((res) => {
        console.log("Fetched candidates", res.data);
        setCandidates(res.data);
      })
      .catch((err) => {
        console.log("Error fetching candidates", err);
      });
  }, [stage]);

  return (
    <div className="flex gap-6 py-8 px-10 bg-gray-50 min-h-screen">
      {/* Sidebar - Stage Filters */}
      <div className="flex flex-col items-center w-[22%] bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter by Stage</h2>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {stage.length > 0 ? (
            stage.map((selectedStage) => (
              <div
                key={selectedStage}
                className="bg-blue-500 pl-3 pr-2 py-[2px] text-white rounded-xl flex gap-2 items-center"
              >
                <p className="capitalize">{selectedStage}</p>
                <button onClick={() => handleStageCancel(selectedStage)}>
                  <img src="/close.png" alt="remove" width={30} height={30} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No stage selected</p>
          )}
        </div>

        {/* Stage Checkboxes */}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          {possibleStage.map((eachStage) => (
            <label
              key={eachStage}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={stage.includes(eachStage)}
                onChange={() => handleStageClick(eachStage)}
                className="accent-blue-500"
              />
              <span className="capitalize">{eachStage}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center w-[78%]">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Candidates</h1>

        {/* Search Bar */}
        <div className="w-[70%] mb-10">
          <div className="relative">
            <input
              type="text"
              id="candidateSearchbar"
              className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-2 focus:outline-none focus:border-blue-500 shadow-sm"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img
              src="/searchicon.png"
              alt="search"
              width={22}
              className="absolute right-4 top-2.5 opacity-70"
            />
          </div>
          <div className="text-center text-sm text-gray-500 mt-1">
            {searchQuery
              ? searchOptions.length === 0
                ? "No matching candidates"
                : `${searchOptions.length} matching candidates`
              : `${candidates.length} matching candidates`}
          </div>
        </div>

        {/* Candidate List */}
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
          {searchOptions.length === 0 && appliedSearchQuery !== "" ? (
            <div className="text-center text-gray-500 py-4">Try searching for something else</div>
          ) : (
            <List
              rowComponent={CandidateRow}
              rowCount={appliedSearchQuery === "" ? candidates.length : searchOptions.length}
              rowHeight={70}
              rowProps={
                appliedSearchQuery === ""
                  ? { candidates }
                  : { candidates: searchOptions }
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
