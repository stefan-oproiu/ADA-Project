import {Router} from 'express';
import { User } from '../models/users';

const router = Router();

const users: User[] = [];
router.get('/api/banking/users', (req: any, res: any, next: any) => {
    res.status(200).json({users:users});
    console.log("test")
});

// router.get('/add-user',(req: any, res: any, next: any) =>
// {
//     console.log("I m in add user");
// });

// router.post('/users',(req: any, res: any, next: any) =>
// {   users.push({})
//     console.log("I M HERE in users");
     
// });

export default router;