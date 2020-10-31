const hospital = requiere("../model/Hospital");

hospital.createEvolution = (req, res) => {
  res.send("Hello word!");
};
hospital.admitPatient = (req, res) => {
  res.send("Hello word!");
};
hospital.listAlerts = (req, res) => {
  res.send("Hello word!");
};

module.exports = hospital;
