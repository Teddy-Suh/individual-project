import { useNavigate } from "react-router-dom";
import {
  getLatestSelectedMovie,
  ReturnSelectedMovie,
} from "../../firebase/movie";
import { useEffect, useState } from "react";

const Home = () => {
  const [movieOfThisWeek, setMovieOfThisWeek] =
    useState<ReturnSelectedMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieOfThisWeek = async () => {
      try {
        const movieData = await getLatestSelectedMovie();
        setMovieOfThisWeek(movieData);
        console.log("이 주의 영화 가져오기 성공", movieData);
      } catch (error) {
        console.error("이 주의 영화 가져오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieOfThisWeek();
  }, []);

  return (
    <>
      <div className="mx-auto mb-5 border-2 shadow-xl card w-96 border-primary">
        <div className="card-body">
          <h2 className="card-title">Moveek에 오신걸 환영합니다!</h2>
          <p>이번 주 영화는 보셨나요?</p>
          <div className="justify-end card-actions">
            <button
              className="btn btn-primary btn-outline"
              onClick={() => {
                navigate("/about");
              }}
            >
              ABOUT
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-96">
        <label className="swap">
          <input type="checkbox" />
          <div
            className="bg-cover border-2 shadow-xl swap-off card border-primary"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieOfThisWeek?.poster_path})`,
            }}
          >
            {isLoading && (
              <div className="flex justify-center h-96">
                <span className="loading loading-bars loading-lg text-primary"></span>
              </div>
            )}
          </div>
          <div className="border-2 swap-on card image-full w-96 border-primary">
            <figure>
              <img
                src={`https://image.tmdb.org/t/p/original/${movieOfThisWeek?.poster_path}`}
                alt="영화 포스터"
                className="rounded-lg"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {movieOfThisWeek?.selectedAt.month}월{" "}
                {movieOfThisWeek?.selectedAt.week}주차
              </h2>
              <h3 className="card-title">{movieOfThisWeek?.title}</h3>
              <p>{movieOfThisWeek?.original_title}</p>
              <p className="text-lg ">
                <b>개봉 </b>
                {movieOfThisWeek?.release_date}
              </p>
              <p className="text-lg">
                <b>장르 </b>
                {movieOfThisWeek?.genres.map((genre) => (
                  <span key={genre}> {genre} </span>
                ))}
              </p>
              <p className="text-lg">{movieOfThisWeek?.overview}</p>
            </div>
          </div>
        </label>
      </div>
    </>
  );
};

export default Home;
