//array for the tile objects
var tiles = [];
var tiles2 = [];
var tiles3 = [];

//array for the image data
var imageTiles = [];
var imageTilesAuthor=[];
var imageTilesTitle=[];
var imageTilesURL=[];

var imageTiles2 = [];
var imageTiles2Author = [];
var imageTiles2Title = [];
var imageTiles2URL=[];

//array for easter egg data
var imageTiles3 = [];
var imageTiles3Author = [];
var imageTiles3Title = [];
var imageTiles3URL = [];

//preload logo var
var logo;

//variables for JSON
var data;
var weather;

//for the wind forces
var wind;
var windangle;
var windmag;
var movingForce;
var movingForce2;

//for perlin noise
var xoff=0;
var yoff=0;

//adjust width of text fields
var textWidth;

//for the day night parting
var colorMap;
var colorMap2;
var colorMapRed;
var colorMapGreen;
var colorMapBlue;

//for the geofence
var fence;
var locationData;

//for accessibility tabbing
var tabIndex;
var tabIndex2;
var tabIndex3;
var accessibilityURL;
var voice;
var sunriseStart;
var sunriseEnd;
var h;
var m;

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//preload the JSON data

function preload() {

//load the open space logo
logo = loadImage('images/o.png');

//call gotData function after preload
data = loadJSON("data.json", gotData);

//load a custom font
//myFont = loadFont('font/europa-regular.otf');

//weather=loadJSON("http://api.apixu.com/v1/current.json?key=3aa88fe0b9c44e0188d170132182606&q=94103", gotWeatherData);

}

function askWeather() {
loadJSON("http://api.apixu.com/v1/current.json?key=6836e9b60d19486981102955180607&q=94103", gotWeatherData);
}

//************************************
//************************************
//************************************
//************************************
//************************************
//expand canvas on resize - responsive behaviors go here
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//setup

function setup() {
  // put setup code here
 colorMode(RGB);

 //needed for accessbility - have to start at -1 so when user pressed right arrow for first time it increments to 0
 tabIndex=-1;
 tabIndex2=-1;
 tabIndex3=-1;
 voice = new p5.Speech(voiceReady); // speech synthesis object
 voice.speak("Please press shift for screen accessibility instructions.")

 //check weather every x milliseconds
 askWeather();
 setInterval(askWeather,20000);

 //establish geo fence - third number is radius
 fence = new geoFenceCircle(37.785718, -122.401051, 150, insideTheFence, outsideTheFence, 'mi');
 //getCurrentPosition(doThisOnLocation);

  //createcanvas the viewport size
  createCanvas(windowWidth, windowHeight);
  background(255);

  textWidth=100;

  //initialize the first stream - this is the second half of the articles, so count backwards
  //subtract one from length to avoid overlap, duplicate tile in both streams
  for (var i = floor(imageTiles.length / 2)-1; i >= 0; i--) {
    //can use the picker below for random articles
    //var picker = floor(random(0,imageTiles.length));

    var img=imageTiles[i];
    var title=imageTilesTitle[i];
    var author=imageTilesAuthor[i];
    var url=imageTilesURL[i];

    //scale width randomly, constrain to 140px in case image size is giant
    var width=constrain(img.width/random(5,10),0,140);

    //calculate aspect ratio of image
    var aspectRatio = img.height/img.width;
    //change height to aspect ratio so image is scaled uniformly
    var height=width*aspectRatio;

    var x = random(0,(windowHeight/2)-height);

    var position = createVector(random(windowWidth), x);
    var velocity = createVector(random(.25),0);
    var acceleration = createVector(0,0);

    var mass = random(aspectRatio*8,aspectRatio*16);

    //construct tiles
    tiles[i] = new contentTile(position.x, position.y, width, height, img, position, velocity, acceleration, mass, title, author, url);
  }


  //initialize a second stream - first half of articles
  for (var i = ceil(imageTiles2.length/2); i < imageTiles2.length; i++) {

    //remap i to j so array population starts at 0;
    var j = i - ceil(imageTiles2.length/2);
    //console.log(j);

    //can use the picker below for random articles
    //var picker = floor(random(0,imageTiles2.length));

    var img=imageTiles2[i];
    var title=imageTiles2Title[i];
    var author=imageTiles2Author[i];
    var url=imageTiles2URL[i];

    //scale width randomly, constrain to 140px in case image size is giant
    var width=constrain(img.width/random(5,10),0,140);
    //calculate aspect ratio of image
    var aspectRatio = img.height/img.width;
    //change height to aspect ratio so image is scaled uniformly
    var height=width*aspectRatio;

    var x = random(windowHeight/2,windowHeight-height);

    var position = createVector(random(windowWidth), x);
    var velocity = createVector(random(-.25),0);
    var acceleration = createVector(0,0);
    var mass = random(aspectRatio*8,aspectRatio*16);

    //construct tiles
    tiles2[j] = new contentTile(position.x, position.y, width, height, img, position, velocity, acceleration, mass, title, author, url);
  }

}

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//do accessibility stuff with the keyboard and speech

function voiceReady() {
//  add stuff here when ready if needed;
}

function keyReleased() {

  if (keyCode === LEFT_ARROW) {

    //decrement through the streams backwards
    if(tabIndex2>=tiles2.length-1  && tabIndex3 >= 1) {
      tabIndex3--;
      tiles3[tabIndex3].bounds=true;
      tiles3[tabIndex3+1].bounds=false;
      var url=tiles3[tabIndex3].url
      voice.speak(tiles3[tabIndex3].title + "by" + tiles3[tabIndex3].author)
    } else if(tabIndex>=tiles.length-1  && tabIndex2 >= 1) {

      //turn off previous tile boundary
      tiles3[0].bounds=false;
      tabIndex2--;
      tiles2[tabIndex2].bounds=true;
      tiles2[tabIndex2+1].bounds=false;
      var url=tiles2[tabIndex2].url
      voice.speak(tiles2[tabIndex2].title + "by" + tiles2[tabIndex2].author)
    } else if(tabIndex>=1) {

      //turn off previous tile boundary
      tiles2[0].bounds=false;
      tabIndex--;
      tiles[tabIndex].bounds=true;
      tiles[tabIndex+1].bounds=false;
      var url=tiles[tabIndex].url
      voice.speak(tiles[tabIndex].title + "by" + tiles[tabIndex].author)

}

}


  if (keyCode === RIGHT_ARROW) {
    //increment through the streams
    if(tabIndex<tiles.length-1) {
    tabIndex++;
    tiles[tabIndex].bounds=true;
    accessibilityURL=tiles[tabIndex].url
    voice.speak(tiles[tabIndex].title + "by" +tiles[tabIndex].author)

    //need to turn off previous tiles
    if(tabIndex>0) tiles[tabIndex-1].bounds=false;

  } else if(tabIndex>=tiles.length-1  && tabIndex2 < tiles2.length -1) {
    tiles[tabIndex].bounds=false;
    tabIndex2++;
    tiles2[tabIndex2].bounds=true;
    accessibilityURL=tiles2[tabIndex2].url
    voice.speak(tiles2[tabIndex2].title + "by" +tiles[tabIndex2].author)

    //need to turn off previous tiles
    if(tabIndex2>0) tiles2[tabIndex2-1].bounds=false;

  } else if(tabIndex2>=tiles2.length-1 && tabIndex3 < tiles3.length-1) {
    tiles2[tabIndex2].bounds=false;
    tabIndex3++;
    tiles3[tabIndex3].bounds=true;
    accessibilityURL=tiles3[tabIndex3].url

    //bug here, voice will repeat forever
    voice.speak(tiles3[tabIndex3].title + "by" +tiles3[tabIndex3].author)

    //need to turn off previous tiles
    if(tabIndex3>0) tiles3[tabIndex3-1].bounds=false;
  }


    //div0.remove();
    //div0 = createDiv('this is a DIV'+tabIndex);

  }


  if (keyCode === ENTER) {
    if(accessibilityURL!=undefined){
    window.open(accessibilityURL);
    voice.speak("Opening Open Space article:" + accessibilityURL)
  }
  }

  if (keyCode === SHIFT) {

    voice.speak("Welcome to S F MOMA's Open Space Waterfall Experiment. To select an article navigate using the left or right arrows. Hit enter to open an article. A series of articles that appear as tiles are gently floating across the screen based on the wind direction and speed at the museum. Current wind speed is"+windmag+"miles per hour and current win direction is"+degrees(windangle)+"degrees. Sunset happens at "+sunsetStart+"hundred hours and sunrise starts at "+sunriseStart+" hundred hours. The background colors gently shift to reflect a meditative experience that spans from day time to night time. Current time at the museum is" + h + "hundred hours" + m + "minutes. We hope you enjoy your stay with us and discover a wealth of engaging content.");
  }

//  print(tabIndex);
}

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//do stuff when we get the json data

function gotData(data) {

console.log("got the JSON data, over and out!");

//load the images into the tile array - stream 1
for (var i = 0; i < data.length; i++) {

  for (var j=0; j < data[i].articles.length; j++) {

        //do all this if it's not an easter egg
        if(data[i].tag != "Easter Egg") {
              if (data[i].articles[j].img=="") {
              imageTiles.splice(0,0,loadImage("images/noimage.png"));
              imageTiles2.splice(0,0,loadImage("images/noimage.png"));

              } else {
              imageTiles.splice(0,0,loadImage(data[i].articles[j].img));
              imageTiles2.splice(0,0,loadImage(data[i].articles[j].img));

              }

              imageTilesAuthor.splice(0,0,data[i].articles[j].author);
              imageTiles2Author.splice(0,0,data[i].articles[j].author);

              imageTilesTitle.splice(0,0,data[i].articles[j].title);
              imageTiles2Title.splice(0,0,data[i].articles[j].title);

              imageTilesURL.splice(0,0,data[i].articles[j].url);
              imageTiles2URL.splice(0,0,data[i].articles[j].url);

            } else {

             //object is an easter egg
             if (data[i].articles[j].img=="") {
             imageTiles3.splice(0,0,loadImage("images/noimage.png"));
             } else {
             imageTiles3.splice(0,0,loadImage(data[i].articles[j].img));

             }

             imageTiles3Author.splice(0,0,data[i].articles[j].author);
             imageTiles3Title.splice(0,0,data[i].articles[j].title);
             imageTiles3URL.splice(0,0,data[i].articles[j].url);

            }

      }

    }

}

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//draw

function draw() {
  // put drawing code here

  dayNightPart();
  background(colorMapRed,colorMapGreen,colorMapBlue);

  //error check if no weather data, or it's still loading, or an error
  if(weather) {

    displayWindDirection();

  } else {

    movingForce = createVector(0,0);
    movingForce2 = createVector(0,0);

  }

  for (var i = 0; i < tiles.length; i++) {

    //perlin noise
    // xoff = xoff + 0.03;
    // var n = map(noise(xoff), 0, 1, -.01,.01);
    // console.log(n)

    //  movingForce = createVector(.01,0);
    //wind.mult(.25);
    //  movingForce.add(n);
    tiles[i].applyForce(movingForce);

    tiles[i].move(mouseX,mouseY,tiles[i]);
    tiles[i].display();
    tiles[i].checkEdges();
  //  tint(255,127);

  }

  for (var i = 0; i < tiles2.length; i++) {

    //perlin noise
    //  xoff = xoff + 0.03;
   //  var n = map(noise(xoff), 0, 1, -.01,.01);
   //  console.log(n)

    tiles2[i].applyForce(movingForce);

    tiles2[i].move(mouseX,mouseY,tiles[i]);
    tiles2[i].display();
    tiles2[i].checkEdges();
  //  tint(255,127);

  }

  //************************************
  //************************************
  //************************************
  //************************************
  //easter eggs

  for (var i = 0; i < tiles3.length; i++) {


    //perlin noise
    xoff +=.05;
    var n = map(noise(xoff), 0, 1, -.01,.01);
    var o = map(noise(yoff), 0, 1, -.01,.01);

    //  console.log(n)
    movingForce2.mult(0);
    movingForce2.add(n,o);


    tiles3[i].applyForce(movingForce2);

    tiles3[i].move(mouseX,mouseY,tiles[i]);
    tiles3[i].display();
    tiles3[i].checkEdges();

  }

  yoff+=.1;
  //display the open space logo
  image(logo,(windowWidth/2)-200,(windowHeight/2)-200,400,400);

  var fps = frameRate();
  textSize(12);
  fill(colorMap2,colorMap2,colorMap2);
  text("FPS: " + fps.toFixed(2), 10, 20);

  if(windangle!=undefined) {
  text("W° " + floor(degrees(windangle)), 10, windowHeight-40);
  text("WM: " + windmag, 10, windowHeight-25);
  } else {
  text("weather is off",10, windowHeight-25);
}

}

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//do stuff with geo fencing

function insideTheFence(position){

    print("INlat: " + position.latitude);
    print("INlong: " + position.longitude);
    print("user is inside of the fence")

    //initialize a easter egg stream
    for (var i = 0; i < imageTiles3.length; i++) {

      //select randomly from image array
      var img=imageTiles3[i];
      var title=imageTiles3Title[i];
      var author=imageTiles3Author[i];
      var url=imageTiles3URL[i];

      //scale width randomly, constrain to 140px in case image size is giant
      var width=constrain(img.width/random(7,10),120,180);

      //calculate aspect ratio of image
      var aspectRatio = img.height/img.width;
      //change height to aspect ratio so image is scaled uniformly
      var height=width*aspectRatio;

      var x = random(0,windowHeight-height);

      var position = createVector(random(windowWidth), x);
      var velocity = createVector(random(-.05,.05),random(-.05,.05));
      var acceleration = createVector(0,0);
      var mass = random(aspectRatio*8,aspectRatio*16);

      //construct tiles
      tiles3[i] = new contentTile(position.x, position.y, width, height, img, position, velocity, acceleration, mass, title, author, url);
    }

    //clear the fence so it doesn't fire randomly - just once when loading
    //uncomment to update dynamically
    fence.clear();
}


function outsideTheFence(position){
    print("OUTlat: " + position.latitude);
    print("OUTlong: " + position.longitude);
    print("user is outside of the fence")
}

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//do stuff with weather

function gotWeatherData(data) {

weather=data;
//console.log(weather.current.wind_degree);

// Get the angle (convert to radians)
windangle = radians(Number(weather.current.wind_degree));
//0 = 270, 180 = 270;
//console.log(windangle+"deg");
// Get the wind speed
windmag = Number(weather.current.wind_mph);

// Make a vector from windangle
wind = p5.Vector.fromAngle(windangle);

//console.log((Number(weather.current.wind_degree)) + " wind angle");
//console.log(windmag + " mph wind speed");

//remap windspeed from JSON data 0 - 60mph = 0-0.01
var windmagConstrained = map(windmag, 0, 60, 0, 0.01);

movingForce = createVector();
movingForce2 = createVector();

//wind.normalize();
//console.log(wind);
wind.mult(windmagConstrained);

movingForce.add(wind);
movingForce2.sub(wind);

wind.mult(windmagConstrained);
//movingForce.div(40);

}


function displayWindDirection() {

   push();
   translate(35, height - 70);
   // Rotate by the wind's angle
   rotate(wind.heading()+PI/2);

  // rotate(wind.heading()+PI/2);

   noStroke();
   fill(colorMap2);
   ellipse(0, 0, 30, 30);

   stroke(colorMap);
   strokeWeight(1.5);
   line(0, -8, 0, 8);

   noStroke();
   fill(colorMap);
   triangle(0, -8, -5, 0, 5, 0);
   pop();

}

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//mouse handlers

function mousePressed() {

  for (var i = tiles.length-1; i >= 0; i--) {
    tiles[i].clicked(mouseX,mouseY,i);

  //if dragging exit the loop so multiple tiles are not selected
  if(tiles[i].dragging) {
    break;
  }

    //if not dragging and clicking white space blow wind
    var force = createVector(-2.5,0);
    tiles[i].applyForce(force);

 }

 for (var i = tiles2.length-1; i >= 0; i--) {
   tiles2[i].clicked(mouseX,mouseY,i);

 //if dragging exit the loop so multiple tiles are not selected
 if(tiles2[i].dragging) {
   break;
 }

   //if not dragging and clicking white space blow wind
   var force = createVector(2.5,0);
   tiles2[i].applyForce(force);

}

for (var i = tiles3.length-1; i >= 0; i--) {
  tiles3[i].clicked(mouseX,mouseY,i);

//if dragging exit the loop so multiple tiles are not selected
if(tiles3[i].dragging) {
  break;
}

  //if not dragging and clicking white space blow wind
  var force = createVector(Math.random(0),Math.random(2));
  tiles3[i].applyForce(force);

}

}

function mouseReleased() {
  for (var i = 0; i < tiles.length; i++) {
      tiles[i].dragging=false;
 }

 for (var i = 0; i < tiles2.length; i++) {
     tiles2[i].dragging=false;
}

for (var i = 0; i < tiles3.length; i++) {
     tiles3[i].dragging=false;
}

}

function doubleClicked() {
  //open URLs on double clicks
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].doubleClicked(mouseX,mouseY,i);
 }

 for (var i = 0; i < tiles2.length; i++) {
    tiles2[i].doubleClicked(mouseX,mouseY,i);
}

for (var i = 0; i < tiles3.length; i++) {
    tiles3[i].doubleClicked(mouseX,mouseY,i);
}

}

//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//do stuff during sunrise, sunset, day, night

function dayNightPart() {

   h = hour();
   m = minute();
   //var s = second();

  //military time
  sunriseStart = 5;
  var sunriseEnd = 6;
  sunsetStart = 18;
  var sunsetEnd = 21;
  var sunsetDuration=(sunsetEnd-sunsetStart)*60;
  var sunriseDuration=(sunriseEnd-sunriseStart)*60;
  //print(h);


  if(h >= sunriseStart && h < sunriseEnd ) {
    //sunrise
    var elapsed = (abs(sunriseStart-h)*60)+m;
    colorMap=map(elapsed,0,sunriseDuration,0,255);

    //remap time to different rates for colors
    remapR=floor(map(elapsed,20,60,0,60));
    remapG=floor(map(elapsed,5,60,0,60));
    remapB=floor(map(elapsed,12,60,0,60));

    //map to colors
    colorMapRed=map(remapR,0,sunriseDuration,0,255);
    colorMapGreen=map(remapG,0,sunriseDuration,0,255);
    colorMapBlue=map(remapB,0,sunriseDuration,0,255);

     print(colorMapRed + "red");
     print(colorMapGreen + "green");
     print(colorMapBlue + "blue");

  }

  if(h >= sunriseEnd && h < sunsetStart) {
  // daytime
   runTime = 0;
   colorMap=255;
   colorMapRed=255;
   colorMapGreen=255;
   colorMapBlue=255;
  }

  if(h >= sunsetStart && h < sunsetEnd ) {
    //sunset
    var elapsed = (abs(sunsetStart-h)*60)+m;
    //print(sunsetEnd);

    //remap time to different rates for colors
    remapR=map(elapsed,15,60,0,60);
    remapG=floor(map(elapsed,10,60,0,60));
    remapB=floor(map(elapsed,6,60,0,60));

    //map to colors
    colorMapRed=map(remapR,0,sunsetDuration,255,0);
    colorMapGreen=map(remapG,0,sunsetDuration,255,0);
    colorMapBlue=map(remapB,0,sunsetDuration,255,0);

    //print(colorMapGreen + "g")
   //  print(colorMapBlue + "b")


    colorMap=map(elapsed,0,sunsetDuration,255,0);

  }

  if(h >= sunsetEnd || h < sunriseStart) {
   //night time
   runtime=0;
   colorMap=0;
   colorMapRed=0;
   colorMapGreen=0;
   colorMapBlue=0;

  }

  //for text
  colorMap2=constrain(350-colorMap,0,255);

}



//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//************************************
//contentTile class

class contentTile {

  //the equals here is when no values are passed to the constructor, it defaults to these
  constructor(x=0,y=0,width=25,height=25,imageSource='noimage.png', position, velocity, acceleration, mass, title, author, url) {

    //set up constructor with values
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.imageSource=imageSource;
    this.position=position;
    this.velocity=velocity;
    this.acceleration=acceleration;
    this.mass=mass;
    this.title=title;
    this.author=author;
    this.url=url;

  }


  //tile click detection
  clicked (px,py,id) {
    //var d = dist(px,py,this.x,this.y);
    if(px > this.position.x && px < this.position.x + this.width && py > this.position.y && py < this.position.y + this.height) {

     //  change image to another random one in the array
     //  this.imageSource = imageTiles[floor(random(0,5))];
     //  remove objects from array
     //  tiles.splice(id,1);

     this.dragging=true;
     this.offsetX = this.position.x-px;
     this.offsetY = this.position.y-py;

   }

  }

  //tile click detection
  doubleClicked (px,py,id) {
    //var d = dist(px,py,this.x,this.y);
    if(px > this.position.x && px < this.position.x + this.width && py > this.position.y && py < this.position.y + this.height) {

     //  change image to another random one in the array
     //  this.imageSource = imageTiles[floor(random(0,5))];
     //  remove objects from array
     //  tiles.splice(id,1);
    window.open(this.url);
    // this.dragging=true;
     this.offsetX = this.position.x-px;
     this.offsetY = this.position.y-py;

   }

  }

 applyForce(force) {

   //divide mass by force
   //var f = force.div(this.mass);
   var f = p5.Vector.div(force,this.mass);
   this.acceleration.add(f);

 }

  move(px,py,id) {

    if(this.dragging) {
      this.position.x=px+this.offsetX
      this.position.y=py+this.offsetY
    //  console.log("click2");

    } else {

      //change in speed over time
      this.velocity.add(this.acceleration);
      //change in position over time
      this.position.add(this.velocity);
      //reset for recalc
      this.acceleration.mult(0);
      //  this.x = (this.position.x);

    }

  }

  checkEdges() {

    //reorient x positions, damp velocities
    if(this.position.x >= windowWidth) {

      this.velocity.x*=0.5;
      this.position.x=0-this.width - textWidth;

    } else if(this.position.x < 0-(this.width+textWidth)) {
      this.velocity.x*=0.5;
      this.position.x=windowWidth;
    }

    //reorient y positions, damp velocities
    if(this.position.y >= windowHeight) {

       this.velocity.y*=0.5;
       this.position.y=0-this.height;

    } else if(this.position.y < 0-this.height-200) {
      this.velocity.y*=0.5;
      this.position.y=windowHeight;
    }

  }

 showBounds() {

   push();
   translate(0, 0);
   noFill();
   stroke(0,0,255)
   strokeWeight(3);
   rect(this.position.x,this.position.y,this.width,this.height);
   pop();

 }

  display(bounds) {

   //display the images
   image(this.imageSource,this.position.x,this.position.y,this.width,this.height)
   if(this.bounds) this.showBounds();

   textSize(12);

  // var colorFade2=map(h, 0, 24, 0, 255);
   //invert text color from background
   fill(colorMap2,colorMap2,colorMap2);
   textFont("Georgia");

   text(this.title + " by " + this.author, this.position.x+this.width+10, this.position.y,textWidth,150);

  }

}
