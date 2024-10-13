import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TruckContainer from './TruckContainer';
import ItemForm from './ItemForm';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const totalVolume = 48;
  const [occupiedVolume, setOccupiedVolume] = useState(0);
  const [items, setItems] = useState([]);

  const addItem = ({ width, height, depth, quantity, volume, color }) => {
    const newOccupiedVolume = occupiedVolume + volume;

    if (newOccupiedVolume > totalVolume) {
      alert('Not enough space in the container!');
      return;
    }

    const newItems = [];
    for (let i = 0; i < quantity; i++) {
      const position = calculatePosition(items, width, height, depth);
      if (!position) {
        alert('Cannot place more items due to space constraints!');
        break;
      }
      newItems.push({
        id: uuidv4(),
        width,
        height,
        depth,
        position,
        color, 
      });
    }

    setItems([...items, ...newItems]);
    setOccupiedVolume(
      prev =>
        prev + newItems.reduce((acc, item) => acc + item.width * item.height * item.depth, 0)
    );
  };

  const calculatePosition = (existingItems, width, height, depth) => {
    const containerWidth = 4;
    const containerHeight = 2;
    const containerDepth = 6;


    const gridSize = 1; 

    const gridColumns = Math.floor(containerWidth / gridSize);
    const gridRows = Math.floor(containerDepth / gridSize);

    const heightMap = Array.from({ length: gridColumns }, () =>
      Array.from({ length: gridRows }, () => 0)
    );

    existingItems.forEach(item => {
      const gridX = Math.floor((item.position[0] + containerWidth / 2) / gridSize);
      const gridZ = Math.floor((item.position[2] + containerDepth / 2) / gridSize);
      if (gridX >= 0 && gridX < gridColumns && gridZ >= 0 && gridZ < gridRows) {
        const itemTop = item.position[1] + item.height / 2;
        if (itemTop > heightMap[gridX][gridZ]) {
          heightMap[gridX][gridZ] = itemTop;
        }
      }
    });

    for (let x = 0; x < gridColumns; x++) {
      for (let z = 0; z < gridRows; z++) {
        const currentHeight = heightMap[x][z];
        if (currentHeight + height <= containerHeight) {
          const posX = x * gridSize - containerWidth / 2 + gridSize / 2;
          const posY = currentHeight + height / 2;
          const posZ = z * gridSize - containerDepth / 2 + gridSize / 2;

          heightMap[x][z] += height;

          return [posX, posY, posZ];
        }
      }
    }

    return null;
  };

  const updateItemPosition = (id, newPosition) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, position: newPosition } : item))
    );
  };

  return (
    <>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <TruckContainer items={items} totalVolume={totalVolume} onUpdatePosition={updateItemPosition} />
        <OrbitControls />
      </Canvas>

      <div style={{ padding: '20px' }}>
        <h2>Truck Container</h2>
        <p>
          Occupied Volume: {occupiedVolume} / {totalVolume} cubic units
        </p>

        <ItemForm onAddItem={addItem} />

        <button
          onClick={() => {
            setOccupiedVolume(0);
            setItems([]);
          }}
          style={{ marginTop: '10px' }}
        >
          Reset
        </button>
      </div>
    </>
  );
}

export default App;