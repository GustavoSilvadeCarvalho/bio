import Auth from "../../components/Auth";
import { Navbar } from "@/components/Navbar";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center bg-black text-white">
            <Navbar />
            <div className="flex flex-1 items-center justify-center w-full pt-20">
                <div className="w-full max-w-2xl px-4 text-center">
                    <Auth />
                </div>
            </div>
        </main>
    );
}
