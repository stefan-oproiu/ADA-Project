import { Router } from 'express';
import * as usersApi from '../api/users';
import { verifyToken } from '../utils/verifyToken';

const router = Router();

router.get('/api/banking/users/full', usersApi.allUsersFull);
router.get('/api/banking/users', usersApi.allUsers);
router.post('/api/banking/users/send',verifyToken, usersApi.sendMoneyFromPayloadUser);
router.post('/api/banking/users/fill', usersApi.sendMoneyFromSystem);
export default router;