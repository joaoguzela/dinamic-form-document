import { createField, createTopic, move } from '../utils/helpers';

export default function Builder({ form, setForm, openModal }) {
  const patch = (update) => setForm((f) => ({ ...f, ...update }));

  const addTopic = () => patch({ topics: [...form.topics, createTopic()] });

  const removeTopic = (id) =>
    patch({ topics: form.topics.filter((t) => t.id !== id) });

  const moveTopic = (id, dir) =>
    patch({ topics: move(form.topics, id, dir) });

  const updateTopicTitle = (id, title) =>
    patch({ topics: form.topics.map((t) => (t.id === id ? { ...t, title } : t)) });

  const addField = (topicId, type) =>
    patch({
      topics: form.topics.map((t) =>
        t.id === topicId ? { ...t, fields: [...t.fields, createField(type)] } : t
      ),
    });

  const removeField = (topicId, fid) =>
    patch({
      topics: form.topics.map((t) =>
        t.id === topicId ? { ...t, fields: t.fields.filter((f) => f.id !== fid) } : t
      ),
    });

  const moveField = (topicId, fid, dir) =>
    patch({
      topics: form.topics.map((t) =>
        t.id === topicId ? { ...t, fields: move(t.fields, fid, dir) } : t
      ),
    });

  const updateFieldLabel = (topicId, fid, label) =>
    patch({
      topics: form.topics.map((t) =>
        t.id === topicId
          ? { ...t, fields: t.fields.map((f) => (f.id === fid ? { ...f, label } : f)) }
          : t
      ),
    });

  return (
    <div className="builder-pane">
      <div className="pane-header">
        <span>Construtor</span>
        <button className="btn-primary btn-sm" onClick={addTopic}>
          + Tópico
        </button>
      </div>

      <div className="builder-list">
        {form.topics.length === 0 && (
          <div className="empty-state">
            <p>Nenhum tópico ainda</p>
            <small>Clique em + Tópico para começar</small>
          </div>
        )}

        {form.topics.map((topic, ti) => (
          <div key={topic.id} className="topic-card">
            <div className="topic-header">
              <div className="move-btns">
                <button onClick={() => moveTopic(topic.id, 'up')} disabled={ti === 0}>
                  ↑
                </button>
                <button
                  onClick={() => moveTopic(topic.id, 'down')}
                  disabled={ti === form.topics.length - 1}
                >
                  ↓
                </button>
              </div>
              <input
                className="topic-title-input"
                value={topic.title}
                onChange={(e) => updateTopicTitle(topic.id, e.target.value)}
                placeholder="Nome do tópico"
              />
              <button className="btn-remove btn-sm" onClick={() => removeTopic(topic.id)}>
                Remover
              </button>
            </div>

            <div className="fields-list">
              {topic.fields.length === 0 && (
                <div className="fields-empty">Sem campos. Adicione abaixo.</div>
              )}
              {topic.fields.map((field, fi) => (
                <div key={field.id} className="field-item">
                  <div className="field-row">
                    <div className="move-btns move-btns--sm">
                      <button
                        onClick={() => moveField(topic.id, field.id, 'up')}
                        disabled={fi === 0}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveField(topic.id, field.id, 'down')}
                        disabled={fi === topic.fields.length - 1}
                      >
                        ↓
                      </button>
                    </div>
                    <span className={`type-badge type-${field.type}`}>
                      {TYPE_LABELS[field.type]}
                    </span>
                    <input
                      className="field-label-input"
                      value={field.label}
                      onChange={(e) => updateFieldLabel(topic.id, field.id, e.target.value)}
                      placeholder="Rótulo"
                    />
                    {field.type === 'table' && (
                      <button
                        className="btn-edit-table"
                        onClick={() => openModal(topic.id, field.id)}
                      >
                        Editar
                      </button>
                    )}
                    <button
                      className="btn-remove-small"
                      onClick={() => removeField(topic.id, field.id)}
                    >
                      ✕
                    </button>
                  </div>
                  {field.type === 'table' && (
                    <div className="table-meta">
                      {field.columns.length} col × {field.rows.length} linhas
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="add-field-bar">
              <span>+ Campo:</span>
              <button className="sidebar-btn add-type-btn" onClick={() => addField(topic.id, 'text')}>
                Texto
              </button>
              <button
                className="sidebar-btn add-type-btn"
                onClick={() => addField(topic.id, 'checkbox')}
              >
                Checkbox
              </button>
              <button
                className="sidebar-btn add-type-btn"
                onClick={() => addField(topic.id, 'table')}
              >
                Tabela
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TYPE_LABELS = { text: 'Texto', checkbox: 'Checkbox', table: 'Tabela' };
