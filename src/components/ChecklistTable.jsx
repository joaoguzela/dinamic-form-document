import { useState } from 'react';

const initialItems = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

export default function ChecklistTable() {
  const [items, setItems] = useState(
    initialItems.map(item => ({ ...item, checked: false }))
  );

  const toggle = (id) => {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Feito</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggle(item.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
