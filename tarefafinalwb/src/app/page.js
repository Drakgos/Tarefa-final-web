import React from 'react';
import { fetchGames } from './api/api';
import Link from 'next/link';

export default async function HomePage() {
    const response = await fetchGames();
    const games = response?.data || [];

    const calcularMedia = (reviews) => {
        const listaReviews = Array.isArray(reviews) ? reviews : reviews?.data || [];
        if (listaReviews.length === 0) return 'N/A';

        const total = listaReviews.reduce((acc, r) => {
            const nota = r.Avaliacao ?? r.attributes?.Avaliacao ?? 0;
            return acc + nota;
        }, 0);

        return (total / listaReviews.length).toFixed(1);
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 pb-12">
            {/* Secção Hero de Destaque */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/60 py-16 px-8 mb-12">
                <div className="max-w-7xl mx-auto text-center sm:text-left">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Descobre o teu próximo <span className="text-yellow-500">Jogo</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl">
                        As avaliações e classificações da comunidade gamer que mais te interessam. Tudo num só lugar.
                    </p>
                </div>
            </div>

            {/* Grelha de Jogos */}
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="h-6 w-1.5 bg-yellow-500 rounded-full inline-block"></span>
                        Jogos em Destaque
                    </h2>
                </div>

                {games.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 border-dashed">
                        <p className="text-slate-400">Nenhum jogo disponível na base de dados de momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {games.map((game) => {
                            const dados = game.attributes ? game.attributes : game;
                            const { Titulo, Ano_lancamento, Capa, reviews } = dados;
                            const imgUrl = Capa?.url || Capa?.data?.attributes?.url || '/placeholder.png';
                            const nota = calcularMedia(reviews);

                            return (
                                <div
                                    key={game.id}
                                    className="group bg-slate-900/70 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700/50 transition-all duration-300 flex flex-col backdrop-blur-sm"
                                >
                                    {/* Container da Imagem com Efeito de Zoom */}
                                    <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${imgUrl})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                                        {/* Badge de Nota estilo IMDb */}
                                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-yellow-400 px-2.5 py-1 rounded-lg font-black text-sm flex items-center gap-1 shadow-md border border-slate-800/40">
                                            <span>★</span>
                                            <span>{nota}</span>
                                        </div>
                                    </div>

                                    {/* Detalhes do Jogo */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-yellow-500 transition-colors line-clamp-1">
                                                {Titulo || "Sem título"}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 mt-1">
                                                {Ano_lancamento || "Ano N/A"}
                                            </p>
                                        </div>

                                        <button className="w-full mt-4 bg-slate-800/60 hover:bg-yellow-500 hover:text-black font-semibold py-2 px-4 rounded-lg text-sm text-slate-300 transition-all duration-200">
                                            Ver Ficha Técnica
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}