(function () {
    // Matter.js module aliases
    const { Engine, World, Bodies } = Matter;

    // Create engine and world
    const engine = Engine.create();
    const world = engine.world;

    // Set up the SVG canvas
    const canvas = document.getElementById("simulationCanvas");

    // Create variables for O2 molecule components
    let o2Molecule = { oxygen1: null, oxygen2: null, bonds: [] };

    // Function to create an O2 molecule
    function createO2Molecule() {
        // Clear existing molecule if it exists
        canvas.innerHTML = '';

        // Create first oxygen atom (circle)
        const oxygen1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        oxygen1.setAttribute("cx", 400);
        oxygen1.setAttribute("cy", 300);
        oxygen1.setAttribute("r", 15);
        oxygen1.setAttribute("fill", "green"); // Oxygen is typically represented as green
        canvas.appendChild(oxygen1);
        o2Molecule.oxygen1 = oxygen1;

        // Create second oxygen atom (circle)
        const oxygen2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        oxygen2.setAttribute("cx", 450); // Initial position, 50 units away from oxygen1
        oxygen2.setAttribute("cy", 300);
        oxygen2.setAttribute("r", 15);
        oxygen2.setAttribute("fill", "green");
        canvas.appendChild(oxygen2);
        o2Molecule.oxygen2 = oxygen2;

        // Create two bonds (lines) for the double bond between oxygen atoms
        const bondOffsets = [-4, 4]; // Slight vertical offset for multiple bonds
        o2Molecule.bonds = bondOffsets.map(offset => {
            const bond = document.createElementNS("http://www.w3.org/2000/svg", "line");
            bond.setAttribute("x1", 400);
            bond.setAttribute("y1", 300 + offset); // Slight vertical offset for the two bonds
            bond.setAttribute("x2", 450);
            bond.setAttribute("y2", 300 + offset);
            bond.setAttribute("stroke", "green"); // Bonds in O2 are shown as green
            bond.setAttribute("stroke-width", 4);
            canvas.appendChild(bond);
            return bond;
        });

        // Append the oxygen atoms
        canvas.appendChild(oxygen1);
        canvas.appendChild(oxygen2);
    }

    // Button event listener for adding O2 molecule
    document.getElementById("addO2Button").addEventListener("click", createO2Molecule);
})();
