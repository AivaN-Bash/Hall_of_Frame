import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { SiteProvider } from "@/lib/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import HomePage from "@/pages/HomePage";
import CollectionsPage from "@/pages/CollectionsPage";
import CategoryPage from "@/pages/CategoryPage";
import EntryPage from "@/pages/EntryPage";
import AboutPage from "@/pages/AboutPage";
import LoginPage from "@/pages/LoginPage";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <div className="flex min-h-svh flex-col bg-[var(--hof-bg)]">
            <Navbar />
            <main className="flex-1">
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
                    <div className="flex min-h-[50vh] items-center justify-center">
                      <p className="text-sm text-[var(--hof-muted)]">Page not found.</p>
                    </div>
                  }
                />
              </Routes>
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
