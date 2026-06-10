import { uid } from '../utils/helpers';

export default function TableModal({ field, onUpdate, onClose }) {
  // ── Colunas ──────────────────────────────────────────
  const addColumn = () => {
    const cid = uid();
    const newCol = { id: cid, name: `Coluna ${field.columns.length + 1}`, cellType: 'input' };
    const newRows = field.rows.map((r) => ({ ...r, cells: { ...r.cells, [cid]: '' } }));
    onUpdate({ columns: [...field.columns, newCol], rows: newRows });
  };

  const removeColumn = (cid) => {
    if (field.columns.length <= 1) return;
    const newRows = field.rows.map((r) => {
      const cells = { ...r.cells };
      delete cells[cid];
      return { ...r, cells };
    });
    onUpdate({ columns: field.columns.filter((c) => c.id !== cid), rows: newRows });
  };

  const updateColumn = (cid, patch) => {
    const newColumns = field.columns.map((c) => (c.id === cid ? { ...c, ...patch } : c));
    let newRows = field.rows;
    if (patch.cellType !== undefined) {
      const def = patch.cellType === 'checkbox' ? false : '';
      newRows = field.rows.map((r) => ({ ...r, cells: { ...r.cells, [cid]: def } }));
    }
    onUpdate({ columns: newColumns, rows: newRows });
  };

  // ── Linhas ───────────────────────────────────────────
  const addRow = () => {
    const cells = {};
    field.columns.forEach((c) => { cells[c.id] = c.cellType === 'checkbox' ? false : ''; });
    onUpdate({ rows: [...field.rows, { id: uid(), cells }] });
  };

  const removeRow = (rid) => {
    if (field.rows.length <= 1) return;
    onUpdate({ rows: field.rows.filter((r) => r.id !== rid) });
  };

  const updateCell = (rid, cid, value) => {
    onUpdate({
      rows: field.rows.map((r) =>
        r.id === rid ? { ...r, cells: { ...r.cells, [cid]: value } } : r
      ),
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>Editar Tabela — {field.label}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Colunas */}
          <div className="modal-section">
            <div className="modal-section-header">
              <span>Colunas</span>
              <button className="btn-add" onClick={addColumn}>+ Coluna</button>
            </div>
            <div className="col-list">
              {field.columns.map((col) => (
                <div key={col.id} className="col-row">
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) => updateColumn(col.id, { name: e.target.value })}
                    placeholder="Nome da coluna"
                  />
                  <select
                    value={col.cellType}
                    onChange={(e) => updateColumn(col.id, { cellType: e.target.value })}
                  >
                    <option value="texto">Texto</option>
                    <option value="input">Input</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                  <button
                    className="btn-remove-small"
                    onClick={() => removeColumn(col.id)}
                    disabled={field.columns.length <= 1}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Linhas */}
          <div className="modal-section">
            <div className="modal-section-header">
              <span>Linhas ({field.rows.length})</span>
              <button className="btn-add" onClick={addRow}>+ Linha</button>
            </div>
            <div className="table-preview-scroll">
              <table className="preview-table">
                <thead>
                  <tr>
                    {field.columns.map((c) => (
                      <th key={c.id}>
                        {c.name || 'Col'}
                        <span className="col-type-hint">
                          {c.cellType === 'texto' ? ' · texto' : c.cellType === 'input' ? ' · input' : ' · ✓'}
                        </span>
                      </th>
                    ))}
                    <th style={{ width: 32 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {field.rows.map((row) => (
                    <tr key={row.id}>
                      {field.columns.map((col) => (
                        <td key={col.id}>
                          {col.cellType === 'texto' && (
                            <input
                              type="text"
                              value={row.cells[col.id] ?? ''}
                              onChange={(e) => updateCell(row.id, col.id, e.target.value)}
                              placeholder="texto fixo..."
                            />
                          )}
                          {col.cellType === 'input' && (
                            <input type="text" disabled placeholder="—" />
                          )}
                          {col.cellType === 'checkbox' && (
                            <input type="checkbox" disabled />
                          )}
                        </td>
                      ))}
                      <td>
                        <button
                          className="btn-remove-small"
                          onClick={() => removeRow(row.id)}
                          disabled={field.rows.length <= 1}
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Salvar e Fechar</button>
        </div>
      </div>
    </div>
  );
}
