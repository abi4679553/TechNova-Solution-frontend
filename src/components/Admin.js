import React, { useEffect, useState } from "react";

const Admin = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/applications")
            .then((response) => response.json())
            .then((data) => {
                setApplications(data.applications);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-secondary mb-8">
                Job Applications
            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((application) => (
                    <div
                        key={application._id}
                        className="bg-white rounded-xl border border-gray-200 p-6"
                    >
                        <h2 className="text-xl font-bold text-secondary">
                            {application.name}
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Email: {application.email}
                        </p>

                        <p className="text-gray-600 mt-1">
                            Phone: {application.phone}
                        </p>

                        <p className="text-gray-600 mt-1">
                            Employee ID: {application.employeeId}
                        </p>

                        <p className="text-primary font-semibold mt-4">
                            Status: {application.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;