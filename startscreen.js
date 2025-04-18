let simstarted = false;
let bgpic; 

function preload() {
  bgpic = loadImage("explosion.jpg");
  
}

function startsim() {
  simstarted = true
  noStroke();
  // Initialize fissile material
  for (let i = 0; i < MAX_MATERIAL; i++) {
    fissileMaterial.push(createVector(random(width), random(height)));
  }
  // Initialize with some neutrons
  //spawnNeutrons(5);
  
}
function startscreen() {
  background(bgpic)
  rect(width/2 - 150, height/4, 300, 300)
}
