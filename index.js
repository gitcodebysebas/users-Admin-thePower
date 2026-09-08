const express = require('express');

const app = express();

app.use("*", (req, res, next) => {
    return res.status(404).json("Route not found");
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});