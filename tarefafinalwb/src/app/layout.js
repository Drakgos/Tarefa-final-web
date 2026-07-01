'use client';

import "./globals.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function RootLayout({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Função para verificar se há sessão ativa no navegador
        const checkAuth = () => {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            if (savedUser && savedToken) {
                setUser(JSON.parse(savedUser));
            } else {
                setUser(null);
            }
        };

        // Executa ao carregar a página
        checkAuth();

        // Escuta mudanças de storage (caso faças login noutra aba)
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = "/"; // Redireciona para a home de forma limpa
    };

    return (
        <html lang="pt">
        <head>
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

                {/* Alternância Dinâmica de Botões baseada no Estado de Login */}
                <div className="d-flex align-items-center gap-3">
                    {user ? (
                        <>
                  <span className="text-secondary small me-2">
                    Olá, <strong className="text-white">{user.username || user.Name}</strong>!
                  </span>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-danger fw-bold px-3 rounded-3 btn-sm"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>

            </div>
        </nav>

        {children}

        </body>
        </html>
    );
}