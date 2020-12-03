import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { Location } from "../model/Location";
import { CustomRequest } from "../model/Request";

const systemsWithSpaceForPatients = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const idString = req.query.id as string;
    const id: number = parseInt(idString, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const location:
        | Location
        | null
        | undefined = await queries.LocationOfPatientWithPatientId(id);
      if (!location) {
        console.log("the patient was not found");
        return res.sendStatus(404);
      }

      switch (location.systemId) {
        case 1:
          {
            const systems = await queries.returnSystemWithSpaceFromGuardia();
            if (!systems) {
              console.log("the systems was not found");
              return res.sendStatus(404);
            }
            res.json({ systems });
          }
          break;
        case 2:
          {
            const systems = await queries.returnSystemWithSpaceFromUti();
            if (!systems) {
              console.log("the systems was not found");
              return res.sendStatus(404);
            }
            res.json({ systems });
          }
          break;
        case 3:
          {
            const systems = await queries.returnSystemWithSpaceFromHotelAndDomicilio();
            if (!systems) {
              console.log("the systems was not found");
              return res.sendStatus(404);
            }
            res.json({ systems });
          }
          break;
        case 4:
          {
            const systems = await queries.returnSystemWithSpaceFromPisoCovid();
            if (!systems) {
              console.log("the systems was not found");
              return res.sendStatus(404);
            }
            res.json({ systems });
          }
          break;
        case 5:
          {
            const systems = await queries.returnSystemWithSpaceFromHotelAndDomicilio();
            if (!systems) {
              console.log("the systems was not found");
              return res.sendStatus(404);
            }
            res.json({ systems });
          }
          break;
        default: {
          console.log("the systems was not found");
          return res.sendStatus(404);
        }
      }
    } catch (error) {
      console.log("user invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default systemsWithSpaceForPatients;
