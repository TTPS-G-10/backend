const { validationResult } = require("express-validator");
const queries = require("../database/queries");
const dbAPI = require("../database/database");

const auth = async (req, res) => {
  const { email, password } = req.body;

  //corroborate errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: "Email o Contraseña incorrecta" });
  }

  try {
    /**
     * call DB lookup for user
     *  if succeed -> 200 and redirect page
     *  if failure -> 403 FORBIDDEN
     */

    const trx = await dbAPI.start();
    const user = await queries.findUserByEmail(email, trx);
    await dbAPI.commit(trx);

    if (!user) {
      return res.status(400).send({ error: "Usuario no registrado" });
    }
    //check password

    // all ok
    if(user.role == "ADMIN"){
      res.json({ redirect: "/adminsys", user });
    }  
    if(user.role == "DOCTOR"){
      const trx = await dbAPI.start();
      user.system = await queries.findSystemOfUser(email, trx);
      await dbAPI.commit(trx);

      res.json({ redirect: "/patients", user});
    }  
    if(user.role == "ADMIN"){
      res.json({ redirect: "/adminsys", user });
    }  
    if(user.role == "ADMIN"){
      res.json({ redirect: "/adminsys", user });
    }  

  } catch (error) {
    return res.status(400);
  }
};
module.exports = auth;
