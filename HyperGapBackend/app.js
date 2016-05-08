var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var azure = require('azure-storage');
var tableService = azure.createTableService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);
var blobService = azure.createBlobService();



//Get the list of games in the HyperGap Store
app.get('/API/games', function (req, res) {
    var query = new azure.TableQuery()
        .where('PartitionKey eq ?', 'all');
    
    tableService.queryEntities('games', query, null, function (error, result, response) {
        if (!error) {
            res.send(result);
        } else {
            res.send({ err: "List of games could not be retrieved" });
        }
    });
});

//Get the data about an specific game
app.get('/API/games/:gameid', function (req, res) {
    var id = req.params.gameid;
    tableService.retrieveEntity('games', 'all', id, function (error, result, response) {
        if (!error) {
            res.send(result);
        } else {
            res.send({ err: "Game not found" });
        }
    });
});

//Get the data about an specific game
app.get('/API/games/:gameid/download', function (req, res) {
    var id = req.params.gameid;
    tableService.retrieveEntity('games', 'all', id, function (error, result, response) {
        if (!error) {
            blobService.getBlobToStream('games', result.blob._, res, function (error, result, response) {
                if (!error) {
    // blob retrieved
                }
            });
        } else {
            res.send({ err: "Game not found" });
        }
    });
});

app.listen(process.env.port || 1337);
