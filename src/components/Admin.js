import React, { useEffect, useState } from "react";
import {
    RiAddLine,
    RiBriefcaseLine,
    RiCheckLine,
    RiCloseLine,
    RiEyeLine,
    RiNotification3Line,
    RiDeleteBinLine,
    RiTimeLine,
    RiUserLine,
    RiCalendarLine,
} from "react-icons/ri";

const Admin = () => {
    // ================= STATES =================

    const [showCreateJob, setShowCreateJob] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [jobs, setJobs] = useState([]);
    const [requests, setRequests] = useState([]);

    const [formData, setFormData] = useState({
        jobTitle: "",
        description: "",
        deadline: "",
        jobType: "Full Time",
        employeeId: "",
    });

    const [subtasks, setSubtasks] = useState([
        {
            id: `task-${Date.now()}`,
            name: "",
            requiredHours: "",
        },
    ]);

    // ================= EMPLOYEES =================
    // Direct 5 employee IDs

    const employees = [
        {
            employeeId: "EMP001",
            fullName: "EMP001",
        },
        {
            employeeId: "EMP002",
            fullName: "EMP002",
        },
        {
            employeeId: "EMP003",
            fullName: "EMP003",
        },
        {
            employeeId: "EMP004",
            fullName: "EMP004",
        },
        {
            employeeId: "EMP005",
            fullName: "EMP005",
        },
    ];

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
            localStorage.getItem("pendingJobRequests") || "[]"
        );

        setJobs(savedJobs);
        setRequests(savedRequests);
    };

    // ================= FORM CHANGE =================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ================= ADD SUBTASK =================

    const addSubtask = () => {
        setSubtasks((prev) => [
            ...prev,
            {
                id: `task-${Date.now()}-${Math.random()}`,
                name: "",
                requiredHours: "",
            },
        ]);
    };

    // ================= SUBTASK CHANGE =================

    const handleSubtaskChange = (
        index,
        field,
        value
    ) => {
        setSubtasks((prev) => {
            const updated = [...prev];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return updated;
        });
    };

    // ================= DELETE SUBTASK =================

    const deleteSubtask = (index) => {
        if (subtasks.length === 1) {
            alert("At least one subtask is required.");
            return;
        }

        setSubtasks((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // ================= RESET FORM =================

    const resetForm = () => {
        setFormData({
            jobTitle: "",
            description: "",
            deadline: "",
            jobType: "Full Time",
            employeeId: "",
        });

        setSubtasks([
            {
                id: `task-${Date.now()}`,
                name: "",
                requiredHours: "",
            },
        ]);
    };

    // ================= CREATE JOB =================

    const handleCreateJob = (e) => {
        e.preventDefault();

        if (!formData.jobTitle.trim()) {
            alert("Please enter job title.");
            return;
        }

        if (!formData.description.trim()) {
            alert("Please enter job description.");
            return;
        }

        if (!formData.deadline) {
            alert("Please select deadline.");
            return;
        }

        if (!formData.employeeId) {
            alert("Please assign this job to an employee.");
            return;
        }

        const validSubtasks = subtasks.filter(
            (task) => task.name.trim() !== ""
        );

        if (validSubtasks.length === 0) {
            alert("Please add at least one subtask.");
            return;
        }

        const invalidSubtask = validSubtasks.find(
            (task) =>
                !task.requiredHours ||
                Number(task.requiredHours) <= 0
        );

        if (invalidSubtask) {
            alert(
                `Please enter required hours for "${invalidSubtask.name}".`
            );
            return;
        }

        // ================= SELECTED EMPLOYEE =================

        const selectedEmployee = employees.find(
            (employee) =>
                employee.employeeId ===
                formData.employeeId
        );

        if (!selectedEmployee) {
            alert("Employee not found.");
            return;
        }

        // ================= NEW JOB =================

        const newJob = {
            id: Date.now(),

            jobTitle: formData.jobTitle,

            description: formData.description,

            deadline: formData.deadline,

            jobType: formData.jobType,

            assignedTo: {
                employeeId:
                    selectedEmployee.employeeId,

                employeeName:
                    selectedEmployee.fullName,
            },

            subtasks: validSubtasks.map(
                (task) => ({
                    id: task.id,

                    name: task.name,

                    requiredHours:
                        Number(task.requiredHours),
                })
            ),

            status: "Assigned",

            createdDate:
                new Date().toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }
                ),

            employeeEstimate: null,

            approvalRequestId: null,
        };

        // ================= SAVE JOB =================

        const existingJobs = JSON.parse(
            localStorage.getItem("jobs") || "[]"
        );

        const updatedJobs = [
            ...existingJobs,
            newJob,
        ];

        localStorage.setItem(
            "jobs",
            JSON.stringify(updatedJobs)
        );

        setJobs(updatedJobs);

        alert(
            `Job created and assigned to ${selectedEmployee.employeeId}.`
        );

        resetForm();

        setShowCreateJob(false);
    };

    // ================= ACCEPT =================

    const handleAccept = (request) => {
        const confirmed = window.confirm(
            `Accept "${request.jobTitle}" submitted by ${request.employeeName}?`
        );

        if (!confirmed) return;

        // Update request

        const updatedRequests =
            requests.map((item) => {
                if (
                    String(item.id) !==
                    String(request.id)
                ) {
                    return item;
                }

                return {
                    ...item,
                    status: "Accepted",
                    reviewedDate:
                        new Date().toLocaleDateString(
                            "en-GB"
                        ),
                };
            });

        localStorage.setItem(
            "pendingJobRequests",
            JSON.stringify(updatedRequests)
        );

        setRequests(updatedRequests);

        // Update job

        const updatedJobs = jobs.map((job) => {
            if (
                String(job.id) !==
                String(request.jobId)
            ) {
                return job;
            }

            return {
                ...job,
                status: "Accepted",
            };
        });

        localStorage.setItem(
            "jobs",
            JSON.stringify(updatedJobs)
        );

        setJobs(updatedJobs);

        setSelectedRequest(null);

        alert("Job accepted successfully.");
    };

    // ================= REJECT =================

    const handleReject = (request) => {
        const reason = window.prompt(
            "Enter rejection reason:"
        );

        if (reason === null) return;

        if (!reason.trim()) {
            alert("Please enter rejection reason.");
            return;
        }

        // Update request

        const updatedRequests =
            requests.map((item) => {
                if (
                    String(item.id) !==
                    String(request.id)
                ) {
                    return item;
                }

                return {
                    ...item,
                    status: "Rejected",
                    rejectionReason: reason,
                    reviewedDate:
                        new Date().toLocaleDateString(
                            "en-GB"
                        ),
                };
            });

        localStorage.setItem(
            "pendingJobRequests",
            JSON.stringify(updatedRequests)
        );

        setRequests(updatedRequests);

        // Update job

        const updatedJobs = jobs.map((job) => {
            if (
                String(job.id) !==
                String(request.jobId)
            ) {
                return job;
            }

            return {
                ...job,
                status: "Rejected",
                rejectionReason: reason,
            };
        });

        localStorage.setItem(
            "jobs",
            JSON.stringify(updatedJobs)
        );

        setJobs(updatedJobs);

        setSelectedRequest(null);

        alert("Job rejected.");
    };

    // ================= DELETE JOB =================

    const handleDeleteJob = (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        const updatedJobs = jobs.filter(
            (job) =>
                String(job.id) !==
                String(jobId)
        );

        localStorage.setItem(
            "jobs",
            JSON.stringify(updatedJobs)
        );

        setJobs(updatedJobs);
    };

    // ================= PENDING REQUESTS =================

    const pendingRequests = requests.filter(
        (request) =>
            request.status === "Pending"
    );

    return (
        <main className="min-h-screen bg-gray-50">

            {/* ================= HEADER ================= */}

            <section className="bg-white border-b border-gray-200">

                <div className="max-w-6xl mx-auto px-5 py-7">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-primary font-semibold text-xs">
                                ADMIN DASHBOARD
                            </p>

                            <h1 className="text-3xl font-extrabold text-secondary mt-1">
                                Job Management
                            </h1>

                            <p className="text-gray-600 text-sm mt-2">
                                Create jobs, assign employees and manage
                                approval requests.
                            </p>

                        </div>

                        {/* NOTIFICATION */}

                        <div className="relative">

                            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-2xl">
                                <RiNotification3Line />
                            </div>

                            {pendingRequests.length > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-6 h-6 px-1 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {pendingRequests.length}
                                </span>
                            )}

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= CONTENT ================= */}

            <section className="max-w-6xl mx-auto px-5 py-8">

                {/* ================= CREATE BUTTON ================= */}

                {!showCreateJob &&
                    !selectedRequest && (
                        <button
                            onClick={() =>
                                setShowCreateJob(
                                    true
                                )
                            }
                            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                        >
                            <RiAddLine />

                            Create Job
                        </button>
                    )}

                {/* =====================================================
                    CREATE JOB
                ===================================================== */}

                {showCreateJob && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">

                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <h2 className="text-xl font-bold text-secondary">
                                    Create Job
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Create and assign a new job.
                                </p>

                            </div>

                            <button
                                onClick={() => {
                                    setShowCreateJob(
                                        false
                                    );
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <RiCloseLine className="text-2xl" />
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleCreateJob
                            }
                        >

                            {/* ================= BASIC DETAILS ================= */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* JOB TITLE */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Title
                                    </label>

                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={
                                            formData.jobTitle
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter job title"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                                    />

                                </div>

                                {/* DEADLINE */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Deadline
                                    </label>

                                    <input
                                        type="date"
                                        name="deadline"
                                        value={
                                            formData.deadline
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                                    />

                                </div>

                                {/* JOB TYPE */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Type
                                    </label>

                                    <select
                                        name="jobType"
                                        value={
                                            formData.jobType
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                                    >

                                        <option value="Full Time">
                                            Full Time
                                        </option>

                                        <option value="Part Time">
                                            Part Time
                                        </option>

                                        <option value="Internship">
                                            Internship
                                        </option>

                                        <option value="Contract">
                                            Contract
                                        </option>

                                    </select>

                                </div>

                                {/* ================= JOB ASSIGN ================= */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Assign
                                    </label>

                                    <select
                                        name="employeeId"
                                        value={
                                            formData.employeeId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                                    >

                                        <option value="">
                                            Select Employee
                                        </option>

                                        <option value="EMP001">
                                            EMP001
                                        </option>

                                        <option value="EMP002">
                                            EMP002
                                        </option>

                                        <option value="EMP003">
                                            EMP003
                                        </option>

                                        <option value="EMP004">
                                            EMP004
                                        </option>

                                        <option value="EMP005">
                                            EMP005
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* ================= DESCRIPTION ================= */}

                            <div className="mt-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="4"
                                    placeholder="Enter job description"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary resize-none"
                                />

                            </div>

                            {/* ================= SUBTASKS ================= */}

                            <div className="mt-6">

                                <div className="flex items-center justify-between mb-4">

                                    <div>

                                        <h3 className="font-bold text-secondary">
                                            Sub Tasks
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Add tasks and required hours.
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            addSubtask
                                        }
                                        className="flex items-center gap-2 bg-blue-50 text-primary px-4 py-2 rounded-lg text-sm font-semibold"
                                    >
                                        <RiAddLine />

                                        Add Sub Task
                                    </button>

                                </div>

                                <div className="space-y-3">

                                    {subtasks.map(
                                        (
                                            task,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    task.id
                                                }
                                                className="grid grid-cols-1 md:grid-cols-[1fr_180px_45px] gap-3"
                                            >

                                                <input
                                                    type="text"
                                                    value={
                                                        task.name
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleSubtaskChange(
                                                            index,
                                                            "name",
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder={`Sub Task ${
                                                        index +
                                                        1
                                                    }`}
                                                    className="border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                                                />

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={
                                                        task.requiredHours
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleSubtaskChange(
                                                            index,
                                                            "requiredHours",
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Required Hours"
                                                    className="border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteSubtask(
                                                            index
                                                        )
                                                    }
                                                    className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"
                                                >
                                                    <RiDeleteBinLine />
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>

                            </div>

                            {/* ================= CREATE ================= */}

                            <button
                                type="submit"
                                className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                            >
                                Create Job
                            </button>

                        </form>

                    </div>
                )}

                {/* =====================================================
                    APPROVAL REQUEST
                ===================================================== */}

                {selectedRequest && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">

                        <button
                            onClick={() =>
                                setSelectedRequest(
                                    null
                                )
                            }
                            className="flex items-center gap-2 text-primary font-semibold text-sm mb-5"
                        >
                            ← Back to Jobs
                        </button>

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-primary text-xs font-semibold">
                                    APPROVAL REQUEST
                                </p>

                                <h2 className="text-2xl font-bold text-secondary mt-1">
                                    {
                                        selectedRequest.jobTitle
                                    }
                                </h2>

                            </div>

                            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-xs font-bold">
                                {
                                    selectedRequest.status
                                }
                            </span>

                        </div>

                        {/* DETAILS */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                            <div className="bg-gray-50 rounded-lg p-4">

                                <div className="flex items-center gap-2 text-primary">

                                    <RiUserLine />

                                    <p className="text-xs text-gray-500">
                                        Employee
                                    </p>

                                </div>

                                <p className="font-semibold mt-1">
                                    {
                                        selectedRequest.employeeName
                                    }
                                </p>

                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">

                                <div className="flex items-center gap-2 text-primary">

                                    <RiBriefcaseLine />

                                    <p className="text-xs text-gray-500">
                                        Job
                                    </p>

                                </div>

                                <p className="font-semibold mt-1">
                                    {
                                        selectedRequest.jobTitle
                                    }
                                </p>

                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">

                                <div className="flex items-center gap-2 text-primary">

                                    <RiCalendarLine />

                                    <p className="text-xs text-gray-500">
                                        Deadline
                                    </p>

                                </div>

                                <p className="font-semibold mt-1">
                                    {
                                        selectedRequest.deadline
                                    }
                                </p>

                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">

                                <div className="flex items-center gap-2 text-primary">

                                    <RiTimeLine />

                                    <p className="text-xs text-gray-500">
                                        Total Hours
                                    </p>

                                </div>

                                <p className="font-semibold text-primary mt-1">
                                    {
                                        selectedRequest.totalHours
                                    }{" "}
                                    hours
                                </p>

                            </div>

                        </div>

                        {/* SUBTASK TABLE */}

                        <div className="mt-6">

                            <h3 className="font-bold text-secondary mb-3">
                                Employee Estimated Hours
                            </h3>

                            <div className="overflow-x-auto">

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
                                                Required
                                            </th>

                                            <th className="p-3 border text-left">
                                                Employee Hours
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {selectedRequest.subtasks?.map(
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
                                                        {(() => {
                                                            const job =
                                                                jobs.find(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        String(
                                                                            item.id
                                                                        ) ===
                                                                        String(
                                                                            selectedRequest.jobId
                                                                        )
                                                                );

                                                            const originalTask =
                                                                job?.subtasks?.find(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        String(
                                                                            item.id
                                                                        ) ===
                                                                        String(
                                                                            task.id
                                                                        )
                                                                );

                                                            return (
                                                                originalTask?.requiredHours ||
                                                                "-"
                                                            );
                                                        })()}{" "}
                                                        hrs
                                                    </td>

                                                    <td className="p-3 border font-bold text-primary">
                                                        {
                                                            task.estimatedHours
                                                        }{" "}
                                                        hrs
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* ACCEPT / REJECT */}

                        {selectedRequest.status ===
                            "Pending" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">

                                <button
                                    onClick={() =>
                                        handleAccept(
                                            selectedRequest
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold"
                                >
                                    <RiCheckLine />

                                    Accept
                                </button>

                                <button
                                    onClick={() =>
                                        handleReject(
                                            selectedRequest
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold"
                                >
                                    <RiCloseLine />

                                    Reject
                                </button>

                            </div>
                        )}

                    </div>
                )}

                {/* =====================================================
                    JOB TABLE
                ===================================================== */}

                {!showCreateJob &&
                    !selectedRequest && (
                    <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">

                        <div className="p-5 border-b border-gray-200 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-secondary">
                                    Created Jobs
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    All jobs created and assigned by admin.
                                </p>

                            </div>

                            {pendingRequests.length >
                                0 && (
                                <span className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-bold">
                                    {
                                        pendingRequests.length
                                    }{" "}
                                    Pending
                                </span>
                            )}

                        </div>

                        {jobs.length === 0 ? (
                            <div className="p-10 text-center">

                                <RiBriefcaseLine className="text-5xl text-gray-300 mx-auto" />

                                <p className="text-gray-500 text-sm mt-3">
                                    No jobs created yet.
                                </p>

                            </div>
                        ) : (
                            <div className="overflow-x-auto">

                                <table className="w-full border-collapse text-sm">

                                    <thead>

                                        <tr className="bg-gray-50">

                                            <th className="p-4 border text-left">
                                                Job
                                            </th>

                                            <th className="p-4 border text-left">
                                                Assigned To
                                            </th>

                                            <th className="p-4 border text-left">
                                                Deadline
                                            </th>

                                            <th className="p-4 border text-left">
                                                Status
                                            </th>

                                            <th className="p-4 border text-center">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {jobs.map(
                                            (job) => (
                                                <tr
                                                    key={
                                                        job.id
                                                    }
                                                >

                                                    <td className="p-4 border">

                                                        <p className="font-bold text-secondary">
                                                            {
                                                                job.jobTitle
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {
                                                                job.jobType
                                                            }
                                                        </p>

                                                    </td>

                                                    <td className="p-4 border">

                                                        <p className="font-semibold">
                                                            {
                                                                job
                                                                    ?.assignedTo
                                                                    ?.employeeName
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {
                                                                job
                                                                    ?.assignedTo
                                                                    ?.employeeId
                                                            }
                                                        </p>

                                                    </td>

                                                    <td className="p-4 border">
                                                        {
                                                            job.deadline
                                                        }
                                                    </td>

                                                    <td className="p-4 border">

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                job.status ===
                                                                "Accepted"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : job.status ===
                                                                      "Rejected"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : job.status ===
                                                                      "Pending Approval"
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : "bg-blue-100 text-blue-700"
                                                            }`}
                                                        >
                                                            {
                                                                job.status
                                                            }
                                                        </span>

                                                    </td>

                                                    <td className="p-4 border">

                                                        <div className="flex justify-center gap-2">

                                                            {/* VIEW REQUEST */}

                                                            <button
                                                                onClick={() => {

                                                                    const request =
                                                                        requests.find(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                String(
                                                                                    item.jobId
                                                                                ) ===
                                                                                    String(
                                                                                        job.id
                                                                                    ) &&
                                                                                item.status ===
                                                                                    "Pending"
                                                                        );

                                                                    if (
                                                                        request
                                                                    ) {
                                                                        setSelectedRequest(
                                                                            request
                                                                        );
                                                                    } else {
                                                                        alert(
                                                                            "No pending request for this job."
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-9 h-9 bg-blue-50 text-primary rounded-lg flex items-center justify-center"
                                                            >
                                                                <RiEyeLine />
                                                            </button>

                                                            {/* DELETE */}

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteJob(
                                                                        job.id
                                                                    )
                                                                }
                                                                className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"
                                                            >
                                                                <RiDeleteBinLine />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>
                )}

                {/* =====================================================
                    NOTIFICATIONS
                ===================================================== */}

                {!showCreateJob &&
                    !selectedRequest &&
                    pendingRequests.length >
                        0 && (
                        <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">

                            <div className="p-5 border-b border-gray-200">

                                <div className="flex items-center gap-2">

                                    <RiNotification3Line className="text-primary text-xl" />

                                    <h2 className="text-xl font-bold text-secondary">
                                        Approval Notifications
                                    </h2>

                                </div>

                                <p className="text-gray-500 text-sm mt-1">
                                    Employees who submitted their estimated
                                    working hours.
                                </p>

                            </div>

                            <div className="divide-y">

                                {pendingRequests.map(
                                    (
                                        request
                                    ) => (
                                        <div
                                            key={
                                                request.id
                                            }
                                            className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                        >

                                            <div>

                                                <h3 className="font-bold text-secondary">
                                                    {
                                                        request.jobTitle
                                                    }
                                                </h3>

                                                <p className="text-sm text-gray-600 mt-1">
                                                    {
                                                        request.employeeName
                                                    }{" "}
                                                    submitted{" "}
                                                    <strong>
                                                        {
                                                            request.totalHours
                                                        }{" "}
                                                        hours
                                                    </strong>
                                                    .
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    Submitted:{" "}
                                                    {
                                                        request.submittedDate
                                                    }
                                                </p>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    setSelectedRequest(
                                                        request
                                                    )
                                                }
                                                className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
                                            >
                                                Review Request
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    )}

            </section>

        </main>
    );
};

export default Admin;