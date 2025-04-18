let fissileMaterial = [];
let neutrons = [];
let energy = 0;
let fissionFragments = [];
let MAX_MATERIAL = 800; // number of fissile atoms - probably uranium-235
let FISSION_ENERGY = 200; // energy per fission - temporary (in MeV)
//1 MeV = 1.602×10^-13 Joules
let NEUTRON_COUNT = 1; // number of neutrons released
let NEUTRON_SPEED = 2.0; // speed of neutrons
let FRAGMENT_LIFETIME = 400; // how long fragment lasts in frames
let FRAGMENT_SPEED = 1; // fragment speed
let neutrontotal = 0

//add customisation to all the above later ^^
//adithya if ur reading this stop stalking ppl's projects 

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60)
  startsim()
  rerunbutton()
  customisation()
  //startscreen()
}

function draw() {
  //background(0);
  
   background(0)
  if(simstarted == true) {
  startscreen()
  
  fill(255);
  textSize(20);
  textAlign(RIGHT);
  text('Energy Released: ' + energy, width - 10, height - 10);
  text('total neutrons: '+ neutrontotal, width - 400, height-10)
    
  textAlign(LEFT)
  text("Max material: " + MAX_MATERIAL, 3*width/5 + 160, height/3 + 17)
  text("Neutron release/collsion: " + NEUTRON_COUNT, 3*width/5 + 160, height/3 + 57)
  text("Neutron speed: " + NEUTRON_SPEED, 3*width/5 + 160, height/3 + 97)
  }
  
  
  // Update and draw fission fragments
  fill(255, 100, 0, 150);
  for (let i = fissionFragments.length - 1; i >= 0; i--) {
    let fragment = fissionFragments[i];
    fragment.position.x += fragment.vx;
