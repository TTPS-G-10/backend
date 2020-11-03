import mocks from "../mocks";

import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Doctor } from "../model/Doctor";

import queries  from "../database/queries";
import { System } from "../model/System";
import { User } from "../model/User";

const mainPage = async (req: Request, res: Response) => {
  console.log("desde main");
  console.log(req.body);

  /**
   * read JWT to find user kind
   */
  
  const trx = await dbAPI.start();
  const queryResult: User | null = await queries.findUserByEmail("javier@gmail.com", trx);
  await dbAPI.commit(trx);
  if (queryResult) {
    res.json({
      ...mocks,
      ...{
        user: {
          role: (queryResult as Doctor).role,
          name: (queryResult as Doctor).name,
          lastname: (queryResult as Doctor).lastname,
          system: (queryResult as System).system_name,
        },
      },
    });
  } else {
    res.status(404);
  }
};
export default mainPage;
