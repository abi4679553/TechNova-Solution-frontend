import React from "react";
import {
    FaBuilding,
    FaUsers,
    FaRocket,
    FaLightbulb,
    FaShieldAlt,
    FaChartLine,
    FaCheckCircle,
} from "react-icons/fa";

const About = () => {
    return (
        <div className="bg-white text-gray-800">

            {/* ================= HERO ================= */}
            <section className="bg-white py-24 px-6 md:px-12 lg:px-20">
                <div className="max-w-6xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <div>

                            <span className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                About TechNova Solutions
                            </span>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
                                We Build
                                <br />
                                <span className="text-blue-600">
                                    Smarter Workplaces
                                </span>
                            </h1>

                            <p className="text-gray-600 text-lg leading-8 max-w-xl mb-6">
                                TechNova Solutions creates modern digital solutions
                                that help organizations simplify their daily work,
                                improve team collaboration and manage operations
                                efficiently.
                            </p>

                            <p className="text-gray-500 leading-7 max-w-xl">
                                Our approach combines simple technology, organized
                                workflows and people-focused design to create a
                                better working experience for modern teams.
                            </p>

                        </div>


                        {/* Right Side - No Logo */}
                        <div className="relative">

                            <div className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-100">

                                <div className="grid grid-cols-2 gap-5">

                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                            01
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Connect
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Bring teams together in one platform.
                                        </p>
                                    </div>

                                    <div className="bg-blue-600 rounded-2xl p-6 text-white">
                                        <div className="text-3xl font-bold mb-2">
                                            02
                                        </div>
                                        <h3 className="font-semibold mb-2">
                                            Collaborate
                                        </h3>
                                        <p className="text-sm text-blue-100">
                                            Work together and share information easily.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 rounded-2xl p-6">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                            03
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Organize
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Manage tasks and workplace activities.
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                            04
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            Grow
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Improve productivity and team performance.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* ================= WHAT WE DO ================= */}
            <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-20">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-14">

                        <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-3">
                            What We Do
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Solutions Designed For Modern Teams
                        </h2>

                        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                            We focus on creating digital tools that improve
                            collaboration, organization and productivity.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                <FaUsers />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Employee Management
                            </h3>

                            <p className="text-gray-600 leading-7">
                                Manage employee information, roles and
                                responsibilities through a structured
                                digital environment.
                            </p>

                        </div>


                        {/* Card 2 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                <FaRocket />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Task Management
                            </h3>

                            <p className="text-gray-600 leading-7">
                                Create, assign and monitor tasks so teams can
                                clearly understand their responsibilities
                                and deadlines.
                            </p>

                        </div>


                        {/* Card 3 */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                <FaChartLine />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Progress Tracking
                            </h3>

                            <p className="text-gray-600 leading-7">
                                Track work progress and monitor activities to
                                help teams stay focused on their goals.
                            </p>

                        </div>

                    </div>

                </div>
            </section>


            {/* ================= OUR STRENGTH ================= */}
            <section className="py-20 px-6 md:px-12 lg:px-20">
                <div className="max-w-6xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                        {/* Left Content */}
                        <div>

                            <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-3">
                                Our Strength
                            </p>

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Designed Around People
                            </h2>

                            <p className="text-gray-600 leading-8 mb-8">
                                We combine technology with a people-focused
                                approach to create an environment where
                                employees and organizations can work more
                                efficiently.
                            </p>

                            <div className="space-y-5">

                                <div className="flex items-start gap-4">
                                    <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Simple & Easy to Use
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Clean and straightforward interfaces
                                            for everyday workplace activities.
                                        </p>
                                    </div>
                                </div>


                                <div className="flex items-start gap-4">
                                    <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Connected Teams
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Keep employees connected and
                                            informed through one platform.
                                        </p>
                                    </div>
                                </div>


                                <div className="flex items-start gap-4">
                                    <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Reliable Technology
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Build dependable digital solutions
                                            for modern organizations.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>


                        {/* Right Stats */}
                        <div className="grid grid-cols-2 gap-5">

                            <div className="bg-blue-50 rounded-2xl p-7">
                                <FaBuilding className="text-blue-600 text-3xl mb-5" />

                                <h3 className="text-2xl font-bold text-gray-900">
                                    One
                                </h3>

                                <p className="text-gray-600 mt-1">
                                    Connected Platform
                                </p>
                            </div>


                            <div className="bg-gray-50 rounded-2xl p-7">
                                <FaUsers className="text-blue-600 text-3xl mb-5" />

                                <h3 className="text-2xl font-bold text-gray-900">
                                    Team
                                </h3>

                                <p className="text-gray-600 mt-1">
                                    Focused Approach
                                </p>
                            </div>


                            <div className="bg-gray-50 rounded-2xl p-7">
                                <FaLightbulb className="text-blue-600 text-3xl mb-5" />

                                <h3 className="text-2xl font-bold text-gray-900">
                                    Smart
                                </h3>

                                <p className="text-gray-600 mt-1">
                                    Digital Solutions
                                </p>
                            </div>


                            <div className="bg-blue-50 rounded-2xl p-7">
                                <FaShieldAlt className="text-blue-600 text-3xl mb-5" />

                                <h3 className="text-2xl font-bold text-gray-900">
                                    Secure
                                </h3>

                                <p className="text-gray-600 mt-1">
                                    Work Environment
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* ================= MISSION & VISION ================= */}
            <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-20">
                <div className="max-w-6xl mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="bg-white rounded-2xl p-8 border border-gray-200">

                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6">
                                <FaRocket />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Our Mission
                            </h3>

                            <p className="text-gray-600 leading-8">
                                To provide simple and effective digital
                                solutions that help organizations improve
                                communication, manage work efficiently and
                                build stronger teams.
                            </p>

                        </div>


                        <div className="bg-blue-600 text-white rounded-2xl p-8">

                            <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <FaLightbulb />
                            </div>

                            <h3 className="text-2xl font-bold mb-4">
                                Our Vision
                            </h3>

                            <p className="text-blue-100 leading-8">
                                To create a connected digital workplace where
                                technology makes collaboration easier,
                                productivity better and organizations more
                                efficient.
                            </p>

                        </div>

                    </div>

                </div>
            </section>


        </div>
    );
};

export default About;