V1 SFMOMA Open Spaces Waterfall
Updated: 7.5.2018
Coded by Andreas Tagger
the-call.co

Features / Release Notes:

To run: py simple-cors-http-server.py
Go to this URL in browser: localhost:8000

Pulls local JSON for SFMOMA content tiles, this can be updated to automatically update using a setTimer() function
Arranges tiles into three streams (JSON articles split in two streams, easter eggs are a third)
Easter eggs are pulled from the JSON tag "Easter Egg"
Each stream can have their own physics applied to them which can change the visual effects from side scrolling, to kites like behavior
Easter eggs move opposite of wind added force of perlin noise for a semi-randomized movement
The easter eggs are the sfmoma logos

Easter eggs only appear if user is within 150 miles of the geoFenceCircle assigned to the sfmoma zipcode
You can set the distance in geoFenceCircle
Geofencing is only called once when program loads, but it can be set to automatically update by removing the fence.clear()

It pulls weather data from APIXU, windspeed + direction moves the tiles according to wind at the sfmoma zipcode
If weather API is not available or API calls expended, program automatically turns off weather, "weather is off", will appear in lower left
APIXU allows 10K free calls / month, the amount of times it updates can be changed with setInterval(askWeather,100000); in milliseconds
Wind degrees may seems off but the rotation system in p5 is inverted: N is 270, E is 180, S is 90, W is 180

Program day + night parts with a sunrise and sunset
Sunrise / sunset can be adjusted with the sunriseStart/sunriseEnd and sunsetStart/sunsetEnd variables
Colors are mapped to sunriseDuration/sunsetDuration, and can be changed by the remapR/G/B values
Maps at night from grey to purple to black and some shades in between
Map in morning from greys to light blues to white
Text colors + wind speed compass change dynamically for contrast on background, and offset so there is not a grey on grey situation or poor contrast
Sunrise 6-9am, Sunset 6-9pm. Set computer clock to preview.

Tiles are draggable
Double clicking opens the article URL in a new window
Tiles have a random mass assigned to them based on their aspectRatio, and tiles with more mass react slower to forces
Tiles are randomly sized by aspect ratio, and constrained in the case of a giant image being uploaded
Physics are damped slightly when a tile leaves the screen and renters
Clicking on white space applies a force vector to the objects, like an additional wind force

Canvas boundaries update dynamically if you change the window size (i.e. tiles will know their boundaries in space)
