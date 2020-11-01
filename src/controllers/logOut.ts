import jwtMock from "../mocks";
import { Response, Request } from "express";

const logOut = async (req: Request, res: Response) => {
  res.json({ redirect: "/", jwt: jwtMock });
};

/*
const auth = async (req, res) => {
  try {
    if ((req.body.jwt = jwtMock)) res.json({ redirect: "/", jwt: jwtMock });
  } catch (error) {
    return res.status(400);
  }
};*/
export default logOut;
