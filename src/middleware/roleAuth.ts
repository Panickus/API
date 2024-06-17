import { Request, Response, NextFunction } from 'express';

const roleAuth = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).user.role;
  console.log('User role:', userRole);
  if (!roles.includes(userRole)) {
    console.log('Access denied for role:', userRole);
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

export default roleAuth;
