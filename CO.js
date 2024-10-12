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

    // Create variables for CO molecule components
    let coMolecule = { carbon: null, oxygen: null, bonds: [] };

    // Variable to control stretching direction
    let stretchingDirection = 1; // 1 for expanding, -1 for contracting
    let isStretching = false; // Track if the molecule is currently stretching

    // Variables to control stretching speed
    let stretchingInterval = 200; // Time in milliseconds between stretches
    let lastStretchTime = 0; // Variable to keep track of last stretch time

    // Variables for rotation
    let isRotating = false; // Track if the molecule is currently rotating
    let rotationAngle = 0; // Current rotation angle
    const rotationSpeed = 2; // Speed of rotation

   
    const bondLength = 50; // Length of the bond between Carbon and Oxygen

    // Function to create a CO molecule
    function createCOMolecule() {
        // Clear existing molecule if it exists
        canvas.innerHTML = '';

        // Create carbon atom (circle)
        const carbon = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        carbon.setAttribute("cx", 400);
        carbon.setAttribute("cy", 300);
        carbon.setAttribute("r", 15);
        carbon.setAttribute("fill", "black");
        canvas.appendChild(carbon);
        coMolecule.carbon = carbon;

        // Create oxygen atom (circle)
        const oxygen = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        oxygen.setAttribute("cx", 450); // Initial position, 30 units away from carbon
        oxygen.setAttribute("cy", 300);
        oxygen.setAttribute("r", 15);
        oxygen.setAttribute("fill", "red");
        canvas.appendChild(oxygen);
        coMolecule.oxygen = oxygen;

        // Create three bonds (lines) for the triple bond
        const bondOffsets = [-3, 0, 3]; // To position the three bonds
        coMolecule.bonds = bondOffsets.map(offset => {
            const bond = document.createElementNS("http://www.w3.org/2000/svg", "line");
            bond.setAttribute("x1", 400);
            bond.setAttribute("y1", 300 + offset); // Slight vertical offset for multiple bonds
            bond.setAttribute("x2", 450);
            bond.setAttribute("y2", 300 + offset);
            bond.setAttribute("stroke", "red");
            bond.setAttribute("stroke-width", 4);
            canvas.appendChild(bond);
            return bond;
        });
        canvas.appendChild(carbon);
    }

    // Function to emit photons
    function emitPhoton(type) {
        const photon = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        photon.setAttribute("cx", 0); // Start at x=0
        photon.setAttribute("cy", 300); // Fixed y-coordinate
        photon.setAttribute("r", 5); // Radius of the photon
        photon.setAttribute("fill", "green"); // Color of the photon
        
        // Assign the photon type using a custom attribute
        photon.setAttribute("data-type", type); // e.g., "IR" or "microwave"
        
        canvas.appendChild(photon); // Add the photon to the canvas
        photons.push(photon); // Add the photon to the array for tracking
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

    // Function to stretch the bond and move oxygen atom (x-axis vibration)
    function stretchBond() {
        const stretchDistance = 10; // Distance for stretching (expansion and contraction)
        const carbon = coMolecule.carbon;
        const oxygen = coMolecule.oxygen;

        // Get current positions of carbon and oxygen
        const carbonX = parseFloat(carbon.getAttribute("cx"));
        const oxygenX = parseFloat(oxygen.getAttribute("cx"));

        // Calculate new positions for stretching
        const newOxygenX = oxygenX + (stretchingDirection * stretchDistance);
        const newCarbonX = carbonX - (stretchingDirection * stretchDistance); // Move carbon in the opposite direction

        // Update oxygen position for the stretch
        oxygen.setAttribute("cx", newOxygenX);

        // Update carbon position for the stretch (opposite direction)
        carbon.setAttribute("cx", newCarbonX);

        // Update positions for all three bonds
        coMolecule.bonds.forEach((bond, index) => {
            const bondOffset = bond.getAttribute("y1") - 300; // Maintain vertical offset
            bond.setAttribute("x1", newCarbonX); // Carbon side of the bond
            bond.setAttribute("y1", 300 + bondOffset); // Maintain vertical alignment
            bond.setAttribute("x2", newOxygenX); // Oxygen side of the bond
            bond.setAttribute("y2", 300 + bondOffset); // Maintain vertical alignment
        });

        // Toggle stretching direction for next call
        stretchingDirection *= -1; // Change direction for expansion and contraction
    }

    // Function to rotate the CO molecule
    function rotateMolecule() {
        const carbon = coMolecule.carbon;
        const oxygen = coMolecule.oxygen;
    
        // Calculate the midpoint of the bond
        const midX = (parseFloat(carbon.getAttribute("cx")) + parseFloat(oxygen.getAttribute("cx"))) / 2;
        const midY = (parseFloat(carbon.getAttribute("cy")) + parseFloat(oxygen.getAttribute("cy"))) / 2;
    
        // Calculate new positions based on rotation around the midpoint
        const angleInRadians = rotationAngle * (Math.PI / 180);
    
        // Calculate new positions for carbon and oxygen
        const carbonX = midX + (bondLength / 2) * Math.cos(angleInRadians);
        const carbonY = midY + (bondLength / 2) * Math.sin(angleInRadians);
        const oxygenX = midX - (bondLength / 2) * Math.cos(angleInRadians);
        const oxygenY = midY - (bondLength / 2) * Math.sin(angleInRadians);
    
        // Update positions of carbon and oxygen
        carbon.setAttribute("cx", carbonX);
        carbon.setAttribute("cy", carbonY);
        oxygen.setAttribute("cx", oxygenX);
        oxygen.setAttribute("cy", oxygenY);
    
        // Update positions for all bonds
        coMolecule.bonds.forEach((bond) => {
            bond.setAttribute("x1", carbonX);
            bond.setAttribute("y1", carbonY);
            bond.setAttribute("x2", oxygenX);
            bond.setAttribute("y2", oxygenY);
        });
    
        // Update the rotation angle
        rotationAngle += rotationSpeed;
    
        // Reset angle to create a back-and-forth rotation effect
        if (rotationAngle >= 120 || rotationAngle <= -120) {
            rotationSpeed *= -1; // Reverse the direction of rotation
        }
    }

    // Function to check for collisions
    function checkCollisions() {
        if (coMolecule.carbon) {
            photons.forEach((photon, index) => {
                let cx = parseFloat(photon.getAttribute("cx"));
                let type = photon.getAttribute("data-type"); // Get the photon type
                
                // Check for IR photon (for stretching)
                if (type === "IR" && cx >= 385 && cx <= 415) {
                    if (!isStretching) {
                        isStretching = true; // Set stretching state
                        continuousStretching(); // Start stretching animation
                    }
    
                    // Remove the photon after collision
                    canvas.removeChild(photon);
                    photons.splice(index, 1);
                }
                // Check for microwave photon (for rotation)
                else if (type === "microwave" && cx >= 425 && cx <= 445) {
                    if (!isRotating) {
                        isRotating = true; // Set rotating state
                        continuousRotation(); // Start rotation animation
                    }
    
                    // Remove the photon after collision
                    canvas.removeChild(photon);
                    photons.splice(index, 1);
                }
            });
        }
    }
    
    

    // Function for continuous stretching animation
    function continuousStretching(timestamp) {
        if (isStretching) {
            if (timestamp - lastStretchTime > stretchingInterval) {
                stretchBond(); // Call stretching function
                lastStretchTime = timestamp; // Update last stretch time
            }
            requestAnimationFrame(continuousStretching); // Continue stretching
        } else {
            isStretching = false; // Reset stretching state
        }
    }

    // Function for continuous rotation animation
    function continuousRotation() {
        if (isRotating) {
            rotateMolecule(); // Rotate the molecule
            requestAnimationFrame(continuousRotation); // Continue rotating
        } else {
            isRotating = false; // Reset rotating state
        }
    }
    

    // Button event listeners
    document.getElementById("addCOButton").addEventListener("click", createCOMolecule);
    document.getElementById("emitPhotonButton").addEventListener("click", () => emitPhoton("IR")); // Emit an IR photon
    document.getElementById("microwaveBtn").addEventListener("click", () => emitPhoton("microwave")); // Emit a microwave photon


    // Main simulation loop
    function simulate() {
        updatePhotons(); // Update photon positions
        checkCollisions(); // Check for collisions
        Engine.update(engine); // Update Matter.js engine
        requestAnimationFrame(simulate); // Loop the simulation
    }

    // Start the simulation
    simulate();
})();
