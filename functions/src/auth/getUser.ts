// 회원 정보를 불러옵니다.
import { onRequest } from 'firebase-functions/v2/https';
import { admin } from '../firebaseAdmin';

export const getUser = onRequest(async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      res.status(400).send('UID is required');
      return;
    }

    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(uid as string)
      .get();
    if (!userDoc.exists) {
      res.status(404).send('User not found');
    } else {
      // 유저 데이터와 uid까지 반환해서 context에 저장할 수 있게 함
      const userData = userDoc.data();
      res.status(200).send({ uid, ...userData });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(`Error fetching user profile: ${error.message}`);
    }
  }
});
