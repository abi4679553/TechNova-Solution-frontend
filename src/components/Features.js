import React from "react";
import {
  FaUsers,
  FaTasks,
  FaComments,
  FaShareAlt,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUsers />,
    title: "Team Collaboration",
    description:
      "Bring your team together and collaborate seamlessly from one powerful platform.",
  },
  {
    icon: <FaTasks />,
    title: "Task Management",
    description:
      "Create, assign and track tasks easily to keep your projects organized.",
  },
  {
    icon: <FaComments />,
    title: "Team Communication",
    description:
      "Communicate with your team quickly and keep everyone updated in real time.",
  },
  {
    icon: <FaShareAlt />,
    title: "Easy File Sharing",
    description:
      "Share important documents and files securely with your team members.",
  },
  {
    icon: <FaChartLine />,
    title: "Project Tracking",
    description:
      "Track project progress and monitor your team's performance effortlessly.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure & Reliable",
    description:
      "Keep your organization's information protected with secure and reliable tools.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-white py-20 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#071426]">
            Everything Your Team Needs
          </h2>

          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            Powerful tools designed to keep your entire organization
            connected, productive and organized.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl p-7
              hover:border-blue-500 hover:shadow-lg
              transition-all duration-300 hover:-translate-y-1"
            >
              
              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center
                rounded-xl bg-blue-50 text-blue-600 text-xl
                group-hover:bg-blue-600 group-hover:text-white
                transition-all duration-300"
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-xl font-semibold text-[#071426]">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-500 text-sm leading-6">
                {feature.description}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;