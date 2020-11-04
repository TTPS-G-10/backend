const dbAPI = require("../database/database");
import { Request, Response } from "express";
import { User } from "../model/User";

const queries = require("../database/queries");

const patients = async (req: Request, res: Response) => {
  /**
   * read JWT to find user kind
   */
  const trx = await dbAPI.start();
  const user: User | null = await queries.findUserByEmail(
    "javier@gmail.com",
    trx
  );
  if (user) {
    const system = await queries.findSystemOfUser("javier@gmail.com", trx);
    user.system = system ? system : undefined;

    const patients = await queries.returnPatientsOfAnSystemForName(
      user.system,
      trx
    );
    const rooms_names = await queries.returnRomsOfAnSystemForName(
      user.system,
      trx
    );
  }

  await dbAPI.commit(trx);

 
module.exports = patients;
