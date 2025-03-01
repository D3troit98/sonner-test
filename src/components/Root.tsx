import { Toaster } from "./ui/sonner";
import { Outlet, ScrollRestoration } from "react-router";

const Root = () => {
  return (
    <div>
      <Toaster richColors />
      <main>
        <ScrollRestoration />
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
