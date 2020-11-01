"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mocks = {
    jwtMock: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiRE9DVE9SIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.Ybf4VHyHJSJLK_MfQIKqxXbfQ7NGLDJeFAnsv6BRnQ4",
    mainpageDoctorMock: {
        "user": {
            "role": "DOCTOR",
            "name": "Carolina",
            "lastname": "Fernandez",
            "system": "GUARDIA"
        },
        "rooms": [
            {
                "name": "Sala 1",
                "beds": [
                    {
                        "name": "Cama 1",
                        "patient": {
                            "name": "Luciano",
                            "lastname": "Pérez Cerra"
                        }
                    },
                    {
                        "name": "Cama 2",
                        "patient": {
                            "name": "lucas",
                            "lastname": "Pérez "
                        }
                    },
                    {
                        "name": "Cama 3",
                        "patient": {
                            "name": "juan",
                            "lastname": "martinez "
                        }
                    }
                ]
            },
            {
                "name": "Sala 2",
                "beds": []
            },
            {
                "name": "Sala 3",
                "beds": [
                    {
                        "name": "Cama 1",
                        "patient": {
                            "name": "federico",
                            "lastname": "Cerra"
                        }
                    },
                    {
                        "name": "Cama 2",
                        "patient": {
                            "name": "mario",
                            "lastname": "juarez "
                        }
                    }
                ]
            }
        ]
    }
};
exports.default = mocks;
