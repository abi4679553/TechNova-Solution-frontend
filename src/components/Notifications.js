import React, { useEffect, useState } from "react";
import { RiArrowLeftLine, RiBriefcaseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();

  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const savedRequests = JSON.parse(
      localStorage.getItem("pendingJobRequests") || "[]"
    );

    const requests = savedRequests.filter(
      (job) => job.status === "Pending"
    );

    setPendingRequests(requests);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-5xl mx-auto">

        {/* Back Button */}

        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-primary font-semibold text-sm mb-6"
        >
          <RiArrowLeftLine />
          Back to Dashboard
        </button>

        {/* Heading */}

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-secondary">
            New Requests
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View employee requests waiting for approval.
          </p>

        </div>

        {/* Requests */}

        {pendingRequests.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

            <p className="text-gray-500">
              No new requests.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {pendingRequests.map((job) => (

              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition"
              >

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                      <RiBriefcaseLine className="text-xl" />
                    </div>

                    <div>

                      <p className="font-bold text-secondary">
                        {job.employeeId}
                      </p>

                      <p className="text-sm text-gray-500">
                        {job.employeeName}
                      </p>

                    </div>

                  </div>

                  <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs font-semibold">
                    {job.status}
                  </span>

                </div>

                <div className="mt-5">

                  <h2 className="text-lg font-bold text-secondary">
                    {job.task}
                  </h2>

                </div>

                <div className="border-t border-gray-100 mt-4 pt-4">

                  <p className="text-xs text-gray-400">
                    Submitted Date
                  </p>

                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {job.submittedDate}
                  </p>

                </div>

                <button
                  onClick={() => navigate("/admin", {
                    state: {selectedJobId: job.id},
                  })}
                  className="w-full mt-4 bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                >
                  View Request
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
};

export default Notifications;