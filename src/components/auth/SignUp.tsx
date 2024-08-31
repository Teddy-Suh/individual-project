import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

interface IformInput {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IformInput>({ mode: 'onBlur' });

  const onSumit: SubmitHandler<IformInput> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 로그를 추가하여 확인
      console.log('UserCredential:', userCredential);
      console.log('UID:', user.uid);
      console.log('Email:', user.email);

      try {
        await axios.post(
          'http://127.0.0.1:5001/individual-project-37cd0/us-central1/createUser',
          {
            uid: user.uid,
            email: user.email,
            providerId: 'password',
          }
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error registering user', error.response?.data);
        }
      }
      const response = await axios.get(
        'http://127.0.0.1:5001/individual-project-37cd0/us-central1/getUser',
        {
          params: {
            uid: user.uid,
          },
        }
      );

      //받아온 정보 context에 저장
      dispatch({ type: 'LOGIN', payload: response.data });
      console.log('STATE', state);
      // 닉네임 설정 페이지로
      navigate('/nickname');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error registering user', error.response?.data);
      } else {
        console.error('Unknown Error:', error);
      }
    }
  };

  return (
    <div>
      <h1>이메일로 회원가입</h1>
      <form onSubmit={handleSubmit(onSumit)}>
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
        <div>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="비밀번호를 다시 입력해주세요."
            {...register('confirmPassword', {
              required: '비밀번호 확인을 입력해주세요',
              validate: (value) =>
                value === watch('password') || '비밀번호가 일치하지 않습니다',
            })}
          />
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;
