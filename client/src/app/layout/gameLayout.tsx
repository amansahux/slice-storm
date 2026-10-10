import { Outlet } from "react-router";

const GameLayout = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Add navbar, sidebar, or game chrome here later */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default GameLayout;
