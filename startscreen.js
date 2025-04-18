let simstarted = false;
let bgpic; 
let rerun;
let maxmaterialslider;
let neutronsreleasedslider;
let neutronspeedslider;

let sizewidthselect; 
let sizeheightselect;
let fissilematerialselect;

let fragmentcountslider; 

let fragmentfissionswitch; 

function preload() {
  bgpic = loadImage("explosion.jpg");
  
}

function startsim() {
  simstarted = true
  noStroke();
  // Initialize fissile material
  for (let i = 0; i < MAX_MATERIAL; i++) {
    fissileMaterial.push(createVector(random(3*width/5), random(height)));
  }
  // Initialize with some neutrons
  //spawnNeutrons(5);
  
  
  
}
function startscreen() {
  fill("blue")
  noStroke()
  rect(3*width/5, 0, 2*width/5, height)
  fill("red")
  textAlign(CENTER)
  text("Nuclear Fission Simulator", 4*width/5 , 30)
  //rect(0,3*height/5, 3*width/5, 2*width/5 )
}

function rerunbutton() {
  rerun = createButton("Play")
  rerun.position(4*width/5, 60)
  rerun.addClass("mybutton")
  rerun.size(100,50)
  rerun.mouseOver(changecolor1);
  rerun.mouseOut(changecolor12);
  rerun.mousePressed(rerunfunc);
  
}

function customisation() {
  maxmaterialslider = createSlider(200, 3200, 800)
  maxmaterialslider.position(3*width/5 + 20, height/3)
 
  neutronspeedslider = createSlider(0.1, 5, 2.0, 0.1)
  neutronspeedslider.position(3*width/5 + 20, height/3 + 40)
  
  neutronsreleasedslider = createSlider(1, 5, 1)
  neutronsreleasedslider.position(3*width/5 + 20, height/3 +80)
  
  
  fragmentcountslider = createSlider(1, 5, fragmentcount)
  fragmentcountslider.position(3*width/5 + 20, height/3 + 120)
  
  fragmentfissionswitch = createCheckbox('Enable fission of fragments (Performance intensive)', false)
  fragmentfissionswitch.position(3*width/5 + 20, height/3 + 160)
  
  
  
  sizewidthselect = createSelect()
  sizewidthselect.position(3*width/5 + 20, height/3 - 50)
  sizewidthselect.size(100,30)
  sizewidthselect.option('default', 3*width/5)
  sizewidthselect.option('small', width/2)
  sizewidthselect.option('x-small', width/3)
  sizewidthselect.option('xx-small', width/5)
  sizewidthselect.selected('default')
  
  sizeheightselect = createSelect()
  sizeheightselect.size(100,30)
  sizeheightselect.position(3*width/5 + 150, height/3 - 50)
  sizeheightselect.option('default.', height)
  sizeheightselect.option('small.', 2*height/3)
  sizeheightselect.option('x-small.', height/2)
  sizeheightselect.option('xx-small.', height/3)
  sizeheightselect.selected('default.')
  
  fissilematerialselect = createSelect()
  fissilematerialselect.size(120,30)
  fissilematerialselect.position(3*width/5 + 150, height/3 - 130)
  fissilematerialselect.option('U-235(default)', 2)
  fissilematerialselect.option('Pu-239', 3)
  fissilematerialselect.option('U-233', 2)
  fissilematerialselect.option('Custom', 1)
  fissilematerialselect.selected('U-235(default)')
  
  
    
  
}




function rerunfunc() {
  for (let i = fissileMaterial.length; i > -1; i--) {
    fissileMaterial.splice(i, 1)
  }
  for (let i = neutrons.length; i > -1; i--) {
    neutrons.splice(i, 1)
    neutrontotal-= 1
  }
  for (let i = fissionFragments.length; i > -1; i--) {
    fissionFragments.splice(i, 1)
  }
  for (let i = fissionFragments2.length; i > -1; i--) {
    fissionFragments2.splice(i, 1)
  }
  for (let i = fissileMaterial.length; i < MAX_MATERIAL; i++) {
    fissileMaterial.push(createVector(random(sizewidthselect.selected()), random(sizeheightselect.selected())));
    
}
  neutrontotal = 0
  energy = 0
  timerstart = false
  oldtimer = round(timer/30,2)
  timer = 0
}
function changecolor1() {
  //setting the colour change and the shadow of the buttons upon mouseOver
  rerun.style("background-image", "radial-gradient(circle, #62fc03 , #03e3fc)");
  rerun.style("box-shadow", "0 12px 16px 0 rgba(0,0,0,0.24), 0 40px 50px 0 rgba(0,0,0,0.19)");
  rerun.style("transition-duration", "0.5s");
}

function changecolor12() {
  //set starting colour gradient
  rerun.style("background-image", "linear-gradient(red, yellow)");
  rerun.style("box-shadow", "none");
}
