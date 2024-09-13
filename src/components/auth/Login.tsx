import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { googleLogin, localLogin } from "../../firebase/auth";
import { createUser } from "../../firebase/user";
import { UserCredential } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface LoginForm {
  email: string;
  password: string;
}

interface CustomUserCredential extends UserCredential {
  _tokenResponse: {
    isNewUser: boolean;
  };
}

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const user = await localLogin(data.email, data.password);
      console.log("로컬 로그인 성공", user);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-credential") {
          setError("email", {
            type: "manual",
            message: "유효하지 않은 로그인 정보입니다.",
          });
        }
      }
      console.error("로컬 로그인 실패", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = (await googleLogin()) as CustomUserCredential;
      if (userCredential._tokenResponse?.isNewUser) {
        console.log("구글 소셜 회원가입 성공", userCredential);
        await createUser(userCredential.user.uid);
        navigate("/mypage/nickname");
      } else {
        console.log("구글 소셜 로그인 성공", userCredential.user);
        navigate("/");
      }
    } catch (error) {
      console.error("구글 소셜 로그인 실패", error);
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
                placeholder="이메일"
                className="grow"
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
          <button
            type="submit"
            className="mt-10 text-base btn btn-outline btn-primary w-80"
          >
            로그인
          </button>

          <div className="flex items-center justify-center my-6">
            <div className="w-full border-t border-primary"></div>
            <span className="px-4 text-xl text-primary">or</span>
            <div className="w-full border-t border-primary"></div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-base btn btn-outline btn-primary w-80"
          >
            이메일로 회원가입
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-10 text-base btn btn-outline btn-primary w-80"
          >
            Google 계정으로 시작하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
