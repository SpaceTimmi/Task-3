const http = require("http");
// For testing
const fs = require('fs');


const additionSynoms = ["+", "add", "plus", "addition", "join", "attach", "prepend", "append", "add together", "add up", "tally", "cast up"];
const subtractionSynoms = ["-", "subtract", "subtraction", "remove", "take away", "take off", "debit", "deduct", "minus"];
//const multiplicationSynoms = ["*", "multiply", "multiplication", "spread", "times"]

const computeOptype = (str) => {
  // Get the type of operation.
  if (additionSynoms.includes(str) !== -1) return 'addition';
  else if (subtractionSynoms.includes(str) !== -1) return 'subtraction';
  else return 'mulitplication'; // hopefully, this doesn't bite me in the a** :)
}


const computeResult = (json, Optype) => {
  // Get the result
  let x = parseInt(json.x);
  let y = parseInt(json.y);

  switch(Optype) {
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

    // POST /
    if (req.method === "POST" && req.url === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      let Optype = computeOptype(req.body.operation_type)
      let n = computeResult(req.body, Optype);
      let jsonResult = {
        slackUsername: "Timon",
        operation_type: Optype,
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


