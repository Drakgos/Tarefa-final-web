const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchGames() {
    const query = 'populate[0]=Capa&populate[1]=genres&populate[2]=plataforms&populate[3]=reviews';
    const res = await fetch(`${STRAPI_URL}/api/games?${query}`, { cache: 'no-store' });

    if (!res.ok) {
        throw new Error('Falha ao carregar jogos');
    }

    return res.json();
}