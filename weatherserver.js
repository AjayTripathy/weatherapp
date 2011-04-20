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
					console.log(JSON.parse(chunk).data.current_condition[0].humidity);
					var humidity = JSON.parse(chunk).data.current_condition[0].humidity;
					var temp = JSON.parse(chunk).data.current_condition[0].temp_F;
					var  windspeed = JSON.parse(chunk).data.current_condition[0].windspeedMiles;
					var effectTemp = effectiveTemp(temp, windspeed, humidity);
					end('success', effectTemp, res, jsonp);
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
var server = http.createServer(handleHttp);
server.listen(9001);
