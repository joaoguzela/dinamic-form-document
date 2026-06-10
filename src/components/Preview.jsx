import { useState, useMemo } from 'react';
import { generateBodyHTML, wrapHTML } from '../utils/generateHtml';

export default function Preview({ form }) {
  const [tab, setTab] = useState('preview');

  const html = useMemo(() => wrapHTML(generateBodyHTML(form), form.title), [form]);
  const jsonStr = useMemo(() => JSON.stringify(form, null, 2), [form]);

  return (
    <div className="preview-pane">
      <div className="pane-header">
        <span>Visualização</span>
        <div className="tab-group">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'preview' && (
        <iframe
          className="preview-frame"
          srcDoc={html}
          title="Preview do formulário"
          sandbox="allow-same-origin"
        />
      )}

      {tab === 'html' && (
        <pre className="json-view code-scroll">{html}</pre>
      )}

      {tab === 'json' && (
        <pre className="json-view code-scroll">{jsonStr}</pre>
      )}
    </div>
  );
}

const TABS = [
  { id: 'preview', label: 'Preview' },
  { id: 'html', label: 'HTML' },
  { id: 'json', label: 'JSON' },
];
