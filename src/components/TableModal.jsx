import { uid } from '../utils/helpers';

export default function TableModal({ field, onUpdate, onClose }) {
  const addColumn = () => {
    onUpdate({
      columns: [
        ...field.columns,
        { id: uid(), name: `Coluna ${field.columns.length + 1}`, cellType: 'text' },
      ],
    });
  };

  const removeColumn = (cid) => {
    if (field.columns.length <= 1) return;
    onUpdate({ columns: field.columns.filter((c) => c.id !== cid) });
  };

  const updateColumn = (cid, patch) => {
    onUpdate({ columns: field.columns.map((c) => (c.id === cid ? { ...c, ...patch } : c)) });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>Editar Tabela — {field.label}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
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
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <div className="modal-section-header">
              <span>Número de linhas</span>
            </div>
            <input
              type="number"
              className="row-count-input"
              min={1}
              max={50}
              value={field.rowCount}
              onChange={(e) =>
                onUpdate({ rowCount: Math.max(1, Math.min(50, Number(e.target.value))) })
              }
            />
          </div>

          <div className="modal-section">
            <div className="modal-section-header">
              <span>Pré-visualização</span>
            </div>
            <div className="table-preview-scroll">
              <table className="preview-table">
                <thead>
                  <tr>
                    {field.columns.map((c) => (
                      <th key={c.id}>{c.name || 'Col'}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(field.rowCount, 5) }).map((_, r) => (
                    <tr key={r}>
                      {field.columns.map((c) => (
                        <td key={c.id}>
                          {c.cellType === 'checkbox' && <input type="checkbox" disabled />}
                          {c.cellType === 'input' && <input type="text" disabled placeholder="—" />}
                          {c.cellType === 'texto' && <span style={{ fontSize: 12, color: '#94a3b8' }}>abc</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {field.rowCount > 5 && (
                    <tr>
                      <td colSpan={field.columns.length} className="more-rows">
                        +{field.rowCount - 5} linhas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
