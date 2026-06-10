export const uid = () => Math.random().toString(36).slice(2, 10);

export const esc = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function createField(type) {
  const labels = { text: 'Campo de Texto', checkbox: 'Checkbox', table: 'Tabela' };
  const base = { id: uid(), type, label: labels[type] ?? type };
  if (type === 'table') {
    const c1 = uid(), c2 = uid();
    const cols = [
      { id: c1, name: 'Coluna 1', cellType: 'input' },
      { id: c2, name: 'Coluna 2', cellType: 'checkbox' },
    ];
    return {
      ...base,
      columns: cols,
      rows: Array.from({ length: 3 }, () => ({
        id: uid(),
        cells: { [c1]: '', [c2]: false },
      })),
    };
  }
  return base;
}

export function createTopic() {
  return { id: uid(), title: 'Novo Tópico', fields: [] };
}

export function move(arr, id, dir) {
  const i = arr.findIndex((x) => x.id === id);
  const j = dir === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
