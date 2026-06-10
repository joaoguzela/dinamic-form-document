export function generateHtml(elements, formTitle = 'Formulário') {
  const body = elements.map(renderElement).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(formTitle)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      color: #000;
      background: #fff;
      padding: 20mm;
    }

    h1.form-title {
      font-size: 16pt;
      text-align: center;
      margin-bottom: 12mm;
      border-bottom: 2px solid #000;
      padding-bottom: 4mm;
    }

    .element { margin-bottom: 8mm; }

    /* Paragraph */
    .element-paragraph p {
      font-size: 11pt;
      line-height: 1.6;
      text-align: justify;
    }

    /* Table */
    .element-table {
      width: 100%;
      border-collapse: collapse;
    }
    .element-table th,
    .element-table td {
      border: 1px solid #000;
      padding: 3mm 4mm;
      font-size: 10pt;
      vertical-align: top;
      min-height: 10mm;
    }
    .element-table th {
      background-color: #e0e0e0;
      font-weight: bold;
      text-align: center;
    }
    .element-table td {
      background-color: #fff;
    }

    /* Checkbox group */
    .element-checkbox .checkbox-label {
      display: block;
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 3mm;
    }
    .element-checkbox .checkbox-item {
      display: flex;
      align-items: center;
      gap: 4mm;
      margin-bottom: 2mm;
      font-size: 11pt;
    }
    .element-checkbox .checkbox-box {
      width: 5mm;
      height: 5mm;
      border: 1.5px solid #000;
      display: inline-block;
      flex-shrink: 0;
    }

    @media print {
      body { padding: 0; }
      @page { margin: 20mm; size: A4; }
      .element { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1 class="form-title">${escapeHtml(formTitle)}</h1>
  ${body}
</body>
</html>`;
}

function renderElement(el) {
  switch (el.type) {
    case 'paragraph':
      return `<div class="element element-paragraph"><p>${escapeHtml(el.text || '')}</p></div>`;

    case 'table': {
      const headers = (el.columns || [])
        .map(c => `<th>${escapeHtml(c)}</th>`)
        .join('');
      const rows = Array.from({ length: el.rows || 1 })
        .map(() => {
          const cells = (el.columns || []).map(() => '<td>&nbsp;</td>').join('');
          return `<tr>${cells}</tr>`;
        })
        .join('\n');
      return `<div class="element">
  <table class="element-table">
    <thead><tr>${headers}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>`;
    }

    case 'checkbox': {
      const items = (el.options || [])
        .map(opt => `
      <div class="checkbox-item">
        <span class="checkbox-box"></span>
        <span>${escapeHtml(opt)}</span>
      </div>`)
        .join('');
      return `<div class="element element-checkbox">
  ${el.label ? `<span class="checkbox-label">${escapeHtml(el.label)}</span>` : ''}
  ${items}
</div>`;
    }

    default:
      return '';
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
