import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function LogDevice() {
  const router = useRouter();
  const { deviceId: deviceId } = router.query;

  const [formData, setFormData] = useState({
    day: new Date().toISOString().split("T")[0],
    weekDay: new Date().toLocaleString("en-US", { weekday: "long" }),
    time: new Date().toTimeString().split(" ")[0],
    deviceId: "",
    dailyCodeReadinessTest: "false",
    dailyBatteryCheck: "false",
    weeklyManualDefibTest: "false",
    weeklyPacerTest: "false",
    weeklyRecorder: "false",
    padsNotExpired: "false",
    expirationDate: "",
    correctiveAction: "",
    nurseName: "",
  });

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  useEffect(() => {
    if (deviceId) {
      setFormData((prevData) => ({
        ...prevData,
        deviceId: deviceId,
      }));
    }
  }, [deviceId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? String(checked) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    try {
      const response = await fetch("/api/loggers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Log entry created successfully!");
        setFormData({
          day: new Date().toISOString().split("T")[0],
          weekDay: new Date().toLocaleString("en-US", { weekday: "long" }),
          time: new Date().toTimeString().split(" ")[0],
          deviceId: deviceId.toString() || "",
          dailyCodeReadinessTest: "false",
          dailyBatteryCheck: "false",
          weeklyManualDefibTest: "false",
          weeklyPacerTest: "false",
          weeklyRecorder: "false",
          padsNotExpired: "false",
          expirationDate: "",
          correctiveAction: "",
          nurseName: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const checkboxItems = [
    {
      name: "dailyCodeReadinessTest",
      label: "Daily Code Readiness Test",
      category: "daily",
    },
    {
      name: "dailyBatteryCheck",
      label: "Daily Battery Check",
      category: "daily",
    },
    {
      name: "weeklyManualDefibTest",
      label: "Weekly Manual Defib Test",
      category: "weekly",
    },
    { name: "weeklyPacerTest", label: "Weekly Pacer Test", category: "weekly" },
    { name: "weeklyRecorder", label: "Weekly Recorder", category: "weekly" },
    {
      name: "padsNotExpired",
      label: "Pads: Not Expired",
      category: "inspection",
    },
  ];

  const dailyChecks = checkboxItems.filter((item) => item.category === "daily");
  const weeklyChecks = checkboxItems.filter(
    (item) => item.category === "weekly"
  );
  const inspectionChecks = checkboxItems.filter(
    (item) => item.category === "inspection"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Device Maintenance Log
            </h1>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
              Device ID: {deviceId || "Loading..."}
            </div>
            {deviceId && (
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Ensure this device has been registered in the Admin Dashboard
                before submitting.
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="day"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="day"
                  id="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="weekDay"
                className="block text-sm font-medium text-gray-700 mb-2">
                Day of Week
              </label>
              <input
                type="text"
                name="weekDay"
                id="weekDay"
                value={formData.weekDay}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-600"
                readOnly
              />
            </div>
          </div>

          {/* Daily Checks Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-full text-xs font-bold mr-2">
                D
              </span>
              Daily Checks
            </h2>
            <div className="space-y-3">
              {dailyChecks.map((item) => (
                <div key={item.name} className="flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      name={item.name}
                      id={item.name}
                      checked={formData[item.name] === "true"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </div>
                  <label
                    htmlFor={item.name}
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Checks Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold mr-2">
                W
              </span>
              Weekly Checks
            </h2>
            <div className="space-y-3">
              {weeklyChecks.map((item) => (
                <div key={item.name} className="flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      name={item.name}
                      id={item.name}
                      checked={formData[item.name] === "true"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </div>
                  <label
                    htmlFor={item.name}
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Inspection Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-800 rounded-full text-xs font-bold mr-2">
                I
              </span>
              Equipment Inspection
            </h2>
            <div className="space-y-4">
              {inspectionChecks.map((item) => (
                <div key={item.name} className="flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      name={item.name}
                      id={item.name}
                      checked={formData[item.name] === "true"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                    />
                  </div>
                  <label
                    htmlFor={item.name}
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              ))}

              <div className="mt-4">
                <label
                  htmlFor="expirationDate"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Earliest Expiration Date
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  id="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Additional Information
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="correctiveAction"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up / Corrective Action
                </label>
                <textarea
                  name="correctiveAction"
                  id="correctiveAction"
                  value={formData.correctiveAction}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe any issues found or corrective actions taken..."
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 text-sm resize-vertical"
                />
              </div>

              <div>
                <label
                  htmlFor="nurseName"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Print Name & Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nurseName"
                  id="nurseName"
                  value={formData.nurseName}
                  onChange={handleChange}
                  placeholder="e.g., John Smith, RN"
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button
              type="submit"
              disabled={isLoadingSubmit}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out">
              {isLoadingSubmit ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Log...
                </>
              ) : (
                "Submit Maintenance Log"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
