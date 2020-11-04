import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Room } from "../model/Room";
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
  console.log("pas111a");
  if (user) {
    const system = await queries.findSystemOfUser("javier@gmail.com", trx);
    user.system = system ? system : undefined;



   

    const rooms = await queries.returnRomsOfAnSystemForName(user.system, trx);

  
    const finaldata = await Promise.all( rooms.map(async function(room:Room) {
         return  {...room,patients:await queries.returnPatientsForRoom(room.id, trx)}
    }))
 
    console.log("pasa");
    
    res.json({user,rooms:finaldata})


  }else {
    res.status(404);}
    await dbAPI.commit(trx);
}
export default patients;
