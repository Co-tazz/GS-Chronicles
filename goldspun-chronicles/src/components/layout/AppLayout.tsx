import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
