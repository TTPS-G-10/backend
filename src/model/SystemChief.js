class SystemChief extends Doctor {
  directs_in;

  constructor(name, lasname, email, password, role, field, directs_in) {
    super(name, lasname, email, password, role);

    this.directs_in = directs_in;
  }
  //listNewsPatient()
}
