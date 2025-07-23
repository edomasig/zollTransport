import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [devices, setDevices] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices'); // Assuming a new API endpoint to fetch all devices
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      } else {
        setMessage('Failed to fetch devices.');
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setMessage('An error occurred while fetching devices.');
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleGenerateQrCode = async () => {
    if (!deviceIdInput) {
      setMessage('Please enter a Device ID.');
      return;
    }

    try {
      const response = await fetch('/api/devices/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId: deviceIdInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qrCodeUrl);
        setMessage('QR Code generated successfully!');
        setDeviceIdInput(''); // Clear input after generation
        fetchDevices(); // Refresh device list
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setMessage('An unexpected error occurred during QR code generation.');
    }
  };

  const handlePrintQrCode = () => {
    if (qrCodeUrl) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
      printWindow.document.write('<img src="' + qrCodeUrl + '" onload="window.print();window.close()" />');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
    } else {
      setMessage('No QR Code to print. Generate one first.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light text-gray-800 font-sans p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary-dark mb-6 text-center">Admin Dashboard</h1>

        <div className="mb-8 p-6 border border-neutral rounded-lg shadow-sm bg-neutral-light">
          <h2 className="text-2xl font-semibold text-primary mb-4">Generate QR Code for Device</h2>
          <input
            type="text"
            placeholder="Enter Device ID"
            value={deviceIdInput}
            onChange={(e) => setDeviceIdInput(e.target.value)}
            className="mt-1 block w-full rounded-md border-neutral-dark focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50 p-3 text-lg bg-white shadow-sm"
          />
          <button
            onClick={handleGenerateQrCode}
            className="mt-4 inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition duration-150 ease-in-out"
          >
            Generate QR Code
          </button>
          {message && <p className="mt-3 text-sm text-red-600 font-medium">{message}</p>}
          {qrCodeUrl && (
            <div className="mt-6 p-4 border border-neutral rounded-lg bg-white text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-3">Generated QR Code:</h3>
              <img src={qrCodeUrl} alt="Generated QR Code" className="mx-auto border p-2 bg-white shadow-md" />
              <p className="mt-3 text-base text-gray-600">Scan this QR code to log checks for device: <span className="font-semibold text-primary-dark">{deviceIdInput}</span></p>
              <button
                onClick={handlePrintQrCode}
                className="mt-4 inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light transition duration-150 ease-in-out"
              >
                Print QR Code
              </button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Existing Devices</h2>
          {devices.length === 0 ? (
            <p className="text-gray-600">No devices found. Generate one above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <Link key={device.id} href={`/admin/logs/${device.id}`}>
                  <div className="border border-neutral rounded-lg shadow-md p-6 bg-white cursor-pointer hover:shadow-xl transition-shadow duration-200 ease-in-out">
                    <h3 className="text-xl font-semibold text-primary-dark mb-2">Device ID: {device.id}</h3>
                    <p className="text-gray-700">Name: <span className="font-medium">{device.name}</span></p>
                    <p className="text-gray-700">Location: <span className="font-medium">{device.location}</span></p>
                    {device.qrCodeUrl && (
                      <div className="mt-4 text-center">
                        <img src={device.qrCodeUrl} alt={`QR Code for ${device.id}`} className="mx-auto border p-1 bg-white shadow-sm" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
