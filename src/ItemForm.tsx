// src/ItemForm.js
import React, { useState } from 'react';

function ItemForm({ onAddItem }) {
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [depth, setDepth] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('#0000ff'); // Default color: blue
  const [name, setName] = useState(''); // New state for item name

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('Please enter a name for the item.');
      return;
    }
    const itemVolume = width * height * depth * quantity;
    onAddItem({ width, height, depth, quantity, volume: itemVolume, color, name });
    setName(''); // Reset name after submission
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div>
        <label>Width: </label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Math.max(0.1, parseFloat(e.target.value)))}
          min="0.1"
          step="0.1"
          required
        />
      </div>
      <div>
        <label>Height: </label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Math.max(0.1, parseFloat(e.target.value)))}
          min="0.1"
          step="0.1"
          required
        />
      </div>
      <div>
        <label>Depth: </label>
        <input
          type="number"
          value={depth}
          onChange={(e) => setDepth(Math.max(0.1, parseFloat(e.target.value)))}
          min="0.1"
          step="0.1"
          required
        />
      </div>
      <div>
        <label>Quantity: </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          min="1"
          required
        />
      </div>
      <div>
        <label>Color: </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
          required
        />
      </div>
      <button type="submit">Add Item</button>
    </form>
  );
}

export default ItemForm;
