import { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "./ui/button";

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes or 24 hours
const WARNING_TIMEOUT = 4.5 * 60 * 1000; // 4.5 minutes (30 seconds before logout)
const COUNTDOWN_DURATION = 30; // 30 seconds countdown
const WARNING_TOAST_ID = "session-warning-toast";

const SessionManager = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [showMultiTabModal, setShowMultiTabModal] = useState(false);
  const [otherTabInfo, setOtherTabInfo] = useState<TabInfo | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const channelRef = useRef<BroadcastChannel | null>(null);

  interface TabInfo {
    title: string;
    url: string;
  }

  const handleLogout = useCallback(
    (reason: "idle" | "multiple-login") => {
      toast.error(
        reason === "idle"
          ? "You have been logged out due to inactivity"
          : "Session expired: A new login was detected in another tab",
        { duration: 5000 }
      );
      toast.dismiss(WARNING_TOAST_ID);
      setShowWarning(false);
      console.log("logging out");
      sessionStorage.clear();
      navigate("/login", {
        replace: true,
        state: {
          sessionExpired: true,
          reason: reason === "idle" ? "idle-timeout" : "multiple-login",
        },
      });
    },
    [navigate]
  );

  const resetTimers = useCallback(() => {
    // Clear existing timers
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (countdownIntervalRef.current)
      if (countdownIntervalRef.current !== null) {
        clearInterval(countdownIntervalRef.current);
      }

    setShowWarning(false);
    setCountdown(COUNTDOWN_DURATION);
    toast.dismiss(WARNING_TOAST_ID);

    // Set new warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current)
              if (countdownIntervalRef.current !== null) {
                clearInterval(countdownIntervalRef.current);
              }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_TIMEOUT);

    // Set new logout timer
    logoutTimerRef.current = setTimeout(() => {
      handleLogout("idle");
    }, IDLE_TIMEOUT);
  }, [handleLogout]);

  const handleUseThisTab = useCallback(() => {
    setShowMultiTabModal(false);

    // Broadcast that this tab is taking control
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "TAB_TAKEOVER",
        sessionId: sessionStorage.getItem("sessionId"),
        timestamp: Date.now(),
      });
    }
  }, []);

  const handleCloseTab = useCallback(() => {
    setShowMultiTabModal(false);
    handleLogout("multiple-login");
  }, [handleLogout]);

  useEffect(() => {
    // Initialize session ID and broadcast channel
    const existingSessionId = sessionStorage.getItem("sessionId");
    if (!existingSessionId) {
      const sessionId = crypto.randomUUID();
      sessionStorage.setItem("sessionId", sessionId);
      sessionStorage.setItem("lastActive", Date.now().toString());
    }

    channelRef.current = new BroadcastChannel("auth_channel");

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const currentSessionId = sessionStorage.getItem("sessionId");
        const lastActive = sessionStorage.getItem("lastActive");

        if (currentSessionId) {
          if (channelRef.current) {
            channelRef.current.postMessage({
              type: "TAB_ACTIVE",
              sessionId: currentSessionId,
              timestamp: Date.now(),
              lastActive,
              tabInfo: {
                title: document.title,
                url: window.location.href,
              },
            });
          }
          sessionStorage.setItem("lastActive", Date.now().toString());
        }
      }
    };

    const handleUserActivity = () => {
      resetTimers();
      // Update last active timestamp
      sessionStorage.setItem("lastActive", Date.now().toString());
    };

    const handleMessage = (event: MessageEvent) => {
      const currentSessionId = sessionStorage.getItem("sessionId");
      const currentLastActive = parseInt(
        sessionStorage.getItem("lastActive") || "0"
      );

      if (
        event.data.type === "TAB_ACTIVE" &&
        event.data.sessionId !== currentSessionId
      ) {
        // If other tab is more active than this one
        if (event.data.timestamp > currentLastActive) {
          // Show WhatsApp style modal instead of immediate logout
          setOtherTabInfo(event.data.tabInfo);
          setShowMultiTabModal(true);
        }
      } else if (
        event.data.type === "TAB_TAKEOVER" &&
        event.data.sessionId !== currentSessionId
      ) {
        // Another tab claimed control, logout this tab
        handleLogout("multiple-login");
      }
    };

    // Set up event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keypress", handleUserActivity);
    document.addEventListener("click", handleUserActivity);
    channelRef.current.addEventListener("message", handleMessage);

    // Initialize timers
    resetTimers();

    // Broadcast active status when component mounts
    handleVisibilityChange();

    // Clean up
    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keypress", handleUserActivity);
      document.removeEventListener("click", handleUserActivity);
      if (channelRef.current) channelRef.current.close();
    };
  }, [handleLogout, resetTimers, handleUseThisTab]);

  // Warning toast with countdown for idle timeout
  useEffect(() => {
    if (showWarning) {
      toast.info(
        ` Your session will expire in ${countdown} seconds due to inactivity`,
        {
          id: WARNING_TOAST_ID,
          duration: Infinity,
          onDismiss: () => setShowWarning(false),
        }
      );
    }

  }, [countdown, showWarning, resetTimers]);

  // modal for multiple tab detection
  if (showMultiTabModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md shadow-xl max-w-md w-full p-6 mx-4">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Session already open in another window
            </h3>
            <p className="text-gray-600">
              {otherTabInfo
                ? `The application is already open at ${
                    new URL(otherTabInfo.url).pathname
                  }`
                : "The application is already open in another tab or window."}
            </p>
            <p className="text-gray-600">
              Click &quot;Use here&quot; to use the application in this window.
            </p>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                onClick={handleCloseTab}
                variant="outline"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </Button>
              <Button
                onClick={handleUseThisTab}
                className="px-4 py-2 bg-primary hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Use here
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SessionManager;
