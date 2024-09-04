import axios from "axios";

const MovieInfo = () => {
  const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/movie/now_playing",
    params: { language: "ko", page: "1", region: "KR" },
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNWRhZWVmMmJlNDg4ZjkyZjExZGVhNzMzYTk4ODAyNCIsIm5iZiI6MTcyNTM1Nzg4MC40MTk1MjMsInN1YiI6IjY2YzZhODFkYmUwZjZkMDI2MGYyOTM2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vPcidVFTk8ihLsqBJ3fFM2PuuFozEHna7Vkc5xLPWmA",
    },
  };

  axios.request(options).then(function (response) {
    console.log(response.data);
  });

  return <div>영화정보</div>;
};

export default MovieInfo;
