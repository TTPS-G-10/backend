const { jwtMock } = require("../mocks");
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
    const queryResult = await queries.findUserByEmail(email, trx);
    await dbAPI.commit(trx);

    if (!queryResult) {
      return res.status(400).send({ error: "Usuario no registrado" });
    }
    //check password

    // all ok
    res.json({ redirect: "/patients", jwt: jwtMock });
  } catch (error) {
    return res.status(400);
  }
};
module.exports = auth;
