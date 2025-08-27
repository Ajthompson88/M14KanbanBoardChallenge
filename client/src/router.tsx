// client/src/router.tsx
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Board from "./pages/Board";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route
        path="board"
        element={
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        }
      />
      <Route
        path="create"
        element={
          <ProtectedRoute>
            <CreateTicket />
          </ProtectedRoute>
        }
      />
      <Route
        path="edit"
        element={
          <ProtectedRoute>
            <EditTicket />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Home />} />
    </Route>
  )
);
