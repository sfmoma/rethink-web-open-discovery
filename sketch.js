//array for the tile objects
var tiles = [];

//array for the image data
var imageTiles = [];
var logo;

//preload the image data
function preload() {

  for (var i = 0; i < 5; i++) {
    imageTiles[i] = loadImage('images/image' + i + '.jpg')
  }

logo = loadImage('images/o.png')

}

//expand canvas on resize
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  // put setup code here

  //createcanvas the viewport size
  createCanvas(windowWidth, windowHeight);
  //createCanvas(500, 500);
  background(255);

  loadJSON("data.json",gotData);

  for (var i = 0; i < 60; i++) {

    //set random speeds
   //  var speed = random(.1,3);

   // set random sizes
   // var size=random(10,70);

    //select randomly from image array
    var img=imageTiles[floor(random(0,5))];
    //scale width randomly
    var width=img.width/random(5,10);
    //calculate aspect ratio of image
    var aspectRatio = img.height/img.width;
    //change height to aspect ratio so image is scaled uniformly
    var height=width*aspectRatio;

    var x = random(windowHeight-height);

    var position = createVector(random(windowWidth), x);
    var velocity = createVector(random(.5),0);
    var acceleration = createVector(0,0);
    var mass = random(aspectRatio*8,aspectRatio*16);

    //var force = createVector(.2,0);

    //construct a tile
    tiles[i] = new contentTile(position.x, position.y, width, height, img, position, velocity, acceleration, mass);
  }

}

//do stuff when we get the json data
function gotData(data) {
console.log(data);
console.log(data[0]);
console.log(data[0].blue);
console.log(data[0].red);

}

function draw() {
  // put drawing code here
  background(255);
  //rectMode(CENTER);
  for (var i = 0; i < tiles.length; i++) {
  //  var gravity = createVector(4,0.2*tiles[i].mass);

    var movingForce = createVector(.025,0);
    tiles[i].applyForce(movingForce);

    tiles[i].move(mouseX,mouseY,tiles[i]);
    tiles[i].display();
    tiles[i].checkEdges();
  }

}

function mousePressed() {

  for (var i = tiles.length-1; i >= 0; i--) {
    tiles[i].clicked(mouseX,mouseY,i);

  //if dragging exit the loop so multiple tiles are not selected
  if(tiles[i].dragging) {
    break;
  }

    //if not dragging and clicking white space blow wind
    var wind = createVector(10,random(15));
    tiles[i].applyForce(wind);



 }

}

function mouseReleased() {
  for (var i = 0; i < tiles.length; i++) {
      tiles[i].dragging=false;
 }
}

class contentTile {

  //the equals here is when no values are passed to the constructor, it defaults to these
  constructor(x=0,y=0,width=25,height=25,imageSource='image0.jpg', position, velocity, acceleration, mass) {

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
      this.position.x=0-this.width;

    } else if(this.position.x < 0-this.width) {
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
    image(logo,(windowWidth/2)-200,(windowHeight/2)-200,400,400);
    //display the images
    image(this.imageSource,this.position.x,this.position.y,this.width,this.height)
   //  rect(this.x, this.y, this.width, this.height);

  }

}
