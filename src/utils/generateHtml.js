import { esc } from './helpers';

export function generateBodyHTML(form) {
  if (!form.topics?.length) return '';
  return form.topics.map(generateTopicHTML).join('\n\n');
}

function generateTopicHTML(topic) {
  const fields = topic.fields.map(generateFieldHTML).join('\n  ');
  return `<section class="form-section">
  <h2 class="section-title">${esc(topic.title)}</h2>
  <div class="section-body">
  ${fields}
  </div>
</section>`;
}

function generateFieldHTML(field) {
  const fid = `fld_${field.id}`;

  if (field.type === 'text') {
    return `<div class="form-field">
    <label for="${fid}">${esc(field.label)}</label>
    <input type="text" id="${fid}" name="${fid}">
  </div>`;
  }

  if (field.type === 'checkbox') {
    return `<div class="form-field form-field--cb">
    <input type="checkbox" id="${fid}" name="${fid}">
    <label for="${fid}">${esc(field.label)}</label>
  </div>`;
  }

  if (field.type === 'table') {
    const heads = field.columns.map((c) => `<th>${esc(c.name)}</th>`).join('');
    const rows = field.rows
      .map((row) => {
        const cells = field.columns
          .map((c) => {
            const nm = `${fid}_${row.id}_${c.id}`;
            if (c.cellType === 'checkbox')
              return `<td class="td-cb"><input type="checkbox" name="${nm}"></td>`;
            if (c.cellType === 'input')
              return `<td><input type="text" name="${nm}"></td>`;
            // texto — conteúdo fixo pré-definido
            return `<td class="td-texto">${esc(row.cells?.[c.id] ?? '')}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');
    return `<div class="form-field form-field--table">
    <label>${esc(field.label)}</label>
    <table>
      <thead><tr>${heads}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
  }

  return '';
}

export function wrapHTML(bodyHTML, title = 'Formulário') {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<style>
/* ── Reset ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── Página ── */
html,body{
  font-family:'Arial',sans-serif;
  font-size:11pt;
  color:#000;
  background:#e5e7eb;
}

/* ── Folha A4 ── */
.page{
  width:210mm;
  min-height:297mm;
  margin:12mm auto;
  background:#fff;
  padding:18mm 20mm 20mm;
  box-shadow:0 2px 12px rgba(0,0,0,.15);
}

/* ── Título do formulário ── */
h1.form-title{
  font-size:16pt;
  font-weight:700;
  text-align:center;
  text-transform:uppercase;
  letter-spacing:.5px;
  padding-bottom:6pt;
  border-bottom:2pt solid #000;
  margin-bottom:14pt;
}

/* ── Seções (tópicos) ── */
.form-section{
  margin-bottom:10pt;
  page-break-inside:avoid;
}

h2.section-title{
  font-size:9pt;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.8px;
  background:#e5e7eb;
  color:#000;
  padding:4pt 8pt;
  border:1pt solid #aaa;
  margin-bottom:0;
}

.section-body{
  border:1pt solid #aaa;
  border-top:none;
  padding:8pt 10pt;
  display:flex;
  flex-direction:column;
  gap:8pt;
}

/* ── Campo texto ── */
.form-field{
  display:flex;
  flex-direction:column;
  gap:3pt;
}

.form-field label{
  font-size:8pt;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.4px;
  color:#555;
}

/* Input texto: parece linha de documento, não caixa web */
.form-field input[type=text]{
  width:100%;
  border:none;
  border-bottom:1pt solid #333;
  border-radius:0;
  background:transparent;
  outline:none;
  box-shadow:none;
  -webkit-appearance:none;
  appearance:none;
  font-size:10pt;
  font-family:inherit;
  color:#000;
  padding:2pt 0;
  height:16pt;
}

/* ── Checkbox ── */
.form-field--cb{
  flex-direction:row;
  align-items:center;
  gap:6pt;
}
.form-field--cb label{
  font-size:10pt;
  font-weight:normal;
  text-transform:none;
  letter-spacing:0;
  color:#000;
  cursor:pointer;
}
.form-field--cb input[type=checkbox]{
  width:11pt;
  height:11pt;
  cursor:pointer;
  flex-shrink:0;
  accent-color:#000;
}

/* ── Tabela ── */
.form-field--table label{
  font-size:8pt;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.4px;
  color:#555;
  display:block;
  margin-bottom:4pt;
}

table{
  width:100%;
  border-collapse:collapse;
  font-size:9pt;
  page-break-inside:avoid;
}
th{
  background:#e5e7eb;
  border:1pt solid #aaa;
  padding:4pt 6pt;
  text-align:left;
  font-size:8pt;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.3px;
}
td{
  border:1pt solid #aaa;
  padding:0;
  height:18pt;
  vertical-align:middle;
}
td input[type=text]{
  width:100%;
  border:none;
  outline:none;
  background:transparent;
  font-size:9pt;
  font-family:inherit;
  color:#000;
  padding:2pt 5pt;
  height:100%;
}
.td-cb{
  text-align:center;
  width:22pt;
}
.td-cb input[type=checkbox]{
  width:11pt;
  height:11pt;
  cursor:pointer;
  accent-color:#000;
  display:block;
  margin:0 auto;
}
/* Célula texto estático — área para escrita manual */
.td-texto{
  background:#fafafa;
}

/* ── Assinatura / rodapé ── */
.form-footer{
  margin-top:20pt;
  display:flex;
  gap:20mm;
}
.sign-block{
  flex:1;
  display:flex;
  flex-direction:column;
  gap:3pt;
}
.sign-line{
  border-bottom:1pt solid #333;
  height:20pt;
}
.sign-label{
  font-size:7pt;
  color:#555;
  text-align:center;
}

/* ── Impressão ── */
@media print{
  html,body{background:#fff}
  .page{
    margin:0;
    padding:18mm 20mm 20mm;
    box-shadow:none;
    width:100%;
    min-height:auto;
  }
  @page{
    size:A4 portrait;
    margin:0;
  }
}
</style>
</head>
<body>
<div class="page">
  <h1 class="form-title">${esc(title)}</h1>
  ${bodyHTML}
  <div class="form-footer">
    <div class="sign-block">
      <div class="sign-line"></div>
      <div class="sign-label">Assinatura</div>
    </div>
    <div class="sign-block">
      <div class="sign-line"></div>
      <div class="sign-label">Data</div>
    </div>
  </div>
</div>
</body>
</html>`;
}
