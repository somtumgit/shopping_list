const fs = require('fs');
const http = require("http")





const server = http.createServer(function(req,res){
    fs.readFile(__dirname+"/hello.txt", "utf8", (err,data) => {
        if(err) throw err;
        //res.writeHead(200,{"content-type":"text/plain"})
        res.writeHead(200,{"content-type":"text/html"});
        res.write("<h1>Node Js Tutorials Running</h1>");
        res.write("<p>"+data+"<p>");
        res.end();
    })

    // fs.unlink(__dirname+"/hello.txt", (err,data) => {
    //     if(err) throw err;
    //     console.log("File deleted"+data);
    // })
    
}).listen(3000, () => console.log("Server Running on port 3000..."))




