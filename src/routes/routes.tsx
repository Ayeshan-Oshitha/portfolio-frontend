import { createBrowserRouter } from "react-router-dom";
import PortfolioLayout from "../portfolio/layout/PortfolioLayout";
import Home from "../portfolio/pages/Home";
import ContactPage from "../portfolio/pages/ContactPage";
import AboutPage from "../portfolio/pages/AboutPage";
import WorkPage from "../portfolio/pages/WorkPage";
import BlogPage from "../portfolio/pages/BlogPage";
import ServicesPage from "../portfolio/pages/ServicesPage";
import App from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PortfolioLayout />,
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
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },
]);
