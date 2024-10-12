// Matter.js module aliases
const { Engine, World, Bodies } = Matter;

// Create engine and world
const engine = Engine.create();
const world = engine.world;

// Set up the SVG canvas
const canvas = document.getElementById("simulationCanvas");
const photons = [];

// Create variables for CO₂ molecule components
let co2Molecule = { carbon: null, oxygens: [], bonds: [] };

// Variable to keep track of bending direction
let bendingDirection = 1; // 1 for upward, -1 for downward
let isBending = false; // Track if the molecule is currently bending

// Variables to control bending speed
let bendingInterval = 200; // Time in milliseconds between bends
let lastBendTime = 0; // Variable to keep track of last bend time


// Function to create a CO₂ molecule
function createCO2Molecule() {
    // Clear existing molecule if it exists
    canvas.innerHTML = '';

    // Create carbon atom (circle)
    const carbon = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    carbon.setAttribute("cx", 400);
    carbon.setAttribute("cy", 300);
    carbon.setAttribute("r", 15);
    carbon.setAttribute("fill", "black");
    canvas.appendChild(carbon);
    co2Molecule.carbon = carbon;

    // Create oxygen atoms (circles)
    const oxygen1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    oxygen1.setAttribute("cx", 350);
    oxygen1.setAttribute("cy", 300);
    oxygen1.setAttribute("r", 10);
    oxygen1.setAttribute("fill", "green");
    canvas.appendChild(oxygen1);
    co2Molecule.oxygens.push(oxygen1);

    const oxygen2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    oxygen2.setAttribute("cx", 450);
    oxygen2.setAttribute("cy", 300);
    oxygen2.setAttribute("r", 10);
    oxygen2.setAttribute("fill", "green");
    canvas.appendChild(oxygen2);
    co2Molecule.oxygens.push(oxygen2);

    // Create bonds (lines)
    const bond1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    bond1.setAttribute("x1", 350);
    bond1.setAttribute("y1", 300);
    bond1.setAttribute("x2", 400);
    bond1.setAttribute("y2", 300);
    bond1.classList.add("bond");
    bond1.setAttribute("stroke", "green");
    bond1.setAttribute("stroke-width", 7);
    canvas.appendChild(bond1);
    co2Molecule.bonds.push(bond1);

    const bond2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    bond2.setAttribute("x1", 450);
    bond2.setAttribute("y1", 300);
    bond2.setAttribute("x2", 400);
    bond2.setAttribute("y2", 300);
    bond2.classList.add("bond");
    bond2.setAttribute("stroke", "green");
    bond2.setAttribute("stroke-width", 8);
    canvas.appendChild(bond2);
    co2Molecule.bonds.push(bond2);

    canvas.appendChild(carbon);
}

// Function to emit photons
function emitPhoton() {
    const photon = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    photon.setAttribute("cx", 0);
    photon.setAttribute("cy", 300);
    photon.setAttribute("r", 5);
    photon.setAttribute("fill", "yellow");
    canvas.appendChild(photon);
    photons.push(photon);
}

// Function to update the position of photons
function updatePhotons() {
    photons.forEach((photon, index) => {
        let cx = parseFloat(photon.getAttribute("cx"));
        cx += 5; // Move to the right
        // Prevent photons from going out of the canvas
        if (cx > canvas.clientWidth) {
            // Reset position if it goes out of bounds
            cx = 0;
        }
        photon.setAttribute("cx", cx);
    });
}

// Function to bend the bonds and move oxygen atoms
function bendBonds() {
    const angle = 20; // Degrees for bending
    const frequency = 10; // Amplitude of bending

    // Get current positions of oxygen atoms
    const oxygen1 = co2Molecule.oxygens[0];
    const oxygen2 = co2Molecule.oxygens[1];
    const carbon = co2Molecule.carbon;

    const carbonX = parseFloat(carbon.getAttribute("cx"));
    const carbonY = parseFloat(carbon.getAttribute("cy"));

    // Calculate new positions using trigonometry based on bending direction
    const newOxygen1X = carbonX - 50; // Fixed left position
    const newOxygen2X = carbonX + 50; // Fixed right position

    // Calculate new Y positions based on bending direction
    const newOxygen1Y = carbonY + (bendingDirection * frequency);
    const newOxygen2Y = carbonY + (bendingDirection * frequency);

    oxygen1.setAttribute("cx", newOxygen1X);
    oxygen1.setAttribute("cy", newOxygen1Y);

    oxygen2.setAttribute("cx", newOxygen2X);
    oxygen2.setAttribute("cy", newOxygen2Y);

    // Update bond positions
    co2Molecule.bonds.forEach((bond, index) => {
        bond.setAttribute("x2", carbon.getAttribute("cx"));
        bond.setAttribute("y2", carbon.getAttribute("cy"));
        if (index === 0) {
            bond.setAttribute("x1", newOxygen1X);
            bond.setAttribute("y1", newOxygen1Y);
        } else {
            bond.setAttribute("x1", newOxygen2X);
            bond.setAttribute("y1", newOxygen2Y);
        }
    });

    // Toggle bending direction for next call
    bendingDirection *= -1; // Change direction
}

// Function to check for collisions
function checkCollisions() {
    if (co2Molecule.carbon) {
        photons.forEach((photon, index) => {
            let cx = parseFloat(photon.getAttribute("cx"));
            // Check collision with carbon and oxygen atoms
            if ((cx >= 385 && cx <= 415) || (cx >= 335 && cx <= 365) || (cx >= 435 && cx <= 465)) {
                // Start bending the bonds continuously
                if (!isBending) {
                    isBending = true; // Set bending state
                    continuousBending(); // Start bending animation
                }

                // Remove the photon after collision
                canvas.removeChild(photon);
                photons.splice(index, 1);
            }
        });
    }
}

// Function for continuous bending animation
function continuousBending(timestamp) {
    if (isBending) {
        if (timestamp - lastBendTime > bendingInterval) {
            bendBonds(); // Call bending function
            lastBendTime = timestamp; // Update last bend time
        }
        requestAnimationFrame(continuousBending); // Continue bending
    }
}

// Button event listeners
document.getElementById("addCO2Button").addEventListener("click", createCO2Molecule);
document.getElementById("emitPhotonButton").addEventListener("click", emitPhoton);

// Main update loop
function update() {
    updatePhotons();
    checkCollisions();
    updateFrame = requestAnimationFrame(update); // Store frame ID

}

// Start the update loop
update();
