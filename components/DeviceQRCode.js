import dynamic from "next/dynamic";

const QRCode = dynamic(() => import("qrcode.react"), { ssr: false });

export default function DeviceQRCode({ deviceId }) {
  const url = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/log/${deviceId}`;
  return (
    <div className="flex flex-col items-center">
      <QRCode value={url} size={200} />
      <p className="mt-2">
        Scan to log device: <span className="font-mono">{deviceId}</span>
      </p>
    </div>
  );
}

// Example usage: <DeviceQRCode deviceId="abc-123" />
