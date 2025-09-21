import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { BottomNavigation } from "./components/BottomNavigation";
import { PWAUpdater } from "./components/PWAUpdater";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CameraSettingsProvider } from "./contexts/CameraSettingsContext";
import { MathpixSettingsProvider } from "./contexts/MathpixSettingsContext";
import { FlowiseAgentsProvider } from "./contexts/FlowiseAgentsContext";
import { PromptsProvider } from "./contexts/PromptsContext";
import { MultiOCRWorkflowProvider } from "./contexts/MultiOCRWorkflowContext";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // PWA Links
  { rel: "manifest", href: process.env.NODE_ENV === 'production' ? "/react-mathpix-flowise/manifest.json" : "/manifest.json" },
  { rel: "icon", href: process.env.NODE_ENV === 'production' ? "/react-mathpix-flowise/favicon.ico" : "/favicon.ico" },
  { rel: "apple-touch-icon", href: process.env.NODE_ENV === 'production' ? "/react-mathpix-flowise/icon-192x192.png" : "/icon-192x192.png" },
  { rel: "apple-touch-icon", sizes: "192x192", href: process.env.NODE_ENV === 'production' ? "/react-mathpix-flowise/icon-192x192.png" : "/icon-192x192.png" },
  { rel: "apple-touch-icon", sizes: "512x512", href: process.env.NODE_ENV === 'production' ? "/react-mathpix-flowise/icon-512x512.png" : "/icon-512x512.png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="MathPix OCR" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MathPix OCR" />
        <meta name="description" content="Aplicación de OCR matemático con MathPix y Flowise para reconocimiento de texto e imágenes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content={process.env.NODE_ENV === 'production' ? "/react-mathpix-flowise/browserconfig.xml" : "/browserconfig.xml"} />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />
        {/* Forzar actualización del manifest */}
        <meta name="manifest-version" content="2.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CameraSettingsProvider>
        <MathpixSettingsProvider>
          <FlowiseAgentsProvider>
            <PromptsProvider>
              <MultiOCRWorkflowProvider>
                <div className="min-h-screen main-content" style={{ backgroundColor: 'var(--color-background)' }}>
                  <Outlet />
                  <BottomNavigation />
                  <PWAUpdater />
                </div>
              </MultiOCRWorkflowProvider>
            </PromptsProvider>
          </FlowiseAgentsProvider>
        </MathpixSettingsProvider>
      </CameraSettingsProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
