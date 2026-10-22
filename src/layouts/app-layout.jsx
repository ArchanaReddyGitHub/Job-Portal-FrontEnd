
import Header from "../components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        // <div className="min-h-screen flex flex-col bg-background text-foreground">
        <div className="min-h-screen">
            <Header />
            {/* <main className="flex-grow container mx-auto px-4 pt-6 pb-20"> */}
            <main className="relative z-10">
                <Outlet />
            </main>
            {/* <footer className="p-6 text-center text-gray-500 text-sm border-t border-border">
                With 💗 Learning MERN Full Stack Developer
            </footer> */}
        </div>
    );
};

export default AppLayout;