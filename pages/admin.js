import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const AdminDashboard = () => {
  const router = useRouter();
  const [deviceIdInput, setDeviceIdInput] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [devices, setDevices] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // 'success', 'error', 'info'
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
  const [isLoadingReprint, setIsLoadingReprint] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);

  const fetchDevices = async () => {
    setIsLoadingDevices(true);
    try {
      const response = await fetch("/api/devices");
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      } else {
        setMessage("Failed to fetch devices.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      setMessage("An error occurred while fetching devices.");
      setMessageType("error");
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleGenerateQrCode = async () => {
    if (!deviceIdInput) {
      setMessage("Please enter a Device ID.");
      setMessageType("error");
      return;
    }

    setIsLoadingGenerate(true);
    setMessage("");
    try {
      const response = await fetch("/api/devices/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId: deviceIdInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qrCodeUrl);
        if (data.status === "created") {
          setMessage("New device created and QR Code generated successfully!");
          setMessageType("success");
        } else if (data.status === "updated") {
          setMessage("QR Code regenerated for existing device!");
          setMessageType("success");
        }
        const currentDeviceId = deviceIdInput;
        setDeviceIdInput("");
        fetchDevices();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        setMessageType("error");
        setQrCodeUrl("");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      setMessage("An unexpected error occurred during QR code generation.");
      setMessageType("error");
    } finally {
      setIsLoadingGenerate(false);
    }
  };

  const handlePrintQrCode = () => {
    if (qrCodeUrl) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        "<html><head><title>Print QR Code</title></head><body>"
      );
      printWindow.document.write(
        '<img src="' + qrCodeUrl + '" onload="window.print();window.close()" />'
      );
      printWindow.document.write("</body></html>");
      printWindow.document.close();
    } else {
      setMessage("No QR Code to print. Generate one first.");
      setMessageType("error");
    }
  };

  const handleReprintQrCode = async (deviceId) => {
    setIsLoadingReprint(true);
    setMessage("");
    try {
      const response = await fetch("/api/devices/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qrCodeUrl);
        setMessage(`QR Code for ${deviceId} reprinted successfully!`);
        setMessageType("success");
      } else {
        const errorData = await response.json();
        setMessage(`Error reprinting QR code: ${errorData.message}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error reprinting QR code:", error);
      setMessage("An unexpected error occurred during QR code reprinting.");
      setMessageType("error");
    } finally {
      setIsLoadingReprint(false);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    if (
      !confirm(
        `Are you sure you want to delete device ${deviceId} and all its associated logs? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoadingDelete(true);
    setMessage("");
    try {
      const response = await fetch("/api/devices/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId }),
      });

      if (response.ok) {
        setMessage(`Device ${deviceId} and its logs deleted successfully!`);
        setMessageType("success");
        fetchDevices();
        setQrCodeUrl("");
      } else {
        const errorData = await response.json();
        setMessage(`Error deleting device: ${errorData.message}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      setMessage("An unexpected error occurred during device deletion.");
      setMessageType("error");
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const getMessageStyles = () => {
    const baseStyles =
      "fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out";
    switch (messageType) {
      case "success":
        return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
      case "info":
        return `${baseStyles} bg-blue-50 border border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-800`;
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "📝";
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      Cookies.remove("auth");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setMessage("An error occurred during logout.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {message && (
        <div className={getMessageStyles()}>
          <div className="flex items-start">
            <span className="flex-shrink-0 text-lg mr-3">
              {getMessageIcon()}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={() => setMessage("")}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {devices.length > 0 &&
                  `Managing ${devices.length} device${
                    devices.length !== 1 ? "s" : ""
                  }`}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-blue-800">
                  Healthcare Equipment Logger
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* QR Code Generation Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="bg-blue-100 rounded-full p-2 mr-3">
                <span className="text-blue-600 text-lg">📱</span>
              </span>
              Generate QR Code for Device
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a new device or regenerate QR code for existing equipment
            </p>
          </div>

          <div className="px-6 py-6">
            <div className="max-w-md">
              <label
                htmlFor="deviceId"
                className="block text-sm font-medium text-gray-700 mb-2">
                Device ID
              </label>
              <div className="flex space-x-3">
                <input
                  id="deviceId"
                  type="text"
                  placeholder="Enter Device ID (e.g., DEF-001)"
                  value={deviceIdInput}
                  onChange={(e) => setDeviceIdInput(e.target.value)}
                  className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2"
                  disabled={isLoadingGenerate}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleGenerateQrCode()
                  }
                />
                <button
                  onClick={handleGenerateQrCode}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={isLoadingGenerate}>
                  {isLoadingGenerate ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">⚡</span>
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated QR Code Display */}
            {qrCodeUrl && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <img
                        src={qrCodeUrl}
                        alt="Generated QR Code"
                        className="w-32 h-32 mx-auto"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      QR Code Generated Successfully
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      This QR code links to the logging form for the device.
                      Nurses can scan this code to quickly access the equipment
                      check form.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handlePrintQrCode}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                        <span className="mr-2">🖨️</span>
                        Print QR Code
                      </button>
                      <button
                        onClick={() => setQrCodeUrl("")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition">
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Devices Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="bg-green-100 rounded-full p-2 mr-3">
                    <span className="text-green-600 text-lg">🏥</span>
                  </span>
                  Registered Devices
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all registered medical equipment
                </p>
              </div>
              <button
                onClick={fetchDevices}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                disabled={isLoadingDevices}>
                {isLoadingDevices ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                ) : (
                  <span className="mr-1">🔄</span>
                )}
                Refresh
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            {isLoadingDevices ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading devices...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📱</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No devices registered
                </h3>
                <p className="text-gray-500 mb-6">
                  Get started by generating your first QR code above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                  <div key={device.id} className="relative group">
                    <Link href={`/admin/logs/${device.id}`}>
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden">
                        {/* Device Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {device.id}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                          {device.name && (
                            <p className="text-sm text-gray-600 mt-1">
                              {device.name}
                            </p>
                          )}
                          {device.location && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <span className="mr-1">📍</span>
                              {device.location}
                            </p>
                          )}
                        </div>

                        {/* QR Code Display */}
                        {device.qrCodeUrl && (
                          <div className="px-6 py-4 text-center bg-gray-50">
                            <div className="inline-block bg-white p-3 rounded-lg shadow-sm border">
                              <img
                                src={device.qrCodeUrl}
                                alt={`QR Code for ${device.id}`}
                                className="w-20 h-20 mx-auto"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Scan to access logging form
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="px-6 py-4 bg-white border-t border-gray-100">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleReprintQrCode(device.id);
                              }}
                              className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                              disabled={isLoadingReprint}>
                              {isLoadingReprint ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                              ) : (
                                <>
                                  <span className="mr-1">🖨️</span>
                                  <span className="hidden sm:inline">
                                    Reprint
                                  </span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteDevice(device.id);
                              }}
                              className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-50"
                              disabled={isLoadingDelete}>
                              {isLoadingDelete ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                              ) : (
                                <>
                                  <span className="mr-1">🗑️</span>
                                  <span className="hidden sm:inline">
                                    Delete
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Click to view logs indicator */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            View Logs →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
