import React, { useEffect, useState } from "react";

import {
  Bell,
  Check,
  X,
  User,
  Briefcase,
  Clock,
  CalendarDays,
  FileText,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Circle,
  Sparkles,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // ============================================
  // LOAD ADMIN NOTIFICATIONS
  // ============================================
  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem("adminNotifications");

      if (!saved) {
        setNotifications([]);
        return;
      }

      const parsed = JSON.parse(saved);

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
      console.error("Notification loading error:", error);
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

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
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
        localStorage.getItem("employeeNotifications");

      const employeeNotifications = saved
        ? JSON.parse(saved)
        : [];

      const isApproved = action === "approved";

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

        employeeId: notification.employeeId,
        employeeName: notification.employeeName,
        projectId: notification.projectId,
        jobTitle: notification.jobTitle,
        jobDescription: notification.jobDescription,
        jobType: notification.jobType,
        startDate: notification.startDate,
        dueDate: notification.dueDate,
        tasks: notification.tasks || [],
        totalHours: notification.totalHours || 0,

        status: action,
        approvalStatus: action,

        isRead: false,

        createdAt: new Date().toISOString(),
      };

      employeeNotifications.unshift(employeeNotification);

      localStorage.setItem(
        "employeeNotifications",
        JSON.stringify(employeeNotifications)
      );

      window.dispatchEvent(
        new Event("employeeNotificationsUpdated")
      );
    } catch (error) {
      console.error(
        "Employee notification error:",
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
        notifications.map((notification) => {
          const notificationId =
            notification.id ||
            notification._id;

          if (
            String(notificationId) === String(id)
          ) {
            return {
              ...notification,
              isRead: true,
            };
          }

          return notification;
        });

      setNotifications(updatedNotifications);

      localStorage.setItem(
        "adminNotifications",
        JSON.stringify(updatedNotifications)
      );

      window.dispatchEvent(
        new Event("adminNotificationsUpdated")
      );
    } catch (error) {
      console.error(
        "Mark as read error:",
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
        notifications.find((notification) => {
          const notificationId =
            notification.id ||
            notification._id;

          return (
            String(notificationId) === String(id)
          );
        });

      if (!selectedNotification) {
        console.error(
          "Notification not found:",
          id
        );
        return;
      }

      // UPDATE NOTIFICATION
      const updatedNotifications =
        notifications.map((notification) => {
          const notificationId =
            notification.id ||
            notification._id;

          if (
            String(notificationId) === String(id)
          ) {
            return {
              ...notification,
              status: "approved",
              approvalStatus: "approved",
              isRead: true,
            };
          }

          return notification;
        });

      setNotifications(updatedNotifications);

      localStorage.setItem(
        "adminNotifications",
        JSON.stringify(updatedNotifications)
      );

      // UPDATE JOB
      const savedJobs =
        localStorage.getItem("jobs");

      const jobs = savedJobs
        ? JSON.parse(savedJobs)
        : [];

      const updatedJobs = jobs.map((job) => {
        if (
          String(job.projectId) ===
          String(selectedNotification.projectId)
        ) {
          return {
            ...job,
            status: "approved",
            approvalStatus: "approved",
          };
        }

        return job;
      });

      localStorage.setItem(
        "jobs",
        JSON.stringify(updatedJobs)
      );

      // SEND EMPLOYEE NOTIFICATION
      sendEmployeeNotification(
        selectedNotification,
        "approved"
      );

      // EVENTS
      window.dispatchEvent(
        new Event("jobsUpdated")
      );

      window.dispatchEvent(
        new Event("adminNotificationsUpdated")
      );
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  // ============================================
  // REJECT JOB
  // ============================================
  const handleReject = (id) => {
    try {
      const selectedNotification =
        notifications.find((notification) => {
          const notificationId =
            notification.id ||
            notification._id;

          return (
            String(notificationId) === String(id)
          );
        });

      if (!selectedNotification) {
        console.error(
          "Notification not found:",
          id
        );
        return;
      }

      // UPDATE NOTIFICATION
      const updatedNotifications =
        notifications.map((notification) => {
          const notificationId =
            notification.id ||
            notification._id;

          if (
            String(notificationId) === String(id)
          ) {
            return {
              ...notification,
              status: "rejected",
              approvalStatus: "rejected",
              isRead: true,
            };
          }

          return notification;
        });

      setNotifications(updatedNotifications);

      localStorage.setItem(
        "adminNotifications",
        JSON.stringify(updatedNotifications)
      );

      // UPDATE JOB
      const savedJobs =
        localStorage.getItem("jobs");

      const jobs = savedJobs
        ? JSON.parse(savedJobs)
        : [];

      const updatedJobs = jobs.map((job) => {
        if (
          String(job.projectId) ===
          String(selectedNotification.projectId)
        ) {
          return {
            ...job,
            status: "rejected",
            approvalStatus: "rejected",
          };
        }

        return job;
      });

      localStorage.setItem(
        "jobs",
        JSON.stringify(updatedJobs)
      );

      // SEND EMPLOYEE NOTIFICATION
      sendEmployeeNotification(
        selectedNotification,
        "rejected"
      );

      // EVENTS
      window.dispatchEvent(
        new Event("jobsUpdated")
      );

      window.dispatchEvent(
        new Event("adminNotificationsUpdated")
      );
    } catch (error) {
      console.error("Reject error:", error);
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
  // PENDING COUNT
  // ============================================
  const pendingCount =
    notifications.filter(
      (notification) =>
        notification.status !== "approved" &&
        notification.status !== "rejected"
    ).length;

  // ============================================
  // APPROVED COUNT
  // ============================================
  const approvedCount =
    notifications.filter(
      (notification) =>
        notification.status === "approved"
    ).length;

  // ============================================
  // REJECTED COUNT
  // ============================================
  const rejectedCount =
    notifications.filter(
      (notification) =>
        notification.status === "rejected"
    ).length;

  // ============================================
  // FORMAT DATE
  // ============================================
  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "-";
    }
  };

  // ============================================
  // STATUS CONFIG
  // ============================================
  const getStatusConfig = (status) => {
    if (status === "approved") {
      return {
        label: "Approved",
        icon: CheckCircle2,
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        iconBg: "bg-green-100",
      };
    }

    if (status === "rejected") {
      return {
        label: "Rejected",
        icon: XCircle,
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        iconBg: "bg-red-100",
      };
    }

    return {
      label: "Pending Approval",
      icon: Clock,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
    };
  };

  // ============================================
  // PAGE
  // ============================================
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ========================================
          HEADER
      ======================================== */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* TITLE */}
            <div className="flex items-center gap-4">

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <Bell
                    size={27}
                    className="text-white"
                  />
                </div>

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[25px] h-[25px] px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Notifications
                  </h1>

                  <Sparkles
                    size={19}
                    className="text-blue-500"
                  />
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Manage employee job approval requests
                </p>
              </div>
            </div>

            {/* UNREAD */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-500 font-medium">
                  Total
                </p>

                <p className="text-lg font-bold text-blue-700">
                  {notifications.length}
                </p>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs text-red-500 font-medium">
                  Unread
                </p>

                <p className="text-lg font-bold text-red-600">
                  {unreadCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

        {/* ======================================
            SUMMARY CARDS
        ====================================== */}
        {notifications.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

            {/* PENDING */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Pending Requests
                  </p>

                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {pendingCount}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock
                    size={21}
                    className="text-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* APPROVED */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Approved
                  </p>

                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {approvedCount}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2
                    size={21}
                    className="text-green-600"
                  />
                </div>
              </div>
            </div>

            {/* REJECTED */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Rejected
                  </p>

                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {rejectedCount}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                  <XCircle
                    size={21}
                    className="text-red-600"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================
            EMPTY STATE
        ====================================== */}
        {notifications.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

            <div className="px-6 py-16 text-center">

              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <Bell
                  size={38}
                  className="text-blue-500"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-800 mt-6">
                No Notifications
              </h2>

              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                There are currently no job approval requests.
                New employee requests will appear here.
              </p>

            </div>
          </div>

        ) : (

          /* ====================================
             NOTIFICATION LIST
          ==================================== */
          <div className="space-y-5">

            {notifications.map(
              (notification, index) => {

                const notificationId =
                  notification.id ||
                  notification._id ||
                  index;

                const statusConfig =
                  getStatusConfig(
                    notification.status
                  );

                const StatusIcon =
                  statusConfig.icon;

                const isPending =
                  notification.status !==
                    "approved" &&
                  notification.status !==
                    "rejected";

                return (
                  <div
                    key={notificationId}
                    className={`relative bg-white rounded-3xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      !notification.isRead
                        ? "border-blue-200"
                        : "border-slate-200"
                    }`}
                  >

                    {/* UNREAD TOP LINE */}
                    {!notification.isRead && (
                      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />
                    )}

                    {/* =================================
                        CARD HEADER
                    ================================= */}
                    <div className="px-5 sm:px-7 pt-6">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                        <div className="flex items-start gap-4">

                          {/* ICON */}
                          <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <Briefcase
                              size={22}
                              className="text-blue-600"
                            />
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h2 className="text-lg font-bold text-slate-800">
                                {notification.title ||
                                  "New Job Approval Request"}
                              </h2>

                              {!notification.isRead && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">
                                  <Circle
                                    size={6}
                                    fill="currentColor"
                                  />
                                  NEW
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-slate-500 mt-1">
                              Employee job approval request
                            </p>

                          </div>
                        </div>

                        {/* STATUS */}
                        <div
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}
                        >
                          <StatusIcon size={16} />

                          <span className="text-xs font-bold">
                            {statusConfig.label}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* =================================
                        MESSAGE
                    ================================= */}
                    <div className="px-5 sm:px-7 mt-5">

                      <div className="relative rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 sm:p-5">

                        <div className="flex items-start gap-3">

                          <div className="w-9 h-9 shrink-0 rounded-xl bg-white border border-blue-100 flex items-center justify-center">
                            <Bell
                              size={17}
                              className="text-blue-600"
                            />
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                              Notification
                            </p>

                            <p className="text-sm text-slate-700 mt-1 leading-6">
                              {notification.message ||
                                `${
                                  notification.employeeId ||
                                  "Employee"
                                } submitted a new job for approval.`}
                            </p>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* =================================
                        JOB INFORMATION
                    ================================= */}
                    <div className="px-5 sm:px-7 mt-6">

                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <FileText
                            size={16}
                            className="text-slate-600"
                          />
                        </div>

                        <h3 className="text-sm font-bold text-slate-800">
                          Job Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                        {/* EMPLOYEE */}
                        <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-white hover:shadow-sm transition">

                          <div className="flex items-center gap-2 mb-2">
                            <User
                              size={16}
                              className="text-blue-500"
                            />

                            <span className="text-xs font-medium text-slate-400">
                              Employee
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-700 break-words">
                            {notification.employeeId ||
                              "-"}

                            {notification.employeeName && (
                              <span className="block text-xs font-normal text-slate-500 mt-1">
                                {notification.employeeName}
                              </span>
                            )}
                          </p>
                        </div>

                        {/* PROJECT */}
                        <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-white hover:shadow-sm transition">

                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase
                              size={16}
                              className="text-indigo-500"
                            />

                            <span className="text-xs font-medium text-slate-400">
                              Project ID
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-700 break-words">
                            {notification.projectId ||
                              "-"}
                          </p>
                        </div>

                        {/* JOB TITLE */}
                        <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-white hover:shadow-sm transition">

                          <div className="flex items-center gap-2 mb-2">
                            <FileText
                              size={16}
                              className="text-purple-500"
                            />

                            <span className="text-xs font-medium text-slate-400">
                              Job Title
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-700 break-words">
                            {notification.jobTitle ||
                              "-"}
                          </p>
                        </div>

                        {/* JOB TYPE */}
                        <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-white hover:shadow-sm transition">

                          <div className="flex items-center gap-2 mb-2">
                            <ClipboardList
                              size={16}
                              className="text-orange-500"
                            />

                            <span className="text-xs font-medium text-slate-400">
                              Job Type
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-700 break-words">
                            {notification.jobType ||
                              "-"}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* =================================
                        DATE / HOURS
                    ================================= */}
                    <div className="px-5 sm:px-7 mt-4">

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                        {/* HOURS */}
                        <div className="rounded-2xl border border-slate-200 p-4 bg-white">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                              <Clock
                                size={18}
                                className="text-purple-600"
                              />
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Total Hours
                              </p>

                              <p className="text-sm font-bold text-slate-700 mt-0.5">
                                {notification.totalHours ??
                                  0}{" "}
                                Hours
                              </p>
                            </div>

                          </div>
                        </div>

                        {/* START DATE */}
                        <div className="rounded-2xl border border-slate-200 p-4 bg-white">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                              <CalendarDays
                                size={18}
                                className="text-green-600"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-slate-400">
                                Start Date
                              </p>

                              <p className="text-sm font-bold text-slate-700 mt-0.5 truncate">
                                {notification.startDate ||
                                  "-"}
                              </p>
                            </div>

                          </div>
                        </div>

                        {/* DUE DATE */}
                        <div className="rounded-2xl border border-slate-200 p-4 bg-white">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                              <CalendarDays
                                size={18}
                                className="text-red-600"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-slate-400">
                                Due Date
                              </p>

                              <p className="text-sm font-bold text-slate-700 mt-0.5 truncate">
                                {notification.dueDate ||
                                  "-"}
                              </p>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>

                    {/* =================================
                        DESCRIPTION
                    ================================= */}
                    {notification.jobDescription && (
                      <div className="px-5 sm:px-7 mt-5">

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                          <div className="flex items-center gap-2 mb-2">
                            <FileText
                              size={17}
                              className="text-slate-500"
                            />

                            <p className="text-sm font-bold text-slate-700">
                              Job Description
                            </p>
                          </div>

                          <p className="text-sm text-slate-600 leading-6">
                            {notification.jobDescription}
                          </p>

                        </div>
                      </div>
                    )}

                    {/* =================================
                        TASKS
                    ================================= */}
                    {Array.isArray(
                      notification.tasks
                    ) &&
                      notification.tasks.length >
                        0 && (

                        <div className="px-5 sm:px-7 mt-5">

                          <div className="flex items-center justify-between mb-3">

                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <ClipboardList
                                  size={16}
                                  className="text-indigo-600"
                                />
                              </div>

                              <h3 className="text-sm font-bold text-slate-800">
                                Task Details
                              </h3>
                            </div>

                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                              {notification.tasks.length}{" "}
                              Tasks
                            </span>

                          </div>

                          <div className="space-y-2">

                            {notification.tasks.map(
                              (
                                task,
                                taskIndex
                              ) => (

                                <div
                                  key={taskIndex}
                                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-blue-200 hover:bg-blue-50/30 transition"
                                >

                                  <div className="flex items-center gap-3 min-w-0">

                                    <div className="w-7 h-7 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                                      <span className="text-xs font-bold text-blue-600">
                                        {taskIndex +
                                          1}
                                      </span>
                                    </div>

                                    <span className="text-sm font-medium text-slate-700 truncate">
                                      {task.taskName ||
                                        `Task ${
                                          taskIndex +
                                          1
                                        }`}
                                    </span>

                                  </div>

                                  <span className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                    {task.hours ||
                                      0}{" "}
                                    hrs
                                  </span>

                                </div>
                              )
                            )}

                          </div>
                        </div>
                      )}

                    {/* =================================
                        FOOTER
                    ================================= */}
                    <div className="px-5 sm:px-7 mt-6 pb-6">

                      <div className="pt-5 border-t border-slate-100">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                          {/* SUBMITTED */}
                          <div className="flex items-center gap-2 text-xs text-slate-400">

                            <CalendarDays size={14} />

                            <span>
                              Submitted{" "}
                              {formatDate(
                                notification.createdAt
                              )}
                            </span>

                          </div>

                          {/* ACTION BUTTONS */}
                          {isPending && (
                            <div className="flex flex-wrap gap-2">

                              {/* APPROVE */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleApprove(
                                    notificationId
                                  )
                                }
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
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
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                              >
                                <X size={17} />
                                Reject
                              </button>

                              {/* MARK READ */}
                              {!notification.isRead && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    markAsRead(
                                      notificationId
                                    )
                                  }
                                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-sm font-semibold transition-all"
                                >
                                  <CheckCircle2
                                    size={16}
                                  />
                                  Mark as Read
                                </button>
                              )}

                            </div>
                          )}

                        </div>
                      </div>
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