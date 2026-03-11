import React, { useState, useEffect } from 'react'

const BASE = 'http://localhost:8080'

async function apiFetch(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

const S = {
  app: { minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif", padding: '24px 16px' },
  card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24, maxWidth: 720, margin: '0 auto 24px' },
  h1: { textAlign: 'center', color: '#1a1a2e', marginBottom: 4, fontSize: 28 },
  sub: { textAlign: 'center', color: '#666', marginBottom: 24, fontSize: 14 },
  row: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 },
  input: { flex: 1, minWidth: 140, padding: '8px 12px', border: '1px solid #d0d0d0', borderRadius: 8, fontSize: 14, outline: 'none' },
  btn: (color) => ({ padding: '8px 18px', background: color, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }),
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { background: '#f7f8fa', padding: '10px 12px', textAlign: 'left', color: '#555', fontWeight: 600, borderBottom: '2px solid #e8e8e8' },
  td: { padding: '10px 12px', borderBottom: '1px solid #f0f0f0', color: '#333' },
  err: { background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, padding: '10px 14px', color: '#cf1322', marginBottom: 12, fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre-wrap' },
  ok: { background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: '8px 14px', color: '#389e0d', marginBottom: 12, fontSize: 13 },
  badge: (c) => ({ display: 'inline-block', background: c, color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 12, cursor: 'pointer', marginRight: 4 }),
}

const EMPTY = { name: '', number: '', note: '' }

export default function App() {
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('checking') // checking | ok | error

  const loadContacts = async () => {
    try {
      const data = await apiFetch('/contacts')
      setContacts(Array.isArray(data) ? data : [])
      setStatus('ok')
    } catch (e) {
      setStatus('error')
      showMsg('err', `Не удалось загрузить контакты:\n${e.message}\n\nПроверь что backend запущен (docker-compose logs app)`)
    }
  }

  useEffect(() => { loadContacts() }, [])

  const showMsg = (type, text) => {
    setMsg({ type, text })
    if (type === 'ok') setTimeout(() => setMsg(null), 3500)
  }

  const handleAdd = async () => {
    if (!form.name || !form.number) return showMsg('err', 'ФИО и номер обязательны')
    setLoading(true)
    try {
      await apiFetch('/addcontact', { method: 'POST', body: JSON.stringify(form) })
      setForm(EMPTY)
      showMsg('ok', 'Контакт добавлен')
      loadContacts()
    } catch (e) {
      showMsg('err', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить контакт?')) return
    try {
      await apiFetch(`/contacts/${id}`, { method: 'DELETE' })
      showMsg('ok', 'Контакт удалён')
      loadContacts()
    } catch (e) {
      showMsg('err', e.message)
    }
  }

  const startEdit = (c) => {
    setEditId(c.id)
    setEditForm({ name: c.name, number: c.number, note: c.note || '' })
  }

  const handleUpdate = async () => {
    if (!editForm.name || !editForm.number) return showMsg('err', 'ФИО и номер обязательны')
    try {
      await apiFetch(`/contacts/${editId}`, {
        method: 'PUT',
        body: JSON.stringify({ id: editId, ...editForm }),
      })
      setEditId(null)
      showMsg('ok', 'Контакт обновлён')
      loadContacts()
    } catch (e) {
      showMsg('err', e.message)
    }
  }

  return (
    <div style={S.app}>
      <div style={S.card}>
        <h1 style={S.h1}>📒 Телефонная книга</h1>
        <p style={S.sub}>Добавляйте, редактируйте и удаляйте контакты</p>

        {/* статус подключения */}
        {status === 'checking' && <div style={{ textAlign: 'center', color: '#999', marginBottom: 12 }}>⏳ Подключение к серверу...</div>}
        {status === 'error' && <div style={{ textAlign: 'center', color: '#cf1322', marginBottom: 12 }}>🔴 Нет связи с сервером</div>}

        {msg && <div style={msg.type === 'ok' ? S.ok : S.err}>{msg.text}</div>}

        {/* форма добавления */}
        <h3 style={{ color: '#1a1a2e', marginBottom: 10 }}>Новый контакт</h3>
        <div style={S.row}>
          <input style={S.input} placeholder="ФИО *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input style={S.input} placeholder="Номер (ровно 10 цифр) *" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
          <input style={S.input} placeholder="Заметка" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <button style={S.btn('#4361ee')} onClick={handleAdd} disabled={loading}>{loading ? '...' : '➕ Добавить'}</button>
        </div>

        {/* таблица */}
        <h3 style={{ color: '#1a1a2e', marginTop: 24, marginBottom: 10 }}>
          Контакты ({contacts.length})
          <button style={{ ...S.btn('#6c757d'), marginLeft: 12, fontSize: 12, padding: '4px 12px' }} onClick={loadContacts}>🔄 Обновить</button>
        </h3>

        {contacts.length === 0 && status === 'ok' ? (
          <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>Контактов пока нет</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>ФИО</th>
                  <th style={S.th}>Номер</th>
                  <th style={S.th}>Заметка</th>
                  <th style={S.th}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) =>
                  editId === c.id ? (
                    <tr key={c.id} style={{ background: '#fffbe6' }}>
                      <td style={S.td}><input style={{ ...S.input, minWidth: 0 }} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                      <td style={S.td}><input style={{ ...S.input, minWidth: 0 }} value={editForm.number} onChange={(e) => setEditForm({ ...editForm, number: e.target.value })} /></td>
                      <td style={S.td}><input style={{ ...S.input, minWidth: 0 }} value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} /></td>
                      <td style={S.td}>
                        <span style={S.badge('#52c41a')} onClick={handleUpdate}>💾 Сохранить</span>
                        <span style={S.badge('#8c8c8c')} onClick={() => setEditId(null)}>✖ Отмена</span>
                      </td>
                    </tr>
                  ) : (
                    <tr key={c.id}>
                      <td style={S.td}>{c.name}</td>
                      <td style={S.td}>{c.number}</td>
                      <td style={S.td}>{c.note || '—'}</td>
                      <td style={S.td}>
                        <span style={S.badge('#fa8c16')} onClick={() => startEdit(c)}>✏️ Изменить</span>
                        <span style={S.badge('#ff4d4f')} onClick={() => handleDelete(c.id)}>🗑 Удалить</span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
