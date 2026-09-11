import React from "react";
import { RiArrowLeftLine, RiUploadLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

const ApplyJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    formData.append("jobId", id);
    formData.append("employeeId", "EMP001");

    try {
        const response = await fetch("http://localhost:5000/applications", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            alert("Application submitted successfully");
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
};
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-6">

                <button
                    onClick={() => navigate(`/job-details/${id}`)}
                    className="flex items-center gap-2 text-primary font-semibold mb-8"
                >
                    <RiArrowLeftLine />
                    Back to Job
                </button>

                <div className="bg-white border border-gray-200 rounded-xl p-8">

                    <h1 className="text-3xl font-bold text-secondary">
                        Apply for Job
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Submit your details to apply for this opportunity.
                    </p>

                    <form  onSubmit={handleSubmit} className="mt-8 space-y-6">

                        <div>
                            <label className="block font-semibold text-secondary mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-secondary mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-secondary mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-secondary mb-2">
                                Resume
                            </label>
                            

                            <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-4 cursor-pointer hover:bg-gray-50">
                                <RiUploadLine className="text-primary text-xl" />
                                <span className="text-gray-600">
                                    Upload your resume
                                </span>

                                <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                        >
                            Submit Application
                        </button>

                    </form>

                </div>
            </div>
        </main>
    );
};

export default ApplyJob;