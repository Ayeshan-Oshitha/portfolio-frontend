import { createBrowserRouter } from "react-router-dom";
import ClientLayout from "@/client/layout/ClientLayout";
import Home from "@/client/pages/Home";
import ContactPage from "@/client/pages/ContactPage";
import AboutPage from "@/client/pages/AboutPage";
import WorkPage from "@/client/pages/WorkPage";
import ProjectDetailPage from "@/client/pages/ProjectDetailPage";
import BlogPage from "@/client/pages/BlogPage";
import ArticleDetailPage from "@/client/pages/ArticleDetailPage";
import ClientReviewsPage from "@/client/pages/ReviewsPage";
import ServicesPage from "@/client/pages/ServicesPage";
import AdminRoot from "@/admin/layout/AdminRoot";
import RequireAuth from "@/admin/components/RequireAuth";
import RequireSuperAdmin from "@/admin/components/RequireSuperAdmin";
import RedirectIfAuthenticated from "@/admin/components/RedirectIfAuthenticated";
import AdminLayout from "@/admin/layout/AdminLayout";
import AuthLayout from "@/admin/layout/AuthLayout";
import LoginPage from "@/admin/pages/LoginPage";
import RegisterPage from "@/admin/pages/RegisterPage";
import DashboardPage from "@/admin/pages/DashboardPage";
import ChangePasswordPage from "@/admin/pages/ChangePasswordPage";
import UsersPage from "@/admin/pages/UsersPage";
import PendingApprovalsPage from "@/admin/pages/PendingApprovalsPage";
import TagsPage from "@/admin/pages/TagsPage";
import ArticlesPage from "@/admin/pages/ArticlesPage";
import AdminServicesPage from "@/admin/pages/ServicesPage";
import PricingPage from "@/admin/pages/PricingPage";
import ProjectsPage from "@/admin/pages/ProjectsPage";
import ProjectEditorPage from "@/admin/pages/ProjectEditorPage";
import FaqsPage from "@/admin/pages/FaqsPage";
import ReviewsPage from "@/admin/pages/ReviewsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "services",
        element: <ServicesPage />,
      },
      {
        path: "work",
        element: <WorkPage />,
      },
      {
        path: "work/:slug",
        element: <ProjectDetailPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/:slug",
        element: <ArticleDetailPage />,
      },
      {
        path: "reviews",
        element: <ClientReviewsPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },
  {
    // The CMS lives outside the marketing layout and owns its own auth state.
    path: "/admin",
    element: <AdminRoot />,
    children: [
      {
        element: <RedirectIfAuthenticated />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: "login",
                element: <LoginPage />,
              },
              {
                path: "register",
                element: <RegisterPage />,
              },
            ],
          },
        ],
      },
      {
        // element: <RequireAuth />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                element: <RequireSuperAdmin />,
                children: [
                  {
                    path: "users",
                    element: <UsersPage />,
                  },
                  {
                    path: "approvals",
                    element: <PendingApprovalsPage />,
                  },
                ],
              },
              {
                path: "projects",
                element: <ProjectsPage />,
              },
              {
                // A project has far more fields than the other content types,
                // so it is edited on its own route rather than in a modal.
                path: "projects/new",
                element: <ProjectEditorPage />,
              },
              {
                path: "projects/:id",
                element: <ProjectEditorPage />,
              },
              {
                path: "articles",
                element: <ArticlesPage />,
              },
              {
                path: "tags",
                element: <TagsPage />,
              },
              {
                path: "services",
                element: <AdminServicesPage />,
              },
              {
                path: "pricing",
                element: <PricingPage />,
              },
              {
                path: "faqs",
                element: <FaqsPage />,
              },
              {
                path: "reviews",
                element: <ReviewsPage />,
              },
              {
                path: "change-password",
                element: <ChangePasswordPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
