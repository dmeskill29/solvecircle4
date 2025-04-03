"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">(
    "other"
  );

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    }

    const addDebugInfo = (info: string) => {
      setDebugInfo((prev) => [...prev, `${new Date().toISOString()}: ${info}`]);
    };

    // Check if app is already installed
    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as NavigatorWithStandalone).standalone ||
      document.referrer.includes("android-app://");

    setIsStandalone(isInStandalone);
    addDebugInfo(`isInStandalone: ${isInStandalone}`);
    addDebugInfo(`Platform detected: ${platform}`);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault(); // Prevent the default browser install prompt
      addDebugInfo("beforeinstallprompt event received");
      // Store the event for later use
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    addDebugInfo("Adding beforeinstallprompt event listener");
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check service worker registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        addDebugInfo(`Service Worker registrations: ${registrations.length}`);
        registrations.forEach((registration) => {
          addDebugInfo(`SW scope: ${registration.scope}`);
        });
      });
    } else {
      addDebugInfo("Service Worker not supported");
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDebugInfo((prev) => [...prev, `Install outcome: ${outcome}`]);

      if (outcome === "accepted") {
        setIsInstallable(false);
      }
    } catch (error) {
      console.error("Error installing PWA:", error);
      setDebugInfo((prev) => [...prev, `Install error: ${error}`]);
    }

    setDeferredPrompt(null);
  };

  // Show iOS-specific instructions even if in standalone mode
  if (platform === "ios") {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Install SolveCircle
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              To install on iOS:
              <ol className="list-decimal ml-4 mt-1">
                <li>Tap the Share button in Safari</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </p>
            <div className="mt-3">
              <Button
                onClick={() => setIsInstallable(false)}
                variant="outline"
                size="sm"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For Android/other platforms, only show if installable and not in standalone
  if (
    process.env.NODE_ENV === "production" &&
    (isStandalone || !isInstallable)
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Install SolveCircle
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Install our app for a better experience and offline access
          </p>
          <div className="mt-3 flex space-x-2">
            <Button onClick={handleInstallClick} variant="default" size="sm">
              Install
            </Button>
            <Button
              onClick={() => setIsInstallable(false)}
              variant="outline"
              size="sm"
            >
              Maybe Later
            </Button>
          </div>
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 max-h-40 overflow-auto">
              <p>Debug Info:</p>
              {debugInfo.map((info, i) => (
                <div key={i}>{info}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
