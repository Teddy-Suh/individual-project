import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { googleLogin, localLogin } from "../../firebase/auth";
import { createUser } from "../../firebase/user";
import { UserCredential } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface LoginFormInput {
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
  } = useForm<LoginFormInput>();

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
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
      const userCredential = await googleLogin();
      const customUserCredential = userCredential as CustomUserCredential;
      if (customUserCredential._tokenResponse?.isNewUser) {
        console.log("구글 소셜 회원가입 성공", userCredential);
        await createUser(userCredential.user.uid);
        navigate("/nickname");
      } else {
        console.log("구글 소셜 로그인 성공", userCredential.user);
        navigate("/");
      }
    } catch (error) {
      console.error("구글 소셜 로그인 실패", error);
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
        <button type="submit">로그인</button>
      </form>
      <button onClick={() => navigate("/signup")}>이메일로 회원가입</button>
      <button onClick={handleGoogleLogin}>Google 계정으로 시작하기</button>
    </>
  );
};

export default Login;
