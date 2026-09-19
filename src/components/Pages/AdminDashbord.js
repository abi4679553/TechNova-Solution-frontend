import React, { useEffect, useState } from "react";
import CreateJob from "../Pages/CreateJob";
import {
    Bell,
    X,
    Search,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    Briefcase,
    Clock,
    Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = ({ user }) => {

    const navigate = useNavigate();

    // ==========================================
    // CREATE JOB MODAL
    // ==========================================

    const [showCreateJob, setShowCreateJob] = useState(false);

    // ==========================================
    // JOB DETAILS MODAL
    // ==========================================

    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobDetails, setShowJobDetails] = useState(false);

    // ==========================================
    // NOTIFICATIONS
    // ==========================================

    const [notifications, setNotifications] = useState([]);

    // ==========================================
    // JOBS
    // ==========================================

    const [jobs, setJobs] = useState([]);

    // ==========================================
    // SEARCH
    // ==========================================

    const [searchTerm, setSearchTerm] = useState("");

    // ==========================================
    // STATUS FILTER
    // ==========================================

    const [statusFilter, setStatusFilter] = useState("all");

    // ==========================================
    // LOAD NOTIFICATIONS
    // ==========================================

    const loadNotifications = () => {
        try {
            const saved =
                localStorage.getItem("adminNotifications");

            if (!saved) {
                setNotifications([]);
                return;
            }

            const data = JSON.parse(saved);

            if (Array.isArray(data)) {
                setNotifications(data);
            } else {
                setNotifications([]);
            }

        } catch (error) {
            console.error(
                "Notification Load Error:",
                error
            );

            setNotifications([]);
        }
    };

    // ==========================================
    // LOAD JOBS
    // ==========================================

    const loadJobs = () => {
        try {
            const saved =
                localStorage.getItem("jobs");

            if (!saved) {
                setJobs([]);
                return;
            }

            const data = JSON.parse(saved);

            if (Array.isArray(data)) {
                setJobs(data);
            } else {
                setJobs([]);
            }

        } catch (error) {
            console.error(
                "Jobs Load Error:",
                error
            );

            setJobs([]);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        loadNotifications();
        loadJobs();
    }, []);

    // ==========================================
    // SAME TAB UPDATE
    // ==========================================

    useEffect(() => {

        const handleNotificationUpdate = () => {
            loadNotifications();
            loadJobs();
        };

        window.addEventListener(
            "adminNotificationsUpdated",
            handleNotificationUpdate
        );

        return () => {
            window.removeEventListener(
                "adminNotificationsUpdated",
                handleNotificationUpdate
            );
        };

    }, []);

    // ==========================================
    // OTHER TAB UPDATE
    // ==========================================

    useEffect(() => {

        const handleStorageChange = (event) => {

            if (event.key === "adminNotifications") {
                loadNotifications();
            }

            if (event.key === "jobs") {
                loadJobs();
            }
        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };

    }, []);

    // ==========================================
    // CREATE JOB
    // ==========================================

    const handleCreateJob = () => {
        setShowCreateJob(true);
    };

    // ==========================================
    // CLOSE CREATE JOB
    // ==========================================

    const handleCloseCreateJob = () => {

        setShowCreateJob(false);

        loadJobs();
        loadNotifications();
    };

    // ==========================================
    // VIEW JOB
    // ==========================================

    const handleViewJob = (job) => {

        setSelectedJob(job);
        setShowJobDetails(true);
    };

    // ==========================================
    // CLOSE JOB DETAILS
    // ==========================================

    const handleCloseJobDetails = () => {

        setSelectedJob(null);
        setShowJobDetails(false);
    };

    // ==========================================
    // DELETE JOB
    // ==========================================

    const handleDeleteJob = (job) => {

        const jobTitle =
            job.jobTitle ||
            job.title ||
            "this job";

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${jobTitle}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            /*
             * Remove ONLY the selected job.
             * Object reference is used here, so
             * other jobs will not be deleted.
             */

            const updatedJobs = jobs.filter(
                (item) => item !== job
            );

            // Update React state
            setJobs(updatedJobs);

            // Update localStorage
            localStorage.setItem(
                "jobs",
                JSON.stringify(updatedJobs)
            );

            // Close details popup
            setSelectedJob(null);
            setShowJobDetails(false);

            // Refresh notifications
            loadNotifications();

            // Notify other components
            window.dispatchEvent(
                new Event("adminNotificationsUpdated")
            );

        } catch (error) {

            console.error(
                "Delete Job Error:",
                error
            );

            alert(
                "Failed to delete the job."
            );
        }
    };

    // ==========================================
    // NOTIFICATION COUNT
    // ==========================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;

    // ==========================================
    // JOB COUNTS
    // ==========================================

    const totalJobs =
        jobs.length;

    const pendingJobs =
        jobs.filter(
            (job) =>
                job.approvalStatus === "pending" ||
                job.status === "pending"
        ).length;

    const acceptedJobs =
        jobs.filter(
            (job) =>
                job.approvalStatus === "approved" ||
                job.status === "approved"
        ).length;

    const rejectedJobs =
        jobs.filter(
            (job) =>
                job.approvalStatus === "rejected" ||
                job.status === "rejected"
        ).length;

    // ==========================================
    // FILTER JOBS
    // ==========================================

    const filteredJobs = jobs.filter((job) => {

        const title =
            job.jobTitle ||
            job.title ||
            "";

        const projectId =
            job.projectId ||
            "";

        const createdBy =
            job.createdBy ||
            "";

        const employeeId =
            job.employeeId ||
            "";

        const searchValue =
            `${title} ${projectId} ${createdBy} ${employeeId}`
                .toLowerCase();

        const matchesSearch =
            searchValue.includes(
                searchTerm.toLowerCase()
            );

        const jobStatus =
            job.approvalStatus ||
            job.status ||
            "pending";

        const matchesStatus =
            statusFilter === "all" ||
            jobStatus === statusFilter;

        return (
            matchesSearch &&
            matchesStatus
        );
    });

    // ==========================================
    // STATUS BADGE
    // ==========================================

    const getStatusBadge = (job) => {

        const status =
            job.approvalStatus ||
            job.status ||
            "pending";

        if (status === "approved") {

            return (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    <CheckCircle size={14} />
                    Approved
                </span>
            );
        }

        if (status === "rejected") {

            return (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                    <XCircle size={14} />
                    Rejected
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                <Clock size={14} />
                Pending
            </span>
        );
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        } catch {

            return date;
        }
    };

    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-gray-50 p-6">

            <div className="max-w-7xl mx-auto">

                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="flex items-center justify-between mb-8">

                    <div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage jobs, employees and approvals
                        </p>

                    </div>

                    <div className="flex items-center gap-4">

                        {/* NOTIFICATION BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/notifications")
                            }
                            className="relative w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
                        >

                            <Bell
                                size={22}
                                className="text-gray-700"
                            />

                            {unreadCount > 0 && (

                                <span className="absolute -top-1 -right-1 min-w-[21px] h-[21px] px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">

                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}

                                </span>
                            )}

                        </button>

                        {/* CREATE JOB */}

                        <button
                            type="button"
                            onClick={handleCreateJob}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition shadow-sm"
                        >
                            + Create Job
                        </button>

                    </div>

                </div>

                {/* ======================================
                    SUMMARY CARDS
                ====================================== */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* TOTAL */}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">

                                <Briefcase
                                    size={23}
                                    className="text-blue-600"
                                />

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Total Jobs
                                </p>

                                <h2 className="text-3xl font-bold text-gray-800 mt-1">
                                    {totalJobs}
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* PENDING */}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">

                                <Clock
                                    size={23}
                                    className="text-yellow-600"
                                />

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Pending Approval
                                </p>

                                <h2 className="text-3xl font-bold text-yellow-600 mt-1">
                                    {pendingJobs}
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* ACCEPTED */}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">

                                <CheckCircle
                                    size={23}
                                    className="text-green-600"
                                />

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Accepted Jobs
                                </p>

                                <h2 className="text-3xl font-bold text-green-600 mt-1">
                                    {acceptedJobs}
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* REJECTED */}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">

                                <XCircle
                                    size={23}
                                    className="text-red-600"
                                />

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Rejected Jobs
                                </p>

                                <h2 className="text-3xl font-bold text-red-600 mt-1">
                                    {rejectedJobs}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ======================================
                    NOTIFICATION SUMMARY
                ====================================== */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">

                    <div className="p-5 border-b">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="font-semibold text-gray-800">
                                    Notifications
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Job approval requests
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/notifications")
                                }
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View All
                            </button>

                        </div>

                    </div>

                    <div className="p-6">

                        {notifications.length === 0 ? (

                            <div className="text-center py-5">

                                <Bell
                                    size={30}
                                    className="mx-auto text-gray-300"
                                />

                                <p className="text-gray-500 mt-2">
                                    No notifications available
                                </p>

                            </div>

                        ) : (

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="font-medium text-gray-800">

                                        You have{" "}

                                        <span className="text-red-500 font-bold">
                                            {unreadCount}
                                        </span>{" "}

                                        unread notification
                                        {unreadCount !== 1
                                            ? "s"
                                            : ""}.

                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Click View All to see job approval requests.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/notifications")
                                    }
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                                >
                                    Open Notifications
                                </button>

                            </div>

                        )}

                    </div>

                </div>

                {/* ======================================
                    JOB APPROVAL TABLE
                ====================================== */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8 overflow-hidden">

                    {/* TABLE HEADER */}

                    <div className="p-5 border-b">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            <div>

                                <h2 className="font-semibold text-gray-800 text-lg">
                                    Job Approvals
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Manage employee job requests and approvals
                                </p>

                            </div>

                            {/* SEARCH + FILTER */}

                            <div className="flex flex-col sm:flex-row gap-3">

                                {/* SEARCH */}

                                <div className="relative">

                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search jobs..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(
                                                e.target.value
                                            )
                                        }
                                        className="w-full sm:w-64 h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    className="h-10 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="all">
                                        All Status
                                    </option>

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="approved">
                                        Approved
                                    </option>

                                    <option value="rejected">
                                        Rejected
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                    {/* TABLE */}

                    {filteredJobs.length === 0 ? (

                        <div className="p-12 text-center">

                            <Briefcase
                                size={42}
                                className="mx-auto text-gray-300"
                            />

                            <p className="text-gray-500 mt-3">
                                No jobs available
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1200px]">

                                <thead className="bg-gray-50 border-b">

                                    <tr>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Job Details
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Employee ID
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Project ID
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Job Type
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Total Hours
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Start Date
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Due Date
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {filteredJobs.map(
                                        (job, index) => (

                                            <tr
                                                key={
                                                    job.id ||
                                                    job._id ||
                                                    index
                                                }
                                                className="hover:bg-gray-50 transition"
                                            >

                                                {/* JOB DETAILS */}

                                                <td className="px-5 py-5">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">

                                                            <Briefcase
                                                                size={18}
                                                                className="text-blue-600"
                                                            />

                                                        </div>

                                                        <div>

                                                            <p className="font-semibold text-gray-800">

                                                                {job.jobTitle ||
                                                                    job.title ||
                                                                    "Untitled Job"}

                                                            </p>

                                                            <p className="text-xs text-gray-500 mt-1">

                                                                Created by:{" "}

                                                                {job.createdBy ||
                                                                    job.employeeId ||
                                                                    "-"}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* EMPLOYEE ID */}

                                                <td className="px-5 py-5 text-sm text-gray-700">

                                                    {job.employeeId ||
                                                        job.createdBy ||
                                                        "-"}

                                                </td>

                                                {/* PROJECT ID */}

                                                <td className="px-5 py-5 text-sm font-medium text-gray-700">

                                                    {job.projectId ||
                                                        "-"}

                                                </td>

                                                {/* JOB TYPE */}

                                                <td className="px-5 py-5">

                                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">

                                                        {job.jobType ||
                                                            job.type ||
                                                            "Full Time"}

                                                    </span>

                                                </td>

                                                {/* TOTAL HOURS */}

                                                <td className="px-5 py-5">

                                                    <div className="flex items-center gap-1.5 text-sm text-gray-700">

                                                        <Clock size={15} />

                                                        {job.totalHours ||
                                                            job.hours ||
                                                            0}{" "}
                                                        hrs

                                                    </div>

                                                </td>

                                                {/* START DATE */}

                                                <td className="px-5 py-5">

                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">

                                                        <Calendar size={15} />

                                                        {formatDate(
                                                            job.startDate
                                                        )}

                                                    </div>

                                                </td>

                                                {/* DUE DATE */}

                                                <td className="px-5 py-5">

                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">

                                                        <Calendar size={15} />

                                                        {formatDate(
                                                            job.dueDate
                                                        )}

                                                    </div>

                                                </td>

                                                {/* STATUS */}

                                                <td className="px-5 py-5">

                                                    {getStatusBadge(job)}

                                                </td>

                                                {/* ACTION */}

                                                <td className="px-5 py-5">

                                                    <div className="flex items-center gap-2">

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewJob(
                                                                    job
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition"
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
                                                            className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                                                            title="Delete Job"
                                                        >

                                                            <Trash2
                                                                size={17}
                                                            />

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

            </div>

            {/* =================================================
                CREATE JOB POPUP
            ================================================= */}

            {showCreateJob && (

                <div
                    className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {
                            handleCloseCreateJob();
                        }

                    }}
                >

                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-gray-800">
                                    Create New Job
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Create and assign a new job
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseCreateJob
                                }
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                            >

                                <X
                                    size={20}
                                    className="text-gray-600"
                                />

                            </button>

                        </div>

                        {/* CREATE JOB */}

                        <div className="p-6">

                            <CreateJob
                                user={user}
                                onClose={
                                    handleCloseCreateJob
                                }
                            />

                        </div>

                    </div>

                </div>

            )}

            {/* =================================================
                JOB DETAILS POPUP
            ================================================= */}

            {showJobDetails && selectedJob && (

                <div
                    className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {
                            handleCloseJobDetails();
                        }

                    }}
                >

                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* DETAILS HEADER */}

                        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-gray-800">
                                    Job Details
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Complete job information
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseJobDetails
                                }
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                            >

                                <X
                                    size={20}
                                    className="text-gray-600"
                                />

                            </button>

                        </div>

                        {/* DETAILS CONTENT */}

                        <div className="p-6">

                            {/* JOB TITLE */}

                            <div className="flex items-center gap-4 mb-6">

                                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">

                                    <Briefcase
                                        size={26}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div>

                                    <h3 className="text-xl font-bold text-gray-800">

                                        {selectedJob.jobTitle ||
                                            selectedJob.title ||
                                            "Untitled Job"}

                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Job Information
                                    </p>

                                </div>

                            </div>

                            {/* DETAILS GRID */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* EMPLOYEE */}

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-1">
                                        Employee ID
                                    </p>

                                    <p className="font-semibold text-gray-800">

                                        {selectedJob.employeeId ||
                                            selectedJob.createdBy ||
                                            "-"}

                                    </p>

                                </div>

                                {/* PROJECT */}

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-1">
                                        Project ID
                                    </p>

                                    <p className="font-semibold text-gray-800">

                                        {selectedJob.projectId ||
                                            "-"}

                                    </p>

                                </div>

                                {/* JOB TYPE */}

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-1">
                                        Job Type
                                    </p>

                                    <p className="font-semibold text-gray-800">

                                        {selectedJob.jobType ||
                                            selectedJob.type ||
                                            "Full Time"}

                                    </p>

                                </div>

                                {/* TOTAL HOURS */}

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-1">
                                        Total Hours
                                    </p>

                                    <p className="font-semibold text-gray-800">

                                        {selectedJob.totalHours ||
                                            selectedJob.hours ||
                                            0}{" "}
                                        hrs

                                    </p>

                                </div>

                                {/* START DATE */}

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-1">
                                        Start Date
                                    </p>

                                    <p className="font-semibold text-gray-800">

                                        {formatDate(
                                            selectedJob.startDate
                                        )}

                                    </p>

                                </div>

                                {/* DUE DATE */}

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-1">
                                        Due Date
                                    </p>

                                    <p className="font-semibold text-gray-800">

                                        {formatDate(
                                            selectedJob.dueDate
                                        )}

                                    </p>

                                </div>

                                {/* CREATED BY */}

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-1">
                                        Created By
                                    </p>

                                    <p className="font-semibold text-gray-800">

                                        {selectedJob.createdBy ||
                                            selectedJob.employeeId ||
                                            "-"}

                                    </p>

                                </div>

                                {/* STATUS */}

                                <div className="bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-2">
                                        Status
                                    </p>

                                    {getStatusBadge(
                                        selectedJob
                                    )}

                                </div>

                            </div>

                            {/* DESCRIPTION */}

                            {selectedJob.description && (

                                <div className="mt-5 bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-2">
                                        Description
                                    </p>

                                    <p className="text-sm text-gray-700 leading-6">

                                        {selectedJob.description}

                                    </p>

                                </div>

                            )}

                            {/* ADDITIONAL DETAILS */}

                            {selectedJob.requirements && (

                                <div className="mt-5 bg-gray-50 rounded-xl p-4">

                                    <p className="text-xs text-gray-500 mb-2">
                                        Requirements
                                    </p>

                                    <p className="text-sm text-gray-700 leading-6">

                                        {selectedJob.requirements}

                                    </p>

                                </div>

                            )}

                            {/* ACTION BUTTONS */}

                            <div className="flex justify-end gap-3 mt-7 pt-5 border-t">

                                {/* CLOSE */}

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseJobDetails
                                    }
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
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
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                                >

                                    <Trash2 size={17} />

                                    Delete Job

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminDashboard;