const http = require("http");



const server = http.createServer((req, res) => {

    // Get request body
    let reqBody = "";
    req.on("data", (data) => {
        reqBody += data;
    })

    // When request has finised processing.
    // Parsing the body of the request.
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


    // Route handler

    // POST /
    if (req.method === "POST" && req.url === "/") {

    }

    // Route not found
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.write("Not Found!");
    return res.end();

})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));




