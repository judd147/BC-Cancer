import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./AuthContext";
import "./index.css";
import App from "./App.tsx";
import Events from "./pages/events";
import CreateEvent from "./pages/create-event";
import EventDetail from "./pages/event-detail";

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const PrivateRoute = () => {
  const { isAuthed } = useAuth();
  return isAuthed ? <Outlet /> : <Navigate to="/" />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route element={<PrivateRoute />}>
        <Route path="events" element={<Events />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="events/:eventId" element={<EventDetail />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
