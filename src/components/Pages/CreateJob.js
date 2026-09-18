import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const CreateJob = ({ user: propUser }) => {

    const navigate = useNavigate();
    const location = useLocation();

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(() => {

        if (propUser) {
            return propUser;
        }

        try {

            const savedUser =
                localStorage.getItem("currentUser");

            return savedUser
                ? JSON.parse(savedUser)
                : null;

        } catch (error) {

            console.error(
                "User Parse Error:",
                error
            );

            return null;
        }
    });

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        projectId: "",
        jobTitle: "",
        jobType: "Full Time",
        description: "",
        startDate: "",
        deadline: "",
    });

    // =====================================================
    // TASKS
    // =====================================================

    const [tasks, setTasks] = useState([
        {
            taskName: "",
            hours: "",
        },
    ]);

    // =====================================================
    // EMPLOYEES
    // =====================================================

    const [employees, setEmployees] = useState([]);

    const [selectedEmployees, setSelectedEmployees] =
        useState([]);

    const [loading, setLoading] = useState(false);

    // =====================================================
    // GET LOGGED USER
    // =====================================================

    useEffect(() => {

        if (propUser) {

            setUser(propUser);

            return;
        }

        try {

            const savedUser =
                localStorage.getItem("currentUser");

            if (savedUser) {

                const parsedUser =
                    JSON.parse(savedUser);

                setUser(parsedUser);

                console.log(
                    "Current User Loaded:",
                    parsedUser
                );

                console.log(
                    "Employee ID:",
                    parsedUser?.Id
                );
            }

        } catch (error) {

            console.error(
                "User Parse Error:",
                error
            );
        }

    }, [propUser]);

    // =====================================================
    // GET ROLE
    // =====================================================

    const role =
        location.pathname === "/admin"
            ? "admin"
            : location.pathname === "/employee"
                ? "employee"
                : user?.role?.toLowerCase() ||
                (
                    user?.Id
                        ?.toUpperCase()
                        .startsWith("ADM")
                        ? "admin"
                        : "employee"
                );

    // =====================================================
    // GET EMPLOYEES
    // =====================================================

    useEffect(() => {

        if (role !== "admin") {
            return;
        }

        try {

            const savedEmployees =
                localStorage.getItem(
                    "employees"
                );

            if (savedEmployees) {

                const parsedEmployees =
                    JSON.parse(
                        savedEmployees
                    );

                setEmployees(
                    Array.isArray(
                        parsedEmployees
                    )
                        ? parsedEmployees
                        : []
                );

            } else {

                setEmployees([]);

            }

        } catch (error) {

            console.error(
                "Employee Load Error:",
                error
            );

            setEmployees([]);
        }

    }, [role]);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // TASK CHANGE
    // =====================================================

    const handleTaskChange = (
        index,
        field,
        value
    ) => {

        const updatedTasks = [
            ...tasks,
        ];

        updatedTasks[index] = {
            ...updatedTasks[index],
            [field]: value,
        };

        setTasks(updatedTasks);
    };

    // =====================================================
    // ADD TASK
    // =====================================================

    const addTask = () => {

        setTasks((prev) => [
            ...prev,

            {
                taskName: "",
                hours: "",
            },
        ]);
    };

    // =====================================================
    // REMOVE TASK
    // =====================================================

    const removeTask = (index) => {

        if (tasks.length === 1) {
            return;
        }

        setTasks((prev) =>
            prev.filter(
                (_, i) =>
                    i !== index
            )
        );
    };

    // =====================================================
    // SELECT EMPLOYEE
    // ADMIN ONLY
    // =====================================================

    const handleEmployeeChange = (e) => {

        const employeeId =
            e.target.value;

        if (!employeeId) {
            return;
        }

        if (role !== "admin") {
            return;
        }

        if (
            !selectedEmployees.includes(
                employeeId
            )
        ) {

            setSelectedEmployees(
                (prev) => [
                    ...prev,
                    employeeId,
                ]
            );
        }
    };

    // =====================================================
    // REMOVE EMPLOYEE
    // =====================================================

    const removeEmployee = (
        employeeId
    ) => {

        if (role !== "admin") {
            return;
        }

        setSelectedEmployees(
            (prev) =>
                prev.filter(
                    (id) =>
                        id !== employeeId
                )
        );
    };

    // =====================================================
    // TOTAL HOURS
    // =====================================================

    const totalHours =
        tasks.reduce(
            (total, task) =>
                total +
                Number(
                    task.hours || 0
                ),
            0
        );

    // =====================================================
    // SUBMIT JOB
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // =================================================
        // GET CURRENT USER
        // =================================================

        let currentUser = user;

        try {

            const savedUser =
                localStorage.getItem(
                    "currentUser"
                );

            if (savedUser) {

                currentUser =
                    JSON.parse(
                        savedUser
                    );
            }

        } catch (error) {

            console.error(
                "Current User Error:",
                error
            );
        }

        // =================================================
        // USER CHECK
        // =================================================

        if (!currentUser?.Id) {

            alert(
                "User information not found. Please login again."
            );

            return;
        }

        console.log(
            "Submitting Employee ID:",
            currentUser.Id
        );

        // =================================================
        // PROJECT ID
        // =================================================

        if (
            !formData.projectId.trim()
        ) {

            alert(
                "Please enter Project ID"
            );

            return;
        }

        // =================================================
        // JOB TITLE
        // =================================================

        if (
            !formData.jobTitle.trim()
        ) {

            alert(
                "Please enter Job Title"
            );

            return;
        }

        // =================================================
        // DESCRIPTION
        // =================================================

        if (
            !formData.description.trim()
        ) {

            alert(
                "Please enter Job Description"
            );

            return;
        }

        // =================================================
        // START DATE
        // =================================================

        if (!formData.startDate) {

            alert(
                "Please select Start Date"
            );

            return;
        }

        // =================================================
        // DUE DATE
        // =================================================

        if (!formData.deadline) {

            alert(
                "Please select Due Date"
            );

            return;
        }

        // =================================================
        // DATE VALIDATION
        // =================================================

        if (
            new Date(
                formData.deadline
            ) <
            new Date(
                formData.startDate
            )
        ) {

            alert(
                "Due Date cannot be before Start Date"
            );

            return;
        }

        // =================================================
        // VALID TASKS
        // =================================================

        const validTasks =
            tasks.filter(
                (task) =>
                    task.taskName.trim() &&
                    Number(task.hours) > 0
            );

        if (
            validTasks.length === 0
        ) {

            alert(
                "Please add at least one valid task"
            );

            return;
        }

        // =================================================
        // EMPLOYEE ASSIGNMENT CHECK
        // =================================================

        if (
            role === "employee" &&
            selectedEmployees.length > 0
        ) {

            alert(
                "Employee cannot assign jobs to other employees"
            );

            return;
        }

        // =================================================
        // JOB DATA
        // =================================================

        const jobData = {

            id: Date.now(),

            projectId:
                formData.projectId.trim(),

            jobTitle:
                formData.jobTitle.trim(),

            jobType:
                formData.jobType,

            jobDescription:
                formData.description.trim(),

            createdBy:
                currentUser.Id,

            createdByName:
                currentUser.fullName,

            createdByRole:
                role,

            startDate:
                formData.startDate,

            dueDate:
                formData.deadline,

            tasks:
                validTasks.map(
                    (task) => ({
                        taskName:
                            task.taskName.trim(),

                        hours:
                            Number(
                                task.hours
                            ),
                    })
                ),

            totalHours:
                totalHours,

            assignedEmployees:
                role === "admin"
                    ? selectedEmployees
                    : [],

            status:
                "pending",

            approvalStatus:
                "pending",

            createdAt:
                new Date().toISOString(),
        };

        // =================================================
        // SAVE JOB
        // =================================================

        try {

            setLoading(true);

            let existingJobs = [];

            try {

                const savedJobs =
                    localStorage.getItem(
                        "jobs"
                    );

                if (savedJobs) {

                    const parsedJobs =
                        JSON.parse(
                            savedJobs
                        );

                    existingJobs =
                        Array.isArray(
                            parsedJobs
                        )
                            ? parsedJobs
                            : [];
                }

            } catch (error) {

                console.error(
                    "Jobs Parse Error:",
                    error
                );

                existingJobs = [];
            }

            // =================================================
            // SAVE JOB
            // =================================================

            const updatedJobs = [
                jobData,
                ...existingJobs,
            ];

            localStorage.setItem(
                "jobs",
                JSON.stringify(
                    updatedJobs
                )
            );

            console.log(
                "Job Saved Successfully:",
                jobData
            );

            // =================================================
            // EMPLOYEE → ADMIN NOTIFICATION
            // =================================================

            if (
                role === "employee"
            ) {

                const notification = {

                    id:
                        Date.now().toString(),

                    type:
                        "job-approval",

                    title:
                        "New Job Approval Request",

                    message:
                        `${currentUser.Id} - ${currentUser.fullName || "Employee"} submitted a new job for approval.`,

                    employeeId:
                        currentUser.Id,

                    employeeName:
                        currentUser.fullName ||
                        "Employee",

                    projectId:
                        formData.projectId.trim(),

                    jobTitle:
                        formData.jobTitle.trim(),

                    jobDescription:
                        formData.description.trim(),

                    jobType:
                        formData.jobType,

                    startDate:
                        formData.startDate,

                    dueDate:
                        formData.deadline,

                    tasks:
                        validTasks.map(
                            (task) => ({

                                taskName:
                                    task.taskName.trim(),

                                hours:
                                    Number(
                                        task.hours
                                    ),

                            })
                        ),

                    totalHours:
                        totalHours,

                    status:
                        "pending",

                    approvalStatus:
                        "pending",

                    isRead:
                        false,

                    createdAt:
                        new Date().toISOString(),
                };

                console.log(
                    "New Admin Notification:",
                    notification
                );

                // =================================================
                // GET OLD NOTIFICATIONS
                // =================================================

                let existingNotifications =
                    [];

                try {

                    const savedNotifications =
                        localStorage.getItem(
                            "adminNotifications"
                        );

                    if (
                        savedNotifications
                    ) {

                        const parsedNotifications =
                            JSON.parse(
                                savedNotifications
                            );

                        existingNotifications =
                            Array.isArray(
                                parsedNotifications
                            )
                                ? parsedNotifications
                                : [];
                    }

                } catch (error) {

                    console.error(
                        "Notification Parse Error:",
                        error
                    );

                    existingNotifications =
                        [];
                }

                // =================================================
                // SAVE NEW NOTIFICATION
                // =================================================

                const updatedNotifications = [

                    notification,

                    ...existingNotifications,

                ];

                localStorage.setItem(
                    "adminNotifications",
                    JSON.stringify(
                        updatedNotifications
                    )
                );

                console.log(
                    "Admin Notification Saved:",
                    updatedNotifications
                );

                // =================================================
                // UPDATE ADMIN BELL IMMEDIATELY
                // =================================================

                window.dispatchEvent(
                    new Event(
                        "adminNotificationsUpdated"
                    )
                );
            }

            // =================================================
            // ADMIN JOB
            // =================================================

            if (
                role === "admin"
            ) {

                alert(
                    "Job created and assigned successfully!"
                );

            }

            // =================================================
            // EMPLOYEE JOB
            // =================================================

            if (
                role === "employee"
            ) {

                alert(
                    "Job submitted successfully! Waiting for Admin approval."
                );

            }

            // =================================================
            // NAVIGATION
            // =================================================

            if (
                role === "admin"
            ) {

                navigate(
                    "/admin"
                );

            } else {

                navigate(
                    "/employee"
                );

            }

        } catch (error) {

            console.error(
                "Create Job Error:",
                error
            );

            alert(
                "Failed to save job."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-slate-50 py-8 px-4">

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}

                <div className="flex items-center gap-4 mb-6">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="p-2 bg-white border rounded-lg hover:bg-gray-100"
                    >

                        <ArrowLeft
                            size={22}
                        />

                    </button>

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">
                            Create Job
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Create and submit a new job
                        </p>

                    </div>

                </div>

                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="bg-white border rounded-2xl shadow-sm p-6 md:p-8"
                >

                    {/* JOB INFORMATION */}

                    <h2 className="text-xl font-semibold text-gray-800 mb-5">
                        Job Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* PROJECT ID */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project ID
                            </label>

                            <input
                                type="text"
                                name="projectId"
                                value={
                                    formData.projectId
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter Project ID"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* JOB TITLE */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                placeholder="Enter Job Title"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* JOB TYPE */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="Full Time">
                                    Full Time
                                </option>

                                <option value="Part Time">
                                    Part Time
                                </option>

                                <option value="Contract">
                                    Contract
                                </option>

                                <option value="Internship">
                                    Internship
                                </option>

                            </select>

                        </div>

                        {/* CREATED BY */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Created By
                            </label>

                            <input
                                type="text"
                                value={
                                    user?.Id || ""
                                }
                                readOnly
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600"
                            />

                        </div>

                    </div>

                    {/* DESCRIPTION */}

                    <div className="mt-6">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            rows="5"
                            placeholder="Enter job description"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* DATES */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={
                                    formData.startDate
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date
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
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>

                    {/* TASKS */}

                    <div className="mt-8">

                        <div className="flex justify-between items-center mb-4">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Tasks
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    addTask
                                }
                                className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
                            >

                                <Plus
                                    size={18}
                                />

                                Add Task

                            </button>

                        </div>

                        <div className="space-y-4">

                            {tasks.map(
                                (
                                    task,
                                    index
                                ) => (

                                    <div
                                        key={
                                            index
                                        }
                                        className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-3 bg-gray-50 border rounded-lg p-4"
                                    >

                                        {/* TASK */}

                                        <div>

                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Task Name
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    task.taskName
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        "taskName",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter task name"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                        </div>

                                        {/* HOURS */}

                                        <div>

                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Hours
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                value={
                                                    task.hours
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        "hours",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Hours"
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                        </div>

                                        {/* DELETE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeTask(
                                                    index
                                                )
                                            }
                                            disabled={
                                                tasks.length ===
                                                1
                                            }
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30"
                                        >

                                            <Trash2
                                                size={20}
                                            />

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                        {/* TOTAL HOURS */}

                        <div className="text-right mt-4">

                            <span className="font-semibold text-gray-700">
                                Total Hours:
                            </span>

                            <span className="ml-2 text-blue-600 font-bold">
                                {totalHours}
                            </span>

                        </div>

                    </div>

                    {/* ASSIGN EMPLOYEES */}

                    <div className="mt-8">

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Assign Employees
                        </h2>

                        <select
                            value=""
                            onChange={
                                handleEmployeeChange
                            }
                            disabled={
                                role !== "admin"
                            }
                            className={`w-full border border-gray-300 rounded-lg px-4 py-3 outline-none ${
                                role === "admin"
                                    ? "bg-white focus:ring-2 focus:ring-blue-500"
                                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                            }`}
                        >

                            <option value="">
                                {role === "admin"
                                    ? "Select Employee"
                                    : "Only Admin can assign employees"}
                            </option>

                            {role === "admin" &&
                                employees.map(
                                    (
                                        employee
                                    ) => (

                                        <option
                                            key={
                                                employee._id ||
                                                employee.Id
                                            }
                                            value={
                                                employee.Id
                                            }
                                        >

                                            {
                                                employee.Id
                                            }

                                            {" - "}

                                            {
                                                employee.fullName
                                            }

                                        </option>

                                    )
                                )}

                        </select>

                        {/* SELECTED EMPLOYEES */}

                        {selectedEmployees.length >
                            0 && (

                                <div className="mt-4 space-y-2">

                                    {selectedEmployees.map(
                                        (
                                            employeeId
                                        ) => (

                                            <div
                                                key={
                                                    employeeId
                                                }
                                                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3"
                                            >

                                                <span className="font-medium text-blue-700">
                                                    {
                                                        employeeId
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeEmployee(
                                                            employeeId
                                                        )
                                                    }
                                                    disabled={
                                                        role !==
                                                        "admin"
                                                    }
                                                    className="text-red-500 hover:text-red-700 disabled:opacity-30"
                                                >

                                                    <Trash2
                                                        size={18}
                                                    />

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        {role ===
                            "employee" && (

                                <p className="mt-2 text-sm text-gray-500">
                                    Only Admin can assign this job
                                    to another employee.
                                </p>

                            )}

                    </div>

                    {/* BUTTONS */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                        >

                            {loading
                                ? "Submitting..."
                                : role === "admin"
                                    ? "Create & Assign Job"
                                    : "Submit for Approval"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateJob;