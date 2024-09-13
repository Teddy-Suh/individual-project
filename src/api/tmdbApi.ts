import axios from "axios";

const fetchNowPlayingMovies = async () => {
  const response = await axios.get(
    "https://api.themoviedb.org/3/movie/now_playing",
    {
      params: { language: "ko", page: "1", region: "KR" },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${
          import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN
        }`,
      },
    }
  );
  return response.data.results;
};

export default fetchNowPlayingMovies;
