import { json, Request, Response } from "express";
import { User } from "../model/User";
import queries from "../DAL/queries";
import { CustomRequest } from "../model/Request";
import { validationResult } from "express-validator";

const updateStateUser = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    }
    try {
      const result = await queries.updateStateUser(user.id, req.body.value);
      res.sendStatus(201);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};

const returnStateUser = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    }
    try {
      const estatus = await queries.returnStateUser(user.id);
      return res.json(estatus);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};

const state = { updateStateUser, returnStateUser };
export default state;
