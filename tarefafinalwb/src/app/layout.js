import "./globals.css";
import Link from "next/link";

export const metadata = {
    title: "GamingDB",
    description: "O teu IMDb de videojogos",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt" className="scroll-smooth">
        <body className="bg-slate-950 text-slate-100 antialiased">
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo Estilo Premium */}
                <Link href="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-1 group">
                    <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-black transform group-hover:scale-105 transition-transform">G</span>
                    <span>Gaming<span className="text-yellow-500">DB</span></span>
                </Link>

                {/* Menu de Autenticação */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/aut/login"
                        className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/aut/register"
                        className="px-4 py-2 bg-yellow-500 text-black text-sm font-bold rounded-lg hover:bg-yellow-600 shadow-md shadow-yellow-500/10 active:scale-95 transition-all"
                    >
                        Criar Conta
                    </Link>
                </div>
            </div>
        </nav>

        {children}
        </body>
        </html>
    );
}