import { useForm, SubmitHandler } from 'react-hook-form';
import {
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthProvider } from 'firebase/auth';

interface IFormInput {
  email: string;
  password: string;
}

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const navigate = useNavigate();
  const { dispatch } = useAuth();

  // 로컬 이메일, 비밀번호 로그인
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      const response = await axios.get(
        'http://127.0.0.1:5001/individual-project-37cd0/us-central1/getUser',
        {
          params: {
            uid: user.uid,
          },
        }
      );
      // context에 저장 하고 홈으로
      dispatch({ type: 'LOGIN', payload: response.data });
      navigate('/');
    } catch (error) {
      console.error('Error logging in with email and password:', error);
    }
  };

  // 구글 소셜 로그인

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // 로그인 성공 시 리디렉션할 경로
          navigate('/');
        } else {
          console.log('No redirect result');
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    handleRedirectResult();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('로그인 시도');
      await signInWithRedirect(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('Error during sign in with redirect:', error);
    }
  };

  // useEffect(() => {
  //   const checkGoogleSignIn = async () => {
  //     try {
  //       // Google 로그인 후 리다이렉트 결과 확인
  //       const result = await getRedirectResult(auth);
  //       if (result) {
  //         const user = result.user;
  //         console.log('Google sign-in successful:', user);
  //         const response = await axios.post(
  //           'http://127.0.0.1:5001/individual-project-37cd0/us-central1/checkUser',
  //           {
  //             uid: user.uid,
  //           }
  //         );

  //         // 가존 회원인 경우
  //         if (response.status === 200) {
  //           // context에 업데이트 하고 홈으로
  //           dispatch({ type: 'LOGIN', payload: response.data });
  //           navigate('/');

  //           // 신규 회원인 경우
  //         } else if (response.status === 404) {
  //           // 닉네임을 제외한 일부 정보로 유저 정보 생성
  //           await axios.post(
  //             'http://127.0.0.1:5001/individual-project-37cd0/us-central1/createUser',
  //             {
  //               uid: user.uid,
  //               email: user.email,
  //               authProvider: user.providerData[0]?.providerId,
  //             }
  //           );
  //           // 닉네임 설정 페이지로
  //           navigate('/nickname');
  //         }
  //       } else {
  //         console.log('오류');
  //       }
  //     } catch (error) {
  //       console.error('Error during redirect result handling:', error);
  //     }
  //   };

  //   checkGoogleSignIn();
  // }, [navigate]);

  return (
    <>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력해주세요"
            {...register('email', {
              required: '이메일을 입력해주세요',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: '유효한 이메일 형식을 입력해주세요',
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
            {...register('password', {
              required: '비밀번호를 입력해주세요',
              minLength: {
                value: 8,
                message: '비밀번호는 최소 8자리 이상이어야 합니다',
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: '비밀번호는 문자와 숫자를 포함해야 합니다',
              },
            })}
          />
          <p>{errors.password?.message}</p>
        </div>
        <button type="submit">로그인</button>
      </form>
      <div className="divider">
        <hr />
        <span>OR</span>
        <hr />
      </div>
      <button onClick={() => navigate('/signup')}>이메일로 회원가입</button>
      <button onClick={handleGoogleSignIn}>Google 계정으로 시작하기</button>
    </>
  );
};

export default SignIn;
