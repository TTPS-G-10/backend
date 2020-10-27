const { jwtMock } = require("../mocks");
const { validationResult } = require("express-validator");
const queries = require("../database/queries");
const dbAPI = require("../database/database");

const auth = async (req, res) => {
  const { email, password } = req.body;

  //corroborate errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("LOS CAMPOS QUE LLEGARON NO SON VALIDOS");
    //return res.status(400).json({ errors: errores.array() });
    return res.status(400).json({ errors: errors.array(), redirect: "/" });
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
      console.log("EL EMAIL NO EXISTE");
      return res.status(400).json({ errors: errors.array(), redirect: "/" });
    }

    //check password

    // all ok
    res.json({ redirect: "/patients", jwt: jwtMock });
  } catch (error) {
    console.log(error);
    res.status(400).send("hubo un error en la validacion del usuario");
  }
};
module.exports = auth;
