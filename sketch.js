let fissileMaterial = [];
let neutrons = [];
let energy = 0;
let fissionFragments = [];
const MAX_MATERIAL = 800; // number of fissile atoms - probably uranium-235
const FISSION_ENERGY = 200; // energy per fission - temporary 
const NEUTRON_COUNT = 1; // number of neutrons released
const NEUTRON_SPEED = 2; // speed of neutrons
const FRAGMENT_LIFETIME = 200; // how long fragment lasts in frames
const FRAGMENT_SPEED = 1; // fragment speed
let neutrontotal = 0

//add customisation to all the above later ^^
//adithya if ur reading this stop stalking ppl's projects 

function setup() {
  createCanvas(windowWidth, windowHeight);
  startsim()
  //startscreen()
}

function draw() {
  //background(0);
  
  if(simstarted == true) {
  background(0)
  fill(255);
  textSize(20);
  textAlign(RIGHT);
  text('Energy Released: ' + energy, width - 10, height - 10);
  text('total neutrons: '+ neutrontotal, width - 400, height-10)
  }
  
  // Update and draw fission fragments
  fill(255, 100, 0, 150);
  for (let i = fissionFragments.length - 1; i >= 0; i--) {
    let fragment = fissionFragments[i];
    fragment.position.x += fragment.vx;
    fragment.position.y += fragment.vy;
    fragment.lifetime--;
    
    // Remove fragments that go out of bounds or after lifetime
    if (fragment.lifetime <= 0 ||
        fragment.position.x < 0 || fragment.position.x > width ||
        fragment.position.y < 0 || fragment.position.y > height) {
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
      neutrontotal-=1
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
        
        // Add fission fragments
        for (let k = 0; k < NEUTRON_COUNT; k++) {
          let angle = random(TWO_PI);
          let vx = FRAGMENT_SPEED * cos(angle);
          let vy = FRAGMENT_SPEED * sin(angle);
          fissionFragments.push({
            position: createVector(neutron.x, neutron.y),
            vx: vx,
            vy: vy,
            lifetime: FRAGMENT_LIFETIME
          });
        }
        
        spawnNeutrons(NEUTRON_COUNT, material.x, material.y);
        break;
      }
    }
  }
  

  
}

// Function to spawn neutrons at the specified location
function spawnNeutrons(count, x, y) {
  for (let i = 0; i < count; i++) {
    let angle = random(TWO_PI);
    let vx = NEUTRON_SPEED * cos(angle);
    let vy = NEUTRON_SPEED * sin(angle);
    let neutron = createVector(x, y);
    neutron.vx = vx;
    neutron.vy = vy;
    neutrons.push(neutron);
    neutrontotal+=1
  }
}

// Mouse press event to spawn neutrons where the user clicks
function mousePressed() {
  spawnNeutrons(2, mouseX, mouseY); // Spawn 5 neutrons at the mouse position
}
