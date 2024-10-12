// Wrap your code in an IIFE
(function () {
    // Matter.js module aliases
    const { Engine, World, Bodies } = Matter;

    // Create engine and world
    const engine = Engine.create();
    const world = engine.world;

    // Set up the SVG canvas
    const canvas = document.getElementById("simulationCanvas");
    const photons = [];

    // Create variables for H₂O molecule components
    let h2oMolecule = { oxygen: null, hydrogens: [], bonds: [] };

    // Variable to keep track of bending direction
    let bendingDirection = 1; // 1 for upward, -1 for downward
    let isBending = false; // Track if the molecule is currently bending

    // Variables to control bending speed
    let bendingInterval = 200; // Time in milliseconds between bends
    let lastBendTime = 0; // Variable to keep track of last bend time

    // Function to create an H₂O molecule
    function createH2OMolecule() {
        // Clear existing molecule if it exists
        canvas.innerHTML = '';

        // Create oxygen atom (circle)
        const oxygen = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        oxygen.setAttribute("cx", 400);
        oxygen.setAttribute("cy", 300);
        oxygen.setAttribute("r", 15);
        oxygen.setAttribute("fill", "red");
        canvas.appendChild(oxygen);
        h2oMolecule.oxygen = oxygen;

        // Create hydrogen atoms (circles)
        const hydrogen1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hydrogen1.setAttribute("cx", 370);
        hydrogen1.setAttribute("cy", 300);
        hydrogen1.setAttribute("r", 10);
        hydrogen1.setAttribute("fill", "black");
        canvas.appendChild(hydrogen1);
        h2oMolecule.hydrogens.push(hydrogen1);

        const hydrogen2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hydrogen2.setAttribute("cx", 430);
        hydrogen2.setAttribute("cy", 300);
        hydrogen2.setAttribute("r", 10);
        hydrogen2.setAttribute("fill", "black");
        canvas.appendChild(hydrogen2);
        h2oMolecule.hydrogens.push(hydrogen2);

        // Create bonds (lines)
        const bond1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bond1.setAttribute("x1", 370);
        bond1.setAttribute("y1", 300);
        bond1.setAttribute("x2", 400);
        bond1.setAttribute("y2", 300);
        bond1.classList.add("bond");
        bond1.setAttribute("stroke", "black");
        bond1.setAttribute("stroke-width", 5);
        canvas.appendChild(bond1);
        h2oMolecule.bonds.push(bond1);

        const bond2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bond2.setAttribute("x1", 430);
        bond2.setAttribute("y1", 300);
        bond2.setAttribute("x2", 400);
        bond2.setAttribute("y2", 300);
        bond2.classList.add("bond");
        bond2.setAttribute("stroke", "black");
        bond2.setAttribute("stroke-width", 5);
        canvas.appendChild(bond2);
        h2oMolecule.bonds.push(bond2);

        canvas.appendChild(oxygen);
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

    // Function to bend the bonds and move hydrogen atoms
    function bendBonds() {
        const angle = 20; // Degrees for bending
        const frequency = 10; // Amplitude of bending

        // Get current positions of hydrogen atoms
        const hydrogen1 = h2oMolecule.hydrogens[0];
        const hydrogen2 = h2oMolecule.hydrogens[1];
        const oxygen = h2oMolecule.oxygen;

        const oxygenX = parseFloat(oxygen.getAttribute("cx"));
        const oxygenY = parseFloat(oxygen.getAttribute("cy"));

        // Calculate new positions using trigonometry based on bending direction
        const newHydrogen1X = oxygenX - 30; // Fixed left position
        const newHydrogen2X = oxygenX + 30; // Fixed right position

        // Calculate new Y positions based on bending direction
        const newHydrogen1Y = oxygenY + (bendingDirection * frequency);
        const newHydrogen2Y = oxygenY + (bendingDirection * frequency);

        hydrogen1.setAttribute("cx", newHydrogen1X);
        hydrogen1.setAttribute("cy", newHydrogen1Y);

        hydrogen2.setAttribute("cx", newHydrogen2X);
        hydrogen2.setAttribute("cy", newHydrogen2Y);

        // Update bond positions
        h2oMolecule.bonds.forEach((bond, index) => {
            bond.setAttribute("x2", oxygen.getAttribute("cx"));
            bond.setAttribute("y2", oxygen.getAttribute("cy"));
            if (index === 0) {
                bond.setAttribute("x1", newHydrogen1X);
                bond.setAttribute("y1", newHydrogen1Y);
            } else {
                bond.setAttribute("x1", newHydrogen2X);
                bond.setAttribute("y1", newHydrogen2Y);
            }
        });

        // Toggle bending direction for next call
        bendingDirection *= -1; // Change direction
    }

    // Function to check for collisions
    function checkCollisions() {
        if (h2oMolecule.oxygen) {
            photons.forEach((photon, index) => {
                let cx = parseFloat(photon.getAttribute("cx"));
                // Check collision with oxygen and hydrogen atoms
                if ((cx >= 385 && cx <= 415) || (cx >= 355 && cx <= 375) || (cx >= 425 && cx <= 445)) {
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
    document.getElementById("addH2OButton").addEventListener("click", createH2OMolecule);
    document.getElementById("emitPhotonButton").addEventListener("click", emitPhoton);

    // Main update loop
    function update() {
        updatePhotons();
        checkCollisions();
        requestAnimationFrame(update);
    }

    // Start the update loop
    update();
})();
