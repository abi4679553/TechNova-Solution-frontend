import React, { useEffect, useState } from "react";

import {
  Plus,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Trash2,
  X,
  CalendarDays,
  User,
  FileText,
} from "lucide-react";

import CreateJob from "./CreateJob";

// =====================================================
// GET USER SAFELY FROM LOCAL STORAGE
// =====================================================

const getStoredUser = () => {
  try {
    const savedUser =
      localStorage.getItem("currentUser");

    if (
      !savedUser ||
      savedUser === "undefined" ||
      savedUser === "null"
    ) {
      return null;
    }

    const parsedUser =
      JSON.parse(savedUser);

    if (
      !parsedUser ||
      typeof parsedUser !== "object"
    ) {
      return null;
    }

    return parsedUser;

  } catch (error) {

    console.error(
      "User Parse Error:",
      error
    );

    return null;
  }
};

// =====================================================
// EMPLOYEE DASHBOARD
// =====================================================

const EmployeeDashboard = ({ user: propUser }) => {

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(() => {
    return propUser || getStoredUser();
  });

  // =====================================================
  // STATES
  // =====================================================

  const [showCreateJob, setShowCreateJob] =
    useState(false);

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedJob, setSelectedJob] =
    useState(null);

  // =====================================================
  // UPDATE USER
  // =====================================================

  useEffect(() => {

    if (propUser) {

      setUser(propUser);

      console.log(
        "Dashboard User from Props:",
        propUser
      );

      return;
    }

    const storedUser =
      getStoredUser();

    if (storedUser) {

      setUser(storedUser);

      console.log(
        "Dashboard User from LocalStorage:",
        storedUser
      );

    } else {

      console.error(
        "❌ User not found in props or localStorage"
      );
    }

  }, [propUser]);

  // =====================================================
  // EMPLOYEE ID
  // =====================================================

  const employeeId = user?.Id;

  // =====================================================
  // DEBUG USER
  // =====================================================

  useEffect(() => {

    console.log(
      "================================"
    );

    console.log(
      "EMPLOYEE DASHBOARD USER:",
      user
    );

    console.log(
      "EMPLOYEE ID:",
      employeeId
    );

    console.log(
      "================================"
    );

  }, [user, employeeId]);

  // =====================================================
  // LOAD JOBS FROM LOCAL STORAGE
  // =====================================================

  const fetchJobs = () => {

    try {

      setLoading(true);

      // -----------------------------------------------
      // USER ID CHECK
      // -----------------------------------------------

      if (!employeeId) {

        console.log(
          "Employee ID not available"
        );

        setJobs([]);

        return;
      }

      // -----------------------------------------------
      // GET JOBS
      // -----------------------------------------------

      const savedJobs =
        localStorage.getItem("jobs");

      if (
        !savedJobs ||
        savedJobs === "undefined" ||
        savedJobs === "null"
      ) {

        setJobs([]);

        return;
      }

      // -----------------------------------------------
      // PARSE JOBS
      // -----------------------------------------------

      let parsedJobs;

      try {

        parsedJobs =
          JSON.parse(savedJobs);

      } catch (error) {

        console.error(
          "Jobs JSON Parse Error:",
          error
        );

        setJobs([]);

        return;
      }

      // -----------------------------------------------
      // ARRAY CHECK
      // -----------------------------------------------

      if (!Array.isArray(parsedJobs)) {

        setJobs([]);

        return;
      }

      // -----------------------------------------------
      // EMPLOYEE JOBS
      // -----------------------------------------------

      const employeeJobs =
        parsedJobs.filter(
          (job) =>
            String(job?.createdBy) ===
            String(employeeId)
        );

      console.log(
        "Employee Jobs:",
        employeeJobs
      );

      setJobs(employeeJobs);

    } catch (error) {

      console.error(
        "Fetch Jobs Error:",
        error
      );

      setJobs([]);

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    if (employeeId) {

      fetchJobs();

    } else {

      setLoading(false);
    }

  }, [employeeId]);

  // =====================================================
  // REFRESH WHEN JOB CREATED / UPDATED / DELETED
  // =====================================================

  useEffect(() => {

    const handleJobsUpdate = () => {

      console.log(
        "Jobs updated - refreshing employee jobs"
      );

      fetchJobs();
    };

    window.addEventListener(
      "jobsUpdated",
      handleJobsUpdate
    );

    return () => {

      window.removeEventListener(
        "jobsUpdated",
        handleJobsUpdate
      );
    };

  }, [employeeId]);

  // =====================================================
  // REFRESH WHEN WINDOW GETS FOCUS
  // =====================================================

  useEffect(() => {

    const handleFocus = () => {

      if (employeeId) {

        fetchJobs();
      }
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      );
    };

  }, [employeeId]);

  // =====================================================
  // GET JOB STATUS
  // =====================================================

  const getJobStatus = (job) => {

    const approvalStatus =
      String(
        job?.approvalStatus || ""
      ).toLowerCase();

    const status =
      String(
        job?.status || ""
      ).toLowerCase();

    // APPROVED

    if (
      approvalStatus === "approved" ||
      status === "approved"
    ) {

      return "approved";
    }

    // REJECTED

    if (
      approvalStatus === "rejected" ||
      status === "rejected"
    ) {

      return "rejected";
    }

    // DEFAULT

    return "pending";
  };

  // =====================================================
  // JOB COUNTS
  // =====================================================

  const pendingJobs =
    jobs.filter(
      (job) =>
        getJobStatus(job) ===
        "pending"
    );

  const acceptedJobs =
    jobs.filter(
      (job) =>
        getJobStatus(job) ===
        "approved"
    );

  const rejectedJobs =
    jobs.filter(
      (job) =>
        getJobStatus(job) ===
        "rejected"
    );

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredJobs =
    jobs.filter((job) => {

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        String(
          job?.jobTitle || ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          job?.projectId || ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          job?.jobType || ""
        )
          .toLowerCase()
          .includes(search);

      const jobStatus =
        getJobStatus(job);

      const matchesStatus =
        statusFilter === "all" ||
        jobStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return "N/A";
    }

    try {

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch (error) {

      return "N/A";
    }
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const StatusBadge = ({ job }) => {

    const status =
      getJobStatus(job);

    // APPROVED

    if (status === "approved") {

      return (

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

          <CheckCircle size={14} />

          Accepted

        </span>
      );
    }

    // REJECTED

    if (status === "rejected") {

      return (

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">

          <XCircle size={14} />

          Rejected

        </span>
      );
    }

    // PENDING

    return (

      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">

        <Clock size={14} />

        Pending

      </span>
    );
  };

  // =====================================================
  // CREATE JOB CLOSE
  // =====================================================

  const handleCreateJobClose = () => {

    setShowCreateJob(false);

    fetchJobs();
  };

  // =====================================================
  // VIEW JOB
  // =====================================================

  const handleViewJob = (job) => {

    setSelectedJob(job);
  };

  // =====================================================
  // CLOSE VIEW MODAL
  // =====================================================

  const closeViewModal = () => {

    setSelectedJob(null);
  };

  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDeleteJob = (job) => {

    if (!job) {
      return;
    }

    const jobTitle =
      job?.jobTitle ||
      "this job";

    // -----------------------------------------------
    // CONFIRM DELETE
    // -----------------------------------------------

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete "${jobTitle}"?`
      );

    if (!confirmDelete) {

      return;
    }

    try {

      // -----------------------------------------------
      // GET ALL JOBS
      // -----------------------------------------------

      const savedJobs =
        localStorage.getItem("jobs");

      if (
        !savedJobs ||
        savedJobs === "undefined" ||
        savedJobs === "null"
      ) {

        return;
      }

      const allJobs =
        JSON.parse(savedJobs);

      if (!Array.isArray(allJobs)) {

        return;
      }

      // -----------------------------------------------
      // IDENTIFY JOB
      // -----------------------------------------------

      const selectedJobId =
        job?._id ||
        job?.id;

      // -----------------------------------------------
      // DELETE ONLY SELECTED JOB
      // -----------------------------------------------

      let updatedJobs;

      if (selectedJobId) {

        updatedJobs =
          allJobs.filter(
            (item) =>
              String(
                item?._id ||
                item?.id
              ) !==
              String(selectedJobId)
          );

      } else {

        /*
         * Fallback for old jobs which
         * don't have id/_id.
         */

        updatedJobs =
          allJobs.filter(
            (item) => {

              return !(
                String(
                  item?.createdBy
                ) ===
                  String(
                    job?.createdBy
                  ) &&

                String(
                  item?.projectId
                ) ===
                  String(
                    job?.projectId
                  ) &&

                String(
                  item?.jobTitle
                ) ===
                  String(
                    job?.jobTitle
                  )
              );
            }
          );
      }

      // -----------------------------------------------
      // SAVE UPDATED JOBS
      // -----------------------------------------------

      localStorage.setItem(
        "jobs",
        JSON.stringify(updatedJobs)
      );

      // -----------------------------------------------
      // UPDATE UI IMMEDIATELY
      // -----------------------------------------------

      setJobs(
        updatedJobs.filter(
          (item) =>
            String(
              item?.createdBy
            ) ===
            String(employeeId)
        )
      );

      // -----------------------------------------------
      // CLOSE VIEW POPUP
      // -----------------------------------------------

      setSelectedJob(null);

      // -----------------------------------------------
      // NOTIFY OTHER COMPONENTS
      // -----------------------------------------------

      window.dispatchEvent(
        new Event("jobsUpdated")
      );

      console.log(
        "✅ Job deleted successfully:",
        jobTitle
      );

    } catch (error) {

      console.error(
        "❌ Delete Job Error:",
        error
      );

      alert(
        "Failed to delete job. Please try again."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Employee Dashboard
            </h1>

            <p className="text-slate-500 mt-1">

              Welcome,{" "}

              {user?.fullName ||
                user?.name ||
                "Employee"}

            </p>

            <div className="flex items-center gap-2 mt-2">

              <User
                size={15}
                className="text-slate-400"
              />

              <p className="text-sm text-slate-400">

                Employee ID:{" "}

                <span className="font-semibold text-slate-600">

                  {employeeId ||
                    "N/A"}

                </span>

              </p>

            </div>

          </div>

          {/* CREATE JOB BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowCreateJob(true)
            }
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition"
          >

            <Plus size={19} />

            Create Job

          </button>

        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">

          {/* MY JOBS */}

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">

                <Briefcase size={24} />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  My Jobs
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {jobs.length}
                </p>

              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">

                <Clock size={24} />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Pending Approval
                </p>

                <p className="text-2xl font-bold text-yellow-600">
                  {pendingJobs.length}
                </p>

              </div>

            </div>

          </div>

          {/* ACCEPTED */}

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-green-50 text-green-600 rounded-lg">

                <CheckCircle size={24} />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Accepted
                </p>

                <p className="text-2xl font-bold text-green-600">
                  {acceptedJobs.length}
                </p>

              </div>

            </div>

          </div>

          {/* REJECTED */}

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-red-50 text-red-600 rounded-lg">

                <XCircle size={24} />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Rejected
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {rejectedJobs.length}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            JOB TABLE
        ================================================= */}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

          {/* TABLE HEADER */}

          <div className="p-5 border-b border-slate-200">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <h2 className="text-xl font-semibold text-slate-800">
                  My Jobs
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Jobs created by you and submitted for approval
                </p>

              </div>

              {/* SEARCH + FILTER */}

              <div className="flex flex-col sm:flex-row gap-3">

                {/* SEARCH */}

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search jobs..."
                    className="w-full sm:w-64 border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                </div>

                {/* STATUS FILTER */}

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="all">
                    All Status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="approved">
                    Accepted
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="p-10 text-center">

              <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

              <p className="text-slate-500 mt-3">
                Loading jobs...
              </p>

            </div>

          ) : filteredJobs.length === 0 ? (

            /* EMPTY */

            <div className="p-10 text-center">

              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-slate-100 rounded-full">

                <Briefcase
                  size={28}
                  className="text-slate-400"
                />

              </div>

              <h3 className="text-lg font-semibold text-slate-700 mt-4">

                {jobs.length === 0
                  ? "No Jobs Found"
                  : "No Matching Jobs"}

              </h3>

              <p className="text-sm text-slate-500 mt-1">

                {jobs.length === 0
                  ? "Create your first job using the Create Job button."
                  : "Try changing your search or status filter."}

              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Job Details
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Project ID
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Job Type
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Total Hours
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Start Date
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Due Date
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Status
                    </th>

                    <th className="text-center px-5 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredJobs.map(
                    (job) => {

                      const jobStatus =
                        getJobStatus(job);

                      return (

                        <tr
                          key={
                            job._id ||
                            job.id ||
                            `${job.projectId}-${job.jobTitle}`
                          }
                          className="hover:bg-slate-50 transition"
                        >

                          {/* JOB DETAILS */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">

                                <Briefcase
                                  size={19}
                                  className="text-blue-600"
                                />

                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">

                                  {job.jobTitle ||
                                    "Untitled Job"}

                                </p>

                                <p className="text-xs text-slate-400 mt-1">

                                  Created by:{" "}

                                  {job.createdBy ||
                                    employeeId}

                                </p>

                              </div>

                            </div>

                          </td>

                          {/* PROJECT ID */}

                          <td className="px-5 py-5">

                            <span className="font-medium text-slate-700">

                              {job.projectId ||
                                "N/A"}

                            </span>

                          </td>

                          {/* JOB TYPE */}

                          <td className="px-5 py-5">

                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">

                              {job.jobType ||
                                "N/A"}

                            </span>

                          </td>

                          {/* TOTAL HOURS */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-1.5 text-slate-700">

                              <Clock size={15} />

                              <span className="font-semibold">

                                {job.totalHours ||
                                  0}

                              </span>

                              <span className="text-xs text-slate-400">
                                hrs
                              </span>

                            </div>

                          </td>

                          {/* START DATE */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-1.5 text-sm text-slate-600">

                              <CalendarDays
                                size={15}
                              />

                              {formatDate(
                                job.startDate
                              )}

                            </div>

                          </td>

                          {/* DUE DATE */}

                          <td className="px-5 py-5">

                            <div className="text-sm text-slate-600">

                              {formatDate(
                                job.dueDate
                              )}

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">

                            <StatusBadge
                              job={job}
                            />

                            {jobStatus ===
                              "rejected" &&
                              job.rejectionReason && (

                                <p className="text-xs text-red-500 mt-2 max-w-[180px]">

                                  {job.rejectionReason}

                                </p>
                              )}

                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-5 text-center">

                            <div className="flex items-center justify-center gap-2">

                              {/* VIEW */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewJob(
                                    job
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                                title="View Job"
                              >

                                <Eye size={16} />

                                View

                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteJob(
                                    job
                                  )
                                }
                                className="w-9 h-9 inline-flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                title="Delete Job"
                              >

                                <Trash2
                                  size={17}
                                />

                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          CREATE JOB MODAL
      ===================================================== */}

      {showCreateJob && (

        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">

          <div className="min-h-screen py-6">

            <CreateJob
              user={user}
              onClose={
                handleCreateJobClose
              }
            />

          </div>

        </div>
      )}

      {/* =====================================================
          VIEW JOB MODAL
      ===================================================== */}

      {selectedJob && (

        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              closeViewModal();
            }

          }}
        >

          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-5 border-b">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Job Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Complete job information
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeViewModal
                }
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                title="Close"
              >

                <X size={22} />

              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="p-6">

              {/* TITLE */}

              <div className="mb-6">

                <p className="text-sm text-slate-500">
                  Job Title
                </p>

                <h3 className="text-2xl font-bold text-slate-800 mt-1">

                  {selectedJob.jobTitle ||
                    "N/A"}

                </h3>

              </div>

              {/* BASIC DETAILS */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* PROJECT ID */}

                <div className="bg-slate-50 rounded-lg p-4">

                  <p className="text-xs text-slate-500">
                    Project ID
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">

                    {selectedJob.projectId ||
                      "N/A"}

                  </p>

                </div>

                {/* JOB TYPE */}

                <div className="bg-slate-50 rounded-lg p-4">

                  <p className="text-xs text-slate-500">
                    Job Type
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">

                    {selectedJob.jobType ||
                      "N/A"}

                  </p>

                </div>

                {/* TOTAL HOURS */}

                <div className="bg-slate-50 rounded-lg p-4">

                  <p className="text-xs text-slate-500">
                    Total Hours
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">

                    {selectedJob.totalHours ||
                      0}{" "}
                    Hours

                  </p>

                </div>

                {/* EMPLOYEE ID */}

                <div className="bg-slate-50 rounded-lg p-4">

                  <p className="text-xs text-slate-500">
                    Employee ID
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">

                    {selectedJob.createdBy ||
                      employeeId}

                  </p>

                </div>

                {/* START DATE */}

                <div className="bg-slate-50 rounded-lg p-4">

                  <p className="text-xs text-slate-500">
                    Start Date
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">

                    {formatDate(
                      selectedJob.startDate
                    )}

                  </p>

                </div>

                {/* DUE DATE */}

                <div className="bg-slate-50 rounded-lg p-4">

                  <p className="text-xs text-slate-500">
                    Due Date
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">

                    {formatDate(
                      selectedJob.dueDate
                    )}

                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div className="mt-6">

                <p className="text-sm text-slate-500 mb-2">
                  Approval Status
                </p>

                <StatusBadge
                  job={selectedJob}
                />

              </div>

              {/* DESCRIPTION */}

              <div className="mt-6">

                <div className="flex items-center gap-2 mb-2">

                  <FileText
                    size={18}
                    className="text-slate-500"
                  />

                  <p className="font-semibold text-slate-700">
                    Job Description
                  </p>

                </div>

                <div className="bg-slate-50 border rounded-lg p-4">

                  <p className="text-sm text-slate-600 whitespace-pre-wrap">

                    {selectedJob.jobDescription ||
                      selectedJob.description ||
                      "No description available."}

                  </p>

                </div>

              </div>

              {/* TASKS */}

              {Array.isArray(
                selectedJob.tasks
              ) &&
                selectedJob.tasks.length >
                  0 && (

                  <div className="mt-6">

                    <h3 className="font-semibold text-slate-700 mb-3">
                      Tasks
                    </h3>

                    <div className="border rounded-lg overflow-hidden">

                      <table className="w-full">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                              Task
                            </th>

                            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">
                              Hours
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y">

                          {selectedJob.tasks.map(
                            (
                              task,
                              index
                            ) => (

                              <tr
                                key={
                                  index
                                }
                              >

                                <td className="px-4 py-3 text-sm text-slate-700">

                                  {task.taskName ||
                                    "Task"}

                                </td>

                                <td className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">

                                  {task.hours ||
                                    0}{" "}
                                  hrs

                                </td>

                              </tr>
                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>
                )}

              {/* REJECTION REASON */}

              {getJobStatus(
                selectedJob
              ) === "rejected" &&
                selectedJob.rejectionReason && (

                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">

                    <p className="font-semibold text-red-700">
                      Rejection Reason
                    </p>

                    <p className="text-sm text-red-600 mt-1">

                      {
                        selectedJob.rejectionReason
                      }

                    </p>

                  </div>
                )}

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-3 p-5 border-t">

              {/* CLOSE */}

              <button
                type="button"
                onClick={
                  closeViewModal
                }
                className="px-5 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition"
              >
                Close
              </button>

              {/* DELETE */}

              <button
                type="button"
                onClick={() =>
                  handleDeleteJob(
                    selectedJob
                  )
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >

                <Trash2 size={17} />

                Delete Job

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default EmployeeDashboard;