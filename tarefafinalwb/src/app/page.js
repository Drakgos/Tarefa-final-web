import React from 'react';
import Link from 'next/link';
import { fetchGames } from './api/api';

export default async function HomePage() {
    let games = [];
    try {
        const response = await fetchGames();
        games = response?.data || [];
    } catch (error) {
        console.error("Erro a ir buscar jogos:", error);
    }

    const calcularMedia = (reviews) => {
        const listaReviews = Array.isArray(reviews) ? reviews : reviews?.data || [];
        if (listaReviews.length === 0) return '—';
        const total = listaReviews.reduce((acc, r) => acc + (r.Avaliacao ?? r.attributes?.Avaliacao ?? 0), 0);
        return (total / listaReviews.length).toFixed(1);
    };

    return (
        <main className="bg-dark text-white min-vh-screen">
            {/* Jumbotron / Hero Banner com Bootstrap */}
            <div className="py-5 mb-5" style={{ background: 'linear-gradient(180deg, #1e293b 0%, #212529 100%)', borderBottom: '1px solid #343a40' }}>
                <div className="container px-4">
                    <h1 className="display-4 fw-black text-white">
                        Descobre o teu próximo <span className="text-warning">Jogo</span>
                    </h1>
                    <p className="lead text-secondary" style={{ maxWidth: '650px' }}>
                        Explora classificações, acompanha tendências e partilha as tuas avaliações com a maior comunidade gamer.
                    </p>
                </div>
            </div>

            {/* Contentor Principal dos Jogos */}
            <div className="container px-4 mb-5">
                <div className="d-flex align-items-center mb-4">
                    {/* Linha vertical decorativa amarela */}
                    <div className="bg-warning rounded" style={{ width: '6px', height: '30px', marginRight: '12px' }}></div>
                    <h2 className="h4 text-uppercase fw-bold m-0 tracking-wider">Jogos Populares</h2>
                </div>

                {games.length === 0 ? (
                    <div className="text-center py-5 text-secondary border border-secondary border-dashed rounded-3">
                        <p className="m-0 fs-5">Nenhum jogo listado ou base de dados desligada.</p>
                    </div>
                ) : (
                    /* Grelha Responsiva do Bootstrap (1 coluna em mobile, 2 em SM, 3 em MD, 4 em LG) */
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {games.map((game) => {
                            const dados = game.attributes ? game.attributes : game;
                            const { Titulo, Ano_lancamento, Capa, reviews } = dados;

                            const rawUrl = Capa?.url || Capa?.data?.attributes?.url;
                            const imgUrl = rawUrl
                                ? `http://localhost:1337${rawUrl}`
                                : 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=500';

                            const nota = calcularMedia(reviews);

                            return (
                                <div key={game.id} className="col">
                                    {/* Card do Bootstrap estilizado para modo escuro */}
                                    <div className="card h-100 bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white shadow rounded-4 overflow-hidden position-relative group-card">

                                        {/* Container da Imagem */}
                                        <div className="position-relative" style={{ pt: '133.33%', overflow: 'hidden', aspectRatio: '3/4' }}>
                                            <img
                                                src={imgUrl}
                                                alt={Titulo}
                                                className="card-img-top w-100 h-100 object-fit-cover transition-all"
                                                style={{ transition: 'transform 0.3s ease' }}
                                            />

                                            {/* Badge de Nota flutuante */}
                                            <span className="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-75 border border-secondary text-warning px-2.5 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-1">
                                                ★ {nota}
                                            </span>
                                        </div>

                                        {/* Corpo do Card */}
                                        <div className="card-body d-flex flex-column justify-content-between p-4">
                                            <div>
                                                <h3 className="card-title h5 fw-bold text-truncate mb-2 text-white">
                                                    {Titulo || "Título Indisponível"}
                                                </h3>
                                                <span className="badge bg-dark text-secondary fw-semibold px-2.5 py-1">
                                                    {Ano_lancamento || "N/A"}
                                                </span>
                                            </div>

                                            <Link href={`/games/${game.id}`} className="btn btn-outline-secondary text-white fw-bold w-full mt-4 py-2 rounded-3 btn-custom-hover text-center d-block text-decoration-none">
                                                Ver Detalhes
                                            </Link>
                                        </div>

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