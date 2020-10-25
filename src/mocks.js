const mocks = {
    jwtMock: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiRE9DVE9SIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSJ9.Ybf4VHyHJSJLK_MfQIKqxXbfQ7NGLDJeFAnsv6BRnQ4",
    mainpageDoctorMock: {
        "user":{
            "role":"DOCTOR",
            "name":"Carolina",
            "lastname":"Fernandez",
            "system":"UTI"
         },
         "rooms":[
            {
               "name":"Sala 1",
               "beds":[
                  {
                     "name":"Cama 1",
                     "patient":{
                        "name":"Luciano",
                        "lastname":"Pérez Cerra"
                     }
                  },
                  {
                     "name":"Sala 2",
                     "beds":[
                        
                     ]
                  }
               ]
            }
         ]
    }
 };
 module.exports = mocks;