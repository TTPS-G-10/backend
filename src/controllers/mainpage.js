const { mainpageDoctorMock } = require("../mocks");
const getDoctorData = (id) => {
  return mainpageDoctorMock;
};
const dbAPI = require("../database/database");

const queries = require("../database/queries");

const mainPage = async (req, res) => {
  console.log("desde main");
  console.log(req.body);

  /**
   * read JWT to find user kind
   */
  const mockedData = getDoctorData();
  const trx = await dbAPI.start();
  const queryResult = await queries.findUserByEmail("javier@gmail.com", trx);
  await dbAPI.commit(trx);
  res.json({
    ...mockedData,
    ...{
      user: {
        role: queryResult.role,
        name: queryResult.name,
        lastname: queryResult.lastname,
        system: queryResult.system_name,
      },
    },
  });
};
module.exports = mainPage;
