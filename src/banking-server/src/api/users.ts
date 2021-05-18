import * as usersLib from "../lib/users";

export function allUsers(req:any, res:any) {
    usersLib.allUsers(req, res);
}
export function allUsersFull(req:any, res:any) {
    usersLib.allUsersFull(req, res);
}

export function sendMoneyFromPayloadUser(req:any, res:any,next:any) {
    usersLib.sendMoneyFromPayloadUser(req,res,next);
}

export function sendMoneyFromSystem(req:any, res:any, next:any) {
    usersLib.sendMoneyFromSystem(req,res,next);
}
 
export function currentUser(req: any, res: any, next: any) {
    usersLib.currentUser(req,res,next);
}