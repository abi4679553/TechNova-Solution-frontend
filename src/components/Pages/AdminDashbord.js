import React, { useEffect, useState } from "react";
import CreateJob from "../Pages/CreateJob";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = ({ user }) => {

    const navigate = useNavigate();

    // ==========================================
    // CREATE JOB
    // ==========================================

    const [showCreateJob, setShowCreateJob] =
        useState(false);

    // ==========================================
    // NOTIFICATIONS
    // ==========================================

    const [notifications, setNotifications] =
        useState([]);

    // ==========================================
    // JOBS
    // ==========================================

    const [jobs, setJobs] = useState([]);

    // ==========================================
    // LOAD NOTIFICATIONS
    // ==========================================

    const loadNotifications = () => {

        try {

            const saved =
                localStorage.getItem(
                    "adminNotifications"
                );

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

            if (
                event.key ===
                "adminNotifications"
            ) {

                loadNotifications();

            }

            if (
                event.key ===
                "jobs"
            ) {

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
                job.approvalStatus ===
                    "pending" ||
                job.status === "pending"
        ).length;

    const acceptedJobs =
        jobs.filter(
            (job) =>
                job.approvalStatus ===
                    "approved" ||
                job.status === "approved"
        ).length;

    const rejectedJobs =
        jobs.filter(
            (job) =>
                job.approvalStatus ===
                    "rejected" ||
                job.status === "rejected"
        ).length;

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

                        {/* ==================================
                            BELL
                        ================================== */}

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

                        {/* ==================================
                            CREATE JOB
                        ================================== */}

                        <button
                            type="button"
                            onClick={
                                handleCreateJob
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
                        >

                            + Create Job

                        </button>

                    </div>

                </div>

                {/* ======================================
                    CARDS
                ====================================== */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* TOTAL */}

                    <div className="bg-white rounded-xl shadow-sm border p-5">

                        <p className="text-sm text-gray-500">
                            Total Jobs
                        </p>

                        <h2 className="text-3xl font-bold text-gray-800 mt-2">
                            {totalJobs}
                        </h2>

                    </div>

                    {/* PENDING */}

                    <div className="bg-white rounded-xl shadow-sm border p-5">

                        <p className="text-sm text-gray-500">
                            Pending Approval
                        </p>

                        <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                            {pendingJobs}
                        </h2>

                    </div>

                    {/* ACCEPTED */}

                    <div className="bg-white rounded-xl shadow-sm border p-5">

                        <p className="text-sm text-gray-500">
                            Accepted Jobs
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">
                            {acceptedJobs}
                        </h2>

                    </div>

                    {/* REJECTED */}

                    <div className="bg-white rounded-xl shadow-sm border p-5">

                        <p className="text-sm text-gray-500">
                            Rejected Jobs
                        </p>

                        <h2 className="text-3xl font-bold text-red-600 mt-2">
                            {rejectedJobs}
                        </h2>

                    </div>

                </div>

                {/* ======================================
                    NOTIFICATION SUMMARY
                ====================================== */}

                <div className="bg-white rounded-xl shadow-sm border mt-8">

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
                                    navigate(
                                        "/notifications"
                                    )
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
                                        navigate(
                                            "/notifications"
                                        )
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
                    RECENT JOBS
                ====================================== */}

                <div className="bg-white rounded-xl shadow-sm border mt-8">

                    <div className="p-5 border-b">

                        <h2 className="font-semibold text-gray-800">
                            Recent Jobs
                        </h2>

                    </div>

                    {jobs.length === 0 ? (

                        <div className="p-8 text-center text-gray-500">
                            No jobs available
                        </div>

                    ) : (

                        <div className="divide-y">

                            {jobs
                                .slice(0, 10)
                                .map((job, index) => (

                                    <div
                                        key={
                                            job.id ||
                                            job._id ||
                                            index
                                        }
                                        className="p-5 hover:bg-gray-50"
                                    >

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <h3 className="font-semibold text-gray-800">
                                                    {job.jobTitle ||
                                                        job.title ||
                                                        "Untitled Job"}
                                                </h3>

                                                <p className="text-sm text-gray-500 mt-1">

                                                    Project:

                                                    <span className="font-medium ml-1">
                                                        {job.projectId ||
                                                            "-"}
                                                    </span>

                                                </p>

                                                <p className="text-sm text-gray-500">

                                                    Created By:

                                                    <span className="font-medium ml-1">
                                                        {job.createdBy ||
                                                            "-"}
                                                    </span>

                                                </p>

                                            </div>

                                            <div>

                                                {job.approvalStatus ===
                                                    "approved" ||
                                                job.status ===
                                                    "approved" ? (

                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                        Approved
                                                    </span>

                                                ) : job.approvalStatus ===
                                                      "rejected" ||
                                                  job.status ===
                                                      "rejected" ? (

                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                                        Rejected
                                                    </span>

                                                ) : (

                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                                        Pending
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                ))}

                        </div>

                    )}

                </div>

                {/* ======================================
                    CREATE JOB
                ====================================== */}

                {showCreateJob && (

                    <div className="mt-8">

                        <CreateJob
                            user={user}
                            onClose={() =>
                                setShowCreateJob(
                                    false
                                )
                            }
                        />

                    </div>

                )}

            </div>

        </div>

    );

};

export default AdminDashboard;