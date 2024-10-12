// Assume that the animations are controlled by requestAnimationFrame or setTimeout/setInterval

let photonMovementAnimationID; // for photon movement animation
let bondStretchingAnimationID;  // for bond stretching animation
let bondRotationAnimationID;    // for molecule rotation animation

// Example: Your animation loop function using requestAnimationFrame()
function photonMovement() {
    if (isEmitting) {
        // Do photon movement here
        photonMovementAnimationID = requestAnimationFrame(photonMovement); // Recursively call the animation
    }
}

// Example: Molecule rotation animation
function rotateMolecule() {
    if (isRotating) {
        // Rotate the molecule here
        bondRotationAnimationID = requestAnimationFrame(rotateMolecule); // Continue rotation
    }
}

// Function to reset the simulation
function resetSimulation() {
    // Stop all animations by canceling requestAnimationFrame loops
    cancelAnimationFrame(photonMovementAnimationID);  // Stop photon movement
    cancelAnimationFrame(bondStretchingAnimationID);  // Stop bond stretching
    cancelAnimationFrame(bondRotationAnimationID);    // Stop molecule rotation
    cancelAnimationFrame(continuousBendingFrame);     // Stop bending animation
    cancelAnimationFrame(updateFrame);                // Stop any other update

    // Stop emitting photons (IR or microwave)
    isEmitting = false;
    isStretching = false; // Stop stretching
    isRotating = false;   // Stop rotating
    isBending = false;    // Stop bending

    // Clear the canvas and photon array
    canvas.innerHTML = ''; // Remove all elements in the canvas
    photons.length = 0;    // Clear the photons array

    // Reset molecule structures
    co2Molecule = { carbon: null, oxygens: [], bonds: [] };
    coMolecule = { carbon: null, oxygen: null, bonds: [] };
    n2Molecule = { nitrogen1: null, nitrogen2: null, bonds: [] };
    nhMolecule = { nitrogen: null, hydrogens: [], bonds: [] };
    no2Molecule = { nitrogen: null, oxygens: [], bonds: [] };
    o2Molecule = { oxygen1: null, oxygen2: null, bonds: [] };
    h2oMolecule = { oxygen: null, hydrogens: [], bonds: [] };

    // Reset bending state variables
    bendingDirection = 1; // Reset bending direction
    lastBendTime = 0;     // Reset last bend time

    // Optionally remove event listeners (if necessary)
    // document.getElementById("resetButton").removeEventListener("click", resetSimulation);
}

// Add event listener to the reset button
document.getElementById("resetButton").addEventListener("click", resetSimulation);
