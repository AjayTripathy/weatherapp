var http = require('http');
var url = require('url');


function handleHttp(req, res, jsonp){
	var callback;
	requestInfo = require('url').parse(req.url, true);
	if('query' in requestInfo) {
		if ('callback' in requestInfo.query){
			var jsonp = requestInfo.query.callback		
		}
		else {
			var jsonp = false;
		}

		if('loc' in requestInfo.query){
		//	end('success',requestInfo.query.loc, res, jsonp );
			var relUrl = '/feed/weather.ashx?q='+ requestInfo.query.loc + '&format=json&num_of_days=2&key=9a5325fd05065539111904';
			var weather = http.createClient(80, 'free.worldweatheronline.com');
			var request = weather.request('GET', relUrl ,{'host': 'free.worldweatheronline.com'});
			request.end();
			request.on('response', function (response){
				console.log('STATUS: ' + response.statusCode);
				console.log('HEADERS: ' + JSON.stringify(response.headers));
				response.setEncoding('utf8');
				response.on('data', function (chunk) {
					console.log(JSON.parse(chunk).data.weather[0]);
					end('success', chunk, res, jsonp);
				});
			});

			}

 	
		}
		else{
			res.end("You Done Goofed\n");
		}
	}


function end(type, data, res, jsonp){
	 res.writeHead(200, {"Content-Type": "text/javascript"});
	var json = JSON.stringify({type : type, data : data});
	
	if (jsonp){
		res.end(jsonp+'('+json+');');
	}
	else{
		res.end(json);
	}
}

function effectiveTemp(temp, windSpeed, humidity) {
	var finalTemp;
	var c1 = -42.379;
	var c2 = 2.014901523;
	var c3 = 10.14333127;
	var c4 = -0.22475541;
	var c5 = -0.00683783;
	var c6 = -0.05481717;
	var c7 = 0.00122874;
	var c8 = 0.00085282;
	var c9 = -0.00000199;
	if (temp < 50) {
		finalTemp = 35.74 + (0.6215 * temp) - (35.75 * pow(windSpeed, 0.16)) + (0.4275 * pow(windSpeed, 0.16));
	} else {
		finalTemp = c1 + c2 * temp + c3 * humidity +
					c4 * temp * humidity + c5 * pow(temp, 2) +
					c6 * pow(humidity, 2) +
					c7 * pow(temp, 2) * humidity + 
					c8 * temp * pow(humidity, 2) + 
					c9 * pow(temp, 2) * pow(humidity, 2);
	}
	return finalTemp;
}


var server = http.createServer(handleHttp);
server.listen(9002);
