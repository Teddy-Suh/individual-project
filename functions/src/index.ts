/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { checkUser } from './auth/checkUser';
import { createUser } from './auth/createUser';
import { getUser } from './auth/getUser';
import { updateUserNickname } from './auth/updateUserNickname';

export { checkUser, createUser, getUser, updateUserNickname };
