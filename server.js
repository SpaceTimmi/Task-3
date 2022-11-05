const http = require("http");
// For testing
const fs = require('fs');


const computeResult = (json) => {
  let x = parseInt(json.x);
  let y = parseInt(json.y);

  switch(json.operation_type) {
    case 'addition':
      return (x + y);
    case 'subtraction':
      return (x - y);
    case 'multiplication':
      return (x * y);
  }
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }


    // Route handlers
    /*
    // GET /
    // For Testing purpose 
    if (req.method === "GET" && req.url === "/") {
      const htmlPage = fs.readFileSync('./form.html')
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(htmlPage);
      return res.end();
    } */

    // POST /
    if (req.method === "POST" && req.url === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      let n = computeResult(req.body);
      let jsonResult = {
        slackUsername: "Timon",
        operation_type: req.body.operation_type,
        result: n
      }
      res.write(JSON.stringify(jsonResult));
      return res.end();
    }

    // Route not found
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.write("404 Not Found!!!");
    return res.end();


  });
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));





