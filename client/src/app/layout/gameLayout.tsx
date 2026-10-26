import { Outlet } from "react-router";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

const GameLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7E8C3] paper-pattern text-[#1b1c1c] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 flex flex-col ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GameLayout;
