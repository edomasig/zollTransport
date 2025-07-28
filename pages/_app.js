import "../styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Run auth check when component mounts and when route changes
    authCheck(router.asPath);

    const handleRouteChange = (url) => {
      setIsLoading(true);
      authCheck(url);
    };

    router.events.on("routeChangeStart", () => setIsLoading(true));
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", () => setIsLoading(true));
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  function authCheck(url) {
    const publicPaths = ["/login", "/", "/log/[deviceId]"];
    const path = url.split("?")[0];
    const authCookie = Cookies.get("auth");
    const isLoggedIn = authCookie === "true";

    console.log(
      `authCheck: path=${path}, authCookie="${authCookie}", isLoggedIn=${isLoggedIn}`
    );

    // Handle public paths
    if (publicPaths.includes(path) || path.startsWith("/log/")) {
      if (isLoggedIn && path === "/login") {
        // Logged in user trying to access login page - redirect to admin
        console.log("Redirecting logged in user from login to admin");
        router.replace("/admin");
        return;
      }
      // Allow access to public paths
      setAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Handle admin paths
    if (path.startsWith("/admin")) {
      if (isLoggedIn) {
        // Allow access to admin
        setAuthorized(true);
        setIsLoading(false);
      } else {
        // Redirect to login
        console.log("Redirecting to login - not authenticated");
        setAuthorized(false);
        router.replace("/login");
      }
      return;
    }

    // Default: allow access
    setAuthorized(true);
    setIsLoading(false);
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return authorized ? <Component {...pageProps} /> : null;
}
