import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Plus,
    Trash2,
} from "lucide-react";

import {
    createJob,
    getAllEmployees,
} from "../../components/Services/Api";

// =====================================================
// SAFE LOCAL STORAGE USER
// =====================================================

const getStoredUser = () => {
    try {
        const savedUser = localStorage.getItem("currentUser");

        if (
            !savedUser ||
            savedUser === "undefined" ||
            savedUser === "null"
        ) {
            return null;
        }

        const parsedUser = JSON.parse(savedUser);

        if (!parsedUser || typeof parsedUser !== "object") {
            return null;
        }

        return parsedUser;
    } catch (error) {
        console.error("Stored User Error:", error);
        return null;
    }
};

// =====================================================
// CREATE JOB
// =====================================================

const CreateJob = ({ user: propUser, onClose }) => {
    const navigate = useNavigate();

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(() => {
        if (propUser) {
            return propUser;
        }

        return getStoredUser();
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
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [employeeLoading, setEmployeeLoading] = useState(false);

    // =====================================================
    // UPDATE USER
    // =====================================================

    useEffect(() => {
        if (propUser) {
            setUser(propUser);

            console.log("Current User:", propUser);
            console.log("Current User ID:", propUser?.Id);
        } else {
            const storedUser = getStoredUser();

            if (storedUser) {
                setUser(storedUser);

                console.log("Current User:", storedUser);
                console.log("Current User ID:", storedUser?.Id);
            } else {
                console.log("No valid currentUser found");
            }
        }
    }, [propUser]);

    // =====================================================
    // ROLE
    // =====================================================

    const role =
        user?.role?.toLowerCase() ||
        (String(user?.Id || "")
            .toUpperCase()
            .startsWith("ADM")
            ? "admin"
            : "employee");

    const isAdmin = role === "admin";
    const isEmployee = role === "employee";

    // =====================================================
    // DEBUG
    // =====================================================

    useEffect(() => {
        console.log("================================");
        console.log("CREATE JOB");
        console.log("User:", user);
        console.log("User ID:", user?.Id);
        console.log("Role:", role);
        console.log("Is Admin:", isAdmin);
        console.log("Is Employee:", isEmployee);
        console.log("================================");
    }, [user, role, isAdmin, isEmployee]);

    // =====================================================
    // GET EMPLOYEES FROM BACKEND
    // ADMIN ONLY
    // =====================================================

    useEffect(() => {
        const fetchEmployees = async () => {
            // Employee login என்றால் employee list தேவையில்லை
            if (!isAdmin) {
                setEmployees([]);
                return;
            }

            try {
                setEmployeeLoading(true);

                console.log("================================");
                console.log("FETCHING EMPLOYEES");
                console.log("GET /employees");
                console.log("================================");

                const data = await getAllEmployees();

                console.log("Employees API Response:", data);

                if (
                    data?.success &&
                    Array.isArray(data?.employees)
                ) {
                    setEmployees(data.employees);

                    console.log(
                        "Employees Loaded:",
                        data.employees
                    );

                    console.log(
                        "Employee Count:",
                        data.employees.length
                    );
                } else {
                    setEmployees([]);

                    console.log(
                        "No employees found from backend"
                    );
                }
            } catch (error) {
                console.error(
                    "Fetch Employees Error:",
                    error
                );

                setEmployees([]);

                alert(
                    error.message ||
                        "Failed to load employees"
                );
            } finally {
                setEmployeeLoading(false);
            }
        };

        fetchEmployees();
    }, [isAdmin]);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

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
        setTasks((prev) =>
            prev.map((task, i) =>
                i === index
                    ? {
                          ...task,
                          [field]: value,
                      }
                    : task
            )
        );
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
            prev.filter((_, i) => i !== index)
        );
    };

    // =====================================================
    // SELECT EMPLOYEE
    // =====================================================

    const handleEmployeeChange = (e) => {
        const employeeId = e.target.value;

        if (!employeeId) {
            return;
        }

        if (!isAdmin) {
            return;
        }

        if (!selectedEmployees.includes(employeeId)) {
            setSelectedEmployees((prev) => [
                ...prev,
                employeeId,
            ]);
        }
    };

    // =====================================================
    // REMOVE EMPLOYEE
    // =====================================================

    const removeEmployee = (employeeId) => {
        if (!isAdmin) {
            return;
        }

        setSelectedEmployees((prev) =>
            prev.filter(
                (id) => id !== employeeId
            )
        );
    };

    // =====================================================
    // TOTAL HOURS
    // =====================================================

    const totalHours = tasks.reduce(
        (total, task) =>
            total + Number(task.hours || 0),
        0
    );

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const handleClose = () => {
        if (onClose) {
            onClose();
            return;
        }

        navigate(-1);
    };

    // =====================================================
    // SUBMIT JOB
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // =================================================
        // CURRENT USER
        // =================================================

        const currentUser =
            user || getStoredUser();

        // =================================================
        // USER VALIDATION
        // =================================================

        if (!currentUser?.Id) {
            alert(
                "User information not found. Please login again."
            );

            console.error(
                "Invalid User:",
                currentUser
            );

            return;
        }

        console.log(
            "Submitting Job By:",
            currentUser.Id
        );

        console.log(
            "Submitting Job Role:",
            role
        );

        // =================================================
        // PROJECT ID
        // =================================================

        if (!formData.projectId.trim()) {
            alert("Please enter Project ID");
            return;
        }

        // =================================================
        // JOB TITLE
        // =================================================

        if (!formData.jobTitle.trim()) {
            alert("Please enter Job Title");
            return;
        }

        // =================================================
        // DESCRIPTION
        // =================================================

        if (!formData.description.trim()) {
            alert("Please enter Job Description");
            return;
        }

        // =================================================
        // START DATE
        // =================================================

        if (!formData.startDate) {
            alert("Please select Start Date");
            return;
        }

        // =================================================
        // DUE DATE
        // =================================================

        if (!formData.deadline) {
            alert("Please select Due Date");
            return;
        }

        // =================================================
        // DATE VALIDATION
        // =================================================

        if (
            new Date(formData.deadline) <
            new Date(formData.startDate)
        ) {
            alert(
                "Due Date cannot be before Start Date"
            );

            return;
        }

        // =================================================
        // ADMIN EMPLOYEE VALIDATION
        // =================================================

        if (
            isAdmin &&
            selectedEmployees.length === 0
        ) {
            alert(
                "Please select at least one Employee ID"
            );

            return;
        }

        // =================================================
        // VALID TASKS
        // =================================================

        const validTasks = tasks.filter(
            (task) =>
                task.taskName.trim() &&
                Number(task.hours) > 0
        );

        if (validTasks.length === 0) {
            alert(
                "Please add at least one valid task"
            );

            return;
        }

        // =================================================
        // ASSIGNED EMPLOYEES
        // =================================================

        const assignedEmployees = isAdmin
            ? selectedEmployees
            : [];

        // =================================================
        // JOB DATA
        // =================================================

        const jobData = {
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

            createdByRole:
                role,

            startDate:
                formData.startDate,

            dueDate:
                formData.deadline,

            tasks:
                validTasks.map((task) => ({
                    taskName:
                        task.taskName.trim(),

                    hours:
                        Number(task.hours),
                })),

            totalHours:
                totalHours,

            assignedEmployees:
                assignedEmployees,
        };

        console.log("================================");
        console.log("SENDING JOB TO BACKEND");
        console.log("JOB DATA:", jobData);
        console.log("================================");

        // =================================================
        // SAVE TO BACKEND
        // =================================================

        try {
            setLoading(true);

            const response =
                await createJob(jobData);

            console.log(
                "Backend Create Job Response:",
                response
            );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Failed to create job"
                );
            }

            console.log(
                "✅ Job saved successfully in MongoDB"
            );

            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            if (isAdmin) {
                alert(
                    "Job created and assigned successfully!"
                );
            } else {
                alert(
                    "Job submitted successfully! Waiting for Admin approval."
                );
            }

            // =================================================
            // UPDATE EVENT
            // =================================================

            window.dispatchEvent(
                new Event("jobsUpdated")
            );

            // =================================================
            // NAVIGATION
            // =================================================

            if (onClose) {
                onClose();
            } else if (isAdmin) {
                navigate("/admin");
            } else {
                navigate("/employee");
            }
        } catch (error) {
            console.error(
                "❌ Create Job Error:",
                error
            );

            alert(
                error.message ||
                    "Failed to create job. Please try again."
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

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center gap-4 mb-6">

                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 bg-white border rounded-lg hover:bg-gray-100 transition"
                    >
                        <ArrowLeft size={22} />
                    </button>

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">
                            Create Job
                        </h1>

                        <p className="text-gray-500 mt-1">
                            {isAdmin
                                ? "Create and assign a job to employees"
                                : "Create and submit a job for admin approval"}
                        </p>

                    </div>

                </div>

                {/* =================================================
                    USER / ROLE INFO
                ================================================= */}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                        <div>

                            <p className="text-xs text-blue-500 font-medium">
                                Logged in as
                            </p>

                            <p className="font-semibold text-blue-800">
                                {user?.fullName ||
                                    user?.name ||
                                    "User"}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-blue-500 font-medium">
                                Role
                            </p>

                            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold capitalize">
                                {role}
                            </span>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border rounded-2xl shadow-sm p-6 md:p-8"
                >

                    {/* =================================================
                        JOB INFORMATION
                    ================================================= */}

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
                                value={formData.projectId}
                                onChange={handleChange}
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
                                value={formData.jobTitle}
                                onChange={handleChange}
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
                                value={formData.jobType}
                                onChange={handleChange}
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
                                value={user?.Id || ""}
                                readOnly
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />

                        </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div className="mt-6">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Enter job description"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* =================================================
                        DATES
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
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
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>

                    {/* =================================================
                        TASKS
                    ================================================= */}

                    <div className="mt-8">

                        <div className="flex justify-between items-center mb-4">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Tasks
                            </h2>

                            <button
                                type="button"
                                onClick={addTask}
                                className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
                            >
                                <Plus size={18} />
                                Add Task
                            </button>

                        </div>

                        <div className="space-y-4">

                            {tasks.map(
                                (task, index) => (

                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-3 bg-gray-50 border rounded-lg p-4"
                                    >

                                        {/* TASK NAME */}

                                        <div>

                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Task Name
                                            </label>

                                            <input
                                                type="text"
                                                value={task.taskName}
                                                onChange={(e) =>
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
                                                value={task.hours}
                                                onChange={(e) =>
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
                                                removeTask(index)
                                            }
                                            disabled={
                                                tasks.length === 1
                                            }
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30"
                                        >
                                            <Trash2 size={20} />
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

                    {/* =================================================
                        ASSIGN EMPLOYEES
                        ADMIN ONLY
                    ================================================= */}

                    {isAdmin && (

                        <div className="mt-8">

                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Assign Employees
                            </h2>

                            {/* EMPLOYEE DROPDOWN */}

                            <select
                                value=""
                                onChange={handleEmployeeChange}
                                disabled={employeeLoading}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >

                                <option value="">
                                    {employeeLoading
                                        ? "Loading Employees..."
                                        : "Select Employee ID"}
                                </option>

                                {!employeeLoading &&
                                    employees.length === 0 && (
                                        <option
                                            value=""
                                            disabled
                                        >
                                            No employees available
                                        </option>
                                    )}

                                {!employeeLoading &&
                                    employees.map(
                                        (
                                            employee,
                                            index
                                        ) => {

                                            const employeeId =
                                                employee?.Id ||
                                                employee?.employeeId ||
                                                employee?.id;

                                            const employeeName =
                                                employee?.fullName ||
                                                employee?.name ||
                                                "Employee";

                                            if (!employeeId) {
                                                return null;
                                            }

                                            return (
                                                <option
                                                    key={
                                                        employee?._id ||
                                                        employeeId ||
                                                        index
                                                    }
                                                    value={
                                                        employeeId
                                                    }
                                                >
                                                    {
                                                        employeeId
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        employeeName
                                                    }
                                                </option>
                                            );
                                        }
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
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>
                            )}

                        </div>
                    )}

                    {/* =================================================
                        EMPLOYEE INFORMATION
                    ================================================= */}

                    {isEmployee && (

                        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">

                            <p className="text-sm font-semibold text-yellow-800">
                                Approval Required
                            </p>

                            <p className="text-sm text-yellow-700 mt-1">
                                After submitting this job, it will be sent to the Admin for approval.
                            </p>

                        </div>

                    )}

                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">

                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Submitting..."
                                : isAdmin
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