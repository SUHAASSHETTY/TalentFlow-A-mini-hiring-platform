import { useEffect, useRef, useState } from "react";
import { useRole } from "../../context/useRole"
import axios from 'axios'
import { Link } from "react-router-dom";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  TouchSensor
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { JobRow } from '../../components/jobs/jobRow.jsx'

let reorderId = 0;

export function Jobs() {
  const { role, setRole } = useRole();
  const [jobs, setJobs] = useState([]);
  const [sort, setSort] = useState('asc');
  const [activeJobs, setActiveJobs] = useState(true);
  const [archivedJobs, setArchivedJobs] = useState(true);
  const [maxPageNumber, setMaxPageNumber] = useState(4);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [tags, setTags] = useState([]);
  const waitingReorders = useRef([]);
  const pendingReorders = useRef([]);
  const previousJobs = useRef([]);
  const backendSyncJobs = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
  );

  let pageNumbers = [];
  for (let i = 1; i <= maxPageNumber; i++) { pageNumbers.push(i) }

  const allTags = ['React', 'JavaScript', 'UI', 'CSS', 'Node.js', 'API', 'Databases', 'Go', 'SQL', 'Python', 'Visualization', 'Excel', 'TensorFlow', 'AI', 'Data', 'MongoDB', 'AWS', 'Kubernetes', 'DevOps', 'Networking', 'Docker', 'CI/CD', 'Linux', 'HTML', 'Teamwork', 'Testing', 'Automation', 'Selenium', 'Agile', 'Roadmap', 'Leadership', 'Communication', 'ETL', 'Pipelines', 'Figma', 'Prototyping', 'Accessibility', 'React Native', 'Android', 'iOS', 'Security', 'Monitoring', 'Network', 'Threat Detection', 'TypeScript', 'Performance', 'PostgreSQL', 'Microservices', 'Architecture', 'Scalability', 'Deep Learning', 'Research', 'Routers', 'TCP/IP', 'Terraform', 'MySQL', 'Backup', 'Documentation', 'Writing', 'Editing', 'Unity', 'C#', '3D', 'Graphics', 'Customer Support', 'Troubleshooting', 'ML', 'Statistics', 'Planning', 'Solidity', 'Ethereum', 'Smart Contracts', 'Web3', 'C++', 'IoT', 'Microcontrollers', 'Hardware', 'Cloud', 'Pandas', 'Support'];

  function archiveStateConsistency(jobid, newStatus) {
    if (activeJobs && archivedJobs) {
      setJobs(jobs.map(job => {
        if (job['jobid'] == jobid) {
          let newJob = { ...job }
          newJob['status'] = newStatus;
          return newJob;
        } else {
          return job;
        }
      }))
    } else if (activeJobs) {
      setJobs(jobs.filter(job => job['jobid'] != jobid));
    } else if (archivedJobs) {
      setJobs(jobs.filter(job => job['jobid'] != jobid));
    }
  }

  function handleStatusClick(jobid, status) {
    console.log("handle status click", jobid, status)
    let newStatus = '';
    if (status == 'archived') {
      newStatus = 'active'
    } else if (status == 'active') {
      newStatus = 'archived'
    }

    axios.patch(`/api/jobs/${jobid}`, {
      'status': newStatus
    })
      .then(res => {
        console.log(res.data, " job's status was successfully updated");
        archiveStateConsistency(jobid, newStatus);
      })
      .catch(err => {
        console.log("error when trying to update status of job", err)
      })
  }

  function handlePageNumber(pageNumber) {
    setPageNumber(pageNumber);
  }

  function handleTagClick(tag) {
    if (tags.includes(tag)) {
      setTags(tags.filter(eachtag => eachtag != tag))
    } else {
      setTags(Array.from(new Set([...tags, tag])));
    }
  }

  function handleTagCancel(selectedTag) {
    setTags(tags.filter(tag => tag != selectedTag))
  }

  function statusArray() {
    let statusArray = [];
    if (activeJobs) {
      statusArray.push('active')
    }
    if (archivedJobs) {
      statusArray.push('archived')
    }
    return statusArray;
  }

  function proceedReorder(op) {
    pendingReorders.current.push(op);
    axios.patch(`/api/jobs/${op.jobid}/reorder`, {
      'fromOrder': op.from + 1,
      'toOrder': op.to + 1,
    })
      .then(res => {
        previousJobs.current = op.proposed;
        if (waitingReorders.current.length) {
          let nextOp = waitingReorders.current.shift();
          pendingReorders.current = pendingReorders.current.filter(pendingop => pendingop.reorderId != op.reorderId);
          proceedReorder(nextOp);
        } else {
          pendingReorders.current = pendingReorders.current.filter(pendingop => pendingop.reorderId != op.reorderId);
        }
      })
      .catch(err => {
        alert("error when updating op");
        previousJobs.current = [];
        setJobs(op.previous);
        pendingReorders.current = pendingReorders.current.filter(pendingop => pendingop.reorderId != op.reorderId);
        waitingReorders.current = [];
      })
  }

  function jobsCopier() {
    let copy = [];
    jobs.forEach(job => {
      copy.push(structuredClone(job));
    });
    return copy;
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!event.over || active.id == over.id) return;
    let oldIndex;
    let newIndex;
    if (previousJobs.current.length == 0) {
      oldIndex = jobs.findIndex((job) => job.jobid === active.id);
      newIndex = jobs.findIndex((job) => job.jobid === over.id);
    } else {
      oldIndex = previousJobs.current.findIndex((job) => job.jobid === active.id);
      newIndex = previousJobs.current.findIndex((job) => job.jobid === over.id);
    }

    let updatedJobs;
    let jobsCopy = jobsCopier();
    setJobs((prevJobs) => {
      updatedJobs = arrayMove(prevJobs, oldIndex, newIndex);
      return updatedJobs;
    });

    let op = {
      'reorderId': reorderId++,
      'jobid': active.id,
      'from': oldIndex,
      'to': newIndex,
      'previous': previousJobs.current.length ? previousJobs.current : jobsCopy,
      'proposed': updatedJobs,
    }

    if (pendingReorders.current.length > 0) {
      waitingReorders.current.push(op);
    } else {
      proceedReorder(op);
    }
  }

  useEffect(() => {
    axios.get('api/jobs', {
      params: {
        'status': statusArray(),
        'tags': tags,
        'sort': sort,
        'pageNumber': pageNumber,
        'pageSize': pageSize,
      }
    })
      .then((res) => {
        if (pageNumber > res.data.maxPageNumber) {
          setPageNumber(res.data.maxPageNumber);
        }
        setMaxPageNumber(res.data.maxPageNumber);
        setJobs(res.data.records);
      })
      .catch(err => { console.log("error when trying to get data: ", err) })
  }, [activeJobs, archivedJobs, tags, pageNumber, pageSize, sort])

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen py-10 text-gray-800">

      <div className="w-[20%] flex flex-col gap-6 bg-white shadow-md p-5 rounded-2xl border border-gray-200 h-fit sticky top-10">

        <div className="flex flex-col items-center gap-2">
          <label htmlFor="ordersort" className="font-semibold text-gray-700">Sort</label>
          <select
            id="ordersort"
            value={sort}
            onChange={(e) => { setSort(e.target.value) }}
            className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold text-gray-700">Status</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Active</label>
              <input
                type="checkbox"
                checked={activeJobs}
                onChange={(e) => setActiveJobs(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Archived</label>
              <input
                type="checkbox"
                checked={archivedJobs}
                onChange={(e) => setArchivedJobs(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="font-semibold text-gray-700">Tags</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {tags.map(selectedTag => (
              <div
                className="bg-blue-500 px-3 py-[2px] text-white rounded-xl flex gap-2 items-center text-sm shadow-sm"
                key={selectedTag}
              >
                <p>{selectedTag}</p>
                <button onClick={() => { handleTagCancel(selectedTag) }}>
                  <img src="/close.png" width={30} height={30} />
                </button>
              </div>
            ))}
          </div>

          <select
            onChange={(e) => { handleTagClick(e.target.value) }}
            className="border rounded-lg px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          >
            <option value="select tags">--Select tags--</option>
            {allTags.filter(tag => !tags.includes(tag)).map(tag => (
              <option className="flex gap-2" key={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center self-start w-[80%] px-10 mb-20">
        <h1 className="text-2xl font-bold mb-3 text-gray-800">Jobs</h1>
        {
          role == 'recruiter'
            ? <div className="mb-3">
              <Link
                to={'/jobadd'}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-md"
              >
                Create Job
              </Link>
            </div>
            : <></>
        }

        <div className="flex gap-2 items-center mb-4">
          <label htmlFor="pageSize" className="font-medium text-gray-600">Page Size:</label>
          <input
            type="number"
            min={1}
            className="border w-[55px] pl-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="pageSize"
            value={pageSize}
            onChange={(e) => { setPageSize(e.target.value) }}
          />
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={jobs.map(job => job.jobid)} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-6 border p-5 w-[90%] rounded-2xl bg-white shadow-md items-center">
              {
                jobs.length
                  ? jobs.map(job => (
                    <JobRow key={job.jobid} job={job} handleStatusClickFunction={handleStatusClick} />
                  ))
                  : <div className="text-gray-500 py-6">
                    No jobs with given filters exist. Try changing filters to view jobs.
                  </div>
              }
            </ul>
          </SortableContext>
        </DndContext>

        <div className="flex gap-2 mt-5">
          {
            pageNumbers.map(pgNo => (
              <button
                onClick={() => { handlePageNumber(pgNo) }}
                className={`border px-3 py-1 rounded-md text-sm transition-all ${pageNumber == pgNo
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'hover:bg-gray-100'}`}
              >
                {pgNo}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  )
}
