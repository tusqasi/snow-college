/*
 * Referenced from https://thecodingtrain.com/challenges/124-flocking-simulation
 */

// Some variables which are used at many places

// Canvas size
let W = 800;
let H = 400;

// Number of boids
let N = 100;

let alignementOn = true;
let cohesionOn = true;
let seperationOn = true;

let boids = [];

// Colors
let RED = [250, 0, 0];
let GREEN = [0, 255, 0];
let BLUE = [0, 0, 255];
let YELLOW = [255, 255, 0];
let MAGENTA = [255, 0, 255];


// Sliders div
let sliders;

// Divs for each slider
let aligmentSlider;
let seperationSlider;
let cohesionSlider;


// Makes an list of boids
function makeBoids(n) {
  let ret_val = [];
  while (n--) {
    ret_val.push(new Boid());
  }
  return ret_val;
}

// Resets the simulation
function reset_sketch() {
  N = 300;
  boids = [];
  setup();
}


// Change the number of boids
function updateBoids() {
  let inputText = select("#num-input").value();
  if (inputText != "") {
     inputText =parseInt(inputText)
    if(inputText>900){
    message("might be too much, but I am gonna not stop you.")
    }
    N =inputText;
    
  }
  setup();
}


let createdSliders = false;

// Creates and puts the sliders on the page
function createSliders() {
  sliders = select("#sliders");
  let alignDiv = createDiv().id("align");
  let seperateDiv = createDiv().id("seperate");
  let cohereDiv = createDiv().id("cohere");

  seperateDiv.child(createP("Seperation"));
  alignDiv.child(createP("Alignment"));
  cohereDiv.child(createP("Cohesion"));

  seperationSlider = createSlider(0, 2, 1, 0.1)
    .id("seperation")
    .class("slider");
  seperateDiv.child(seperationSlider);

  alignmentSlider = createSlider(0, 1, 0.7, 0.1)
    .id("alignment")
    .class("slider");
  alignDiv.child(alignmentSlider);

  cohesionSlider = createSlider(0, 1, 0.7, 0.1).id("cohesion").class("slider");
  cohereDiv.child(cohesionSlider);

  sliders.child(seperateDiv);
  sliders.child(alignDiv);
  sliders.child(cohereDiv);
}

function setup() {
  createCanvas(W, H);
  boids = makeBoids(N);

  if (!createdSliders) {
    createSliders();
    createdSliders = true;
  }
}

function draw() {
  background(20);
  stroke(225);
  for (let boid of boids) {
    // Check the code in boid.js for more info
    boid.wrap();
    boid.update();
    boid.flock(boids);
    boid.draw();
  }

  // First boid in the list will be focused
  boids[0].focus();
}
