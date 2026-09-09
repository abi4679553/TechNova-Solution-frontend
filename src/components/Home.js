import React from "react";
import logo from "../Assests/logo.png";
import { RiArrowRightLine, RiShieldCheckLine, RiTeamLine, RiChat3Line, RiMegaphoneLine, RiTaskLine, RiDashboardLine, RiNotification3Line, RiUserSettingsLine, RiCheckboxCircleLine, } from "react-icons/ri";

const Home = () => {
    const features = [
        {
            icon: <RiChat3Line />,
            title: "Team Communication",
            text: "Connect with your team and keep conversations organized in one place.",
        },
        {
            icon: <RiMegaphoneLine />,
            title: "Announcements",
            text: "Share important company updates instantly with your entire organization.",
        },
        {
            icon: <RiTaskLine />,
            title: "Project Management",
            text: "Create projects, assign tasks, track progress, and manage deadlines.",
        },
        {
            icon: <RiDashboardLine />,
            title: "Admin Dashboard",
            text: "Get a complete overview of employees, projects, tasks and activities.",
        },
        {
            icon: <RiUserSettingsLine />,
            title: "Employee Management",
            text: "Manage employees, teams, roles and responsibilities efficiently.",
        },
        {
            icon: <RiNotification3Line />,
            title: "Smart Notifications",
            text: "Stay updated with important tasks, messages and company activities.",
        },
    ];

    return (
        <main>

            {/* ================= HERO ================= */}
            <section className="bg-white overflow-hidden">

                <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">

                    {/* ================= LEFT ================= */}
                    <div>

                        <span className="inline-flex items-center bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
                            A Smarter Way to Work Together
                        </span>

                        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-secondary leading-[1.05] tracking-tight">
                            CONNECT.
                            <br />
                            COLLABORATE.
                            <br />
                            <span className="text-primary">GROW.</span>
                        </h1>

                        <p className="text-gray-600 text-lg mt-6 max-w-xl leading-relaxed">
                            Empower your teams with one powerful platform to communicate,
                            manage projects, share updates and stay connected from anywhere.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-8">

                            <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
                                Get Started
                                <RiArrowRightLine />
                            </button>

                            <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition">
                                Explore Features
                            </button>

                        </div>

                        {/* Trust */}
                        <div className="flex flex-wrap gap-6 mt-8 text-sm text-gray-600">

                            <span className="flex items-center gap-2">
                                <RiShieldCheckLine className="text-primary text-lg" />
                                Secure & Reliable
                            </span>

                            <span className="flex items-center gap-2">
                                <RiCheckboxCircleLine className="text-primary text-lg" />
                                Easy to Use
                            </span>

                            <span className="flex items-center gap-2">
                                <RiTeamLine className="text-primary text-lg" />
                                Built for Teams
                            </span>

                        </div>
                    </div>


                    {/* ================= RIGHT SIDE - COMPANY LOGO ================= */}

                    <div className="relative h-[500px] flex items-center justify-center">

                        {/* Background Glow */}
                      
                        

                        {/* Main Logo Card */}
                        <div >

                            <img
                                src={logo}
                                alt="TechNova Solutions"
                                className="min-w-max h-auto object-contain"
                            />

                        </div>
                    </div>

                </div>

            </section>

            {/* ============== FEATURES ================= */}
            <section className="bg-white py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center max-w-2xl mx-auto mb-12">

                       

                        <h2 className="text-4xl font-bold text-secondary mt-2">
                            Everything Your Team Needs
                        </h2>

                        <p className="text-gray-600 mt-4">
                            Powerful tools designed to keep your entire organization
                            connected, productive and organized.
                        </p>

                    </div>


                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {features.map((feature, index) => (

                            <div
                                key={index}
                                className="p-6 border border-gray-200 rounded-xl hover:-translate-y-1 hover:shadow-lg transition duration-300"
                            >

                                <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-2xl mb-5">
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold text-secondary">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600 mt-3 leading-relaxed">
                                    {feature.text}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ================= HOW IT WORKS ================= */}
            <section className="bg-blue-50 py-20">

                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center mb-12">

                        <h2 className="text-4xl font-bold text-secondary">
                            How TechNova Works
                        </h2>

                        <p className="text-gray-600 mt-3">
                            Simple workflow. Better collaboration.
                        </p>

                    </div>


                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="text-center">

                            <div className="w-14 h-14 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                01
                            </div>

                            <h3 className="font-bold text-xl text-secondary mt-5">
                                Create Workspace
                            </h3>

                            <p className="text-gray-600 mt-2">
                                Set up your company workspace and manage your organization.
                            </p>

                        </div>


                        <div className="text-center">

                            <div className="w-14 h-14 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                02
                            </div>

                            <h3 className="font-bold text-xl text-secondary mt-5">
                                Assign & Collaborate
                            </h3>

                            <p className="text-gray-600 mt-2">
                                Create projects, assign tasks and communicate with your team.
                            </p>

                        </div>


                        <div className="text-center">

                            <div className="w-14 h-14 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                03
                            </div>

                            <h3 className="font-bold text-xl text-secondary mt-5">
                                Stay Connected
                            </h3>

                            <p className="text-gray-600 mt-2">
                                Receive updates, complete tasks and track your work.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= CTA ================= */}
            <section className="bg-primary py-16">

                <div className="max-w-5xl mx-auto px-6 text-center text-white">

                    <h2 className="text-4xl font-bold">
                        Ready to Connect Your Team?
                    </h2>

                    <p className="mt-4 text-blue-100 text-lg">
                        Bring your entire company together in one simple,
                        powerful workspace.
                    </p>

                    <button className="mt-8 bg-white text-primary px-7 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                        Start Your Workspace →
                    </button>

                </div>

            </section>

        </main>
    );
};

export default Home;