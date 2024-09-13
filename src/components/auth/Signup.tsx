import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { localSignup } from "../../firebase/auth";
import { FirebaseError } from "firebase/app";
import { createUser } from "../../firebase/user";

interface SignupForm {
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
  } = useForm<SignupForm>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    try {
      const userCredential = await localSignup(data.email, data.password);
      console.log("로컬 회원가입 성공", userCredential.user);
      await createUser(userCredential.user.uid);
      navigate("/mypage/nickname");
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
    <div className="mx-auto border-2 card border-primary w-96">
      <div className="px-6 py-10 card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`${
              errors.email
                ? "tooltip tooltip-bottom tooltip-primary tooltip-open"
                : ""
            }`}
            data-tip={`${errors.email?.message}`}
          >
            <label className="flex items-center gap-2 input input-bordered input-primary w-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="email"
                className="grow"
                placeholder="이메일"
                {...register("email", {
                  required: "이메일을 입력해주세요",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "유효한 이메일 형식을 입력해주세요",
                  },
                })}
              />
            </label>
          </div>
          <div
            className={`${
              errors.password
                ? "tooltip tooltip-bottom tooltip-primary tooltip-open"
                : ""
            }`}
            data-tip={`${errors.password?.message}`}
          >
            <label className="flex items-center gap-2 mt-10 input input-bordered input-primary w-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                className="grow"
                placeholder="비밀번호"
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
            </label>
          </div>
          <div
            className={`${
              errors.confirmPassword
                ? "tooltip tooltip-bottom tooltip-primary tooltip-open"
                : ""
            }`}
            data-tip={`${errors.confirmPassword?.message}`}
          >
            <label className="flex items-center gap-2 mt-10 input input-bordered input-primary w-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type="password"
                className="grow"
                placeholder="비밀번호 확인"
                {...register("confirmPassword", {
                  required: "비밀번호 확인을 입력해주세요",
                  validate: (value) =>
                    value === watch("password") ||
                    "비밀번호가 일치하지 않습니다",
                })}
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-10 text-base btn btn-outline btn-primary w-80"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};
export default Signup;
