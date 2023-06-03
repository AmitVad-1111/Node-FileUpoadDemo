const express = require("express");
const multer = require("multer");
const tools = require("cli-csv-tools");
const bodyParser = require("body-parser");
const app = new express();
const maxCount = 2;

//define port
const PORT = process.env.PORT || 3000;

//register upload folder
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ".csv"
        cb(null, file.originalname.split(".")[0] + '-' + uniqueSuffix)
    }
});
const uploads = multer({
    storage: Storage,
    fileFilter: fileFilterFun
}).array("csvfilesurl");


//middelwares
app.set("view engine", "hbs"); //tell express that we are going using handlebar
app.use("/assets", express.static("public")); //set path for access static assets
app.use(bodyParser.urlencoded({ extended: true }));


//only accest csv file
function fileFilterFun(req, file, cb) {
    if (file.mimetype === 'text/csv') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

//define all routes
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    uploads(req, res, function (err) {
        if (err) {
            res.render("index",{message:null, error:"something went wrong"});
        }
        if (req.files.length) {
            let message = req.files.length > 1 ? 
            `${req.files.length} files uploaded successfully!` : 
            `${req.files.length} file uploaded successfully!`
            res.render("index",{message:message,error:null});
        }else{
            res.render("index",{message:null,error:"please select file to upload"});
        }
    })

    
});

app.post("/openfile", (req, res) => {

    if (req.body.file) {
        try{
            let url = "public/uploads/" + req.body.file;
            data = tools.readCSV(url);
            let payLoad = {
                status: 200,
                headings: Object.keys(data[0]),
                csvfile: data            
            }
            res.json(payLoad);
        }catch(err){
            res.json({status: 404, message: "file not found"})
        }
    }else{
        res.json({statu: 400, message: "bad request"});
    }

})

app.listen(PORT, () => {
    console.log(`Server Listening @ ${PORT}`);
})