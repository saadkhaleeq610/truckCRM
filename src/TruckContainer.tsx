import React from 'react';
import DraggableBox from './DraggableBox';

function TruckContainer({ items, totalVolume, onUpdatePosition }) {
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

      {/* Render each draggable item inside the container */}
      {items.map((item) => (
        <DraggableBox key={item.id} item={item} onUpdatePosition={onUpdatePosition} />
      ))}
    </>
  );
}

export default TruckContainer;
