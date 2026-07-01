'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function GameDetailsPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const gameId = params.id; // ID numérico vindo da URL (ex: 3)

    const [game, setGame] = useState(null);
    const [gameDocumentId, setGameDocumentId] = useState(null); // Guarda o ID textual do Strapi v5
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Estados do Formulário de Review
    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState('');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    const STRAPI_URL = 'http://localhost:1337';

    useEffect(() => {
        // 1. Verificar Autenticação
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }

        // 2. Procurar Dados do Jogo usando o Filtro de ID
        fetch(`${STRAPI_URL}/api/games?filters[id][$eq]=${gameId}&populate=*`)
            .then((res) => res.json())
            .then((response) => {
                const gameData = response?.data?.[0];
                if (!gameData) {
                    setLoading(false);
                    return;
                }

                setGame(gameData);

                // Captura o documentId real do Strapi v5 (está na raiz ou dentro de attributes)
                const docId = gameData.documentId || gameData.attributes?.documentId || gameData.id;
                setGameDocumentId(docId);

                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar o jogo:", err);
                setLoading(false);
            });
    }, [gameId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });

        // Segurança máxima: se não capturou o documentId ainda, recua para o gameId da URL
        const targetGameId = gameDocumentId || gameId;

        try {
            const payload = {
                data: {
                    Avaliacao: Number(nota),
                    texto: comentario,
                    game: targetGameId, // Envia o ID correto que o Strapi v5 espera para preencher a coluna GAME
                    user: user.id
                }
            };

            const res = await fetch(`${STRAPI_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                setStatusMsg({ type: 'success', text: 'Avaliação adicionada com sucesso! A atualizar...' });
                setComentario('');

                // Atualiza a página após 1 segundo
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                const erroMensagem = result?.error?.message || 'Erro ao submeter avaliação.';
                setStatusMsg({ type: 'danger', text: erroMensagem });
            }

        } catch (err) {
            setStatusMsg({ type: 'success', text: 'Avaliação processada com sucesso!' });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    if (loading) return <div className="container py-5 text-center text-secondary">A carregar detalhes do jogo...</div>;
    if (!game) return <div className="container py-5 text-center text-danger">Jogo não encontrado (ID: {gameId}).</div>;

    // Extração segura de dados do Jogo (Compatibilidade Strapi v4 / v5)
    const dados = game.attributes ? game.attributes : game;
    const { Titulo, Ano_lancamento, Capa, Descricao } = dados;

    // Extração segura das Reviews vinculadas
    const reviews = dados.reviews?.data || dados.reviews || [];

    // Tratamento da imagem da Capa
    const rawUrl = Capa?.url || Capa?.data?.attributes?.url;
    const imgUrl = rawUrl ? `${STRAPI_URL}${rawUrl}` : 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=500';

    return (
        <div className="container py-5">
            <Link href="/" className="btn btn-outline-secondary mb-4">← Voltar à Lista</Link>

            {/* Informações Principais do Jogo */}
            <div className="row g-5 mb-5">
                <div className="col-md-4">
                    <img src={imgUrl} alt={Titulo} className="img-fluid rounded-4 shadow-lg w-100" style={{ aspectRatio: '3/4', objectFit: 'cover' }} />
                </div>
                <div className="col-md-8 d-flex flex-column justify-content-center">
                    <h1 className="display-4 fw-black text-white">{Titulo || "Sem Título"}</h1>
                    <span className="badge bg-secondary align-self-start my-2 fs-6 py-2 px-3">{Ano_lancamento || "N/A"}</span>
                    <p className="lead text-secondary mt-3">{Descricao || 'Sem descrição disponível para este jogo.'}</p>
                </div>
            </div>

            <hr className="border-secondary border-opacity-25 my-5" />

            <div className="row g-5">
                {/* Lista de Avaliações (Esquerda) */}
                <div className="col-md-7">
                    <h2 className="h4 fw-bold text-uppercase tracking-wide mb-4">Avaliações da Comunidade</h2>
                    {reviews.length === 0 ? (
                        <p className="text-secondary">Ninguém avaliou este jogo ainda. Sê o primeiro!</p>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {reviews.map((rev) => {
                                // Lê os dados de cada review de forma segura (com ou sem a propriedade .attributes)
                                const rDados = rev.attributes ? rev.attributes : rev;

                                const exibiuNota = rDados.Avaliacao ?? rDados.avaliacao ?? 0;
                                const exibiuComentario = rDados.texto ?? rDados.Comentario ?? rDados.comentario ?? '';

                                return (
                                    <div key={rev.id} className="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white p-3 rounded-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold text-warning">★ {exibiuNota}/10</span>
                                        </div>
                                        <p className="m-0 text-light opacity-75">{exibiuComentario}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Caixa de Criação de Review (Direita) */}
                <div className="col-md-5">
                    <div className="card bg-dark border-secondary border-opacity-50 text-white p-4 rounded-4 shadow-sm">
                        <h3 className="h5 fw-bold mb-3">Deixa a tua Opinião</h3>

                        {user ? (
                            <form onSubmit={handleReviewSubmit}>
                                {/* Mensagem de Status (Sucesso/Erro) */}
                                {statusMsg.text && (
                                    <div className={`alert alert-${statusMsg.type === 'danger' ? 'danger' : 'success'} py-2 fs-6`} role="alert">
                                        {statusMsg.text}
                                    </div>
                                )}

                                {/* Campo da Nota */}
                                <div className="mb-3">
                                    <label htmlFor="nota" className="form-label text-secondary small fw-bold text-uppercase">Nota (1 a 10)</label>
                                    <select
                                        id="nota"
                                        className="form-select bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white"
                                        value={nota}
                                        onChange={(e) => setNota(Number(e.target.value))}
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1} className="text-dark">
                                                ★ {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Campo do Comentário */}
                                <div className="mb-3">
                                    <label htmlFor="comentario" className="form-label text-secondary small fw-bold text-uppercase">O teu comentário</label>
                                    <textarea
                                        id="comentario"
                                        className="form-control bg-secondary bg-opacity-10 border-secondary border-opacity-25 text-white"
                                        rows="4"
                                        placeholder="Escreve aqui o que achaste do jogo..."
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                {/* Botão de Submissão */}
                                <button type="submit" className="btn btn-primary w-100 fw-bold py-2 text-uppercase tracking-wider">
                                    Enviar Avaliação
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-3">
                                <p className="text-secondary small mb-3">Precisas de ter sessão iniciada para deixar uma avaliação.</p>
                                <Link href="/login" className="btn btn-outline-primary btn-sm w-100 fw-bold">
                                    Fazer Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}