const API_URL = "https://technova-backend-hv79.onrender.com";

// ===============================
// CREATE JOB
// ===============================
export const createJob = async (jobData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/jobs/create-job`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create job");
  }

  return data;
};

// ===============================
// GET EMPLOYEE JOBS
// ===============================
export const getEmployeeJobs = async (employeeId) => {
    const normalizedEmployeeId =
        String(employeeId).trim().toUpperCase();

        const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/api/jobs/employee-job/${normalizedEmployeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch employee jobs"
        );
    }

    return data;
};


// ===============================
// GET ALL JOBS
// ===============================
export const getAllJobs = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/jobs/all-jobs`,{
    headers : {
      Authorization:`Bearer ${token}`,
    },
  }

  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch jobs");
  }

  return data;
};


// ===============================
// GET PENDING JOBS
// ===============================
export const getPendingJobs = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/api/jobs/pending-jobs`,
    {
      headers:{
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch pending jobs");
  }

  return data;
};


// ===============================
// APPROVE JOB
// ===============================
export const approveJob = async (jobId) => {
  const response = await fetch(
    `${API_URL}/api/jobs/approve/${jobId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to approve job");
  }

  return data;
};


// ===============================
// REJECT JOB
// ===============================
export const rejectJob = async (jobId, rejectionReason = "") => {
  const response = await fetch(
    `${API_URL}/api/jobs/reject/${jobId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
       Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        rejectionReason,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reject job");
  }

  return data;
};


// ===============================
// DELETE JOB
// ===============================
export const deleteJob = async (jobId) => {
  const response = await fetch(
    `${API_URL}/api/jobs/delete/${jobId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete job");
  }

  return data;
};


// ===============================
// GET NOTIFICATIONS
// ===============================
export const getNotifications = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/api/notifications/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data;
};


// ===============================
// MARK NOTIFICATION AS READ
// ===============================
export const markNotificationAsRead = async (notificationId) => {

  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/api/notifications/read/${notificationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to mark notification as read"
    );
  }

  return data;
};


// GET ALL EMPLOYEES
export const getAllEmployees = async () => {

  const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch employees"
        );
    }

    return data;
};  