(function () {
    // Matter.js module aliases
    const { Engine, World, Bodies } = Matter;

    // Create engine and world
    const engine = Engine.create();
    const world = engine.world;

    // Set up the SVG canvas
    const canvas = document.getElementById("simulationCanvas");

    // Create variables for N2 molecule components
    let n2Molecule = { nitrogen1: null, nitrogen2: null, bonds: [] };

    // Function to create an N2 molecule
    function createN2Molecule() {
        // Clear existing molecule if it exists
        canvas.innerHTML = '';

        // Create first nitrogen atom (circle)
        const nitrogen1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        nitrogen1.setAttribute("cx", 400);
        nitrogen1.setAttribute("cy", 300);
        nitrogen1.setAttribute("r", 15);
        nitrogen1.setAttribute("fill", "blue"); // Nitrogen is typically represented as blue
        canvas.appendChild(nitrogen1);
        n2Molecule.nitrogen1 = nitrogen1;

        // Create second nitrogen atom (circle)
        const nitrogen2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        nitrogen2.setAttribute("cx", 450); // Initial position, 50 units away from nitrogen1
        nitrogen2.setAttribute("cy", 300);
        nitrogen2.setAttribute("r", 15);
        nitrogen2.setAttribute("fill", "blue");
        canvas.appendChild(nitrogen2);
        n2Molecule.nitrogen2 = nitrogen2;

        // Create three bonds (lines) for the triple bond between nitrogen atoms
        const bondOffsets = [-3, 0, 3]; // Slight vertical offset for multiple bonds
        n2Molecule.bonds = bondOffsets.map(offset => {
            const bond = document.createElementNS("http://www.w3.org/2000/svg", "line");
            bond.setAttribute("x1", 400);
            bond.setAttribute("y1", 300 + offset); // Slight vertical offset for the three bonds
            bond.setAttribute("x2", 450);
            bond.setAttribute("y2", 300 + offset);
            bond.setAttribute("stroke", "blue"); // Bonds in N2 are shown as blue
            bond.setAttribute("stroke-width", 4);
            canvas.appendChild(bond);
            return bond;
        });

        // Append the nitrogen atoms
        canvas.appendChild(nitrogen1);
        canvas.appendChild(nitrogen2);
    }

    // Button event listener for adding N2 molecule
    document.getElementById("addN2Button").addEventListener("click", createN2Molecule);
})();
