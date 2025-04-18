let fissileMaterial = [];
let neutrons = [];
let energy = 0;
let fissionFragments = [];
let fissionFragments2 = [];
let MAX_MATERIAL = 800; // number of fissile atoms - probably uranium-235
let FISSION_ENERGY = 200; // energy per fission - temporary (in MeV)
//1 MeV = 1.602×10^-13 Joules
let NEUTRON_COUNT = 1; // number of neutrons released
let NEUTRON_SPEED = 2.0; // speed of neutrons
let FRAGMENT_LIFETIME = 300; // how long fragment lasts in frames
let FRAGMENT_SPEED = 1; // fragment speed
let neutrontotal = 0
let timerstart = false
let timer = 0
let oldtimer = 0
let fragmentcount = 2
let fissioncount = 0
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
  textSize(19);
  textAlign(RIGHT);
  text('Energy Released: ' + energy + "MeV", width - 10, height - 10);
  text('total neutrons: '+ neutrontotal, width - 400, height-10)
  text("time taken: "+ round(timer/30, 2) +"s", width - 10, height-50)  
  text("previous time taken: " + oldtimer + "s", width -10, height-90)
    
  textAlign(LEFT)
  text("Max material: " + MAX_MATERIAL, 3*width/5 + 160, height/3 + 17)
  text("Neutron speed: " + NEUTRON_SPEED, 3*width/5 + 160, height/3 + 57)
  text("Neutron release/collsion: " + NEUTRON_COUNT, 3*width/5 + 160, height/3 + 97)
  text("fragment release/collision: " + fragmentcount, 3*width/5 + 160, height/3 +137)
  
    
  text("Sim Width:",3*width/5 + 25, height/3 - 60)
  text("Sim Height:", 3*width/5 + 150, height/3 -60)
    
  text("Fissle Material:", 3*width/5 + 20, height/3 - 110)
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
      ellipse(fragment.position.x, fragment.position.y, 7, 7);
    }
  }
  fill(0, 100, 255, 150); 
  for (let i = fissionFragments2.length - 1; i >= 0; i--) {
    let fragment = fissionFragments2[i];
    fragment.position.x += fragment.vx;
    fragment.position.y += fragment.vy;
    fragment.lifetime--;
    
   
    
    
    // Remove fragments that go out of bounds or after lifetime
    if (fragment.lifetime <= 0 ||
        fragment.position.x < 0 || fragment.position.x > width ||
        fragment.position.y < 0 || fragment.position.y > height) {
      fissionFragments2.splice(i, 1);
    } else {
      ellipse(fragment.position.x, fragment.position.y, 5, 5);
    }
  }
  
  // Update and draw fissile material
  fill(255, 0, 0);
  
  for (let i = 0; i < fissileMaterial.length; i++) {
    
    ellipse(fissileMaterial[i].x, fissileMaterial[i].y, 12, 12);
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
    
    ellipse(neutron.x, neutron.y, 4, 4);
    
    // Check for fission
    for (let j = fissileMaterial.length - 1; j >= 0; j--) {
      let material = fissileMaterial[j];
      if (dist(neutron.x, neutron.y, material.x, material.y) < 10) {
        // Fission event
        fissileMaterial.splice(j, 1); // Remove the fissile material
        energy += FISSION_ENERGY;
        
        // Add fission fragments
        for (let k = 0; k < fragmentcount; k++) {
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
        timerstart = true
        spawnNeutrons(NEUTRON_COUNT, material.x, material.y);
        break;
      }
    }
    
    //check for fission of fission fragments
    if (fragmentfissionswitch.checked()) {
     for (let j = fissionFragments.length - 1; j >= 0; j--) {
      let material = fissionFragments[j];
      if (dist(neutron.x, neutron.y, material.x, material.y) < 10) {
        // Fission event
        fissionFragments.splice(j, 1); // Remove the fissile material
        energy += FISSION_ENERGY;
        
        // Add fission fragments
        for (let k = 0; k < fragmentcount; k++) {
          let angle = random(TWO_PI);
          let vx = FRAGMENT_SPEED * cos(angle);
          let vy = FRAGMENT_SPEED * sin(angle);
          fissionFragments2.push({
            position: createVector(neutron.x, neutron.y),
            vx: vx,
            vy: vy,
            lifetime: FRAGMENT_LIFETIME
          });
        }
        timerstart = true
        spawnNeutrons(NEUTRON_COUNT, material.x, material.y);
        break;
      }
    }
   }
    
    
  }
  if (energy == MAX_MATERIAL*FISSION_ENERGY) {
    timerstart = false
  }
  
  
  if (timerstart == true) {
    timer++
    
  }
  
 if (fissilematerialselect.value() == 2) {
   neutronsreleasedslider.value(2)
 } else if (fissilematerialselect.value() == 3) {
   neutronsreleasedslider.value(3)
 } else if (fissilematerialselect.value() == 1) {
   NEUTRON_COUNT = neutronsreleasedslider.value()
 }
  else {
   NEUTRON_COUNT = neutronsreleasedslider.value()
 }
  
 MAX_MATERIAL = maxmaterialslider.value()
 NEUTRON_COUNT = neutronsreleasedslider.value()
 NEUTRON_SPEED = neutronspeedslider.value()
 fragmentcount = fragmentcountslider.value()
 
  
  
  
  
}

// Function to spawn neutrons 
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

//handle spawning neutrons
function mousePressed() {
  if (mouseX < 3*width/5) {
  spawnNeutrons(2, mouseX, mouseY); // spawn 2 neutrons at the mouse position
  
  }
}

function fragmentfission() {
  
}
