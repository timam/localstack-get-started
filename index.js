var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:4566"
});
var client = new AWS.DynamoDB();
var documentClient = new AWS.DynamoDB.DocumentClient();

var tableName = "Movies";

var params = {
    TableName: tableName,
    KeySchema: [
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

client.createTable(params, function(tableErr, tableData) {
    if (tableErr) {
        console.error("Error JSON:", JSON.stringify(tableErr, null, 2));
    } else {
        console.log("Created table successfully!");
    }

    // Adding Batman movie to our collection
    var params = {
        TableName: tableName,
        Item: {
            "year": 2005,
            "title": "Batman Begins",
            "info": {
                "plot": "A young Bruce Wayne (Christian Bale) travels to the Far East.",
                "rating": 0
            }
        }
    };

    console.log("Adding a new item...");
    documentClient.put(params, function(err, data) {
        if (err) {
            console.error("Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item successfully!");
        }
    });
});