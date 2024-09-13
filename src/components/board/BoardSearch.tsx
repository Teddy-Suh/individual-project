import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFilteredPostList, PostListItem } from "../../firebase/post";
import BoardPostList from "./BoardPostList";
import { useForm } from "react-hook-form";
import { getSelectedMovies } from "../../firebase/movie";

interface SearchForm {
  keyword: string;
}

// 키워드와 영화태그로 검색 가능
const BoardSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMovieList, setSelectedMovieList] = useState([]);
  const [movieTag, setMovieTag] = useState<{
    id: string;
    title: string;
  }>({ id: "", title: "" });
  const { register, handleSubmit, setValue } = useForm<SearchForm>();
  const [postList, setPostList] = useState<PostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // 영화 태그 리스트 가져오기
  useEffect(() => {
    const fetchSelectedMovieList = async () => {
      const movieList = await getSelectedMovies();
      setSelectedMovieList(movieList);
    };
    fetchSelectedMovieList();
  }, []);

  // 검샐 결과의 게시글에 들어갔다가 뒤로가기로 검색 페이지로 돌아왓을때
  // 쿼리 파라미터를 이용하여 검색 결과 복원
  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    const movieTagId = searchParams.get("movieTagId") || "";
    const movieTagTitle = searchParams.get("movieTagTitle") || "";

    if (keyword || movieTagId) {
      setIsInitial(false);
      fetchFilteredPosts(keyword, movieTagId);
      setValue("keyword", keyword);
      setMovieTag({
        id: movieTagId,
        title: movieTagTitle,
      });
    }
  }, [searchParams, setValue]);

  // 게시글 리스트 가져오는 함수 (필터된 게시글 리스트)
  const fetchFilteredPosts = async (keyword: string, movieTagId: string) => {
    setIsLoading(true);
    try {
      const result = await getFilteredPostList(keyword, movieTagId);
      setPostList(result.postList);
      setIsEmpty(result.postList.length === 0);
    } catch (error) {
      console.error("게시글 목록 불러오기 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 버튼 눌렀을때 검색 결과 가져오기
  const onSubmit = (data: SearchForm) => {
    setIsInitial(false);
    setIsEmpty(false);

    setSearchParams({
      keyword: data.keyword,
      movieTagId: movieTag.id,
      movieTagTitle: movieTag.title,
    });

    fetchFilteredPosts(data.keyword, movieTag.id);
  };

  // select요소 대신 daisyUI의 dropdown을 사용하였기 때문에
  // 영화 태그 눌렀을때 태그 아이디, 제목 상태 변수에 데이터 저장해주기
  const handleClickMovieTag = (movieTagId: string, movieTagTitle: string) => {
    setMovieTag({ id: movieTagId, title: movieTagTitle });

    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/board/post/${postId}`);
  };

  return (
    <>
      <header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full">
            <button
              type="button"
              onClick={() => {
                navigate("/board");
              }}
              className="border-0 btn btn-accent btn-outline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <label className="flex items-center w-full gap-2 input input-accent input-bordered">
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                className="grow"
                {...register("keyword")}
              />
              <button
                type="submit"
                className="border-0 btn btn-accent btn-outline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="size-6"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </label>
          </div>

          <div className="w-full dropdown">
            <div
              tabIndex={0}
              role="button"
              className="flex w-full m-1 text-base font-normal text-gray-400 border-1 border-accent btn btn-outline"
            >
              <div className="flex-1">
                {movieTag.id === "" ? "영화를 선택해 주세요" : movieTag.title}
              </div>
              <div className="flex-none border-0 btn-accent btn-outline btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-[1] w-full p-2 shadow border-2 border-accent"
            >
              <li>
                <a
                  onClick={() =>
                    handleClickMovieTag("", "영화를 선택해 주세요")
                  }
                >
                  영화를 선택해 주세요
                </a>
              </li>
              {selectedMovieList.map((movie) => (
                <li key={movie.selectedMovieId}>
                  <a
                    onClick={() =>
                      handleClickMovieTag(
                        movie.selectedMovieId,
                        `${movie.selectedAt.month}월 ${movie.selectedAt.week}주차 ${movie.title}`
                      )
                    }
                  >
                    {`${movie.selectedAt.month}월 ${movie.selectedAt.week}주차 ${movie.title}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </header>

      <div>
        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-bars loading-lg text-accent"></span>
          </div>
        ) : !isInitial ? (
          <>
            {isEmpty ? (
              <p className="text-center text-accent">검색 결과가 없습니다.</p>
            ) : (
              <BoardPostList
                postList={postList}
                handlePostClick={handlePostClick}
              />
            )}
          </>
        ) : (
          <p className="text-center text-accent">
            검색을 통해 게시글을 확인하세요.
          </p>
        )}
      </div>
    </>
  );
};

export default BoardSearch;
