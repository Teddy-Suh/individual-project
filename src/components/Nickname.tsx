import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { updateNickname } from "../firebase/user";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

interface NicknameFormInput {
  nickname: string;
}

const Nickname = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { nickname, user } = state;
  const uid = user?.uid as string;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<NicknameFormInput>({
    mode: "onBlur",
    defaultValues: {
      nickname: nickname ?? "",
    },
  });

  const onSubmit: SubmitHandler<NicknameFormInput> = async (data) => {
    try {
      const isNicknameDuplicated = await updateNickname(uid, data.nickname);
      if (isNicknameDuplicated) {
        setError("nickname", {
          type: "manual",
          message: "중복된 닉네임 입니다.",
        });
      } else {
        dispatch({
          type: "UPDATE_NICKNAME",
          payload: {
            nickname: data.nickname,
          },
        });
        console.log("닉네임 변경 성공");
        navigate("/mypage");
      }
    } catch (error) {
      console.error("닉네임 변경 실패", error);
    }
  };
  return (
    <div className="mx-auto border-2 card border-secondary w-96">
      <div className="px-6 py-10 card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`${
              errors.nickname
                ? "tooltip tooltip-bottom tooltip-secondary tooltip-open"
                : ""
            }`}
            data-tip={`${errors.nickname?.message}`}
          >
            <label className="flex items-center gap-2 input input-bordered input-secondary w-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="닉네임"
                className="grow"
                {...register("nickname", {
                  required: "닉네임을 입력해 주세요.",
                  minLength: {
                    value: 2,
                    message: "닉네임은 최소 2자리 이상이어야 합니다.",
                  },
                  maxLength: {
                    value: 10,
                    message: "닉네임은 최대 10자리까지 가능합니다.",
                  },
                  pattern: {
                    value: /^[A-Za-z가-힣\d_]+$/,
                    message:
                      "닉네임에는 _를 제외한 특수문자를 사용할 수 없습니다.",
                  },
                })}
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-10 text-base btn btn-outline btn-secondary w-80"
          >
            닉네임 설정
          </button>
        </form>
      </div>
    </div>
  );
};

export default Nickname;
