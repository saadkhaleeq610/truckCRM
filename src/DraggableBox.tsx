// src/DraggableBox.js
import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function DraggableBox({ item, onUpdatePosition }) {
  const meshRef = useRef();
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(new THREE.Vector3());

  const handlePointerDown = (event) => {
    event.stopPropagation();
    setIsDragging(true);

    // Calculate the offset between the mouse position and the mesh position
    const intersectionPoint = event.point;
    const meshPosition = meshRef.current.position;
    setOffset(new THREE.Vector3().subVectors(meshPosition, intersectionPoint));

    // Change cursor to grabbing
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    setIsDragging(false);
    document.body.style.cursor = 'default';
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;

    event.stopPropagation();

    // Project the mouse position onto the container's plane (y=0)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(event.pointer, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    // Update the mesh position with offset
    const newPosition = new THREE.Vector3().addVectors(intersection, offset);

    // Constrain the position within the container bounds
    const containerWidth = 8; // Updated width
    const containerHeight = 4; // Updated height
    const containerDepth = 12; // Updated depth

    const halfWidth = containerWidth / 2 - item.width / 2;
    const halfDepth = containerDepth / 2 - item.depth / 2;
    const halfHeight = containerHeight / 2 - item.height / 2;

    newPosition.x = Math.max(-halfWidth, Math.min(newPosition.x, halfWidth));
    newPosition.z = Math.max(-halfDepth, Math.min(newPosition.z, halfDepth));
    newPosition.y = Math.max(item.height / 2, newPosition.y); // Keep items on the ground or stacked

    onUpdatePosition(item.id, [newPosition.x, newPosition.y, newPosition.z]);
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={item.position}
        scale={[item.width, item.height, item.depth]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={item.color} />
      </mesh>
      {/* Display the item name above the box */}
      <Text
        position={[item.position[0], item.position[1] + item.height / 2 + 0.2, item.position[2]]}
        fontSize={0.3}
        color="#000000"
        anchorX="center"
        anchorY="bottom"
      >
        {item.name}
      </Text>
    </group>
  );
}

export default DraggableBox;
    