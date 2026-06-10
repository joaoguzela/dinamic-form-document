import { useState, useMemo, useRef } from 'react';
import { generateBodyHTML, wrapHTML } from '../utils/generateHtml';

export default function Preview({ form }) {
  const [tab, setTab] = useState('preview');
  const frameRef = useRef(null);

  const html = useMemo(() => wrapHTML(generateBodyHTML(form), form.title), [form]);
  const jsonStr = useMemo(() => JSON.stringify(form, null, 2), [form]);

  const printDoc = () => {
    const frame = frameRef.current;
    if (frame?.contentWindow) {
      frame.contentWindow.print();
    }
  };

  return (
    <div className="preview-pane">
      <div className="pane-header">
        <span>Visualização</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {tab === 'preview' && (
            <button className="btn-print" style={{ fontSize: 12, padding: '4px 12px' }} onClick={printDoc}>
              🖨 Imprimir
            </button>
          )}
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
      </div>

      {tab === 'preview' && (
        <iframe
          ref={frameRef}
          className="preview-frame"
          srcDoc={html}
          title="Preview do formulário"
          sandbox="allow-same-origin allow-modals"
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
