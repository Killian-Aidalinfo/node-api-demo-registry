import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send("Ready !!! 🔥🔥🔥");
});

app.listen(8080);