import React, { useEffect, useState } from "react";
import { Plus, Briefcase } from "lucide-react";
import CreateJob from "./CreateJob";
import { getEmployeeJobs } from "../Services/JobServies";

const EmployeeDashboard = ({ user }) => {
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const employeeId = user?.Id;

  // ============================================
  // FETCH EMPLOYEE JOBS
  // ============================================
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const data = await getEmployeeJobs(employeeId);

      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Fetch Jobs Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================
  useEffect(() => {
    if (employeeId) {
      fetchJobs();
    }
  }, [employeeId]);

  // ============================================
  // UPDATE WHEN ADMIN APPROVES / REJECTS JOB
  // ============================================
  useEffect(() => {
    const handleJobsUpdate = () => {
      console.log("Jobs updated - refreshing employee jobs");
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

  // ============================================
  // JOB COUNTS
  // ============================================

  const pendingJobs = jobs.filter(
    (job) => job.approvalStatus === "pending"
  );

  const acceptedJobs = jobs.filter(
    (job) =>
      job.approvalStatus === "approved" ||
      job.status === "approved"
  );

  const rejectedJobs = jobs.filter(
    (job) =>
      job.approvalStatus === "rejected" ||
      job.status === "rejected"
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Employee Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Welcome, {user?.fullName}
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Employee ID: {employeeId}
            </p>
          </div>

          <button
            onClick={() => setShowCreateJob(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Create Job
          </button>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          {/* My Jobs */}

          <div className="bg-white rounded-xl p-5 shadow-sm border">

            <div className="flex items-center gap-3">

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

          {/* Pending */}

          <div className="bg-white rounded-xl p-5 shadow-sm border">

            <p className="text-sm text-slate-500">
              Pending Approval
            </p>

            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {pendingJobs.length}
            </p>

          </div>

          {/* Accepted */}

          <div className="bg-white rounded-xl p-5 shadow-sm border">

            <p className="text-sm text-slate-500">
              Accepted
            </p>

            <p className="text-2xl font-bold text-green-600 mt-1">
              {acceptedJobs.length}
            </p>

          </div>

          {/* Rejected */}

          <div className="bg-white rounded-xl p-5 shadow-sm border">

            <p className="text-sm text-slate-500">
              Rejected
            </p>

            <p className="text-2xl font-bold text-red-600 mt-1">
              {rejectedJobs.length}
            </p>

          </div>

        </div>

        {/* Job List */}

        <div className="bg-white rounded-xl shadow-sm border">

          <div className="p-5 border-b">

            <h2 className="text-xl font-semibold text-slate-800">
              My Jobs
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Jobs created by you and jobs assigned to you
            </p>

          </div>

          {/* Loading */}

          {loading ? (

            <div className="p-8 text-center text-slate-500">
              Loading jobs...
            </div>

          ) : jobs.length === 0 ? (

            <div className="p-8 text-center text-slate-500">
              No jobs found.
            </div>

          ) : (

            <div className="divide-y">

              {jobs.map((job) => (

                <div
                  key={job._id || job.id}
                  className="p-5 hover:bg-slate-50 transition"
                >

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Job Details */}

                    <div>

                      <h3 className="font-semibold text-lg text-slate-800">
                        {job.jobTitle}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Project ID: {job.projectId}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Job Type: {job.jobType}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Total Hours: {job.totalHours}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Due Date:{" "}
                        {job.dueDate
                          ? new Date(
                              job.dueDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>

                    </div>

                    {/* Status */}

                    <div>

                      {/* PENDING */}

                      {job.approvalStatus === "pending" && (
                        <span className="inline-block px-3 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                          Waiting for Admin
                        </span>
                      )}

                      {/* APPROVED */}

                      {(job.approvalStatus === "approved" ||
                        job.status === "approved") && (
                        <span className="inline-block px-3 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          Accepted
                        </span>
                      )}

                      {/* REJECTED */}

                      {(job.approvalStatus === "rejected" ||
                        job.status === "rejected") && (
                        <div>

                          <span className="inline-block px-3 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                            Rejected
                          </span>

                          {job.rejectionReason && (
                            <p className="text-sm text-red-500 mt-2">
                              Reason:{" "}
                              {job.rejectionReason}
                            </p>
                          )}

                        </div>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* Create Job Modal */}

      {showCreateJob && (
        <CreateJob
          user={user}
          onClose={() => {
            setShowCreateJob(false);
            fetchJobs();
          }}
        />
      )}

    </div>
  );
};

export default EmployeeDashboard;