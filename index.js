const express = require("express");
const app = new express();

const PORT = process.env.PORT || 3000;
app.get("/",(req, res)=>{
    res.send("Hello From Server")
});

app.listen(PORT, ()=>{
    console.log(`Server Listening @ ${PORT}`);
})