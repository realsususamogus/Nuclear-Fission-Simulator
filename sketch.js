let fissileMaterial = [];
let neutrons = [];
let energy = 0;
let fissionFragments = [];
const MAX_MATERIAL = 300; // Initial number of fissile nuclei
const FISSION_ENERGY = 500; // Energy per fission event (simplified)
const NEUTRON_COUNT = 2; // Number of neutrons released per fission
const NEUTRON_SPEED = 0.1; // Speed of neutrons
const FRAGMENT_LIFETIME = 200; // Frames before fragments disappear

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  // Initialize fissile material
  for (let i = 0; i < MAX_MATERIAL; i++) {
    fissileMaterial.push(createVector(random(width), random(height)));
  }
  // Initialize with some neutrons
  spawnNeutrons(1);
}

function draw() {
  background(0);
  
  // Update and draw fission fragments
  fill(255, 100, 0, 150);
  for (let i = fissionFragments.length - 1; i >= 0; i--) {
    let fragment = fissionFragments[i];
    fragment.lifetime--;
    if (fragment.lifetime <= 0) {
      fissionFragments.splice(i, 1);
    } else {
      ellipse(fragment.position.x, fragment.position.y, 10, 10);
    }
  }
  
  // Update and draw fissile material
  fill(255, 0, 0);
  for (let i = 0; i < fissileMaterial.length; i++) {
    ellipse(fissileMaterial[i].x, fissileMaterial[i].y, 10, 10);
  }
  
  // Update and draw neutrons
  fill(0, 255, 0);
  for (let i = neutrons.length - 1; i >= 0; i--) {
    let neutron = neutrons[i];
    neutron.x += neutron.vx;
    neutron.y += neutron.vy;
    
    // Remove neutrons that go out of bounds
    if (neutron.x < 0 || neutron.x > width || neutron.y < 0 || neutron.y > height) {
      neutrons.splice(i, 1);
      continue;
    }
    
    ellipse(neutron.x, neutron.y, 5, 5);
    
    // Check for fission
    for (let j = fissileMaterial.length - 1; j >= 0; j--) {
      let material = fissileMaterial[j];
      if (dist(neutron.x, neutron.y, material.x, material.y) < 10) {
        // Fission event
        fissileMaterial.splice(j, 1); // Remove the fissile material
        energy += FISSION_ENERGY;
        fissionFragments.push({ position: createVector(neutron.x, neutron.y), lifetime: FRAGMENT_LIFETIME });
        spawnNeutrons(NEUTRON_COUNT);
        break;
      }
    }
  }
  
  // Display energy
  fill(255);
  textSize(20);
  textAlign(RIGHT);
  text('Energy Released: ' + energy, width - 10, height - 10);
  
  // Loop the simulation
  if (fissileMaterial.length > 0 || neutrons.length > 0) {
    setTimeout(() => { redraw(); }, 100);
  }
}

function spawnNeutrons(count) {
  for (let i = 0; i < count; i++) {
    let angle = random(TWO_PI);
    let vx = NEUTRON_SPEED * cos(angle);
    let vy = NEUTRON_SPEED * sin(angle);
    let neutron = createVector(random(width), random(height));
    neutron.vx = vx;
    neutron.vy = vy;
    neutrons.push(neutron);
  }
}
