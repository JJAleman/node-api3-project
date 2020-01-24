const port =  8002;

const server = require("./server.js");

server.listen(port, () => console.log(`*** server listening on ${port} ***`))