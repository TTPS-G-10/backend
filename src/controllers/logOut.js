const { jwtMock } = require("../mocks");
const jwt = require("jsonwebtoken");

const logOut = async (req, res) => {
  res.json({ redirect: "/", jwt: jwtMock });
};

/*
const auth = async (req, res) => {
  try {
    if ((req.body.jwt = jwtMock)) res.json({ redirect: "/", jwt: jwtMock });
  } catch (error) {
    return res.status(400);
  }
};*/
module.exports = logOut;
