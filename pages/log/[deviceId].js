// Example component for pages/log/[deviceId].js

import React from "react";
import { useRouter } from "next/router";

const LogDetailsPage = () => {
  const router = useRouter();
  const { deviceId } = router.query;

  return (
    <div>
      <h1>Log Details for Device: {deviceId}</h1>
      {/* Add more details or functionality as needed */}
    </div>
  );
};

export default LogDetailsPage;
