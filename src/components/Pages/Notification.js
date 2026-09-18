import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  X,
  User,
  Briefcase,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // ============================================
  // LOAD ADMIN NOTIFICATIONS
  // ============================================
  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem("adminNotifications");

      console.log("=================================");
      console.log("🔥 NOTIFICATIONS PAGE LOADED");
      console.log("adminNotifications:", saved);
      console.log("=================================");

      if (!saved) {
        setNotifications([]);
        return;
      }

      const parsed = JSON.parse(saved);

      console.log("✅ Parsed notifications:", parsed);
      console.log(
        "✅ Notification count:",
        Array.isArray(parsed) ? parsed.length : 0
      );

      if (Array.isArray(parsed)) {
        const sortedNotifications = [...parsed].sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        setNotifications(sortedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error(
        "❌ Notification loading error:",
        error
      );

      setNotifications([]);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================
  useEffect(() => {
    loadNotifications();
  }, []);

  // ============================================
  // SAME TAB UPDATE
  // ============================================
  useEffect(() => {
    const handleNotificationUpdate = () => {
      console.log(
        "🔔 adminNotificationsUpdated received"
      );

      loadNotifications();
    };

    window.addEventListener(
      "adminNotificationsUpdated",
      handleNotificationUpdate
    );

    return () => {
      window.removeEventListener(
        "adminNotificationsUpdated",
        handleNotificationUpdate
      );
    };
  }, []);

  // ============================================
  // STORAGE UPDATE
  // ============================================
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "adminNotifications") {
        loadNotifications();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  // ============================================
  // SEND NOTIFICATION TO EMPLOYEE
  // ============================================
  const sendEmployeeNotification = (
    notification,
    action
  ) => {
    try {
      const saved =
        localStorage.getItem(
          "employeeNotifications"
        );

      const employeeNotifications = saved
        ? JSON.parse(saved)
        : [];

      const isApproved =
        action === "approved";

      const employeeNotification = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`,

        type: "job-status",

        title: isApproved
          ? "Job Approved"
          : "Job Rejected",

        message: isApproved
          ? `Your job "${notification.jobTitle}" has been approved by Admin.`
          : `Your job "${notification.jobTitle}" has been rejected by Admin.`,

        employeeId:
          notification.employeeId,

        employeeName:
          notification.employeeName,

        projectId:
          notification.projectId,

        jobTitle:
          notification.jobTitle,

        jobDescription:
          notification.jobDescription,

        jobType:
          notification.jobType,

        startDate:
          notification.startDate,

        dueDate:
          notification.dueDate,

        tasks:
          notification.tasks || [],

        totalHours:
          notification.totalHours || 0,

        status: action,

        approvalStatus: action,

        isRead: false,

        createdAt:
          new Date().toISOString(),
      };

      employeeNotifications.unshift(
        employeeNotification
      );

      localStorage.setItem(
        "employeeNotifications",
        JSON.stringify(
          employeeNotifications
        )
      );

      // Employee dashboard update event
      window.dispatchEvent(
        new Event(
          "employeeNotificationsUpdated"
        )
      );

      console.log(
        "================================="
      );

      console.log(
        "✅ EMPLOYEE NOTIFICATION CREATED"
      );

      console.log(
        "Employee ID:",
        notification.employeeId
      );

      console.log(
        "Employee Name:",
        notification.employeeName
      );

      console.log(
        "Job:",
        notification.jobTitle
      );

      console.log(
        "Status:",
        action
      );

      console.log(
        "Employee Notifications:",
        employeeNotifications
      );

      console.log(
        "================================="
      );
    } catch (error) {
      console.error(
        "❌ Employee notification error:",
        error
      );
    }
  };

  // ============================================
  // MARK AS READ
  // ============================================
  const markAsRead = (id) => {
    try {
      const updatedNotifications =
        notifications.map(
          (notification) => {
            const notificationId =
              notification.id ||
              notification._id;

            if (
              String(notificationId) ===
              String(id)
            ) {
              return {
                ...notification,
                isRead: true,
              };
            }

            return notification;
          }
        );

      setNotifications(
        updatedNotifications
      );

      localStorage.setItem(
        "adminNotifications",
        JSON.stringify(
          updatedNotifications
        )
      );

      window.dispatchEvent(
        new Event(
          "adminNotificationsUpdated"
        )
      );

      console.log(
        "✅ Notification marked as read:",
        id
      );
    } catch (error) {
      console.error(
        "❌ Mark as read error:",
        error
      );
    }
  };

  // ============================================
  // APPROVE JOB
  // ============================================
  const handleApprove = (id) => {
    try {
      const selectedNotification =
        notifications.find(
          (notification) => {
            const notificationId =
              notification.id ||
              notification._id;

            return (
              String(notificationId) ===
              String(id)
            );
          }
        );

      if (!selectedNotification) {
        console.error(
          "❌ Notification not found:",
          id
        );
        return;
      }

      // ------------------------------------------
      // UPDATE ADMIN NOTIFICATION
      // ------------------------------------------
      const updatedNotifications =
        notifications.map(
          (notification) => {
            const notificationId =
              notification.id ||
              notification._id;

            if (
              String(notificationId) ===
              String(id)
            ) {
              return {
                ...notification,
                status: "approved",
                approvalStatus: "approved",
                isRead: true,
              };
            }

            return notification;
          }
        );

      setNotifications(
        updatedNotifications
      );

      localStorage.setItem(
        "adminNotifications",
        JSON.stringify(
          updatedNotifications
        )
      );

      // ------------------------------------------
      // UPDATE JOB
      // ------------------------------------------
      const savedJobs =
        localStorage.getItem("jobs");

      const jobs = savedJobs
        ? JSON.parse(savedJobs)
        : [];

      const updatedJobs = jobs.map(
        (job) => {
          if (
            job.projectId ===
            selectedNotification.projectId
          ) {
            return {
              ...job,
              status: "approved",
              approvalStatus: "approved",
            };
          }

          return job;
        }
      );

      localStorage.setItem(
        "jobs",
        JSON.stringify(updatedJobs)
      );

      // ------------------------------------------
      // SEND EMPLOYEE NOTIFICATION
      // ------------------------------------------
      sendEmployeeNotification(
        selectedNotification,
        "approved"
      );

      // ------------------------------------------
      // EVENTS
      // ------------------------------------------
      window.dispatchEvent(
        new Event("jobsUpdated")
      );

      window.dispatchEvent(
        new Event(
          "adminNotificationsUpdated"
        )
      );

      console.log(
        "✅ Job approved successfully"
      );
    } catch (error) {
      console.error(
        "❌ Approve error:",
        error
      );
    }
  };

  // ============================================
  // REJECT JOB
  // ============================================
  const handleReject = (id) => {
    try {
      const selectedNotification =
        notifications.find(
          (notification) => {
            const notificationId =
              notification.id ||
              notification._id;

            return (
              String(notificationId) ===
              String(id)
            );
          }
        );

      if (!selectedNotification) {
        console.error(
          "❌ Notification not found:",
          id
        );
        return;
      }

      // ------------------------------------------
      // UPDATE ADMIN NOTIFICATION
      // ------------------------------------------
      const updatedNotifications =
        notifications.map(
          (notification) => {
            const notificationId =
              notification.id ||
              notification._id;

            if (
              String(notificationId) ===
              String(id)
            ) {
              return {
                ...notification,
                status: "rejected",
                approvalStatus: "rejected",
                isRead: true,
              };
            }

            return notification;
          }
        );

      setNotifications(
        updatedNotifications
      );

      localStorage.setItem(
        "adminNotifications",
        JSON.stringify(
          updatedNotifications
        )
      );

      // ------------------------------------------
      // UPDATE JOB
      // ------------------------------------------
      const savedJobs =
        localStorage.getItem("jobs");

      const jobs = savedJobs
        ? JSON.parse(savedJobs)
        : [];

      const updatedJobs = jobs.map(
        (job) => {
          if (
            job.projectId ===
            selectedNotification.projectId
          ) {
            return {
              ...job,
              status: "rejected",
              approvalStatus: "rejected",
            };
          }

          return job;
        }
      );

      localStorage.setItem(
        "jobs",
        JSON.stringify(updatedJobs)
      );

      // ------------------------------------------
      // SEND EMPLOYEE NOTIFICATION
      // ------------------------------------------
      sendEmployeeNotification(
        selectedNotification,
        "rejected"
      );

      // ------------------------------------------
      // EVENTS
      // ------------------------------------------
      window.dispatchEvent(
        new Event("jobsUpdated")
      );

      window.dispatchEvent(
        new Event(
          "adminNotificationsUpdated"
        )
      );

      console.log(
        "❌ Job rejected successfully"
      );
    } catch (error) {
      console.error(
        "❌ Reject error:",
        error
      );
    }
  };

  // ============================================
  // UNREAD COUNT
  // ============================================
  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.isRead !== true
    ).length;

  // ============================================
  // FORMAT DATE
  // ============================================
  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(
        date
      ).toLocaleString();
    } catch {
      return "-";
    }
  };

  // ============================================
  // PAGE
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* PAGE HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="relative">

                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">

                  <Bell
                    size={28}
                    className="text-blue-600"
                  />

                </div>

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[23px] h-[23px] px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}

              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-800">
                  Notifications
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Job approval requests
                </p>

              </div>

            </div>

            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
              {unreadCount} New
            </div>

          </div>

        </div>

        {/* NOTIFICATIONS */}
        {notifications.length === 0 ? (

          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">

            <Bell
              size={45}
              className="text-gray-300 mx-auto"
            />

            <h2 className="text-xl font-semibold text-gray-700 mt-4">
              No Notifications
            </h2>

            <p className="text-gray-500 mt-2">
              No job approval requests available.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {notifications.map(
              (notification, index) => {

                const notificationId =
                  notification.id ||
                  notification._id ||
                  index;

                return (

                  <div
                    key={notificationId}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                      !notification.isRead
                        ? "border-blue-300"
                        : "border-gray-200"
                    }`}
                  >

                    {!notification.isRead && (
                      <div className="h-1 bg-blue-600"></div>
                    )}

                    <div className="p-6">

                      {/* TITLE */}
                      <div className="flex items-start justify-between">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">

                            <Briefcase
                              size={22}
                              className="text-blue-600"
                            />

                          </div>

                          <div>

                            <h2 className="text-lg font-bold text-gray-800">
                              {notification.title ||
                                "New Job Approval Request"}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                              Job approval request
                            </p>

                          </div>

                        </div>

                        {!notification.isRead && (
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                            NEW
                          </span>
                        )}

                      </div>

                      {/* MESSAGE */}
                      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">

                        <p className="text-sm text-gray-700">
                          {notification.message ||
                            `${
                              notification.employeeId ||
                              "Employee"
                            } submitted a new job for approval.`}
                        </p>

                      </div>

                      {/* DETAILS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                        {/* EMPLOYEE */}
                        <div className="bg-gray-50 rounded-xl p-4">

                          <div className="flex items-center gap-3">

                            <User
                              size={18}
                              className="text-gray-500"
                            />

                            <div>

                              <p className="text-xs text-gray-400">
                                Employee
                              </p>

                              <p className="font-semibold text-gray-700">

                                {notification.employeeId ||
                                  "-"}

                                {notification.employeeName &&
                                  ` - ${notification.employeeName}`}

                              </p>

                            </div>

                          </div>

                        </div>

                        {/* PROJECT */}
                        <div className="bg-gray-50 rounded-xl p-4">

                          <p className="text-xs text-gray-400">
                            Project ID
                          </p>

                          <p className="font-semibold text-gray-700 mt-1">
                            {notification.projectId ||
                              "-"}
                          </p>

                        </div>

                        {/* JOB TITLE */}
                        <div className="bg-gray-50 rounded-xl p-4">

                          <p className="text-xs text-gray-400">
                            Job Title
                          </p>

                          <p className="font-semibold text-gray-700 mt-1">
                            {notification.jobTitle ||
                              "-"}
                          </p>

                        </div>

                        {/* JOB TYPE */}
                        <div className="bg-gray-50 rounded-xl p-4">

                          <p className="text-xs text-gray-400">
                            Job Type
                          </p>

                          <p className="font-semibold text-gray-700 mt-1">
                            {notification.jobType ||
                              "-"}
                          </p>

                        </div>

                        {/* TOTAL HOURS */}
                        <div className="bg-gray-50 rounded-xl p-4">

                          <p className="text-xs text-gray-400">
                            Total Hours
                          </p>

                          <p className="font-semibold text-gray-700 mt-1">
                            {notification.totalHours ??
                              0}{" "}
                            Hours
                          </p>

                        </div>

                        {/* START DATE */}
                        <div className="bg-gray-50 rounded-xl p-4">

                          <p className="text-xs text-gray-400">
                            Start Date
                          </p>

                          <p className="font-semibold text-gray-700 mt-1">
                            {notification.startDate ||
                              "-"}
                          </p>

                        </div>

                        {/* DUE DATE */}
                        <div className="bg-gray-50 rounded-xl p-4">

                          <p className="text-xs text-gray-400">
                            Due Date
                          </p>

                          <p className="font-semibold text-gray-700 mt-1">
                            {notification.dueDate ||
                              "-"}
                          </p>

                        </div>

                      </div>

                      {/* DESCRIPTION */}
                      {notification.jobDescription && (
                        <div className="mt-4 bg-gray-50 rounded-xl p-4">

                          <p className="text-xs text-gray-400">
                            Job Description
                          </p>

                          <p className="text-sm text-gray-700 mt-1">
                            {notification.jobDescription}
                          </p>

                        </div>
                      )}

                      {/* TASKS */}
                      {Array.isArray(
                        notification.tasks
                      ) &&
                        notification.tasks.length > 0 && (

                          <div className="mt-5">

                            <p className="font-semibold text-gray-700 mb-2">
                              Tasks
                            </p>

                            <div className="space-y-2">

                              {notification.tasks.map(
                                (
                                  task,
                                  taskIndex
                                ) => (

                                  <div
                                    key={
                                      taskIndex
                                    }
                                    className="flex justify-between bg-gray-50 p-3 rounded-lg"
                                  >

                                    <span className="text-gray-700">
                                      {
                                        task.taskName
                                      }
                                    </span>

                                    <span className="font-semibold">
                                      {
                                        task.hours
                                      }{" "}
                                      hrs
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}

                      {/* STATUS */}
                      <div className="mt-5">

                        {notification.status ===
                        "approved" ? (

                          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

                            <Check size={16} />

                            Approved

                          </span>

                        ) : notification.status ===
                          "rejected" ? (

                          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">

                            <X size={16} />

                            Rejected

                          </span>

                        ) : (

                          <span className="inline-flex bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                            Pending Approval
                          </span>

                        )}

                      </div>

                      {/* DATE */}
                      <p className="text-xs text-gray-400 mt-4">

                        Submitted:{" "}

                        {formatDate(
                          notification.createdAt
                        )}

                      </p>

                      {/* BUTTONS */}
                      {notification.status !==
                        "approved" &&
                        notification.status !==
                          "rejected" && (

                          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t">

                            {/* APPROVE */}
                            <button
                              type="button"
                              onClick={() =>
                                handleApprove(
                                  notificationId
                                )
                              }
                              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                            >

                              <Check size={17} />

                              Approve

                            </button>

                            {/* REJECT */}
                            <button
                              type="button"
                              onClick={() =>
                                handleReject(
                                  notificationId
                                )
                              }
                              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                            >

                              <X size={17} />

                              Reject

                            </button>

                            {/* MARK AS READ */}
                            {!notification.isRead && (
                              <button
                                type="button"
                                onClick={() =>
                                  markAsRead(
                                    notificationId
                                  )
                                }
                                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium"
                              >
                                Mark as Read
                              </button>
                            )}

                          </div>

                        )}

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>
    </div>
  );
};

export default Notifications;