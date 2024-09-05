import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <h2>Moveek에 오신걸 환영합니다</h2>
        <button
          onClick={() => {
            navigate("/about");
          }}
        >
          ABOUT
        </button>
      </div>
      <hr />
      <div>
        <h2>이주의 영화</h2>
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          alt="영화 포스터"
          style={{ width: "50%" }}
        />
        <p>영화 제목 : {movie.title}</p>
        <p>줄거리 : {movie.overview}</p>
      </div>
    </>
  );
};

export default Home;

// 투표 페이지에서 상영중인 영화 10개 받아옴
// 선정된 영화 selectedMovies에 저장
// selectedMovies 에서 받아오는걸로 바꿀 예정
const movie = {
  adult: false,
  backdrop_path: "/7aPrv2HFssWcOtpig5G3HEVk3uS.jpg",
  genre_ids: [28, 12, 53],
  id: 718821,
  original_language: "en",
  original_title: "Twisters",
  overview:
    "뉴욕 기상청 직원 케이트는 대학 시절 토네이도에 맞서다 소중한 사람들을 잃고 죄책감에 살고 있다. 그런 그녀 앞에 옛 친구 하비가 찾아와 토네이도를 소멸시킬 수 있는 획기적인 방법을 제안한다.  고민 끝에 합류하게 된 케이트는 하비와 오클라호마로 향하고, 일명 토네이도 카우보이라 불리는 유명 인플루언서 타일러를 만난다. 마치 자연을 정복한 듯이 자신감 넘치는 타일러와 매사 부딪히게 되는 케이트. 어느 날, 모든 것을 집어삼킬 거대한 토네이도가 휘몰아칠 것을 감지하게 되는데…",
  popularity: 1185.823,
  poster_path: "/w5mXdM9AIf7urUtoUVYjABdp3g8.jpg",
  release_date: "2024-08-14",
  title: "트위스터스",
  video: false,
  vote_average: 7,
  vote_count: 1236,
};
