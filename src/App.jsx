import { useState } from 'react';
import Builder from './components/Builder';
import Preview from './components/Preview';
import TableModal from './components/TableModal';
import { generateBodyHTML, wrapHTML } from './utils/generateHtml';
import './App.css';

const INITIAL_FORM = { title: 'Meu Formulário', topics: [] };

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [modal, setModal] = useState(null); // { topicId, fieldId }

  const openModal = (topicId, fieldId) => setModal({ topicId, fieldId });
  const closeModal = () => setModal(null);

  const modalField = modal
    ? form.topics.find((t) => t.id === modal.topicId)?.fields.find((f) => f.id === modal.fieldId)
    : null;

  const updateTableField = (patch) => {
    setForm((f) => ({
      ...f,
      topics: f.topics.map((t) =>
        t.id === modal.topicId
          ? {
              ...t,
              fields: t.fields.map((f2) =>
                f2.id === modal.fieldId ? { ...f2, ...patch } : f2
              ),
            }
          : t
      ),
    }));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${form.title || 'formulario'}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          setForm(JSON.parse(ev.target.result));
        } catch {
          alert('Arquivo JSON inválido.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const copyHTML = () => {
    const html = wrapHTML(generateBodyHTML(form), form.title);
    navigator.clipboard.writeText(html).then(() => toast('HTML copiado!')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast('HTML copiado!');
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <input
            className="title-input"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Nome do formulário"
          />
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={importJSON}>
            Importar JSON
          </button>
          <button className="btn-secondary" onClick={exportJSON}>
            Exportar JSON
          </button>
          <button className="btn-print" onClick={copyHTML}>
            Copiar HTML
          </button>
        </div>
      </header>

      <div className="app-body">
        <Builder form={form} setForm={setForm} openModal={openModal} />
        <Preview form={form} />
      </div>

      {modalField && (
        <TableModal field={modalField} onUpdate={updateTableField} onClose={closeModal} />
      )}
    </div>
  );
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}
