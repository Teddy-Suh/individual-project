const MovieCard = ({ movieData }) => {
  return (
    <label className="swap">
      <input type="checkbox" />
      <div className="border-2 swap-on card image-full w-96 border-primary">
        <figure>
          <img
            src={`https://image.tmdb.org/t/p/original/${movieData.poster_path}`}
            alt="영화 포스터"
            className="rounded-lg"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {movieData.selectedAt?.month}
            {movieData.selectedAt?.week}
            <br />
            {movieData.title}
          </h2>
          <p>
            <b>개봉</b>
            {movieData.release_date}
          </p>
          <p>{movieData.overview}</p>
        </div>
      </div>
      <div
        className="bg-cover border-2 shadow-xl swap-off card w-96 border-primary"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieData.poster_path})`,
        }}
      ></div>
    </label>
  );
};

export default MovieCard;
