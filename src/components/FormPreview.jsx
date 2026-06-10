export default function FormPreview({ elements, title }) {
  if (!elements.length) {
    return (
      <div className="preview-empty">
        <span>Nenhum elemento adicionado ainda.</span>
        <small>Use os botões à esquerda para começar a construir o formulário.</small>
      </div>
    );
  }

  return (
    <div className="preview-paper">
      {title && <h2 className="preview-title">{title}</h2>}
      {elements.map((el, i) => (
        <PreviewElement key={el.id ?? i} element={el} />
      ))}
    </div>
  );
}

function PreviewElement({ element }) {
  switch (element.type) {
    case 'paragraph':
      return (
        <div className="prev-paragraph">
          <p>{element.text || <span className="placeholder">Parágrafo vazio</span>}</p>
        </div>
      );

    case 'table': {
      const columns = element.columns || [];
      const rows = element.rows || 1;
      return (
        <div className="prev-table-wrap">
          <table className="prev-table">
            <thead>
              <tr>{columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, r) => (
                <tr key={r}>
                  {columns.map((_, c) => <td key={c}>&nbsp;</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'checkbox':
      return (
        <div className="prev-checkbox">
          {element.label && <strong>{element.label}</strong>}
          {(element.options || []).map((opt, i) => (
            <label key={i} className="prev-checkbox-item">
              <input type="checkbox" readOnly />
              {opt}
            </label>
          ))}
        </div>
      );

    default:
      return null;
  }
}
