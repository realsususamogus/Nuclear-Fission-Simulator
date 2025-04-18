let simstarted = false;
let bgpic;
let rerun;
let help;
let helpdisplay = false;
let maxmaterialslider;
let neutronsreleasedslider;
let neutronspeedslider;

let sizewidthselect;
let sizeheightselect;
let fissilematerialselect;

let fragmentcountslider;

let fragmentfissionswitch;
let betadecayswitch;
let mevtojoulesswitch;

/*
function preload() {
  bgpic = loadImage("explosion.jpg");
} 
*/

function startsim() {
  simstarted = true;
  noStroke();
  // Initialize fissile material
  for (let i = 0; i < MAX_MATERIAL; i++) {
    fissileMaterial.push(
      createVector(random((3 * width) / 5 - 5), random(height))
    );
  }
}

//function to set up initial start screen 
function startscreen() {
  noStroke();
  let cbg1 = color(255, 182, 73);
  let cbg2 = color(52, 255, 219);
  rect((3 * width) / 5, 0, (2 * width) / 5, height);
  drawGradientRect(
    (3 * width) / 5,
    0,
    (2 * width) / 5,
    height,
    cbg1,
    cbg2,
    "Y_AXIS"
  );
  noStroke();
  textAlign(CENTER);
  fill(0);
  textSize(30);
  text("Nuclear Fission Simulator Version 3", (4 * width) / 5, 35);
  let textwidth = textWidth("Nuclear Fission Simulator");
  line((4 * width) / 5, 50 + 30, (4 * width) / 5 + textwidth, 50 + 30);
  //rect(0,3*height/5, 3*width/5, 2*width/5 )
}

//function to handle the play button
function rerunbutton() {
  rerun = createButton("Play");
  rerun.position((4 * width) / 5 - 125, height / 12);
  rerun.addClass("mybutton");
  rerun.size(100, 50);
  rerun.mouseOver(changecolor1);
  rerun.mouseOut(changecolor12);
  rerun.mousePressed(rerunfunc);
}

//function to handle the help button
function helpbutton() {
  help = createButton("???");
  help.position((4 * width) / 5, height / 12);
  help.addClass("mybutton");
  help.size(100, 50);
  help.mouseOver(changecolor2);
  help.mouseOut(changecolor22);
  help.mousePressed(helpfunc);
}

//function to handle all the sliders and checkboxes and dropdown menus 
function customisation() {
  maxmaterialslider = createSlider(100, 3200, 400);
  maxmaterialslider.position((3 * width) / 5 + 20, height / 3);
  maxmaterialslider.addClass("mySlider");

  neutronspeedslider = createSlider(0.1, 5, 2.0, 0.1);
  neutronspeedslider.position((3 * width) / 5 + 20, height / 3 + 40);
  neutronspeedslider.addClass("mySlider");

  neutronsreleasedslider = createSlider(1, 5, 1);
  neutronsreleasedslider.position((3 * width) / 5 + 20, height / 3 + 80);
  neutronsreleasedslider.addClass("mySlider");

  fragmentcountslider = createSlider(1, 5, fragmentcount);
  fragmentcountslider.position((3 * width) / 5 + 20, height / 3 + 120);
  fragmentcountslider.addClass("mySlider");

  fill(0);
  fragmentfissionswitch = createCheckbox(
    "Enable fission of fragments (Unrealistic)",
    false
  );
  fragmentfissionswitch.position((3 * width) / 5 + 20, height / 3 + 160);

  betadecayswitch = createCheckbox("Enable Beta Decay of fragments", false);
  betadecayswitch.position((3 * width) / 5 + 20, height / 3 + 190);

  mevtojoulesswitch = createCheckbox(
    "Enable Energy in Joules (1MeV = 1.60218×10^-13 J)",
    false
  );
  mevtojoulesswitch.position((3 * width) / 5 + 20, height / 3 + 220);

  sizewidthselect = createSelect();
  sizewidthselect.position((3 * width) / 5 + 20, height / 3 - 50);
  sizewidthselect.size(100, 30);
  sizewidthselect.option("default", (3 * width) / 5 - 5);
  sizewidthselect.option("small", width / 2);
  sizewidthselect.option("x-small", width / 3);
  sizewidthselect.option("xx-small", width / 5);
  sizewidthselect.selected("default");

  sizeheightselect = createSelect();
  sizeheightselect.size(100, 30);
  sizeheightselect.position((3 * width) / 5 + 150, height / 3 - 50);
  sizeheightselect.option("default.", height);
  sizeheightselect.option("small.", (2 * height) / 3);
  sizeheightselect.option("x-small.", height / 2);
  sizeheightselect.option("xx-small.", height / 3);
  sizeheightselect.selected("default.");

  fissilematerialselect = createSelect();
  fissilematerialselect.size(120, 30);
  fissilematerialselect.position((3 * width) / 5 + 150, height / 3 - 110);
  fissilematerialselect.option("U-235(default)", 2);
  fissilematerialselect.option("Pu-239", 3);
  fissilematerialselect.option("U-233", 2);
  fissilematerialselect.option("Custom", 1);
  fissilematerialselect.selected("U-235(default)");
}

//function to handle the resetting of the simulation 
function rerunfunc() {
  for (let i = fissileMaterial.length; i > -1; i--) {
    fissileMaterial.splice(i, 1);
  }
  for (let i = neutrons.length; i > -1; i--) {
    neutrons.splice(i, 1);
    neutrontotal -= 1;
  }
  for (let i = fissionFragments.length; i > -1; i--) {
    fissionFragments.splice(i, 1);
  }
  for (let i = fissionFragments2.length; i > -1; i--) {
    fissionFragments2.splice(i, 1);
  }
  for (let i = betaparticles.length; i > -1; i--) {
    betaparticles.splice(i, 1);
  }

  for (let i = fissileMaterial.length; i < MAX_MATERIAL; i++) {
    fissileMaterial.push(
      createVector(
        random(sizewidthselect.selected()),
        random(sizeheightselect.selected())
      )
    );
  }
  neutrontotal = 0;
  oldenergy = energy;
  energy = 0;
  timerstart = false;
  oldtimer = round(timer / 30, 2);
  timer = 0;
}

function helpfunc() {
  helpdisplay = !helpdisplay;
}

//functions that purely aesthetic, handles the looks and behaviour of the play and help buttons. 
function changecolor1() {
  //setting the colour change and the shadow of the buttons upon mouseOver
  rerun.style("background-image", "radial-gradient(circle, #62fc03 , #03e3fc)");
  rerun.style(
    "box-shadow",
    "0 12px 16px 0 rgba(0,0,0,0.24), 0 40px 50px 0 rgba(0,0,0,0.19)"
  );
  rerun.style("transition-duration", "0.5s");
}

function changecolor12() {
  //set starting colour gradient
  rerun.style("background-image", "linear-gradient(red, yellow)");
  rerun.style("box-shadow", "none");
}

function changecolor2() {
  //setting the colour change and the shadow of the buttons upon mouseOver
  help.style("background-image", "radial-gradient(circle, #62fc03 , #03e3fc)");
  help.style(
    "box-shadow",
    "0 12px 16px 0 rgba(0,0,0,0.24), 0 40px 50px 0 rgba(0,0,0,0.19)"
  );
  help.style("transition-duration", "0.5s");
}

function changecolor22() {
  //set starting colour gradient
  help.style("background-image", "linear-gradient(red, yellow)");
  help.style("box-shadow", "none");
}
