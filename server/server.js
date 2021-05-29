const { json } = require('express');
const express = require('express');
var Connection = require('tedious').Connection; // Get the MS SQL driver
var Request = require('tedious').Request; // Get request object
var TYPES = require('tedious').TYPES; // Get TYPES object
const app = express();
port = 3080;

const projects = [];

var dbConfig = {
  server: 'localhost',
  authentication: {
    type: 'default',
    options: {
      userName: 'studentaccess',
      password: '@ccess1'
    }
  },
  options: {
    encrypt: true,
    database: 'Your QS project',
    trustServerCertificate: true,
    validateBulkLoadParameters: true
  }
}
// Create connection
var connection = new Connection(dbConfig);
connection.connect((err) => {
  // Log error to console if there's one
  if (err) {
    console.log("Connection failed: " + err);
    process.exit(0);
  }
});

/**
 * Retrieve all data from the database
 */
function selectAllData(callback) {
  var result = []; // The result from the query
  // New request with string query
  const request = new Request("SELECT [ProjectJSON] FROM dbo.ProjectList;", (err, rowCount) => {
    if (err) {
      // Print error to console if there's one
      console.log("An error occured while creating request: " + err);
    } else {
      // Pass result to callback function
      //console.log(rowCount + 'rows returned');
      callback(result);
    }

  });
  // Create an event which will emit rows
  request.on('row', (columns) => {
    columns.forEach((column) => {
      // If values are null then print NULL to console
      if (column.value === null) {
        console.log('NULL');
      } else {
        // Save the values into the result
        //console.log(column.value)
        result.push(column.value);
      }
    });

  });
  // Execute the request
  connection.execSql(request);
}

function insertProject(project, callback) {

  //selectAllData();
  // Create a new query, first is business defaults, second is project settings, and thirdly is zone

  var request = new Request(
    `BEGIN TRANSACTION
	
		 BEGIN TRY
	
			 INSERT INTO dbo.ProjectList
			 VALUES ('${project}','1')

       DECLARE @ID AS INT;
       DECLARE @json as VARCHAR(MAX);
       DECLARE @JSONID AS VARCHAR(MAX);

       SET @ID = SCOPE_IDENTITY();
       SELECT @json = [ProjectJSON] FROM ProjectList
      	WHERE ProjectID = @ID;
       SET @JSONID = JSON_MODIFY(@json, '$.id', @ID);

       UPDATE ProjectList 
       SET ProjectJSON = @JSONID
       WHERE ProjectID = @ID;

			 COMMIT TRANSACTION;
		 END TRY
	
		 BEGIN CATCH
		 SELECT
    	 ERROR_NUMBER() AS ErrorNumber,
       ERROR_STATE() AS ErrorState,
       ERROR_SEVERITY() AS ErrorSeverity,
       ERROR_PROCEDURE() AS ErrorProcedure,
       ERROR_LINE() AS ErrorLine,
       ERROR_MESSAGE() AS ErrorMessage;
			 ROLLBACK TRANSACTION
		 END CATCH`
    , (err) => { // Callback function
      if (err) {
        //console.log("Error creating request: " + err)
        callback(err)
      } else {
        // Success
        callback(null)
      }
    });
  connection.execSql(request);
}

app.use(express.json());
//app.use(express.static(process.cwd()+""))


// Get project from database
app.get('/projects', (req, res) => {
  selectAllData((data) => {
    // Data is in string format
    res.json(data);
    res.end();
  });
});

// Add project to database
app.post('/addproject', (req, res) => {
  //console.log(req.body.data);
  // Use a callback function to respond with error message if there's one
  insertProject(JSON.stringify(req.body.data), (err) => {
    if (err) {
      res.status(500).json('Error adding project to database: ' + err)
    } else {
      res.json('Success')
    }
  });
});

app.post('/updateproject', (req, res) => {
    
})

// Default route to index.html
/*app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "../sow-app/dist");
})*/

app.listen(port, () => {
  console.log(`Server listening on the port: ${port}`);
})


// INSERT INTO dbo.PeopleAndPricing
// VALUES ('${peoplePricing.markup}', '${peoplePricing.adminHours}',
//  '${peoplePricing.adminCPH}', '${peoplePricing.supervisionHours}',
//  '${peoplePricing.supervisionCPH}','${peoplePricing.projectMHours}','${peoplePricing.projectMCPH}',
//  '${peoplePricing.buildingTeamHours}','${peoplePricing.buildingTCPH}','${peoplePricing.ratesAre}',
//  '${businessDefaults.siteSign}')