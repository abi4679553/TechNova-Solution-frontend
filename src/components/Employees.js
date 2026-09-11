import React , { useEffect,useState }from "react";
import {
    RiSearchLine,
    RiBriefcaseLine,
    RiMapPinLine,
    RiCalendarLine,
    RiArrowRightLine,
} from "react-icons/ri";

const Employee = () => {
    const [jobs, setJobs] = useState([]);

useEffect(() => {
    fetch("http://localhost:5000/jobs")
        .then((response) => response.json())
        .then((data) => {
            setJobs(data.jobs);
        })
        .catch((error) => {
            console.log(error);
        });
}, []);

    

    return (
        <main className="min-h-screen bg-gray-50">

            {/* Header */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">

                    <p className="text-primary font-semibold text-sm">
                        EMPLOYEE DASHBOARD
                    </p>

                    <h1 className="text-4xl font-extrabold text-secondary mt-2">
                        Find Your Next Opportunity
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Explore available jobs and apply for opportunities
                        that match your skills.
                    </p>

                    {/* Search */}
                    <div className="mt-6 max-w-2xl relative">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                </div>
            </section>

            {/* Jobs */}
            <section className="max-w-7xl mx-auto px-6 py-12">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-secondary">
                            Available Jobs
                        </h2>

                        <p className="text-gray-600 mt-1">
                            Choose a job to view complete details.
                        </p>
                    </div>

                    <span className="bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                        {jobs.length} Jobs
                    </span>
                </div>

                {/* Job Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {jobs.map((job, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition duration-300"
                        >

                            {/* Icon */}
                            <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-2xl mb-5">
                                <RiBriefcaseLine />
                            </div>

                            <h3 className="text-xl font-bold text-secondary">
                                {job.title}
                            </h3>

                            <p className="text-primary font-semibold mt-2">
                                {job.company}
                            </p>

                            <div className="mt-5 space-y-3 text-gray-600 text-sm">

                                <div className="flex items-center gap-2">
                                    <RiMapPinLine className="text-primary" />
                                    {job.location}
                                </div>

                                <div className="flex items-center gap-2">
                                    <RiBriefcaseLine className="text-primary" />
                                    {job.jobtype}
                                </div>

                                <div className="flex items-center gap-2">
                                    <RiCalendarLine className="text-primary" />
                                    Deadline: {job.deadline}
                                </div>

                            </div>

                            {/* View Details */}
                            <button
    onClick={() => window.location.href = `/job-details/${job._id}`}
    className="w-full mt-6 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
>
    View Details
    <RiArrowRightLine />
</button>

                        </div>
                    ))}

                </div>

            </section>

        </main>
    );
};

export default Employee;