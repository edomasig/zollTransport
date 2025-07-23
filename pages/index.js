import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>Nurse Logger App</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Nurse Logger App</h1>
      <p className="mb-2">Scan a device QR code to log a check.</p>
      <a href="/admin" className="text-blue-600 underline">
        Admin Dashboard
      </a>
    </div>
  );
}
