import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { localSignup } from "../../firebase/auth";
import { FirebaseError } from "firebase/app";
import { createUser } from "../../firebase/user";

interface SignupFormInput {
  email: string;
  password: string;
  confirmPassword: string;
}
const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignupFormInput>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<SignupFormInput> = async (data) => {
    try {
      const userCredential = await localSignup(data.email, data.password);
      console.log("로컬 회원가입 성공", userCredential.user);
      await createUser(userCredential.user.uid);
      navigate("/nickname");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setError("email", {
            type: "manual",
            message: "이미 가입된 이메일 입니다.",
          });
        }
      } else {
        console.error("로컬 회원가입 실패", error);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요"
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "유효한 이메일 형식을 입력해주세요",
              },
            })}
          />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: {
                value: 8,
                message: "비밀번호는 최소 8자리 이상이어야 합니다",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: "비밀번호는 문자와 숫자를 포함해야 합니다",
              },
            })}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요."
            {...register("confirmPassword", {
              required: "비밀번호 확인을 입력해주세요",
              validate: (value) =>
                value === watch("password") || "비밀번호가 일치하지 않습니다",
            })}
          />
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </>
  );
};
export default Signup;
