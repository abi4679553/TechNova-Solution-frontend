const API_URL = "https://technova-backend-hv79.onrender.com";

// ==============================
// CREATE JOB
// ==============================

export const createJob = async (jobData) => {
  const response = await fetch(
    `${API_URL}/api/jobs/create-job`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(jobData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create job"
    );
  }

  return data;
};


// ==============================
// GET EMPLOYEE JOBS
// ==============================

export const getEmployeeJobs = async (employeeId) => {
  const normalizedEmployeeId =
    String(employeeId).trim().toLowerCase();

  const response = await fetch(
    `${API_URL}/api/jobs/employee-job/${normalizedEmployeeId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch jobs"
    );
  }

  return data;
};

// ==============================
// GET EMPLOYEES
// ==============================

export const getEmployees = async () => {
  const response = await fetch(
    `${API_URL}/api/jobs/employees`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch employees"
    );
  }

  return data;
};


// ==============================
// GET NOTIFICATIONS
// ==============================

export const getNotifications = async (userId) => {
  const response = await fetch(
    `${API_URL}/api/notifications/${userId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch notifications"
    );
  }

  return data;
};