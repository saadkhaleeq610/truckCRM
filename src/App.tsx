import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// A component to represent the truck container
function TruckContainer({ items, totalVolume }) {
  const width = 4;
  const height = 2;
  const depth = 6;

  return (
    <>
      {/* Outer box representing the truck container */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="lightblue" wireframe />
      </mesh>

      {/* Render each item inside the container */}
      {items.map((item, index) => (
        <mesh
          key={index}
          position={item.position}
          scale={[item.width, item.height, item.depth]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      ))}
    </>
  );
}

// Form component for adding items
function ItemForm({ onAddItem }) {
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [depth, setDepth] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemVolume = width * height * depth * quantity;
    onAddItem({ width, height, depth, quantity, volume: itemVolume });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div>
        <label>Width: </label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Math.max(1, e.target.value))}
          min="1"
        />
      </div>
      <div>
        <label>Height: </label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Math.max(1, e.target.value))}
          min="1"
        />
      </div>
      <div>
        <label>Depth: </label>
        <input
          type="number"
          value={depth}
          onChange={(e) => setDepth(Math.max(1, e.target.value))}
          min="1"
        />
      </div>
      <div>
        <label>Quantity: </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, e.target.value))}
          min="1"
        />
      </div>
      <button type="submit">Add Item</button>
    </form>
  );
}

function App() {
  const totalVolume = 48; // Total volume of the truck container
  const [occupiedVolume, setOccupiedVolume] = useState(0);
  const [items, setItems] = useState([]);

  // Add the item to the list of items in the container
  const addItem = ({ width, height, depth, quantity, volume }) => {
    const newOccupiedVolume = occupiedVolume + volume;
    
    // Check if there's enough space
    if (newOccupiedVolume > totalVolume) {
      alert("Not enough space in the container!");
      return;
    }

    // Create new items and place them inside the container
    const newItems = [];
    for (let i = 0; i < quantity; i++) {
      const position = calculatePosition(items, width, height, depth); // Calculate a position for each new item
      newItems.push({ width, height, depth, position });
    }

    setItems([...items, ...newItems]);
    setOccupiedVolume(newOccupiedVolume);
  };

  // Simple function to calculate where to place the item based on existing ones
  const calculatePosition = (existingItems, width, height, depth) => {
    const containerWidth = 4;
    const containerHeight = 2;
    const containerDepth = 6;

    // Basic logic: Start placing items from the bottom left corner and stack along the z-axis, then x, then y
    let x = 0, y = 0, z = 0;

    // Iterate through existing items to find the next free position
    for (const item of existingItems) {
      x += item.width;
      if (x + width > containerWidth) {
        x = 0;
        z += item.depth;
        if (z + depth > containerDepth) {
          z = 0;
          y += item.height;
        }
      }
    }

    // If the calculated y exceeds container height, prevent placing more items
    if (y + height > containerHeight) {
      alert("Not enough vertical space for this item!");
      return [0, 0, 0]; // Reset the position to indicate an error
    }

    return [x + width / 2 - containerWidth / 2, y + height / 2, z + depth / 2 - containerDepth / 2];
  };

  return (
    <>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <TruckContainer items={items} totalVolume={totalVolume} />
        <OrbitControls />
      </Canvas>

      <div style={{ padding: '20px' }}>
        <h2>Truck Container</h2>
        <p>Occupied Volume: {occupiedVolume} / {totalVolume} cubic units</p>

        {/* Render the form to input item dimensions and quantity */}
        <ItemForm onAddItem={addItem} />

        <button onClick={() => { setOccupiedVolume(0); setItems([]); }} style={{ marginTop: '10px' }}>Reset</button>
      </div>
    </>
  );
}

export default App;
