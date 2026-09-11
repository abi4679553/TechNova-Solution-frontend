import React, { useState } from "react";
import {
    RiBriefcaseLine,
    RiArrowRightLine,
    RiArrowLeftLine,
} from "react-icons/ri";
import logo from "../Assests/logo.png"

const Employee = () => {
    const [showPortfolio, setShowPortfolio] = useState(false);

    const tasks = [
        { id: "requirements", name: "Requirement Analysis", required: 2 },
        { id: "planning", name: "Planning / Wireframe", required: 2 },
        { id: "html", name: "HTML Structure", required: 3 },
        { id: "css", name: "CSS Styling", required: 4 },
        { id: "responsive", name: "Responsive Design", required: 3 },
        { id: "javascript", name: "JavaScript Functionality", required: 5 },
        { id: "react", name: "React Components", required: 6 },
        { id: "integration", name: "React Integration", required: 4 },
        { id: "validation", name: "Form / Validation", required: 3 },
        { id: "testing", name: "Testing & Bug Fixing", required: 3 },
        { id: "review", name: "Final UI Review", required: 2 },
        { id: "documentation", name: "Documentation", required: 2 },
    ];

    const [hours, setHours] = useState({});

    const handleHoursChange = (e) => {
        const { name, value } = e.target;

        setHours({
            ...hours,
            [name]: value,
        });
    };

    const totalHours = tasks.reduce(
        (total, task) => total + Number(hours[task.id] || 0),
        0
    );

    if (showPortfolio) {
        return (
            <main className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-5xl mx-auto px-5">

                    <button
                        onClick={() => setShowPortfolio(false)}
                        className="flex items-center gap-2 text-primary font-semibold mb-5 text-sm"
                    >
                        <RiArrowLeftLine />
                        Back to Tasks
                    </button>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">

                        {/* Logo */}
                        <img
                         src={logo}
                        alt="TechNova"
                        className="w-36 h-auto mb-3"
                        />
                        

                        <h1 className="text-2xl font-bold text-secondary">
                            Portfolio
                        </h1>

                        <p className="text-gray-600 text-sm mt-1">
                            Complete the assigned portfolio task and enter your working hours.
                        </p>

                        {/* Company Details */}
                        <div className="mt-5 border border-gray-200 rounded-lg p-4">
                            <h2 className="text-lg font-bold text-secondary mb-4">
                                Company Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Company Name
                                    </p>
                                    <p className="font-semibold text-gray-800 mt-1 text-sm">
                                        TechNova Solutions
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Location
                                    </p>
                                    <p className="font-semibold text-gray-800 mt-1 text-sm">
                                        Chennai
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Job Type
                                    </p>
                                    <p className="font-semibold text-gray-800 mt-1 text-sm">
                                        Full Time
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Job Reference
                                    </p>
                                    <p className="font-semibold text-gray-800 mt-1 text-sm">
                                        TN-PORT-001
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Job Details */}
                        <div className="mt-4 border border-gray-200 rounded-lg p-4">
                            <h2 className="text-lg font-bold text-secondary mb-4">
                                Job Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Job Title
                                    </p>
                                    <p className="font-semibold text-gray-800 mt-1 text-sm">
                                        Frontend Developer
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Deadline
                                    </p>
                                    <p className="font-semibold text-gray-800 mt-1 text-sm">
                                        20 September 2026
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-xs text-gray-500">
                                        Description
                                    </p>
                                    <p className="text-gray-700 text-sm mt-1">
                                        Develop and complete a responsive portfolio
                                        using frontend technologies and submit
                                        the completed work for approval.
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Task Hours */}
                        <div className="mt-4 border border-gray-200 rounded-lg p-4">

                            <h2 className="text-lg font-bold text-secondary">
                                Task Hours
                            </h2>

                            <p className="text-gray-600 text-sm mt-1">
                                Enter the actual hours spent on each task.
                            </p>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full border-collapse text-sm">

                                    <thead>
                                        <tr className="bg-blue-50">
                                            <th className="text-left p-3 border">
                                                Task
                                            </th>

                                            <th className="text-left p-3 border">
                                                Required Hours
                                            </th>

                                            <th className="text-left p-3 border">
                                                Employee Hours
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {tasks.map((task) => (
                                            <tr key={task.id}>

                                                <td className="p-3 border font-semibold">
                                                    {task.name}
                                                </td>

                                                <td className="p-3 border">
                                                    {task.required} hours
                                                </td>

                                                <td className="p-3 border">
                                                    <input
                                                        type="number"
                                                        name={task.id}
                                                        value={hours[task.id] || ""}
                                                        onChange={handleHoursChange}
                                                        min="0"
                                                        placeholder="Hours"
                                                        className="w-full border border-gray-300 rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>

                            {/* Total Hours */}
                            <div className="mt-4 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-secondary">
                                    Total Hours
                                </h2>

                                <p className="text-lg font-bold text-primary">
                                    {totalHours} hours
                                </p>
                            </div>

                            {/* Send for Approval */}
                            <button
                                className="w-full mt-4 bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                            >
                                Send for Approval
                            </button>

                        </div>

                    </div>
                </div>
            </main>
        );
    }

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
                        Select a task to view details and enter your working hours.
                    </p>

                </div>
            </section>

            <section className="max-w-5xl mx-auto px-5 py-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {/* Portfolio Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition duration-300">

                        <div className="w-10 h-10 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-xl mb-4">
                            <RiBriefcaseLine />
                        </div>

                        <h2 className="text-xl font-bold text-secondary">
                            Portfolio
                        </h2>

                        <p className="text-gray-600 text-sm mt-2">
                            Complete the portfolio task and submit your working hours.
                        </p>

                        <button
                            onClick={() => setShowPortfolio(true)}
                            className="w-full mt-5 flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                        >
                            Open Portfolio
                            <RiArrowRightLine />
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Employee;