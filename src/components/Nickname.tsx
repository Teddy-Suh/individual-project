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
    defaultValues: {
      nickname: nickname!,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="nickname">닉네임</label>

        <input
          type="text"
          id="nickname"
          placeholder="닉네임을 입력해 주세요."
          {...register("nickname", {
            required: "닉네임을 입력해 주세요.",
            minLength: {
              value: 4,
              message: "닉네임은 최소 4자리 이상이어야 합니다.",
            },
            pattern: {
              value: /^(?=.*[A-Za-z가-힣])([A-Za-z가-힣\d]{6,})$/,
              message: "닉네임은 숫자로만 이루어질 수 없습니다.",
            },
          })}
        />
        <p>{errors.nickname?.message}</p>
      </div>
      <button type="submit">닉네임 설정</button>
    </form>
  );
};

export default Nickname;
