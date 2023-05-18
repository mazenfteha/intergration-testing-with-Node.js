const express = require('express')
const bookRoute = require('./routes/books')
const app = express();

app.use(express.json());

app.use("/api/books", bookRoute);

const Port = 3000
app.listen(Port, ()=>{
    console.log(`server running on ${Port}`)
})