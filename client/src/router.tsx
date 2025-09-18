// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";   // ← add this import
import Board from "./pages/Board";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },   // ← add this route
      {
        path: "board",
        element: (
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreateTicket />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit/:id",
        element: (
          <ProtectedRoute>
            <EditTicket />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
