let nuclei = [];
let neutrons = [];
let fragments = [];

function setup() {
    createCanvas(800, 600);
    background(0);

    // Create initial nuclei
    for (let i = 0; i < 40; i++) {
        nuclei.push(new Nucleus(random(width), random(height)));
    }
}

function draw() {
    background(0);

    // Update and display nuclei
    for (let i = nuclei.length - 1; i >= 0; i--) {
        nuclei[i].display();
        nuclei[i].update();

        // Check for fission
        if (nuclei[i].isTriggered()) {
            let newFragments = nuclei[i].fission();
            fragments = fragments.concat(newFragments);
            nuclei.splice(i, 1);
        }
    }

    // Display and update fragments
    for (let i = fragments.length - 1; i >= 0; i--) {
        fragments[i].display();
        fragments[i].update();
        if (fragments[i].isOutOfBounds()) {
            fragments.splice(i, 1);
        }
    }

    // Display and update neutrons
    for (let i = neutrons.length - 1; i >= 0; i--) {
        neutrons[i].display();
        neutrons[i].update();
        if (neutrons[i].isOutOfBounds()) {
            neutrons.splice(i, 1);
        }
    }
}

function mousePressed() {
    // Add a neutron to the canvas
    neutrons.push(new Neutron(mouseX, mouseY));
}


class Nucleus {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.triggered = false;
    }

    display() {
        fill(255);
        ellipse(this.x, this.y, this.radius * 2);
    }

    update() {
        // maybe ill add later
    }

    isTriggered() {
        // Check if a neutron has hit the nucleus
        return this.triggered;
    }

    fission() {
        // simulate fission by creating fragments
        let fragments = [];
        for (let i = 0; i < 40; i++) {
            fragments.push(new Fragment(this.x, this.y));
        }
        return fragments;
    }
}


class Neutron {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.speed = 5;
    }

    display() {
        fill(0, 255, 0);
        ellipse(this.x, this.y, this.radius * 2);
    }

    update() {
        //neutron in a random direction
        this.x += random(-this.speed, this.speed);
        this.y += random(-this.speed, this.speed);

        // check for collisions with nuclei
        for (let nucleus of nuclei) {
            let d = dist(this.x, this.y, nucleus.x, nucleus.y);
            if (d < nucleus.radius) {
                nucleus.triggered = true;
            }
        }
    }

    isOutOfBounds() {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }
}


class Fragment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = random(1, 3);
    }

    display() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.radius * 2);
    }

    update() {
        // Move fragment away from the fission point
        let angle = random(TWO_PI);
        this.x += cos(angle) * this.speed;
        this.y += sin(angle) * this.speed;
    }

    isOutOfBounds() {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }
}
