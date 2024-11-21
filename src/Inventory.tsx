// src/Inventory.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface InventoryItem {
  name: string;
  quantity: number;
  unit: string;
}

const Inventory: React.FC = () => {
  const navigate = useNavigate(); // Import and use useNavigate
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [restockAmounts, setRestockAmounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/inventoryData.json');
        const data = await response.json();
        setInventory(data.inventory);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };
    fetchInventory();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleRestockChange = (itemName: string, amount: number) => {
    setRestockAmounts((prevAmounts) => ({
      ...prevAmounts,
      [itemName]: amount,
    }));
  };

  const handleRestock = (itemName: string) => {
    const amount = restockAmounts[itemName] || 0;
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity + amount } : item
      )
    );
    setRestockAmounts((prevAmounts) => ({ ...prevAmounts, [itemName]: 0 })); // Reset restock amount after updating
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="inventory">
      <button onClick={() => navigate('/launchpad')} className="back-arrow">
        ← Back to Launch Pad
      </button>
      <h2>Inventory</h2>
      <input
        type="text"
        placeholder="Search inventory..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredInventory.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity} {item.unit}
            <input
              type="number"
              min="1"
              placeholder="Amount"
              value={restockAmounts[item.name] || ''}
              onChange={(e) => handleRestockChange(item.name, Number(e.target.value))}
              style={{ marginLeft: '10px', width: '80px' }}
            />
            <button onClick={() => handleRestock(item.name)}>Restock</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
