//array for the tile objects
var tiles = [];
var tiles2 = [];
var tiles3 = [];

//array for the image data
var imageTiles = [];
var imageTiles2 = [];
var imageTiles3 = [];

var logo;
var data;
var weather;
var xoff=0;
var textWidth;

var movingForce;
var movingForce2;

var fence;
var locationData;
var h;
var m;
var s;

//preload the image data
function preload() {

//  for (var i = 0; i < 5; i++) {
  //  imageTiles[i] = loadImage('images/image' + i + '.jpg')
//  }


logo = loadImage('images/o.png');

//call gotData function after preload
data = loadJSON("data.json", gotData);
//load font
//myFont = loadFont('font/europa-regular.otf');
weather=loadJSON("http://api.apixu.com/v1/current.json?key=3aa88fe0b9c44e0188d170132182606&q=94103", gotWeatherData);


}

//expand canvas on resize
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  // put setup code here

 //establish geo fence - third number is radius
 fence = new geoFenceCircle(40.7506343, -75.1735422, 100, insideTheFence, outsideTheFence, 'mi');

 //getCurrentPosition(doThisOnLocation);

  //createcanvas the viewport size
  createCanvas(windowWidth, windowHeight);
  //createCanvas(500, 500);
  background(255);

  textWidth=100;
//  loadJSON("dataxx.json",gotData);

  //initialize the first stream
  for (var i = 0; i < 20; i++) {

    var picker = floor(random(0,imageTiles.length));
    //select randomly from image array
    var img=imageTiles[picker][0];
    var title=imageTiles[picker][1];
    var author=imageTiles[picker][2];
    //scale width randomly
    var width=img.width/random(5,10);
    //calculate aspect ratio of image
    var aspectRatio = img.height/img.width;
    //change height to aspect ratio so image is scaled uniformly
    var height=width*aspectRatio;

    var x = random(0,(windowHeight/2)-height);

    var position = createVector(random(windowWidth), x);
    var velocity = createVector(random(.25),0);
    var acceleration = createVector(0,0);
    var mass = random(aspectRatio*8,aspectRatio*16);

    //var force = createVector(.2,0);

    //construct tiles
    tiles[i] = new contentTile(position.x, position.y, width, height, img, position, velocity, acceleration, mass, title, author);
  }

  //initialize a second stream
  for (var i = 0; i < 30; i++) {

    var picker = floor(random(0,imageTiles2.length));
    //select randomly from image array
    var img=imageTiles2[picker][0];
    var title=imageTiles2[picker][1];
    var author=imageTiles2[picker][2];

    //scale width randomly
    var width=img.width/random(5,10);
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
    tiles2[i] = new contentTile(position.x, position.y, width, height, img, position, velocity, acceleration, mass, title, author);
  }



}

function gotWeatherData() {

// Get the angle (convert to radians)
var windangle = radians(Number(weather.current.wind_degree));
// Get the wind speed
var windmag = Number(weather.current.wind_mph);

// Make a vector
wind = p5.Vector.fromAngle(windangle);

console.log(windangle);
console.log(windmag);

//remap windspeed from JSON data
var windmagConstrained = map(windmag, 0, 75, .001, .05);
movingForce = createVector(windmagConstrained,0);
movingForce2 = createVector(-windmagConstrained,0);

}

//do stuff when we get the json data
function gotData(data) {

console.log("got the JSON data, over and out!");
console.log(data[0].tag);
console.log(data.length);
console.log(data[20].tag);

//console.log(data);
//console.log(data[0]);
//console.log(data[0].OneonOne.articles[0].img);

//load the images into the tile array - stream 1
for (var i = 0; i < data[0].articles.length; i++) {
  //define a 2d array for the data
  imageTiles[i]=[];

  if (data[0].articles[i].img=="") {
    imageTiles2[i][0] = loadImage("images/noimage.png");
  } else {
    imageTiles[i][0] = loadImage(data[0].articles[i].img)
  }

  imageTiles[i][1] = data[0].articles[i].title;
  imageTiles[i][2] = data[0].articles[i].author;

}

for (var i = 0; i < data[1].articles.length; i++) {
  //define a 2d array for the data
  imageTiles2[i]=[];

  if (data[1].articles[i].img=="") {
    imageTiles2[i][0] = loadImage("images/noimage.png");
  } else {
    imageTiles2[i][0] = loadImage(data[1].articles[i].img);
  }

  imageTiles2[i][1] = data[1].articles[i].title;
  imageTiles2[i][2] = data[1].articles[i].author;
  //imageTiles.splice(imageTiles.length,0,loadImage(data[0].OneonOne.articles[i].img));
}

for (var i = 0; i < data[2].articles.length; i++) {
  //define a 2d array for the data
  imageTiles3[i]=[];

  if (data[2].articles[i].img=="") {
    imageTiles3[i][0] = loadImage("images/noimage.png");
  } else {
    imageTiles3[i][0] = loadImage(data[2].articles[i].img);
  }

  imageTiles3[i][1] = data[2].articles[i].title;
  imageTiles3[i][2] = data[2].articles[i].author;
  //imageTiles.splice(imageTiles.length,0,loadImage(data[0].OneonOne.articles[i].img));
}

}

function draw() {
  // put drawing code here
   h = hour();
   m = minute();
   s = second();

  var colorFade=map(h, 0, 24, 255, 50);
  var colorFade2=map(m, 0, 60, 100, 0);
  var colorFade3=map(m, 0, 60, 90, 0);

  background(colorFade2,colorFade3,colorFade);

  for (var i = 0; i < tiles.length; i++) {
  //  var gravity = createVector(4,0.2*tiles[i].mass);

    //perlin noise
   //  xoff = xoff + 0.03;
   //  var n = map(noise(xoff), 0, 1, -.01,.01);
   //  console.log(n)

    //movingForce = createVector(.01,0);
    tiles[i].applyForce(movingForce);

    tiles[i].move(mouseX,mouseY,tiles[i]);
    tiles[i].display();
    tiles[i].checkEdges();
  //  tint(255,127);

  }

  for (var i = 0; i < tiles2.length; i++) {
  //  var gravity = createVector(4,0.2*tiles[i].mass);

    //perlin noise
  //  xoff = xoff + 0.03;
  //  var n = map(noise(xoff), 0, 1, -.01,.01);
  //  console.log(n)

    //movingForce = createVector(-.01,0);
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

    //movingForce = createVector(-.01,0);
    tiles3[i].applyForce(movingForce);

    tiles3[i].move(mouseX,mouseY,tiles[i]);
    tiles3[i].display();
    tiles3[i].checkEdges();
  //  tint(255,127);

  }

  //display the open space logo
  image(logo,(windowWidth/2)-200,(windowHeight/2)-200,400,400);


  var fps = frameRate();
  textSize(12);
  fill(255,255,255);
  text("FPS: " + fps.toFixed(2), 10, 20);
//  text("C: " + colorFade, 10, 60);

//  text("T: " + h, 10, 40);
//  noTint();
//xoff=0;
}

function insideTheFence(position){
    print("INlat: " + position.latitude);
    print("INlong: " + position.longitude);
    print("user is inside of the fence")

    //initialize a easter egg stream
    for (var i = 0; i < imageTiles3.length; i++) {

      //select randomly from image array
      var img=imageTiles3[i][0];
      var title=imageTiles3[i][1];
      var author=imageTiles3[i][2];

      //scale width randomly
      var width=img.width/random(1.5,4);
      //calculate aspect ratio of image
      var aspectRatio = img.height/img.width;
      //change height to aspect ratio so image is scaled uniformly
      var height=width*aspectRatio;

      var x = random(0,windowHeight-height);

      var position = createVector(random(windowWidth), x);
      var velocity = createVector(random(-.25),0);
      var acceleration = createVector(0,0);
      var mass = random(aspectRatio*8,aspectRatio*16);

      //var force = createVector(.2,0);

      //construct tiles
      tiles3[i] = new contentTile(position.x, position.y, width, height, img, position, velocity, acceleration, mass, title, author);
    }

}

function outsideTheFence(position){
    print("OUTlat: " + position.latitude);
    print("OUTlong: " + position.longitude);
    print("user is outside of the fence")
}

function mousePressed() {

  for (var i = tiles.length-1; i >= 0; i--) {
    tiles[i].clicked(mouseX,mouseY,i);

  //if dragging exit the loop so multiple tiles are not selected
  if(tiles[i].dragging) {
    break;
  }

    //if not dragging and clicking white space blow wind
    var wind = createVector(-10,0);
    tiles[i].applyForce(wind);

 }

 for (var i = tiles2.length-1; i >= 0; i--) {
   tiles2[i].clicked(mouseX,mouseY,i);

 //if dragging exit the loop so multiple tiles are not selected
 if(tiles2[i].dragging) {
   break;
 }

   //if not dragging and clicking white space blow wind
   var wind = createVector(5,0);
   tiles2[i].applyForce(wind);

}

for (var i = tiles3.length-1; i >= 0; i--) {
  tiles3[i].clicked(mouseX,mouseY,i);

//if dragging exit the loop so multiple tiles are not selected
if(tiles3[i].dragging) {
  break;
}

  //if not dragging and clicking white space blow wind
  var wind = createVector(10,0);
  tiles3[i].applyForce(wind);

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

class contentTile {

  //the equals here is when no values are passed to the constructor, it defaults to these
  constructor(x=0,y=0,width=25,height=25,imageSource='noimage.png', position, velocity, acceleration, mass, title, author) {

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

      this.velocity.x*=.5;
      this.position.x=0-this.width - textWidth;

    } else if(this.position.x < 0-(this.width+textWidth)) {
      this.velocity.x*=.5;
      this.position.x=windowWidth;
    }

    //reorient y positions, damp velocities
    if(this.position.y >= windowHeight) {

       this.velocity.y*=.5;
       this.position.y=0-this.height;

    } else if(this.position.y < 0-this.height) {
      this.velocity.y*=.5;
      this.position.y=windowHeight;
    }

  }


  display() {

   //display the images
   image(this.imageSource,this.position.x,this.position.y,this.width,this.height)
   //  rect(this.x, this.y, this.width, this.height);
   textSize(12);
   var colorFade4=map(h, 0, 24, 0, 255);
   fill(colorFade4,colorFade4,colorFade4);
   textFont("Georgia");
   //  noStroke();
   //  rect(this.position.x+this.width+5,this.position.y,105,105)

   text(this.title + " by " + this.author, this.position.x+this.width+10, this.position.y,textWidth,150);
   // textSize(9);
   // text('by '+ this.author, this.position.x, this.position.y+this.height+5,70,20);
  }

}
