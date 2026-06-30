import "./globals.css";
import Link from "next/link";

export const metadata = {
    title: "GamingDB",
    description: "O teu IMDb de videojogos",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt">
        <head>
            {/* Importação do CSS do Bootstrap 5 */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            />
        </head>
        <body className="bg-dark text-light">

        {/* Barra de Navegação Bootstrap */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary border-opacity-25 sticky-top py-3">
            <div className="container px-4 d-flex justify-content-between align-items-center">

                {/* Logo */}
                <Link href="/" className="navbar-brand fs-3 fw-black tracking-tighter m-0 text-white d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
                    <span className="bg-warning text-dark px-2 py-0.5 rounded fw-black">G</span>
                    <span>Gaming<span className="text-warning">DB</span></span>
                </Link>

                {/* Botões de Ação (Login e Registo) */}
                <div className="d-flex align-items-center gap-3">
                    <Link
                        href="/auth/login"
                        className="btn btn-link text-secondary text-white-hover fw-bold text-decoration-none shadow-none"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/auth/register"
                        className="btn btn-warning fw-bold px-4 rounded-3 shadow-sm"
                    >
                        Criar Conta
                    </Link>
                </div>

            </div>
        </nav>

        {/* Conteúdo das Páginas */}
        {children}

        </body>
        </html>
    );
}