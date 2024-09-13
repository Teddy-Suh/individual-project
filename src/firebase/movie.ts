import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { getMonthAndWeek } from "../utils/dateUtils";
import genres from "../constants/genres";

// API에서 받아온 영화 데이터
interface TmdbMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Firestoredp 저장하는 영화 데이터
interface DbMovie extends TmdbMovie {
  vote: number; // 투표 수
}

// Firestoredp 저장하는 이 주의 영화 데이터
interface DbSelectedMovie extends DbMovie {
  selectedAt: Timestamp;
}

// 반환되는 이 주의 영화 데이터
interface ReturnSelectedMovie
  extends Omit<DbSelectedMovie, "genres" | "selectedAt"> {
  selectedMovieId: string;
  genres: string[];
  selectedAt: {
    month: number;
    week: number;
  };
}

const moviesCollectionRef = collection(db, "movies");
const selectedMoviesRef = collection(db, "selectedMovies");

// selectedMovies와 중복검사 후 5개 movies 저장
const createMovies = async (moviesData: TmdbMovie[]) => {
  // selectedMovies의 영화 id만 추출. 문서 Id X
  const selectedMovies = await getSelectedMovies();
  const selectedMoviesIds = selectedMovies.map(
    (selectedMovie) => selectedMovie.id
  );

  // 증복 검사
  const filteredMovies = moviesData.filter(
    (movie) => !selectedMoviesIds.includes(movie.id)
  );

  // 5개만 저장
  const moviesToSave = filteredMovies.slice(0, 5);
  for (const movie of moviesToSave) {
    await addDoc(moviesCollectionRef, { ...movie, vote: 0 });
  }
};

// movies 받아 오기
const getMovies = async () => {
  const moviesSnapshot = await getDocs(moviesCollectionRef);
  const moviesData = moviesSnapshot.docs.map((doc) => ({
    movieId: doc.id,
    ...doc.data(),
  }));
  return moviesData;
};

// movies 삭제
const deleteMovies = async () => {
  const movieDocs = await getDocs(moviesCollectionRef);
  movieDocs.forEach(async (movie) => {
    await deleteDoc(doc(db, "movies", movie.id));
  });
};

// 가장 많이 투표 된 영화 selectedMovies에 저장
const createSelectedMovie = async () => {
  const querySnapshot = await getDocs(moviesCollectionRef);
  let maxVotes = -1;
  let mostVotedMovie: DbMovie | null = null;

  querySnapshot.forEach((doc) => {
    const movieData = doc.data() as DbMovie;
    if (movieData.vote > maxVotes) {
      maxVotes = movieData.vote;
      mostVotedMovie = { ...movieData };
    }
  });

  if (mostVotedMovie !== null) {
    await addDoc(selectedMoviesRef, {
      ...(mostVotedMovie as DbMovie),
      selectedAt: new Date(),
    });
  }
};

// 이 주의 영화 가져오기
const getLatestSelectedMovie = async (): Promise<ReturnSelectedMovie> => {
  const q = query(selectedMoviesRef, orderBy("selectedAt", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  const latestMovieDoc = querySnapshot.docs[0];
  const latestMovieData = latestMovieDoc.data() as DbSelectedMovie;
  const genreNames = latestMovieData.genre_ids.map((id: number) => {
    return genres[id] || "알 수 없음";
  });

  const latestMovie = {
    selectedMovieId: latestMovieDoc.id,
    ...latestMovieData,
    genres: genreNames,
    selectedAt: getMonthAndWeek(latestMovieData.selectedAt.toDate()),
  };

  return latestMovie;
};

// selectedMovies 가져오기
const getSelectedMovies = async () => {
  const selectedMoviesSnapshot = await getDocs(selectedMoviesRef);
  const selectedMovies = selectedMoviesSnapshot.docs.map((doc) => {
    const selectedMoviesData = doc.data() as DbSelectedMovie;
    const genreNames = selectedMoviesData.genre_ids.map((id: number) => {
      return genres[id] || "알 수 없음";
    });
    return {
      selectedMovieId: doc.id,
      ...selectedMoviesData,
      genres: genreNames,
      selectedAt: getMonthAndWeek(selectedMoviesData.selectedAt.toDate()),
    };
  });
  return selectedMovies;
};

export type { TmdbMovie, DbMovie, DbSelectedMovie, ReturnSelectedMovie };

export {
  createMovies,
  getMovies,
  deleteMovies,
  createSelectedMovie,
  getLatestSelectedMovie,
  getSelectedMovies,
};
