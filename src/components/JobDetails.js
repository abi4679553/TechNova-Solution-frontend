import React, { useEffect, useState}from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
    RiBriefcaseLine,
    RiMapPinLine,
    RiCalendarLine,
    RiArrowLeftLine,
} from "react-icons/ri";


const JobDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const[ job, setJob] = useState(null);
    

   useEffect(() => {
    fetch(`http://localhost:5000/jobs/${id}`)
        .then((response) => response.json())
        .then((data) => {
            setJob(data.job);
        })
        .catch((error) => {
            console.log(error);
        });
}, [id]);

    if(!job)
    {
        return<div>
            loading...
        </div>
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12">

            <div className="max-w-5xl mx-auto px-6">

                <button
                    onClick={() => navigate("/employee")}
                    className="flex items-center gap-2 text-primary font-semibold mb-8"
                >
                    <RiArrowLeftLine />
                    Back to Jobs
                </button>

                <div className="bg-white rounded-xl border border-gray-200 p-8">

                    <div className="flex items-start gap-5">

                        <div className="w-14 h-14 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-3xl">
                            <RiBriefcaseLine />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-secondary">
                                {job.title}
                            </h1>

                            <p className="text-primary font-semibold mt-2">
                                {job.company}
                            </p>
                        </div>

                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-8">

                        <div className="bg-blue-50 rounded-lg p-4">
                            <RiMapPinLine className="text-primary text-xl" />
                            <p className="text-gray-500 text-sm mt-2">
                                Location
                            </p>
                            <p className="font-semibold text-secondary">
                                {job.location}
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                            <RiBriefcaseLine className="text-primary text-xl" />
                            <p className="text-gray-500 text-sm mt-2">
                                Job Type
                            </p>
                            <p className="font-semibold text-secondary">
                                {job.jobType}
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                            <RiCalendarLine className="text-primary text-xl" />
                            <p className="text-gray-500 text-sm mt-2">
                                Deadline
                            </p>
                            <p className="font-semibold text-secondary">
                                {job.deadline}
                            </p>
                        </div>

                    </div>

                    <div className="mt-10">

                        <h2 className="text-2xl font-bold text-secondary">
                            Job Description
                        </h2>

                        <p className="text-gray-600 mt-4 leading-relaxed">
                        {job.description}
                        </p>

                    </div>

                    <div className="mt-8">

                        <h2 className="text-2xl font-bold text-secondary">
                            Required Skills
                        </h2>

                        <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
                            {job.skills.map((skill,index)=> (
                                <li key = {index}>{skill}</li>
                            ))}
                        </ul>

                    </div>

                    <div className="mt-10">

                        <button
                            onClick={() => navigate(`/apply-job/${id}`)}
                           className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                        >
                        Apply Now
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
};

export default JobDetails;