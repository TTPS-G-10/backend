const mocks = {
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