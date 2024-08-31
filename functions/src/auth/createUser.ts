// 회원 가입시 users에 회원 정보를 저장합니다.
import { onRequest } from 'firebase-functions/v2/https';
import { admin } from '../firebaseAdmin';

export const createUser = onRequest(async (req, res) => {
  try {
    const { uid, email, providerId } = req.body;

    if (!uid || !email || !providerId) {
      res.status(400).send('Missing required fields');
      return;
    }

    const userDoc = admin.firestore().collection('users').doc(uid);
    await userDoc.set({
      email,
      nickname: ' ',
      providerId: providerId,

      isAdmin: false,
    });

    res.status(201).send('User profile created successfully');
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(`Error creating user profile: ${error.message}`);
    }
  }
});
