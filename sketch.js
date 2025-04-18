//ADDTIONAL NOTE: OPEN SIMULATION IN FULLSCREEN (file -> share -> fullscreen) FOR THE BEST EXPERIENCE!!
//Nuclear fission simulator by Chandi
//I just realised my UI sizing is not that suited for the school laptop monitor sizing (i did it at home on my pc which had different dimensions) and thus the UI might be a bit wonky

let fissileMaterial = [];
let neutrons = [];
let energy = 0;
let fissionFragments = [];
let fissionFragments2 = [];
let betaparticles = [];
let MAX_MATERIAL = 400; // number of fissile atoms 
let FISSION_ENERGY = 200; // energy per fission - temporary (in MeV)
//1 MeV = 1.60218×10^-13 Joules

let NEUTRON_COUNT = 1; // number of neutrons released
let NEUTRON_SPEED = 2.0; // speed of neutrons
let FRAGMENT_LIFETIME = 300; // how long fragment lasts in frames
let FRAGMENT_SPEED = 1; // fragment speed
let neutrontotal = 0;
let timerstart = false;
let timer = 0;
let oldtimer = 0;
let oldenergy = 0;
let fragmentcount = 2;
let fissioncount = 0;
let betaparticlestotal = 0;
let fissionprogress = 0;

//adithya stop spying on everyone's projects

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  startsim();
  rerunbutton();
  helpbutton();
  customisation();
  //startscreen()
}

function draw() {
  background(0);
  //setting up the control panel/UI
  if (simstarted == true) {
    startscreen();

    fill(0);
    textSize(19);
    textAlign(RIGHT);
    //handles the joules-MeV conversion in real time
    if (mevtojoulesswitch.checked()) {
      text(
        "Energy Released: " + energy * (1.60218 * 10 ** -13) + "J",
        width - 10,
        height - 10
      );
      text(
        "Previous Energy Released: " + oldenergy * (1.60218 * 10 ** -13) + "J",
        width - 10,
        height - 50
      );
    } else {
      text("Energy Released: " + energy + "MeV", width - 10, height - 10);
      text(
        "Previous Energy Released: " + oldenergy + "MeV",
        width - 10,
        height - 50
      );
    }
    text("time taken: " + round(timer / 30, 2) + "s", width - 10, height - 110);
    text("previous time taken: " + oldtimer + "s", width - 10, height - 130);
    text("Total Neutrons: " + neutrontotal, width - 400, height - 10);

    fill(0);
    textAlign(LEFT);
    text(
      "Max material: " + MAX_MATERIAL,
      (3 * width) / 5 + 265,
      height / 3 + 14
    );
    text(
      "Neutron speed: " + NEUTRON_SPEED,
      (3 * width) / 5 + 265,
      height / 3 + 54
    );
    text(
      "Neutron release/collsion: " + NEUTRON_COUNT,
      (3 * width) / 5 + 265,
      height / 3 + 94
    );
    text(
      "Fragment release/collision: " + fragmentcount,
      (3 * width) / 5 + 265,
      height / 3 + 134
    );

    text("Sim Width:", (3 * width) / 5 + 25, height / 3 - 60);
    text("Sim Height:", (3 * width) / 5 + 150, height / 3 - 60);

    text("Fissle Material:", (3 * width) / 5 + 20, height / 3 - 90);
    fissionprogress = 100 - (fissileMaterial.length / MAX_MATERIAL) * 100;
    text("Fission Progress:", (3 * width) / 5 + 20, height / 3 + 280);
    fill("orange");
    rect((3 * width) / 5 + 20, height / 3 + 290, (2 * width) / 5 - 40, 30);
    //progress bar stuff
    if (fissionprogress >= 0) {
      fill(0, 255, 0);
      rect(
        (3 * width) / 5 + 20,
        height / 3 + 290,
        map(fissionprogress, 0, 100, 0, (2 * width) / 5 - 40, false),
        30
      );
      fill(0);
      text(round(fissionprogress, 1) + "%", (4 * width) / 5, height / 3 + 310);
    } else {
      fill(0);
      text("0%", (4 * width) / 5, height / 3 + 310);
      fissionprogress = 0;
    }
  }
  //not sure if i can disable p5js switches so ill just leave it there
  /*if (betadecayswitch.checked()) {
    fragmentfissionswitch.disabled = true;
  } else if (fragmentfissionswitch.checked()) {
    betadecayswitch.disabled = true;
  } else {
    fragmentfissionswitch.disabled = false;
    betadecayswitch.disabled = false;
  } */

  // Update and draw fission fragments
  fill(255, 100, 0, 150);
  for (let i = fissionFragments.length - 1; i >= 0; i--) {
    let fragment = fissionFragments[i];
    fragment.position.x += fragment.vx;
    fragment.position.y += fragment.vy;
    fragment.lifetime--;

    //handles beta decay - if enabled 
    if (
      betadecayswitch.checked() &&
      fragment.lifetime == (2 * FRAGMENT_LIFETIME) / 3
    ) {
      spawnBetaParticles(1, fragment.position.x, fragment.position.y);
      fragment.decaystate = 1;
    } else if (
      betadecayswitch.checked() &&
      fragment.lifetime == FRAGMENT_LIFETIME / 3
    ) {
      spawnBetaParticles(1, fragment.position.x, fragment.position.y);
      fragment.decaystate = 2;
      energy += floor(random(4, 10));
    }

    // Remove fragments that go out of bounds or after lifetime
    if (
      fragment.lifetime <= 0 ||
      fragment.position.x < 0 ||
      fragment.position.x > (3 * width) / 5 ||
      fragment.position.y < 0 ||
      fragment.position.y > height
    ) {
      fissionFragments.splice(i, 1);
    } else if (fragment.decaystate == 1) {
      fill(168, 219, 255, 200);
      ellipse(fragment.position.x, fragment.position.y, 7, 7);
      //decay1 = false
    } else if (fragment.decaystate == 2) {
      fill(107, 29, 163, 200);
      ellipse(fragment.position.x, fragment.position.y, 7, 7);
      //decay2 = false
    } else {
      ellipse(fragment.position.x, fragment.position.y, 7, 7);
    }
  }
  //draw fragments of daughter nuclei fission
  fill(0, 100, 255, 150);
  for (let i = fissionFragments2.length - 1; i >= 0; i--) {
    let fragment = fissionFragments2[i];
    fragment.position.x += fragment.vx;
    fragment.position.y += fragment.vy;
    fragment.lifetime--;

    // Remove fragments that go out of bounds or after lifetime
    if (
      fragment.lifetime <= 0 ||
      fragment.position.x < 0 ||
      fragment.position.x > (3 * width) / 5 ||
      fragment.position.y < 0 ||
      fragment.position.y > height
    ) {
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
    if (
      neutron.x < 0 ||
      neutron.x > (3 * width) / 5 ||
      neutron.y < 0 ||
      neutron.y > height
    ) {
      neutrons.splice(i, 1);
      neutrontotal -= 1;
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
        for (let k = 0; k < fragmentcount; k++) {
          let angle = random(TWO_PI);
          let vx = FRAGMENT_SPEED * cos(angle);
          let vy = FRAGMENT_SPEED * sin(angle);
          fissionFragments.push({
            position: createVector(neutron.x, neutron.y),
            vx: vx,
            vy: vy,
            lifetime: FRAGMENT_LIFETIME,
          });
        }
        timerstart = true;
        spawnNeutrons(NEUTRON_COUNT, material.x, material.y);
        break;
      }
    }

    //check for fission of fission fragments
    if (fragmentfissionswitch.checked()) {
      for (let j = fissionFragments.length - 1; j >= 0; j--) {
        let material = fissionFragments[j].position;
        let timeExisted = fissionFragments[j].lifetime;
        if (
          dist(neutron.x, neutron.y, material.x, material.y) < 5 &&
          timeExisted < FRAGMENT_LIFETIME - 5
        ) {
          // Fission event
          fissionFragments.splice(j, 1); // Remove the fissile material
          energy += FISSION_ENERGY;

          // Add fission fragment fission fragments
          for (let k = 0; k < fragmentcount; k++) {
            let angle = random(TWO_PI);
            let vx = FRAGMENT_SPEED * cos(angle);
            let vy = FRAGMENT_SPEED * sin(angle);
            fissionFragments2.push({
              position: createVector(neutron.x, neutron.y),
              vx: vx,
              vy: vy,
              lifetime: FRAGMENT_LIFETIME,
              decaystate: 0,
            });
          }
          spawnNeutrons(NEUTRON_COUNT, material.x, material.y);
          break;
        }
      }
    }
  }
  //draw beta particles (for beta decay)
  fill(222, 178, 160);
  for (let i = betaparticles.length - 1; i >= 0; i--) {
    let betaparticle = betaparticles[i];
    betaparticle.x += betaparticle.vx;
    betaparticle.y += betaparticle.vy;

    // Remove neutrons that go out of bounds
    if (
      betaparticle.x < 0 ||
      betaparticle.x > (3 * width) / 5 ||
      betaparticle.y < 0 ||
      betaparticle.y > height
    ) {
      betaparticles.splice(i, 1);
      betaparticlestotal -= 1;
    }

    ellipse(betaparticle.x, betaparticle.y, 4, 4);
  }
  
  //handles the timer that begins and ends following the reaction
  if (fissileMaterial.length == 0 && !fragmentfissionswitch.checked()) {
    timerstart = false;
  }

  if (fissionFragments.length == 0 && fragmentfissionswitch.checked()) {
    timerstart = false;
  }

  if (neutrons.length == 0) {
    timerstart = false;
  }

  if (timerstart == true) {
    timer++;
  }
  //handles slider values based on selected fissile material
  if (fissilematerialselect.value() == 2) {
    neutronsreleasedslider.value(2);
  } else if (fissilematerialselect.value() == 3) {
    neutronsreleasedslider.value(3);
  } else if (fissilematerialselect.value() == 1) {
    NEUTRON_COUNT = neutronsreleasedslider.value();
  } else {
    NEUTRON_COUNT = neutronsreleasedslider.value();
  }
  //assigning slider values to variables
  MAX_MATERIAL = maxmaterialslider.value();
  NEUTRON_COUNT = neutronsreleasedslider.value();
  NEUTRON_SPEED = neutronspeedslider.value();
  fragmentcount = fragmentcountslider.value();

  //help menu displaying
  if (helpdisplay == true) {
    let c1 = color(216, 181, 255);
    let c2 = color(30, 174, 152);
    fill(255);
    let helpx = (3 * width) / 25;
    let helpy = height / 5;
    let helpw = (9 * width) / 25;
    let helph = height / 1.3;
    rect(helpx, helpy, helpw, helph); //this rect was to prevent fissile material from being seen in the help menu
    
    drawGradientRect(helpx, helpy, helpw, helph, c1, c2, "X_AXIS");
    fill("red");
    stroke("black");

    let cx = (12 * width) / 25;
    let cy = height / 5;
    let r = width / 50;
    let offset = r / 4;
    circle(cx, cy, r);
    line(cx - offset, cy - offset, cx + offset, cy + offset);
    line(cx + offset, cy - offset, cx - offset, cy + offset);

    textFont("Courier New", 10);
    displaywelcomemessage();
  }
}

//special function to draw gradient rectangles, purely aesthetic
function drawGradientRect(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === "Y_AXIS") {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === "X_AXIS") {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

//function to handle everything inside the help menu 
function displaywelcomemessage() {
  stroke("black");
  fill("black");
  let helpx = (3 * width) / 25;
  let helpy = height / 5;
  let helpw = (9 * width) / 25;
  let helph = height / 1.5;
  text(
    "Welcome to the Nuclear Fission Simulator! This simulation is mostly accurate and quite simplified. Feel free to play around with the different factors that affect this reaction.",
    helpx + 20,
    helpy + 20,
    helpw - 20,
    helph - 20
  );

  text(
    "To START fission, click anywhere inside the simulation area (in black) to spawn neutrons. Click the 'play' button anytime to RESET the simulation. For sim width and sim height, the simulation must be reset for it to take effect. For CUSTOM values, do select custom in the fissile material dropdown menu.",
    helpx + 20,
    helpy + 70,
    helpw - 20,
    helph - 20
  );

  text(
    "Nuclear fission is the process where a heavy atomic nucleus, like uranium-235, splits into smaller nuclei (fragments), releasing a LARGE amount of energy, along with free neutrons that can trigger a chain reaction. This reaction is the basis for nuclear power and weapons. There are many FACTORS that can affect this reaction (eg. concentration of fissile material, beta decay, neutron release, temperature...)",
    helpx + 20,
    helpy + 135,
    helpw - 20,
    helph - 20
  );

  text(
    "Fission of fragments is unrealistic as daughter nuclei released from fission are usually much more stable and thus do not break apart. Instead, they undergo BETA DECAY, where beta particles and small amounts of energy are released.(Note: Enabling BOTH at the same time will only result in fission of fragments)",
    helpx + 20,
    helpy + 220,
    helpw - 20,
    helph - 20
  );

  text("Legend:", helpx + 15, helpy + 300, helpw - 20, helph - 20);
  text("Fissle Material", helpx + 35, helpy + 333);
  text("Fission Fragment", helpx + 35, helpy + 353);
  text("Neutron", helpx + 35, helpy + 373);
  text(
    "Fission Fragment of daughter nuclei (fission of fragments)",
    helpx + 35,
    helpy + 393
  );
  text("Fission Fragment (1st stage Beta Decay)", helpx + 35, helpy + 413);
  text("Fission Fragment (2nd stage Beta Decay)", helpx + 35, helpy + 433);
  text("Beta Particles (from Beta Decay)", helpx + 35, helpy + 453);
  fill(255, 0, 0);
  ellipse(helpx + 20, helpy + 330, 12, 12);
  fill(255, 100, 0, 150);
  ellipse(helpx + 20, helpy + 350, 7, 7);
  fill(0, 255, 0);
  ellipse(helpx + 20, helpy + 370, 5, 5);
  fill(0, 100, 255, 150);
  ellipse(helpx + 20, helpy + 390, 5, 5);
  fill(168, 219, 255, 200);
  ellipse(helpx + 20, helpy + 410, 7, 7);
  fill(107, 29, 163, 200);
  ellipse(helpx + 20, helpy + 430, 7, 7);
  fill(222, 178, 160);
  ellipse(helpx + 20, helpy + 450, 4, 4);

  textFont("Arial", 20);
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
    neutrontotal += 1;
  }
}
//function to spawn beta particles, similar to neutron spawning
function spawnBetaParticles(count, x, y) {
  for (let i = 0; i < count; i++) {
    let angle = random(TWO_PI);
    let vx = NEUTRON_SPEED * cos(angle);
    let vy = NEUTRON_SPEED * sin(angle);
    let betaparticle = createVector(x, y);
    betaparticle.vx = vx;
    betaparticle.vy = vy;
    betaparticles.push(betaparticle);
    betaparticlestotal += 1;
  }
}

//handle spawning neutrons and help display closing
function mousePressed() {
  let cx = (12 * width) / 25;
  let cy = height / 5;
  let r = width / 50;

  if (mouseX < (3 * width) / 5 && helpdisplay == false) {
    spawnNeutrons(2, mouseX, mouseY); // spawn 2 neutrons at the mouse position
  }

  if (
    mouseX < cx + r &&
    mouseX > cx - r &&
    mouseY < cy + r &&
    mouseY > cy - r &&
    helpdisplay == true
  ) {
    helpdisplay = false;
    clear();
  }
}
