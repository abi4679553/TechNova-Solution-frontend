import React from "react";
import logo from "../Assests/logo.png";
import { RiArrowRightLine, RiShieldCheckLine, RiTeamLine, RiCheckboxCircleLine, } from "react-icons/ri";
import Features from "./Features";
import About from "./About";

const Home = () => {
   
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
            <section className="bg-white ">
             <Features />
            </section>
            <About />


           
        </main>
    );
};

export default Home;