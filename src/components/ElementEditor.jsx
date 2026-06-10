import { useState } from 'react';

export default function ElementEditor({ element, onChange, onRemove, onMoveUp, onMoveDown }) {
  const [collapsed, setCollapsed] = useState(false);

  const update = (patch) => onChange({ ...element, ...patch });

  return (
    <div className="element-editor">
      <div className="element-editor-header">
        <span className="element-type-badge">{labelFor(element.type)}</span>
        <div className="element-actions">
          <button onClick={onMoveUp} title="Mover para cima">↑</button>
          <button onClick={onMoveDown} title="Mover para baixo">↓</button>
          <button onClick={() => setCollapsed(c => !c)}>{collapsed ? '▶' : '▼'}</button>
          <button className="btn-remove" onClick={onRemove} title="Remover">✕</button>
        </div>
      </div>

      {!collapsed && (
        <div className="element-editor-body">
          {element.type === 'paragraph' && (
            <ParagraphEditor element={element} update={update} />
          )}
          {element.type === 'table' && (
            <TableEditor element={element} update={update} />
          )}
          {element.type === 'checkbox' && (
            <CheckboxEditor element={element} update={update} />
          )}
        </div>
      )}
    </div>
  );
}

function ParagraphEditor({ element, update }) {
  return (
    <div className="field-group">
      <label>Texto do parágrafo</label>
      <textarea
        rows={4}
        value={element.text || ''}
        onChange={e => update({ text: e.target.value })}
        placeholder="Digite o conteúdo do parágrafo..."
      />
    </div>
  );
}

function TableEditor({ element, update }) {
  const columns = element.columns || ['Coluna 1'];
  const rows = element.rows || 1;

  const addColumn = () => update({ columns: [...columns, `Coluna ${columns.length + 1}`] });
  const removeColumn = (i) => update({ columns: columns.filter((_, idx) => idx !== i) });
  const renameColumn = (i, val) => update({ columns: columns.map((c, idx) => idx === i ? val : c) });

  return (
    <div className="field-group">
      <label>Número de linhas (dados)</label>
      <input
        type="number"
        min={1}
        max={50}
        value={rows}
        onChange={e => update({ rows: Math.max(1, Number(e.target.value)) })}
      />

      <label style={{ marginTop: 12 }}>Colunas</label>
      {columns.map((col, i) => (
        <div key={i} className="inline-row">
          <input
            value={col}
            onChange={e => renameColumn(i, e.target.value)}
            placeholder={`Coluna ${i + 1}`}
          />
          <button className="btn-remove-small" onClick={() => removeColumn(i)} disabled={columns.length <= 1}>✕</button>
        </div>
      ))}
      <button className="btn-add" onClick={addColumn}>+ Adicionar coluna</button>

      <div className="table-preview-label">Pré-visualização</div>
      <div className="table-preview-scroll">
        <table className="preview-table">
          <thead>
            <tr>{columns.map((c, i) => <th key={i}>{c || `Coluna ${i + 1}`}</th>)}</tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.min(rows, 5) }).map((_, r) => (
              <tr key={r}>
                {columns.map((_, c) => <td key={c}>&nbsp;</td>)}
              </tr>
            ))}
            {rows > 5 && (
              <tr>
                <td colSpan={columns.length} className="more-rows">
                  ... mais {rows - 5} linha(s)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CheckboxEditor({ element, update }) {
  const options = element.options || ['Opção 1'];

  const addOption = () => update({ options: [...options, `Opção ${options.length + 1}`] });
  const removeOption = (i) => update({ options: options.filter((_, idx) => idx !== i) });
  const renameOption = (i, val) => update({ options: options.map((o, idx) => idx === i ? val : o) });

  return (
    <div className="field-group">
      <label>Título do grupo</label>
      <input
        value={element.label || ''}
        onChange={e => update({ label: e.target.value })}
        placeholder="Ex: Selecione as opções..."
      />

      <label style={{ marginTop: 12 }}>Opções</label>
      {options.map((opt, i) => (
        <div key={i} className="inline-row">
          <input
            value={opt}
            onChange={e => renameOption(i, e.target.value)}
            placeholder={`Opção ${i + 1}`}
          />
          <button className="btn-remove-small" onClick={() => removeOption(i)} disabled={options.length <= 1}>✕</button>
        </div>
      ))}
      <button className="btn-add" onClick={addOption}>+ Adicionar opção</button>
    </div>
  );
}

function labelFor(type) {
  return { paragraph: '¶ Parágrafo', table: '⊞ Tabela', checkbox: '☑ Checkbox' }[type] || type;
}
