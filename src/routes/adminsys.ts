import adminsys from './../controllers/adminsys';
import Router, { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../model/Request';
import { Role } from '../model/User';
const router = Router();

const checkPermissionByRole = (req: Request, res: Response, next: NextFunction) => {
    const allowedRoles = [Role.Admin];
    if (allowedRoles.includes((req as CustomRequest).user.role)) {
        next();
    } else {
        res.sendStatus(403); // Forbidden
    }
};

router.get('/adminsys', checkPermissionByRole, adminsys);

export default router;