import { Response, Request } from "express";

const logOut = async (req: Request, res: Response) => {
  res.clearCookie('jwt');
  res.json({ redirect: "/" });
};
export default logOut;
