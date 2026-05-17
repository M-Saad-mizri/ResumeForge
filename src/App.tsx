import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { CVProvider } from "@/contexts/CVContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
const Builder = lazy(() => import("./pages/Builder"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SharedCV = lazy(() => import("./pages/SharedCV"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CVProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/builder" element={<Builder />} />
                <Route path="/resume-builder" element={<Navigate to="/builder" replace />} />
                <Route path="/shared/:id" element={<SharedCV />} />
                <Route path="/about" element={<LegalPage page="about" />} />
                <Route path="/contact" element={<LegalPage page="contact" />} />
                <Route path="/privacy-policy" element={<LegalPage page="privacy" />} />
                <Route path="/terms-and-conditions" element={<LegalPage page="terms" />} />
                <Route path="/disclaimer" element={<LegalPage page="disclaimer" />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/guides" element={<Navigate to="/blog" replace />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </BrowserRouter>
          </CVProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
