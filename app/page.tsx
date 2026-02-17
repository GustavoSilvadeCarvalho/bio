import Link from "next/link";
import Auth from "../components/Auth";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-4">BioSite Builder</h1>
      <div className="w-full max-w-2xl mb-6">
        <Auth />
      </div>
      <Link
        href="/afton"
        className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all"
      >
        Ver Perfil de Teste (/afton)
      </Link>
    </main>
  );
}