import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const DeviceLogsPage = () => {
  const router = useRouter();
  const { deviceId } = router.query;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (deviceId) {
      const fetchLogs = async () => {
        try {
          const response = await fetch(`/api/loggers/${deviceId}`);
          if (response.ok) {
            const data = await response.json();
            setLogs(data);
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to fetch logs');
          }
        } catch (err) {
          console.error('Error fetching logs:', err);
          setError('An unexpected error occurred while fetching logs.');
        } finally {
          setLoading(false);
        }
      };
      fetchLogs();
    }
  }, [deviceId]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-light text-gray-800 font-sans p-4 flex items-center justify-center text-lg font-medium">Loading logs...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-neutral-light text-gray-800 font-sans p-4 flex items-center justify-center text-red-600 text-lg font-medium">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-light text-gray-800 font-sans p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary-dark mb-6 text-center">Logs for Device: {deviceId}</h1>

        {logs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No log entries found for this device.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-neutral">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Time</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Nurse</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Daily Code Readiness</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Daily Battery Check</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Pads Not Expired</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Expiration Date</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Corrective Action</th>
                  {/* Add more headers as needed */}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-light transition duration-150 ease-in-out">
                    <td className="py-3 px-4 whitespace-nowrap">{new Date(log.day).toLocaleDateString()}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{new Date(log.time).toLocaleTimeString()}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{log.nurseName}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{log.dailyCodeReadinessTest ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{log.dailyBatteryCheck ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{log.padsNotExpired ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{new Date(log.expirationDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{log.correctiveAction}</td>
                    {/* Add more log data as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceLogsPage;
