const fetchMovies = async (movieRecom) => {
    for (const movie of movieRecom.recommendations) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.name)}&api_key=${process.env.TMDB_API_KEY}`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { poster_path } = data.results[0];
                movie.poster_path = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : null;
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }
    return movieRecom.recommendations
};

export default fetchMovies;
