// client/src/AppLayout.tsx
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
export { AppLayout };