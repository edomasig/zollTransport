import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function LogDevice() {
  const router = useRouter();
  const { id: deviceId } = router.query;

  const [formData, setFormData] = useState({
    day: new Date().toISOString().split('T')[0],
    weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
    time: new Date().toTimeString().split(' ')[0],
    deviceId: '',
    dailyCodeReadinessTest: 'false',
    dailyBatteryCheck: 'false',
    weeklyManualDefibTest: 'false',
    weeklyPacerTest: 'false',
    weeklyRecorder: 'false',
    padsNotExpired: 'false',
    expirationDate: '',
    correctiveAction: '',
    nurseName: '',
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
      [name]: type === 'checkbox' ? String(checked) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    try {
      const response = await fetch('/api/loggers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Log entry created successfully!');
        // Optionally redirect or clear form
        setFormData({
          day: new Date().toISOString().split('T')[0],
          weekDay: new Date().toLocaleString('en-US', { weekday: 'long' }),
          time: new Date().toTimeString().split(' ')[0],
          deviceId: deviceId || '',
          dailyCodeReadinessTest: 'false',
          dailyBatteryCheck: 'false',
          weeklyManualDefibTest: 'false',
          weeklyPacerTest: 'false',
          weeklyRecorder: 'false',
          padsNotExpired: 'false',
          expirationDate: '',
          correctiveAction: '',
          nurseName: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light text-gray-800 font-sans p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary-dark mb-6 text-center">Log for Device: {deviceId}</h1>
        {deviceId && <p className="text-base text-gray-600 mb-6 text-center">Note: Ensure this device ID has been registered in the Admin Dashboard before submitting a log.</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="day" className="block text-lg font-medium text-gray-700 mb-1">Day</label>
            <input
              type="date"
              name="day"
              id="day"
              value={formData.day}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-neutral-dark shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50 p-3 text-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="weekDay" className="block text-lg font-medium text-gray-700 mb-1">Week Day</label>
            <input
              type="text"
              name="weekDay"
              id="weekDay"
              value={formData.weekDay}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-neutral-dark shadow-sm p-3 text-lg bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-lg font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              name="time"
              id="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-neutral-dark shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50 p-3 text-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="deviceId" className="block text-lg font-medium text-gray-700 mb-1">Defibrillator or Device ID</label>
            <input
              type="text"
              name="deviceId"
              id="deviceId"
              value={formData.deviceId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-neutral-dark shadow-sm p-3 text-lg bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="dailyCodeReadinessTest"
                id="dailyCodeReadinessTest"
                checked={formData.dailyCodeReadinessTest === 'true'}
                onChange={handleChange}
                className="h-6 w-6 text-primary border-neutral-dark rounded focus:ring-primary-light"
              />
              <label htmlFor="dailyCodeReadinessTest" className="ml-3 block text-lg text-gray-900">DAILY CODE READINESS TEST</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="dailyBatteryCheck"
                id="dailyBatteryCheck"
                checked={formData.dailyBatteryCheck === 'true'}
                onChange={handleChange}
                className="h-6 w-6 text-primary border-neutral-dark rounded focus:ring-primary-light"
              />
              <label htmlFor="dailyBatteryCheck" className="ml-3 block text-lg text-gray-900">DAILY BATTERY CHECK</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="weeklyManualDefibTest"
                id="weeklyManualDefibTest"
                checked={formData.weeklyManualDefibTest === 'true'}
                onChange={handleChange}
                className="h-6 w-6 text-primary border-neutral-dark rounded focus:ring-primary-light"
              />
              <label htmlFor="weeklyManualDefibTest" className="ml-3 block text-lg text-gray-900">WEEKLY MANUAL DEFIB TEST</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="weeklyPacerTest"
                id="weeklyPacerTest"
                checked={formData.weeklyPacerTest === 'true'}
                onChange={handleChange}
                className="h-6 w-6 text-primary border-neutral-dark rounded focus:ring-primary-light"
              />
              <label htmlFor="weeklyPacerTest" className="ml-3 block text-lg text-gray-900">WEEKLY PACER TEST</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="weeklyRecorder"
                id="weeklyRecorder"
                checked={formData.weeklyRecorder === 'true'}
                onChange={handleChange}
                className="h-6 w-6 text-primary border-neutral-dark rounded focus:ring-primary-light"
              />
              <label htmlFor="weeklyRecorder" className="ml-3 block text-lg text-gray-900">WEEKLY RECORDER</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="padsNotExpired"
                id="padsNotExpired"
                checked={formData.padsNotExpired === 'true'}
                onChange={handleChange}
                className="h-6 w-6 text-primary border-neutral-dark rounded focus:ring-primary-light"
              />
              <label htmlFor="padsNotExpired" className="ml-3 block text-lg text-gray-900">PADS: NOT EXPIRED</label>
            </div>
          </div>

          <div>
            <label htmlFor="expirationDate" className="block text-lg font-medium text-gray-700 mb-1">Freq / Earliest Expiration Date</label>
            <input
              type="date"
              name="expirationDate"
              id="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-neutral-dark shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50 p-3 text-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="correctiveAction" className="block text-lg font-medium text-gray-700 mb-1">Follow up / Corrective Action</label>
            <textarea
              name="correctiveAction"
              id="correctiveAction"
              value={formData.correctiveAction}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full rounded-md border-neutral-dark shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50 p-3 text-lg"
            ></textarea>
          </div>
          <div>
            <label htmlFor="nurseName" className="block text-lg font-medium text-gray-700 mb-1">Print Name & Title</label>
            <input
              type="text"
              name="nurseName"
              id="nurseName"
              value={formData.nurseName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-neutral-dark shadow-sm focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50 p-3 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition duration-150 ease-in-out"
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit ? 'Submitting...' : 'Submit Log'}
          </button>
        </form>
      </div>
    </div>
  );
}