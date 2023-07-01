const http = require('http');

http.createServer((req, res)=>{
res.write('yeaaa boi');
	res.end();

}).listen(3000);

console.log('server started');
