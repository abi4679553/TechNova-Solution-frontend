import React, { useState } from "react";
import {
  RiDashboardLine,
  RiTeamLine,
  RiFileList3Line,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiBarChartBoxLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiSearchLine,
  RiUserLine,
  RiCloseLine,
  RiCheckLine,
  RiArrowRightLine,
} from "react-icons/ri";

const AdminPage = () => {
  // ================= JOB DATA =================

  const [jobs, setJobs] = useState([
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "Kumar",
      task: "Portfolio",
      description:
        "Create a responsive personal portfolio website using modern frontend technologies.",
      tasks: [
        { name: "HTML", hours: 3 },
        { name: "CSS", hours: 4 },
        { name: "JavaScript", hours: 6 },
        { name: "React", hours: 8 },
      ],
      totalHours: 21,
      status: "Pending",
      submittedDate: "10 Sep 2026",
    },

    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Arun",
      task: "E-Commerce Website",
      description:
        "Develop an e-commerce website with product listing and shopping cart functionality.",
      tasks: [
        { name: "HTML", hours: 3 },
        { name: "CSS", hours: 4 },
        { name: "JavaScript", hours: 7 },
        { name: "React", hours: 10 },
      ],
      totalHours: 24,
      status: "Pending",
      submittedDate: "10 Sep 2026",
    },

    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Ravi",
      task: "Admin Dashboard",
      description:
        "Create an admin dashboard with responsive layout and dashboard components.",
      tasks: [
        { name: "HTML", hours: 2 },
        { name: "CSS", hours: 4 },
        { name: "JavaScript", hours: 5 },
        { name: "React", hours: 7 },
      ],
      totalHours: 18,
      status: "Accepted",
      submittedDate: "09 Sep 2026",
    },

    {
      id: 4,
      employeeId: "EMP004",
      employeeName: "Suresh",
      task: "Landing Page",
      description:
        "Design and develop a responsive company landing page.",
      tasks: [
        { name: "HTML", hours: 2 },
        { name: "CSS", hours: 3 },
        { name: "JavaScript", hours: 4 },
      ],
      totalHours: 9,
      status: "Rejected",
      rejectionReason: "Estimated hours need to be revised.",
      submittedDate: "08 Sep 2026",
    },
  ]);

  // ================= STATES =================

  const [selectedJob, setSelectedJob] = useState(null);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [showRejectBox, setShowRejectBox] = useState(false);

  const [rejectReason, setRejectReason] = useState("");

  // ================= STATUS COUNTS =================

  const totalEmployees = new Set(
    jobs.map((job) => job.employeeId)
  ).size;
  
  const acceptedJobs = jobs.filter(
    (job) => job.status === "Accepted"
  ).length;

  const rejectedJobs = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  // ================= FILTER =================

  const filteredJobs = jobs.filter((job) => {
    const searchText =
      search.toLowerCase();

    const matchesSearch =
      job.employeeId
        .toLowerCase()
        .includes(searchText) ||
      job.employeeName
        .toLowerCase()
        .includes(searchText) ||
      job.task
        .toLowerCase()
        .includes(searchText);

    const matchesFilter =
      filter === "All" ||
      job.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ================= ACCEPT JOB =================

  const handleAccept = () => {
    if (!selectedJob) return;

    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              status: "Accepted",
              rejectionReason: "",
            }
          : job
      )
    );

    setSelectedJob((prev) => ({
      ...prev,
      status: "Accepted",
      rejectionReason: "",
    }));
  };

  // ================= REJECT JOB =================

  const handleReject = () => {
    if (!selectedJob) return;

    if (rejectReason.trim() === "") {
      return;
    }

    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              status: "Rejected",
              rejectionReason:
                rejectReason.trim(),
            }
          : job
      )
    );

    setSelectedJob((prev) => ({
      ...prev,
      status: "Rejected",
      rejectionReason:
        rejectReason.trim(),
    }));

    setRejectReason("");
    setShowRejectBox(false);
  };

  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return "bg-green-50 text-green-600 border-green-200";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    return "bg-yellow-50 text-yellow-600 border-yellow-200";
  };

  // ================= RETURN =================

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0 flex-col">

        {/* LOGO */}

        <div className="h-20 px-6 flex items-center border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary">
            TechNova Solutions
          </h1>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-4 space-y-2">

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-medium">
            <RiDashboardLine className="text-xl" />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
            <RiTeamLine className="text-xl" />
            Employees
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
            <RiFileList3Line className="text-xl" />
            Job Requests
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
            <RiCheckboxCircleLine className="text-xl" />
            Accepted Jobs
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
            <RiCloseCircleLine className="text-xl" />
            Rejected Jobs
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
            <RiBarChartBoxLine className="text-xl" />
            Reports
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
            <RiSettings3Line className="text-xl" />
            Settings
          </button>

        </nav>

        {/* LOGOUT */}

        <div className="p-4 border-t border-gray-100">

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50">
            <RiLogoutBoxLine className="text-xl" />
            Logout
          </button>

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="w-full lg:ml-64">

        {/* HEADER */}

        <header className="h-20 bg-white border-b border-gray-200 px-5 sm:px-8 flex items-center justify-between">

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-secondary">
              Admin Dashboard
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage employee job requests
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
            <RiUserLine className="text-xl" />
          </div>

        </header>

        {/* CONTENT */}

        <div className="p-5 sm:p-8">

          {/* ================================================= */}
          {/* SUMMARY CARDS */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* TOTAL EMPLOYEES */}

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Total Employees
                  </p>

                  <h3 className="text-3xl font-bold text-secondary mt-2">
                    {totalEmployees}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                  <RiTeamLine className="text-2xl" />
                </div>

              </div>

            </div>

           
         

            {/* ACCEPTED */}

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Accepted Jobs
                  </p>

                  <h3 className="text-3xl font-bold text-secondary mt-2">
                    {acceptedJobs}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                  <RiCheckboxCircleLine className="text-2xl" />
                </div>

              </div>

            </div>

            {/* REJECTED */}

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Rejected Jobs
                  </p>

                  <h3 className="text-3xl font-bold text-secondary mt-2">
                    {rejectedJobs}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <RiCloseCircleLine className="text-2xl" />
                </div>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* JOB REQUESTS */}
          {/* ================================================= */}

          <div className="mt-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

              <div>
                <h2 className="text-xl font-bold text-secondary">
                  Job Requests
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review employee submitted jobs
                </p>
              </div>

              {/* SEARCH */}

              <div className="relative w-full lg:w-80">

                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search employee or task..."
                  className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-xl bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

              </div>

            </div>

            {/* FILTER */}

            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">

              {[
                "All",
                "Accepted",
                "Rejected",
              ].map((item) => (

                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    filter === item
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-primary"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

            {/* ================================================= */}
            {/* JOB CARDS */}
            {/* ================================================= */}

            {filteredJobs.length === 0 ? (

              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">

                <RiFileList3Line className="text-5xl text-gray-300 mx-auto" />

                <h3 className="font-semibold text-gray-700 mt-4">
                  No Job Requests Found
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  No jobs match your search or filter.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                {filteredJobs.map((job) => (

                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      setShowRejectBox(false);
                      setRejectReason("");
                    }}
                    className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-primary/30 transition cursor-pointer"
                  >

                    {/* CARD HEADER */}

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2">

                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                            <RiUserLine className="text-xl" />
                          </div>

                          <div>

                            <p className="font-bold text-secondary">
                              {job.employeeId}
                            </p>

                            <p className="text-xs text-gray-500">
                              {job.employeeName}
                            </p>

                          </div>

                        </div>

                      </div>

                      <span
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusStyle(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>

                    </div>

                    {/* TASK */}

                    <div className="mt-5">

                      <h3 className="text-lg font-bold text-secondary">
                        {job.task}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {job.description}
                      </p>

                    </div>

                    {/* TASK HOURS */}

                    <div className="mt-4 space-y-2">

                      {job.tasks.map((task) => (

                        <div
                          key={task.name}
                          className="flex items-center justify-between text-sm"
                        >

                          <span className="text-gray-600">
                            {task.name}
                          </span>

                          <span className="font-medium text-secondary">
                            {task.hours} hours
                          </span>

                        </div>

                      ))}

                    </div>

                    {/* TOTAL */}

                    <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">

                      <div>

                        <p className="text-xs text-gray-400">
                          Total Estimated Time
                        </p>

                        <p className="font-bold text-secondary">
                          {job.totalHours} hours
                        </p>

                      </div>

                      <div className="flex items-center gap-1 text-primary text-sm font-semibold">
                        View Details
                        <RiArrowRightLine />
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </main>

      {/* ================================================= */}
      {/* JOB DETAILS MODAL */}
      {/* ================================================= */}

      {selectedJob && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-secondary">
                  Job Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review employee job request
                </p>

              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <RiCloseLine className="text-xl" />
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="p-6">

              {/* EMPLOYEE DETAILS */}

              <div className="bg-gray-50 rounded-xl p-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-gray-400">
                      Employee ID
                    </p>

                    <p className="font-semibold text-secondary mt-1">
                      {selectedJob.employeeId}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Employee Name
                    </p>

                    <p className="font-semibold text-secondary mt-1">
                      {selectedJob.employeeName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Submitted Date
                    </p>

                    <p className="font-semibold text-secondary mt-1">
                      {selectedJob.submittedDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Status
                    </p>

                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(
                        selectedJob.status
                      )}`}
                    >
                      {selectedJob.status}
                    </span>
                  </div>

                </div>

              </div>

              {/* TASK DETAILS */}

              <div className="mt-6">

                <h3 className="text-lg font-bold text-secondary">
                  {selectedJob.task}
                </h3>

                <p className="text-sm text-gray-500 mt-2 leading-6">
                  {selectedJob.description}
                </p>

              </div>

              {/* HOURS */}

              <div className="mt-5">

                <h3 className="font-semibold text-secondary mb-3">
                  Task Estimation
                </h3>

                <div className="border border-gray-200 rounded-xl overflow-hidden">

                  {selectedJob.tasks.map((task) => (

                    <div
                      key={task.name}
                      className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 border-gray-100"
                    >

                      <span className="text-sm text-gray-600">
                        {task.name}
                      </span>

                      <span className="text-sm font-semibold text-secondary">
                        {task.hours} hours
                      </span>

                    </div>

                  ))}

                  <div className="flex items-center justify-between px-4 py-4 bg-gray-50">

                    <span className="font-semibold text-secondary">
                      Total
                    </span>

                    <span className="font-bold text-primary">
                      {selectedJob.totalHours} hours
                    </span>

                  </div>

                </div>

              </div>

              {/* REJECTION REASON */}

              {selectedJob.status === "Rejected" &&
                selectedJob.rejectionReason && (

                  <div className="mt-5 bg-red-50 border border-red-100 rounded-xl p-4">

                    <p className="text-sm font-semibold text-red-600">
                      Rejection Reason
                    </p>

                    <p className="text-sm text-red-500 mt-1">
                      {selectedJob.rejectionReason}
                    </p>

                  </div>

                )}

              {/* REJECT INPUT */}

              {showRejectBox && (

                <div className="mt-5">

                  <label className="block text-sm font-semibold text-secondary mb-2">
                    Rejection Reason
                  </label>

                  <textarea
                    value={rejectReason}
                    onChange={(e) =>
                      setRejectReason(e.target.value)
                    }
                    rows="4"
                    placeholder="Enter reason for rejecting this job..."
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none resize-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />

                  {rejectReason.trim() === "" && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter a rejection reason
                    </p>
                  )}

                </div>

              )}

              {/* ACTION BUTTONS */}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">

                {selectedJob.status === "Pending" ? (

                  <>
                    <button
                      onClick={() => {
                        setShowRejectBox(true);
                      }}
                      className="flex-1 h-11 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <RiCloseCircleLine />
                      Reject
                    </button>

                    <button
                      onClick={handleAccept}
                      className="flex-1 h-11 rounded-xl bg-primary hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <RiCheckLine />
                      Accept
                    </button>
                  </>

                ) : selectedJob.status === "Rejected" ? (

                  <button
                    onClick={() => setSelectedJob(null)}
                    className="w-full h-11 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm"
                  >
                    Close
                  </button>

                ) : (

                  <button
                    onClick={() => setSelectedJob(null)}
                    className="w-full h-11 rounded-xl bg-green-50 text-green-600 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <RiCheckLine />
                    Job Accepted
                  </button>

                )}

              </div>

              {/* CONFIRM REJECT */}

              {showRejectBox && (

                <button
                  onClick={handleReject}
                  disabled={rejectReason.trim() === ""}
                  className={`w-full h-11 mt-3 rounded-xl font-semibold text-sm transition ${
                    rejectReason.trim() === ""
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  Confirm Rejection
                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminPage;