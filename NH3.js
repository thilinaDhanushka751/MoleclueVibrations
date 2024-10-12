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

    // Create variables for NH molecule components
    let nhMolecule = { nitrogen: null, hydrogens: [], bonds: [] };

    // Variables for bond stretching
    let stretchingFactor = 0; // Controls how much the bond stretches
    let stretchingSpeed = 1; // Speed of stretching and contracting
    let isVibrating = false; // Flag to check if the molecule should vibrate

    // Function to create an NH molecule
    function createNHMolecule() {
        // Clear existing molecule if it exists
        canvas.innerHTML = '';

        // Create nitrogen atom (circle)
        const nitrogen = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        nitrogen.setAttribute("cx", 400); // Center position
        nitrogen.setAttribute("cy", 300);
        nitrogen.setAttribute("r", 15);
        nitrogen.setAttribute("fill", "blue");
        canvas.appendChild(nitrogen);
        nhMolecule.nitrogen = nitrogen;

        // Create hydrogen atoms (circles) around nitrogen
        const hydrogen1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hydrogen1.setAttribute("cx", 360); // Left hydrogen
        hydrogen1.setAttribute("cy", 340);
        hydrogen1.setAttribute("r", 10);
        hydrogen1.setAttribute("fill", "green");
        canvas.appendChild(hydrogen1);
        nhMolecule.hydrogens.push(hydrogen1);

        const hydrogen2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hydrogen2.setAttribute("cx", 400); // Right hydrogen
        hydrogen2.setAttribute("cy", 370);
        hydrogen2.setAttribute("r", 10);
        hydrogen2.setAttribute("fill", "green");
        canvas.appendChild(hydrogen2);
        nhMolecule.hydrogens.push(hydrogen2);

        const hydrogen3 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        hydrogen3.setAttribute("cx", 440); // Top hydrogen
        hydrogen3.setAttribute("cy", 340);
        hydrogen3.setAttribute("r", 10);
        hydrogen3.setAttribute("fill", "green");
        canvas.appendChild(hydrogen3);
        nhMolecule.hydrogens.push(hydrogen3);

        // Create bonds (lines) from nitrogen to each hydrogen
        const bond1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bond1.setAttribute("x1", 360); // Left hydrogen
        bond1.setAttribute("y1", 340);
        bond1.setAttribute("x2", 400); // Nitrogen
        bond1.setAttribute("y2", 300);
        bond1.classList.add("bond");
        bond1.setAttribute("stroke", "green");
        bond1.setAttribute("stroke-width", 5);
        canvas.appendChild(bond1);
        nhMolecule.bonds.push(bond1);

        const bond2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bond2.setAttribute("x1", 400); // Right hydrogen
        bond2.setAttribute("y1", 370);
        bond2.setAttribute("x2", 400); // Nitrogen
        bond2.setAttribute("y2", 300);
        bond2.classList.add("bond");
        bond2.setAttribute("stroke", "green");
        bond2.setAttribute("stroke-width", 5);
        canvas.appendChild(bond2);
        nhMolecule.bonds.push(bond2);

        const bond3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bond3.setAttribute("x1", 440); // Top hydrogen
        bond3.setAttribute("y1", 340);
        bond3.setAttribute("x2", 400); // Nitrogen
        bond3.setAttribute("y2", 300);
        bond3.classList.add("bond");
        bond3.setAttribute("stroke", "green");
        bond3.setAttribute("stroke-width", 5);
        canvas.appendChild(bond3);
        nhMolecule.bonds.push(bond3);

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

    // Function to stretch and vibrate the bonds
    function stretchBonds() {
        // Calculate new positions of hydrogen atoms based on stretching factor
        const nitrogen = nhMolecule.nitrogen;

        const nitrogenX = parseFloat(nitrogen.getAttribute("cx"));
        const nitrogenY = parseFloat(nitrogen.getAttribute("cy"));

        // Stretch hydrogen atoms horizontally while moving in opposite directions
        const hydrogen1 = nhMolecule.hydrogens[0];
        const hydrogen2 = nhMolecule.hydrogens[1];
        const hydrogen3 = nhMolecule.hydrogens[2]; // Include the third hydrogen

        // Calculate the new x positions for each hydrogen
        const h1NewX = nitrogenX - (30 + stretchingFactor);
        const h2NewX = nitrogenX + (30 + stretchingFactor);
        const h3NewX = nitrogenX + (15 + stretchingFactor); // Adjust this for the 3rd hydrogen

        // Update hydrogen positions
        hydrogen1.setAttribute("cx", h1NewX);
        hydrogen2.setAttribute("cx", h2NewX);
        hydrogen3.setAttribute("cx", h3NewX);

        // Update bond positions
        nhMolecule.bonds.forEach((bond, index) => {
            bond.setAttribute("x2", nitrogen.getAttribute("cx"));
            bond.setAttribute("y2", nitrogen.getAttribute("cy"));

            if (index === 0) {
                bond.setAttribute("x1", hydrogen1.getAttribute("cx"));
                bond.setAttribute("y1", hydrogen1.getAttribute("cy"));
            } else if (index === 1) {
                bond.setAttribute("x1", hydrogen2.getAttribute("cx"));
                bond.setAttribute("y1", hydrogen2.getAttribute("cy"));
            } else if (index === 2) {
                bond.setAttribute("x1", hydrogen3.getAttribute("cx"));
                bond.setAttribute("y1", hydrogen3.getAttribute("cy"));
            }
        });

        // Adjust stretching factor for next stretch
        stretchingFactor += stretchingSpeed;
        if (stretchingFactor > 10 || stretchingFactor < -10) {
            stretchingSpeed *= -1; // Change direction
        }
    }

    // Function to check for collisions
    function checkCollisions() {
        if (nhMolecule.nitrogen) {
            photons.forEach((photon, index) => {
                let cx = parseFloat(photon.getAttribute("cx"));
                // Check collision with nitrogen and hydrogen atoms
                if ((cx >= 385 && cx <= 415) || (cx >= 355 && cx <= 375) || (cx >= 425 && cx <= 445)) {
                    // Start vibrating the bonds continuously
                    isVibrating = true; // Set the flag to true

                    // Remove the photon after collision
                    canvas.removeChild(photon);
                    photons.splice(index, 1);
                }
            });
        }
    }

    // Button event listeners
    document.getElementById("addNHButton").addEventListener("click", createNHMolecule);
    document.getElementById("emitPhotonButton").addEventListener("click", emitPhoton);

    // Main update loop
    function update() {
        updatePhotons();
        checkCollisions();
        
        // Continuously stretch bonds if vibrating
        if (isVibrating) {
            stretchBonds();
        }

        requestAnimationFrame(update);
    }

    // Start the update loop
    update();
})();
