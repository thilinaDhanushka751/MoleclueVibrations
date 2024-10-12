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

    // Create variables for NO₂ molecule components
    let no2Molecule = { nitrogen: null, oxygens: [], bonds: [] };

    // Variable to keep track of bending direction
    let bendingDirection = 1; // 1 for upward, -1 for downward
    let isBending = false; // Track if the molecule is currently bending

    // Variables to control bending speed
    let bendingInterval = 200; // Time in milliseconds between bends
    let lastBendTime = 0; // Variable to keep track of last bend time
    

    // Function to create an NO₂ molecule
    function createNO2Molecule() {
        // Clear existing molecule if it exists
        canvas.innerHTML = '';

        // Create nitrogen atom (circle)
        const nitrogen = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        nitrogen.setAttribute("cx", 400);
        nitrogen.setAttribute("cy", 300);
        nitrogen.setAttribute("r", 15);
        nitrogen.setAttribute("fill", "blue");
        canvas.appendChild(nitrogen);
        no2Molecule.nitrogen = nitrogen;

        // Create oxygen atoms (circles)
        const oxygen1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        oxygen1.setAttribute("cx", 370);
        oxygen1.setAttribute("cy", 300);
        oxygen1.setAttribute("r", 10);
        oxygen1.setAttribute("fill", "red");
        canvas.appendChild(oxygen1);
        no2Molecule.oxygens.push(oxygen1);

        const oxygen2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        oxygen2.setAttribute("cx", 430);
        oxygen2.setAttribute("cy", 300);
        oxygen2.setAttribute("r", 10);
        oxygen2.setAttribute("fill", "red");
        canvas.appendChild(oxygen2);
        no2Molecule.oxygens.push(oxygen2);

        // Create bonds (lines)
        const bond1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bond1.setAttribute("x1", 370);
        bond1.setAttribute("y1", 300);
        bond1.setAttribute("x2", 400);
        bond1.setAttribute("y2", 300);
        bond1.classList.add("bond");
        bond1.setAttribute("stroke", "red");
        bond1.setAttribute("stroke-width", 8);
        canvas.appendChild(bond1);
        no2Molecule.bonds.push(bond1);

        const bond2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bond2.setAttribute("x1", 430);
        bond2.setAttribute("y1", 300);
        bond2.setAttribute("x2", 400);
        bond2.setAttribute("y2", 300);
        bond2.classList.add("bond");
        bond2.setAttribute("stroke", "red");
        bond2.setAttribute("stroke-width", 5);
        canvas.appendChild(bond2);
        no2Molecule.bonds.push(bond2);

        canvas.appendChild(nitrogen);
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
        const oxygen1 = no2Molecule.oxygens[0];
        const oxygen2 = no2Molecule.oxygens[1];
        const nitrogen = no2Molecule.nitrogen;

        const nitrogenX = parseFloat(nitrogen.getAttribute("cx"));
        const nitrogenY = parseFloat(nitrogen.getAttribute("cy"));

        // Calculate new positions using trigonometry based on bending direction
        const newOxygen1X = nitrogenX - 30; // Fixed left position
        const newOxygen2X = nitrogenX + 30; // Fixed right position

        // Calculate new Y positions based on bending direction
        const newOxygen1Y = nitrogenY + (bendingDirection * frequency);
        const newOxygen2Y = nitrogenY + (bendingDirection * frequency);

        oxygen1.setAttribute("cx", newOxygen1X);
        oxygen1.setAttribute("cy", newOxygen1Y);

        oxygen2.setAttribute("cx", newOxygen2X);
        oxygen2.setAttribute("cy", newOxygen2Y);

        // Update bond positions
        no2Molecule.bonds.forEach((bond, index) => {
            bond.setAttribute("x2", nitrogen.getAttribute("cx"));
            bond.setAttribute("y2", nitrogen.getAttribute("cy"));
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
        if (no2Molecule.nitrogen) {
            photons.forEach((photon, index) => {
                let cx = parseFloat(photon.getAttribute("cx"));
                // Check collision with nitrogen and oxygen atoms
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
    document.getElementById("addNO2Button").addEventListener("click", createNO2Molecule);
    document.getElementById("emitPhotonButton").addEventListener("click", emitPhoton);

    // Main update loop
    function update() {
        updatePhotons();
        checkCollisions();
        updateFrame = requestAnimationFrame(update); // Store frame ID

    }

    // Start the update loop
    update();
})();
