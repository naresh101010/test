const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    if(req.header)
        res.json({
            
                "message": "success",
                "data": {
                  "id": 104,
                  "userId": "user5",
                  "name": "Ian Joseph",
                  "email": "user5@safexpress.com",
                  "mobile": "9835984543503",
                  "categoryId": 3,
                  "defaultBranch": {
                    "branchId": 1,
                    "parentBranchId": 0,
                    "branchCode": "ABO01",
                    "branchName": "ABOHAR-01",
                    "isDefault": 0
                  }
                }
              
        });
    else{
        res.json({
            "message": "Error",
            "data": {
              "id": 104,
              "userId": "user5",
            }
        }); 
    }
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});