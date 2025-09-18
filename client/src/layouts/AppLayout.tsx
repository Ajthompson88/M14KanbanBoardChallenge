import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export function AppLayout() {
  return (
    <>
      {/* Fixed nav at 56px (h-14). Add top padding to push content below it. */}
      <Navbar />
      <div className="pt-14">
        <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
