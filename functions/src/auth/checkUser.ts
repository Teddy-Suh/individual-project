// 소셜 로그인시 기존 회원인지 신규 회원인지 체크합니다.
import { onRequest } from 'firebase-functions/v2/https';
import { admin } from '../firebaseAdmin';

export const checkUser = onRequest(async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      res.status(400).send('UID is required');
      return;
    }

    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    // users에 uid와 일치하는 회원이 없는 경우 신규 회원, 있는 경우 기존 회원
    if (!userDoc.exists) {
      res.status(404).send('User does not exist');
    } else {
      const userData = userDoc.data();
      res
        .status(200)
        .send({ uid, ...userData, createdAt: userData?.createdAt?.toDate() });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(`사용자 존재 확인 중 오류 발생: ${error.message}`);
    }
  }
});
