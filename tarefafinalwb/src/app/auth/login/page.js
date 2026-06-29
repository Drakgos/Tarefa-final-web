'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const STRAPI_URL = 'http://localhost:1337';

        try {
            const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error?.message || 'Email ou password incorretos.');
            }

            // Guardar o Token para futuras avaliações (Reviews)
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Bem-vindo de volta!');
            router.push('/'); // Redireciona para a página principal

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-lg border border-slate-800 w-full max-w-md">
                <h2 className="text-2xl font-black mb-6 text-yellow-500">Entrar_</h2>

                {error && (
                    <div className="bg-rose-950 border border-rose-800 text-rose-400 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Email ou Username</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded focus:border-yellow-500 outline-none"
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded focus:border-yellow-500 outline-none"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black py-2.5 font-bold rounded hover:bg-yellow-600 transition-colors"
                    >
                        {loading ? 'A entrar...' : 'Entrar na Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
}