import React, { useEffect, useMemo, useState } from "react";
import {
    RiBriefcaseLine,
    RiArrowRightLine,
    RiArrowLeftLine,
    RiTimeLine,
    RiCalendarLine,
    RiUserLine,
    RiCheckLine,
    RiCloseLine,
    RiInformationLine,
} from "react-icons/ri";

import logo from "../Assests/logo.png";

const Employee = () => {
    // ================= CURRENT USER =================

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("currentUser");

        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    // ================= STATES =================

    const [jobs, setJobs] = useState([]);
    const [requests, setRequests] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [hours, setHours] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // ================= LOAD DATA =================

    useEffect(() => {
        loadData();

        window.addEventListener("storage", loadData);

        return () => {
            window.removeEventListener("storage", loadData);
        };
    }, []);

    const loadData = () => {
        const savedJobs = JSON.parse(
            localStorage.getItem("jobs") || "[]"
        );

        const savedRequests = JSON.parse(
            localStorage.getItem("pendingJobRequests") ||
                "[]"
        );

        setJobs(savedJobs);
        setRequests(savedRequests);
    };

    // ================= EMPLOYEE JOBS =================

    const employeeJobs = useMemo(() => {
        if (!currentUser) return [];

        return jobs.filter(
            (job) =>
                String(
                    job?.assignedTo?.employeeId
                ) === String(currentUser.employeeId)
        );
    }, [jobs, currentUser]);

    // ================= OPEN JOB =================

    const handleOpenJob = (job) => {
        setSelectedJob(job);

        const existingRequest = requests.find(
            (request) =>
                String(request.jobId) ===
                    String(job.id) &&
                String(request.employeeId) ===
                    String(currentUser.employeeId)
        );

        const initialHours = {};

        if (
            existingRequest &&
            existingRequest.subtasks
        ) {
            existingRequest.subtasks.forEach((task) => {
                initialHours[task.id] =
                    task.estimatedHours;
            });
        } else if (job.subtasks) {
            job.subtasks.forEach((task) => {
                initialHours[task.id] = "";
            });
        }

        setHours(initialHours);
    };

    // ================= BACK =================

    const handleBack = () => {
        setSelectedJob(null);
        setHours({});
    };

    // ================= HOURS CHANGE =================

    const handleHoursChange = (e, taskId) => {
        setHours((prev) => ({
            ...prev,
            [taskId]: e.target.value,
        }));
    };

    // ================= TOTAL =================

    const totalHours = useMemo(() => {
        if (!selectedJob?.subtasks) return 0;

        return selectedJob.subtasks.reduce(
            (total, task) =>
                total +
                Number(hours[task.id] || 0),
            0
        );
    }, [selectedJob, hours]);

    // ================= SUBMIT =================

    const handleSubmit = () => {
        if (!currentUser) {
            alert("Please login again.");
            return;
        }

        if (!selectedJob) return;

        for (const task of selectedJob.subtasks || []) {
            if (
                hours[task.id] === "" ||
                hours[task.id] === undefined ||
                Number(hours[task.id]) <= 0
            ) {
                alert(
                    `Please enter hours for "${task.name}".`
                );
                return;
            }
        }

        setSubmitting(true);

        const submittedTasks = (
            selectedJob.subtasks || []
        ).map((task) => ({
            id: task.id,
            name: task.name,
            estimatedHours: Number(
                hours[task.id]
            ),
        }));

        const newRequest = {
            id: Date.now(),

            jobId: selectedJob.id,

            jobTitle: selectedJob.jobTitle,

            description: selectedJob.description,

            deadline: selectedJob.deadline,

            jobType: selectedJob.jobType,

            employeeId:
                currentUser.employeeId,

            employeeName:
                currentUser.fullName,

            assignedTo:
                selectedJob.assignedTo,

            subtasks: submittedTasks,

            totalHours,

            status: "Pending",

            submittedDate:
                new Date().toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }
                ),
        };

        // ================= REQUEST =================

        const existingRequests =
            JSON.parse(
                localStorage.getItem(
                    "pendingJobRequests"
                ) || "[]"
            );

        const filteredRequests =
            existingRequests.filter(
                (request) =>
                    !(
                        String(
                            request.jobId
                        ) ===
                            String(
                                selectedJob.id
                            ) &&
                        String(
                            request.employeeId
                        ) ===
                            String(
                                currentUser.employeeId
                            ) &&
                        request.status ===
                            "Pending"
                    )
            );

        const updatedRequests = [
            ...filteredRequests,
            newRequest,
        ];

        localStorage.setItem(
            "pendingJobRequests",
            JSON.stringify(
                updatedRequests
            )
        );

        setRequests(updatedRequests);

        // ================= UPDATE JOB =================

        const updatedJobs = jobs.map(
            (job) => {
                if (
                    String(job.id) !==
                    String(selectedJob.id)
                ) {
                    return job;
                }

                return {
                    ...job,

                    status:
                        "Pending Approval",

                    employeeEstimate: {
                        employeeId:
                            currentUser.employeeId,

                        employeeName:
                            currentUser.fullName,

                        subtasks:
                            submittedTasks,

                        totalHours,
                    },

                    approvalRequestId:
                        newRequest.id,
                };
            }
        );

        localStorage.setItem(
            "jobs",
            JSON.stringify(updatedJobs)
        );

        setJobs(updatedJobs);

        setSelectedJob({
            ...selectedJob,

            status:
                "Pending Approval",

            employeeEstimate: {
                employeeId:
                    currentUser.employeeId,

                employeeName:
                    currentUser.fullName,

                subtasks:
                    submittedTasks,

                totalHours,
            },
        });

        setSubmitting(false);

        alert(
            "Submitted successfully. Waiting for admin approval."
        );
    };

    // ================= STATUS =================

    const getStatusClass = (status) => {
        if (status === "Accepted") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Rejected") {
            return "bg-red-100 text-red-700";
        }

        if (status === "Pending Approval") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-blue-100 text-blue-700";
    };

    // ================= LOGIN CHECK =================

    if (!currentUser) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center p-5">

                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">

                    <h2 className="text-xl font-bold text-secondary">
                        User details not found
                    </h2>

                    <p className="text-gray-500 text-sm mt-2">
                        Please login again.
                    </p>

                </div>

            </main>
        );
    }

    // ============================================================
    // DETAILS PAGE
    // ============================================================

    if (selectedJob) {
        const status =
            selectedJob.status ||
            "Assigned";

        const locked =
            status === "Pending Approval" ||
            status === "Accepted";

        return (
            <main className="min-h-screen bg-gray-50 py-6">

                <div className="max-w-5xl mx-auto px-5">

                    {/* BACK */}

                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-primary font-semibold text-sm mb-5"
                    >
                        <RiArrowLeftLine />

                        Back to Tasks
                    </button>

                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        {/* LOGO */}

                        <img
                            src={logo}
                            alt="TechNova"
                            className="w-36 h-auto mb-4"
                        />

                        {/* TITLE */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                            <div>

                                <p className="text-primary font-semibold text-xs">
                                    ASSIGNED JOB
                                </p>

                                <h1 className="text-2xl font-bold text-secondary mt-1">
                                    {
                                        selectedJob.jobTitle
                                    }
                                </h1>

                            </div>

                            <span
                                className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusClass(
                                    status
                                )}`}
                            >
                                {status}
                            </span>

                        </div>

                        {/* ================= IMPORTANT DETAILS ================= */}

                        <div className="mt-5 border border-gray-200 rounded-lg p-4">

                            <div className="flex items-center gap-2 mb-4">

                                <RiInformationLine className="text-primary text-xl" />

                                <h2 className="text-lg font-bold text-secondary">
                                    Important Details
                                </h2>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex gap-3">

                                    <RiBriefcaseLine className="text-primary text-xl" />

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Job Title
                                        </p>

                                        <p className="font-semibold text-sm mt-1">
                                            {
                                                selectedJob.jobTitle
                                            }
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <RiUserLine className="text-primary text-xl" />

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Assigned To
                                        </p>

                                        <p className="font-semibold text-sm mt-1">
                                            {
                                                selectedJob
                                                    ?.assignedTo
                                                    ?.employeeName
                                            }
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <RiCalendarLine className="text-primary text-xl" />

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Deadline
                                        </p>

                                        <p className="font-semibold text-sm mt-1">
                                            {
                                                selectedJob.deadline
                                            }
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <RiBriefcaseLine className="text-primary text-xl" />

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Job Type
                                        </p>

                                        <p className="font-semibold text-sm mt-1">
                                            {
                                                selectedJob.jobType
                                            }
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="mt-4 pt-4 border-t">

                                <p className="text-xs text-gray-500">
                                    Description
                                </p>

                                <p className="text-sm text-gray-700 mt-1 leading-6">
                                    {
                                        selectedJob.description
                                    }
                                </p>

                            </div>

                        </div>

                        {/* ================= SUBTASKS ================= */}

                        <div className="mt-5 border border-gray-200 rounded-lg p-4">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-bold text-secondary">
                                        Sub Tasks
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Enter estimated hours for each
                                        subtask.
                                    </p>

                                </div>

                                <div className="bg-blue-50 text-primary px-3 py-2 rounded-lg font-bold text-sm">
                                    {totalHours} hrs
                                </div>

                            </div>

                            {selectedJob.subtasks?.length >
                            0 ? (
                                <div className="overflow-x-auto mt-4">

                                    <table className="w-full border-collapse text-sm">

                                        <thead>

                                            <tr className="bg-blue-50">

                                                <th className="p-3 border text-left">
                                                    #
                                                </th>

                                                <th className="p-3 border text-left">
                                                    Sub Task
                                                </th>

                                                <th className="p-3 border text-left">
                                                    Required Hours
                                                </th>

                                                <th className="p-3 border text-left">
                                                    Your Hours
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {selectedJob.subtasks.map(
                                                (
                                                    task,
                                                    index
                                                ) => (
                                                    <tr
                                                        key={
                                                            task.id
                                                        }
                                                    >

                                                        <td className="p-3 border">
                                                            {
                                                                index +
                                                                1
                                                            }
                                                        </td>

                                                        <td className="p-3 border font-semibold">
                                                            {
                                                                task.name
                                                            }
                                                        </td>

                                                        <td className="p-3 border">
                                                            {
                                                                task.requiredHours
                                                            }{" "}
                                                            hours
                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.5"
                                                                disabled={
                                                                    locked
                                                                }
                                                                value={
                                                                    hours[
                                                                        task
                                                                            .id
                                                                    ] ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleHoursChange(
                                                                        e,
                                                                        task.id
                                                                    )
                                                                }
                                                                placeholder="Hours"
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                                                            />

                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm mt-4">
                                    No subtasks available.
                                </p>
                            )}

                            {/* TOTAL */}

                            <div className="mt-4 bg-blue-50 rounded-lg p-4 flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                    <RiTimeLine className="text-primary text-xl" />

                                    <span className="font-bold text-secondary">
                                        Total Estimated Hours
                                    </span>

                                </div>

                                <strong className="text-primary">
                                    {totalHours} hours
                                </strong>

                            </div>

                            {/* PENDING */}

                            {status ===
                                "Pending Approval" && (
                                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">

                                    <p className="font-semibold text-yellow-800 text-sm">
                                        Waiting for Admin Approval
                                    </p>

                                    <p className="text-yellow-700 text-xs mt-1">
                                        Your estimated hours have been
                                        submitted.
                                    </p>

                                </div>
                            )}

                            {/* ACCEPTED */}

                            {status ===
                                "Accepted" && (
                                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">

                                    <RiCheckLine className="text-green-600 text-xl" />

                                    <div>

                                        <p className="font-semibold text-green-800 text-sm">
                                            Job Accepted
                                        </p>

                                        <p className="text-green-700 text-xs mt-1">
                                            Admin accepted your estimated
                                            hours.
                                        </p>

                                    </div>

                                </div>
                            )}

                            {/* REJECTED */}

                            {status ===
                                "Rejected" && (
                                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">

                                    <RiCloseLine className="text-red-600 text-xl" />

                                    <div>

                                        <p className="font-semibold text-red-800 text-sm">
                                            Job Rejected
                                        </p>

                                        <p className="text-red-700 text-xs mt-1">
                                            Admin rejected this job estimate.
                                        </p>

                                        {selectedJob.rejectionReason && (
                                            <p className="text-red-700 text-xs mt-2">
                                                Reason:{" "}
                                                {
                                                    selectedJob.rejectionReason
                                                }
                                            </p>
                                        )}

                                    </div>

                                </div>
                            )}

                            {/* SUBMIT */}

                            {!locked && (
                                <button
                                    onClick={
                                        handleSubmit
                                    }
                                    disabled={
                                        submitting
                                    }
                                    className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-60"
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit for Approval"}
                                </button>
                            )}

                        </div>

                    </div>

                </div>

            </main>
        );
    }

    // ============================================================
    // EMPLOYEE DASHBOARD
    // ============================================================

    return (
        <main className="min-h-screen bg-gray-50">

            <section className="bg-white border-b border-gray-200">

                <div className="max-w-5xl mx-auto px-5 py-7">

                    <p className="text-primary font-semibold text-xs">
                        EMPLOYEE DASHBOARD
                    </p>

                    <h1 className="text-3xl font-extrabold text-secondary mt-1">
                        Your Tasks
                    </h1>

                    <p className="text-gray-600 text-sm mt-2">
                        View only the jobs assigned to you.
                    </p>

                </div>

            </section>

            <section className="max-w-5xl mx-auto px-5 py-8">

                {employeeJobs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

                        <RiBriefcaseLine className="text-5xl text-gray-300 mx-auto" />

                        <h2 className="text-xl font-bold text-secondary mt-4">
                            No Jobs Assigned
                        </h2>

                        <p className="text-gray-500 text-sm mt-2">
                            No jobs have been assigned to you yet.
                        </p>

                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                        {employeeJobs.map(
                            (job) => {

                                const status =
                                    job.status ||
                                    "Assigned";

                                return (
                                    <div
                                        key={job.id}
                                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition"
                                    >

                                        <div className="flex items-start justify-between">

                                            <div className="w-10 h-10 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-xl">
                                                <RiBriefcaseLine />
                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>

                                        </div>

                                        <h2 className="text-xl font-bold text-secondary mt-4">
                                            {
                                                job.jobTitle
                                            }
                                        </h2>

                                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                                            {
                                                job.description
                                            }
                                        </p>

                                        <div className="mt-4 space-y-2">

                                            <div className="flex items-center gap-2 text-xs text-gray-600">

                                                <RiCalendarLine className="text-primary" />

                                                Deadline:{" "}
                                                <strong>
                                                    {
                                                        job.deadline
                                                    }
                                                </strong>

                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-600">

                                                <RiTimeLine className="text-primary" />

                                                {
                                                    job.subtasks
                                                        ?.length ||
                                                    0
                                                }{" "}
                                                Sub Tasks

                                            </div>

                                        </div>

                                        <button
                                            onClick={() =>
                                                handleOpenJob(
                                                    job
                                                )
                                            }
                                            className="w-full mt-5 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-semibold text-sm"
                                        >
                                            Open Task

                                            <RiArrowRightLine />
                                        </button>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </section>

        </main>
    );
};

export default Employee;