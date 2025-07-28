import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { exportLogsToExcel } from "../../../components/exportLogsToExcel";
// Using simple text/unicode icons instead of Heroicons to avoid dependency issues

const DeviceLogsPage = () => {
  const router = useRouter();
  const { deviceId } = router.query;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [nurseFilter, setNurseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Sort state
  const [sortField, setSortField] = useState("day");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    if (deviceId) {
      const fetchLogs = async () => {
        try {
          const response = await fetch(`/api/loggers/${deviceId}`);
          if (response.ok) {
            const data = await response.json();
            // Sort by most recent date by default
            const sortedData = data.sort(
              (a, b) => new Date(b.day) - new Date(a.day)
            );
            setLogs(sortedData);
          } else {
            const errorData = await response.json();
            setError(errorData.message || "Failed to fetch logs");
          }
        } catch (err) {
          console.error("Error fetching logs:", err);
          setError("An unexpected error occurred while fetching logs.");
        } finally {
          setLoading(false);
        }
      };
      fetchLogs();
    }
  }, [deviceId]);

  // Get unique nurses for filter dropdown
  const uniqueNurses = useMemo(() => {
    return [...new Set(logs.map((log) => log.nurseName).filter(Boolean))];
  }, [logs]);

  // Filter and sort logs
  const filteredAndSortedLogs = useMemo(() => {
    let filtered = logs;

    // Date range filter
    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      filtered = filtered.filter((log) => {
        const logDate = new Date(log.day);
        if (from && logDate < from) return false;
        if (to && logDate > to) return false;
        return true;
      });
    }

    // Nurse filter
    if (nurseFilter) {
      filtered = filtered.filter((log) => log.nurseName === nurseFilter);
    }

    // Status filter (any failed checks)
    if (statusFilter !== "all") {
      if (statusFilter === "issues") {
        filtered = filtered.filter(
          (log) =>
            !log.dailyCodeReadinessTest ||
            !log.dailyBatteryCheck ||
            !log.padsNotExpired ||
            log.correctiveAction
        );
      } else if (statusFilter === "complete") {
        filtered = filtered.filter(
          (log) =>
            log.dailyCodeReadinessTest &&
            log.dailyBatteryCheck &&
            log.padsNotExpired &&
            !log.correctiveAction
        );
      }
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.nurseName?.toLowerCase().includes(term) ||
          log.correctiveAction?.toLowerCase().includes(term) ||
          log.deviceId?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "day" || sortField === "expirationDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    logs,
    fromDate,
    toDate,
    nurseFilter,
    statusFilter,
    searchTerm,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredAndSortedLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [fromDate, toDate, nurseFilter, statusFilter, searchTerm]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const clearAllFilters = () => {
    setFromDate("");
    setToDate("");
    setNurseFilter("");
    setStatusFilter("all");
    setSearchTerm("");
  };

  const hasActiveFilters =
    fromDate || toDate || nurseFilter || statusFilter !== "all" || searchTerm;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Logs
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Device Logs</h1>
              <p className="mt-1 text-sm text-gray-500">
                Device ID:{" "}
                <span className="font-medium text-gray-900">{deviceId}</span>
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <span className="mr-2">🔍</span>
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center">
                  <span className="mr-1">✕</span>
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nurse, action, device..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    📅
                  </span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    📅
                  </span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Nurse Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nurse
                </label>
                <select
                  value={nurseFilter}
                  onChange={(e) => setNurseFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All Nurses</option>
                  {uniqueNurses.map((nurse) => (
                    <option key={nurse} value={nurse}>
                      {nurse}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Status</option>
                  <option value="complete">Complete</option>
                  <option value="issues">Has Issues</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary & Export */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredAndSortedLogs.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredAndSortedLogs.length}
                </span>{" "}
                entries
                {hasActiveFilters && (
                  <span className="text-blue-600">
                    {" "}
                    (filtered from {logs.length} total)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() =>
                exportLogsToExcel(
                  filteredAndSortedLogs,
                  `logs_${deviceId}_${
                    new Date().toISOString().split("T")[0]
                  }.xlsx`
                )
              }
              disabled={filteredAndSortedLogs.length === 0}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
              <span className="mr-2">⬇</span>
              Export to Excel
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredAndSortedLogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No logs found
              </h3>
              <p className="text-gray-500">
                {hasActiveFilters
                  ? "No logs match your current filters. Try adjusting your search criteria."
                  : "No log entries found for this device."}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: "day", label: "Date" },
                      { key: "weekDay", label: "Day" },
                      { key: "time", label: "Time" },
                      { key: "nurseName", label: "Nurse" },
                      { key: "dailyCodeReadinessTest", label: "Code Ready" },
                      { key: "dailyBatteryCheck", label: "Battery" },
                      { key: "weeklyManualDefibTest", label: "Manual Defib" },
                      { key: "weeklyPacerTest", label: "Pacer" },
                      { key: "weeklyRecorder", label: "Recorder" },
                      { key: "padsNotExpired", label: "Pads OK" },
                      { key: "expirationDate", label: "Exp. Date" },
                      { key: "correctiveAction", label: "Action" },
                    ].map((column) => (
                      <th
                        key={column.key}
                        onClick={() => handleSort(column.key)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition">
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {sortField === column.key && (
                            <span className="text-blue-600">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedLogs.map((log, index) => {
                    const isWeeklyTestDay =
                      log.weekDay?.toLowerCase() === "tuesday";
                    const hasIssues =
                      !log.dailyCodeReadinessTest ||
                      !log.dailyBatteryCheck ||
                      !log.padsNotExpired ||
                      log.correctiveAction;

                    return (
                      <tr
                        key={log.id}
                        className={`hover:bg-gray-50 transition ${
                          isWeeklyTestDay ? "bg-yellow-50" : ""
                        } ${hasIssues ? "border-l-4 border-l-red-400" : ""}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(log.day).toLocaleDateString()}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isWeeklyTestDay
                              ? "font-bold text-yellow-800"
                              : "text-gray-900"
                          }`}>
                          {log.weekDay ||
                            new Date(log.day).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.time || new Date(log.day).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.nurseName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.dailyCodeReadinessTest
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {log.dailyCodeReadinessTest ? "✓" : "✗"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.dailyBatteryCheck
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {log.dailyBatteryCheck ? "✓" : "✗"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.weeklyManualDefibTest
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                            {log.weeklyManualDefibTest ? "✓" : "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.weeklyPacerTest
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                            {log.weeklyPacerTest ? "✓" : "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.weeklyRecorder
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                            {log.weeklyRecorder ? "✓" : "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.padsNotExpired
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {log.padsNotExpired ? "✓" : "✗"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.expirationDate
                            ? new Date(log.expirationDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {log.correctiveAction || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
                      ‹
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === currentPage
                              ? "z-10 bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}>
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
                      ›
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceLogsPage;
