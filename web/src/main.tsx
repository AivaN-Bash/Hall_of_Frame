import "@/index.css";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { SiteProvider } from "@/lib/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import HomePage from "@/pages/HomePage";

const CollectionsPage = lazy(() => import("@/pages/CollectionsPage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const EntryPage = lazy(() => import("@/pages/EntryPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="animate-pulse text-sm text-[var(--hof-muted)]">Loading...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <div className="flex min-h-svh flex-col bg-[var(--hof-bg)]">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/collections/:slug" element={<CategoryPage />} />
                  <Route path="/entry/:slug" element={<EntryPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route
                    path="*"
                    element={
                      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
                        <p className="text-sm text-[var(--hof-muted)]">Page not found.</p>
                        <Link
                          to="/"
                          className="text-xs font-semibold uppercase tracking-wider text-[var(--hof-accent-light)] transition-colors hover:text-[var(--hof-text)]"
                        >
                          &larr; Back to Hall of Fame
                        </Link>
                      </div>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
