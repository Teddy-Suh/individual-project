import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NicknameFormInputs {
  nickname: string;
}

const Nickname = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NicknameFormInputs>();

  const { state } = useAuth(); // Context에서 유저 정보 가져오기
  const navigate = useNavigate();

  const onSubmit = async (data: NicknameFormInputs) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:5001/individual-project-37cd0/us-central1/updateUserNickname',
        {
          uid: state.user?.uid, // Context에서 uid 사용
          nickname: data.nickname,
        }
      );

      if (response.status === 200) {
        console.log('닉네임 업데이트 성공~', response.data);
        navigate('/mypage'); // 성공 후 마이 페이지로 이동
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // 닉네임 중복일 경우 에러 메시지 설정
        setError('nickname', {
          type: 'manual',
          message: '닉네임이 이미 존재합니다. 다른 닉네임을 선택해 주세요.',
        });
        console.error('Nickname already in use:', error.response.data);
      } else {
        console.error('Error updating nickname:', error);
      }
    }
  };

  return (
    <>
      <h1>닉네임을 설정해 주세요</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            {...register('nickname', {
              required: '닉네임을 입력해 주세요.',
              minLength: {
                value: 6,
                message: '닉네임은 최소 6자리 이상이어야 합니다.',
              },
              pattern: {
                value: /^(?=.*[A-Za-z가-힣])([A-Za-z가-힣\d]{6,})$/,
                message:
                  '닉네임은 숫자로만 이루어질 수 없습니다. 문자(영문, 한글) 또는 문자와 숫자가 혼합되어야 합니다.',
              },
            })}
          />
          <p>{errors.nickname?.message}</p>
        </div>
        <button type="submit">설정</button>
      </form>
    </>
  );
};

export default Nickname;
