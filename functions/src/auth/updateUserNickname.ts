import { onRequest } from 'firebase-functions/v2/https';
import { admin } from '../firebaseAdmin';

export const updateUserNickname = onRequest(async (req, res) => {
  try {
    const { uid, nickname } = req.body;

    if (!uid || !nickname) {
      res.status(400).send('UID and nickname are required');
      return;
    }

    // 닉네임 중복 검사
    const usersSnapshot = await admin
      .firestore()
      .collection('users')
      .where('nickname', '==', nickname)
      .get();

    if (!usersSnapshot.empty) {
      res.status(409).send('Nickname already in use');
      return;
    }

    // 닉네임 중복이 아닌 경우 업데이트
    const userDoc = admin.firestore().collection('users').doc(uid);
    await userDoc.update({ nickname });

    res.status(200).send('User nickname updated successfully');
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(`Error updating user nickname: ${error.message}`);
    } else {
      res.status(500).send('Unknown error occurred');
    }
  }
});
