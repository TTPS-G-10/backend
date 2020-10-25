const { mainpageDoctorMock } = require('../mocks');
const getDoctorData = (id) => {
    return mainpageDoctorMock;
};
const mainPage = (req, res) => {
    /**
     * read JWT to find user kind
     */
    const data = getDoctorData();
    res.json(data);
};
module.exports = mainPage;