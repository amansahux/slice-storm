import { Outlet } from "react-router";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

const GameLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GameLayout;
