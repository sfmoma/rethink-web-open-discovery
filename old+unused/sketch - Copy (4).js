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

function setup() {

imageTiles[0] = [ "hi", "hi2", "hi3" ]
imageTiles2[0] = [ "2hi", "2hi2", "2hi3" ]
imageTiles2[1] = [ "2hi", "2hi2", "2hi3" ]

//test =imageTiles[0].concat.imageTiles2[0];
//console.log(imageTiles[0][0].push.imageTiles2[0][0])
imageTiles.splice(imageTiles.length,0,imageTiles2)
console.log(imageTiles);
console.log(imageTiles[1][5]);

}
