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
var movingForce;
var movingForce2;

//for perlin noise
var xoff=0;

//adjust width of text fields
var textWidth;

//for the day night parting
var colorMap;

//for the geofence
var fence;
var locationData;

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

weather=loadJSON("http://api.apixu.com/v1/current.json?key=3aa88fe0b9c44e0188d170132182606&q=94103", gotWeatherData);

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

 //establish geo fence - third number is radius
 fence = new geoFenceCircle(37.785718, -122.401051, 150, insideTheFence, outsideTheFence, 'mi');
 //getCurrentPosition(doThisOnLocation);

  //createcanvas the viewport size
  createCanvas(windowWidth, windowHeight);
  background(255);

  textWidth=100;

  //initialize the first stream - this is the second half of the articles, so count backwards
  for (var i = floor(imageTiles.length / 2); i >= 0; i--) {

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

    //var force = createVector(.2,0);

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

function draw() {
  // put drawing code here

  dayNightPart();
  background(colorMap,colorMap,colorMap);
  displayWindDirection();

  for (var i = 0; i < tiles.length; i++) {

    //perlin noise
    // xoff = xoff + 0.03;
    // var n = map(noise(xoff), 0, 1, -.01,.01);
    // console.log(n)

    //movingForce = createVector(.01,0);
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

    tiles2[i].applyForce(movingForce2);

    tiles2[i].move(mouseX,mouseY,tiles[i]);
    tiles2[i].display();
    tiles2[i].checkEdges();
  //  tint(255,127);

  }

  for (var i = 0; i < tiles3.length; i++) {
  //  var gravity = createVector(4,0.2*tiles[i].mass);

    //perlin noise
  //  xoff = xoff + 0.03;
  //  var n = map(noise(xoff), 0, 1, -.01,.01);
  //  console.log(n)

    tiles3[i].applyForce(movingForce);

    tiles3[i].move(mouseX,mouseY,tiles[i]);
    tiles3[i].display();
    tiles3[i].checkEdges();

  }

  //display the open space logo
  image(logo,(windowWidth/2)-200,(windowHeight/2)-200,400,400);

  var fps = frameRate();
  textSize(12);
  fill(0);
  text("FPS: " + fps.toFixed(2), 10, 20);

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
      var velocity = createVector(random(-.25),0);
      var acceleration = createVector(0,0);
      var mass = random(aspectRatio*8,aspectRatio*16);

      //construct tiles
      tiles3[i] = new contentTile(position.x, position.y, width, height, img, position, velocity, acceleration, mass, title, author, url);
    }

    //clear the fence so it doesn't fire randomly - just once when loading
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

function gotWeatherData() {

// Get the angle (convert to radians)
var windangle = radians(Number(weather.current.wind_degree));
//0 = 270, 180 = 270;
//console.log(windangle+"deg");
// Get the wind speed
var windmag = Number(weather.current.wind_mph);

// Make a vector from windangle
wind = p5.Vector.fromAngle(windangle);

console.log((Number(weather.current.wind_degree)) + " wind angle");
console.log(windmag + " mph wind speed");

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
   translate(40, height - 50);
   // Rotate by the wind's angle
   //rotate(wind.heading()+PI);

   rotate(wind.heading()+PI/2);

   noStroke();
   fill(127,127);
   ellipse(0, 0, 48, 48);

   stroke(255, 255, 255);
   strokeWeight(3);
   line(0, -16, 0, 16);

   noStroke();
   fill(255, 255, 255);
   triangle(0, -18, -6, -10, 6, -10);
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
    var force = createVector(-2,0);
    tiles[i].applyForce(force);

 }

 for (var i = tiles2.length-1; i >= 0; i--) {
   tiles2[i].clicked(mouseX,mouseY,i);

 //if dragging exit the loop so multiple tiles are not selected
 if(tiles2[i].dragging) {
   break;
 }

   //if not dragging and clicking white space blow wind
   var force = createVector(2,0);
   tiles2[i].applyForce(force);

}

for (var i = tiles3.length-1; i >= 0; i--) {
  tiles3[i].clicked(mouseX,mouseY,i);

//if dragging exit the loop so multiple tiles are not selected
if(tiles3[i].dragging) {
  break;
}

  //if not dragging and clicking white space blow wind
  var force = createVector(3,0);
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

  var runtime;

  var h = hour();
  var m = minute();
  var s = second();


  var sunriseStart = 5;
  var sunriseEnd = 8;
  var sunsetStart = 17;
  var sunsetEnd = 20;
  var sunsetDuration=(sunsetEnd-sunsetStart)*60;
  var sunriseDuration=(sunriseEnd-sunriseStart)*60;


  if(h > sunriseStart && h <= sunriseEnd ) {
    //sunrise
    runtime = sunriseDuration-m;
    runtime++;

    colorMap=map(runtime,sunriseDuration,0,0,255);
  }

  if(h >= sunriseEnd && h < sunsetStart) {
  // daytime
   runTime = 0;
   colorMap=255;
  }

  if(h >= sunsetStart && h < sunsetEnd ) {
    //sunset
    runtime = sunsetDuration-m;
    runtime++;
    colorMap=map(runtime,sunsetDuration,0,255,0);
  }

  if(h >= sunsetEnd || h < sunriseStart) {
   //night time
   runtime=0;
   colorMap=0;
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

    } else if(this.position.y < 0-this.height) {
      this.velocity.y*=0.5;
      this.position.y=windowHeight;
    }

  }


  display() {

   //display the images
   image(this.imageSource,this.position.x,this.position.y,this.width,this.height)

   textSize(12);
  // var colorFade2=map(h, 0, 24, 0, 255);
   //invert text color from background
   fill(360-colorMap,360-colorMap,360-colorMap);
   textFont("Georgia");

   text(this.title + " by " + this.author, this.position.x+this.width+10, this.position.y,textWidth,150);

  }

}
