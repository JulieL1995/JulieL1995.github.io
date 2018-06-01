var urls = ["json/weather.json","json/air.json"]; 
var content = "{";

for (i = 0; i < urls.length; i++) {
        (function(i) {
                var request = new XMLHttpRequest();
                request.overrideMimeType("application/json");
                
                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var response = JSON.parse(this.responseText);
                        if (i == 0) 
                            parseWeather(response);
                        else
                            parseAir(response);
                        
                        if (i == urls.length - 1) {
                            var http = new XMLHttpRequest();
                            //http.overrideMimeType("text/plain");
                            var url = "writejson.php";
                            var params = "array=" + encodeURIComponent(content);
                        
                            http.open('POST', url, true);
    
                            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            //http.setRequestHeader("Content-Length", params.length);
                            //http.setRequestHeader("Connection", "close");
                            
                            http.onreadystatechange = function() {//Call a function when the state changes.
                                if(http.readyState == 4 && http.status == 200) {
                                    // do something
                                    window.alert("done");
                                }
                            }
                            http.send(params);
                        }
                    }
                }
                request.open("GET",urls[i],true);  
                request.send();
        })(i);
}



function parseWeather(arr) {
    content += arr["WeatherIcon"] + ",";
    document.getElementById("test").innerHTML = arr["WeatherIcon"];
}
function parseAir(arr) {
    content += arr["Ozone"] + "}";
    document.getElementById("test").innerHTML += " - " + arr["Ozone"];
}
