const Vote = () => {
  return <div>준비중</div>;
};

// import { useEffect, useState } from "react";
// import { getMovies } from "../firebase/movie";

// const Vote = () => {
//   const [movieList, setMovieList] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchMovieList = async () => {
//       try {
//         const movieListData = await getMovies();
//         setMovieList(movieListData);
//         console.log("영화 데이터 받아오기 성공", movieListData);
//       } catch (error) {
//         console.error("영화 데이터 받아오기 실패", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchMovieList();
//   }, []);

//   // {isLoading && (
//   //   <div className="flex justify-center h-96">
//   //     <span className="loading loading-bars loading-lg text-primary"></span>
//   //   </div>
//   // )}

//   return (
//     <>
//       <div className="mb-5 border-2 shadow-xl card w-96 border-error">
//         <div className="card-body">
//           <h2 className="card-title">다음 주 영화를 투표해 보세요!</h2>
//           <p>투표는 매주 화요일까지 진행됩니다.</p>
//           <p>가장 많은 표를 받은 영화로 이야기를 나눠봐요.</p>
//         </div>
//       </div>
//       <div className="max-w-md p-4 space-x-4 carousel carousel-center bg-neutral rounded-box">
//         {movieList.map((movie) => (
//           <div key={movie.movieId} className="carousel-item w-96">
//             <label className="swap">
//               <input type="checkbox" />
//               <div
//                 className="bg-cover border-2 shadow-xl swap-off card border-primary"
//                 style={{
//                   backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie?.poster_path})`,
//                 }}
//               ></div>
//               <div className="border-2 swap-on card image-full border-primary">
//                 <figure>
//                   <img
//                     src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
//                     alt="영화 포스터"
//                     className="object-cover rounded-lg"
//                     style={{ height: "550px" }}
//                   />
//                 </figure>
//                 <div className="card-body">
//                   <h2 className="card-title"></h2>
//                   <h3 className="card-title">{movie?.title}</h3>
//                   <p>{movie?.original_title}</p>
//                   <p className="text-lg ">
//                     <b>개봉 </b>
//                     {movie?.release_date}
//                   </p>
//                   {/* <p className="text-lg">
//                   <b>장르 </b>
//                   {movie?.genres.map((genre) => (
//                     <span key={genre}> {genre} </span>
//                   ))}
//                 </p> */}
//                   {/* <p className="text-lg">{movie?.overview}</p> */}
//                 </div>
//               </div>
//             </label>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

export default Vote;
