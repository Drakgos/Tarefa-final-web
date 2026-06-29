'use client';

import React, { useState } from 'react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

        try {
            const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error?.message || 'Erro ao criar conta.');
            }

            setStatus({
                type: 'success',
                message: 'Conta criada com sucesso! Já podes fazer login no teu IMDb de jogos.',
            });

            setFormData({ username: '', email: '', password: '' });

        } catch (err) {
            setStatus({
                type: 'error',
                message: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
            <div className="bg-slate-900 p-8 rounded-lg border border-slate-800 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-black mb-2 text-yellow-500 tracking-tight">Registar_</h2>
                <p className="text-sm text-slate-400 mb-6">Cria o teu perfil para entrares no GamingDB.</p>

                {status.message && (
                    <div className={`p-3 rounded mb-4 text-sm font-semibold ${
                        status.type === 'success'
                            ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                            : 'bg-rose-950 border border-rose-800 text-rose-400'
                    }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Nome de Utilizador</label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="ex: nelson_player"
                            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ex: nelson@email.com"
                            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Palavra-passe</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-700 disabled:text-slate-400 text-black py-2.5 font-bold rounded transition-colors uppercase text-sm mt-2"
                    >
                        {loading ? 'A criar utilizador...' : 'Registar Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
}