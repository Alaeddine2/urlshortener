const express = require("express");
const app = express();
const urlRoutes = require("./urlRoutes.js");
const logRoutes = require("./logRoutes.js");

// Test End point
app.get('/', (req,res)=> {
    res.send('hello world');
});

app.use("/", urlRoutes);
app.use("/logs", logRoutes);

module.exports = app;