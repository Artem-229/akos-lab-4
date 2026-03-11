import React, { useState, useEffect, useRef } from 'react'

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

function formatPhone(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    let result = ''
    if (digits.length > 0) result += digits.slice(0, 3)
    if (digits.length > 3) result += ') ' + digits.slice(3, 6)
    if (digits.length > 6) result += '-' + digits.slice(6, 8)
    if (digits.length > 8) result += '-' + digits.slice(8, 10)
    return result
}

function getRawDigits(formatted) {
    return formatted.replace(/\D/g, '')
}

function PhoneInput({ value, onChange, placeholder = '+7 (XXX) XXX-XX-XX', style = {} }) {
    const [focused, setFocused] = useState(false)
    const digits = getRawDigits(value)
    const isValid = digits.length === 10
    const hasError = digits.length > 0 && digits.length < 10 && !focused

    const PREFIX = '+7 ('

    const handleChange = (e) => {
        const raw = e.target.value
        const afterPrefix = raw.startsWith(PREFIX) ? raw.slice(PREFIX.length) : raw
        const d = afterPrefix.replace(/\D/g, '').slice(0, 10)
        onChange(formatPhone(d))
    }

    const handleKeyDown = (e) => {
        const input = e.target
        if ((e.key === 'Backspace' || e.key === 'Delete') && input.selectionStart <= PREFIX.length && input.selectionEnd <= PREFIX.length) {
            e.preventDefault()
        }
    }

    const handleFocus = (e) => {
        setFocused(true)
        setTimeout(() => {
            const len = e.target.value.length
            e.target.setSelectionRange(len, len)
        }, 0)
    }

    const displayValue = PREFIX + value

    return (
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
            <input
                style={{
                    width: '100%',
                    padding: '10px 36px 10px 14px',
                    border: `2px solid ${hasError ? '#ff6b6b' : isValid ? '#4ade80' : focused ? '#6366f1' : '#e2e8f0'}`,
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: '0.01em',
                    outline: 'none',
                    background: '#fff',
                    color: '#1e293b',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: focused ? `0 0 0 4px ${hasError ? 'rgba(255,107,107,0.12)' : 'rgba(99,102,241,0.12)'}` : '0 1px 3px rgba(0,0,0,0.06)',
                    boxSizing: 'border-box',
                    ...style,
                }}
                placeholder={placeholder}
                value={displayValue}
                onFocus={handleFocus}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
            />
            {isValid && (
                <span style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: '#4ade80', fontSize: 16,
                }}>✓</span>
            )}
            {hasError && (
                <span style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: '#ff6b6b', fontSize: 11, fontWeight: 600,
                }}>{digits.length}/10</span>
            )}
        </div>
    )
}

function TextField({ value, onChange, placeholder, icon, style = {} }) {
    const [focused, setFocused] = useState(false)
    return (
        <div style={{ position: 'relative', flex: 1, minWidth: 140 }}>
            {icon && (
                <span style={{
                    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 15, pointerEvents: 'none', opacity: focused || value ? 1 : 0.45,
                    transition: 'opacity 0.2s',
                }}>{icon}</span>
            )}
            <input
                style={{
                    width: '100%',
                    padding: icon ? '10px 12px 10px 38px' : '10px 14px',
                    border: `2px solid ${focused ? '#6366f1' : '#e2e8f0'}`,
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: "'Nunito', sans-serif",
                    outline: 'none',
                    background: '#fff',
                    color: '#1e293b',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
                    boxSizing: 'border-box',
                    ...style,
                }}
                placeholder={placeholder}
                value={value}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={onChange}
            />
        </div>
    )
}

const EMPTY = { name: '', number: '', note: '' }

export default function App() {
    const [contacts, setContacts] = useState([])
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [editForm, setEditForm] = useState(EMPTY)
    const [msg, setMsg] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('checking')
    const [search, setSearch] = useState('')

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
        if (type === 'ok') setTimeout(() => setMsg(null), 3000)
    }

    const validateForm = (f) => {
        if (!f.name.trim()) return 'Введите Имя'
        if (getRawDigits(f.number).length !== 10) return 'Номер должен содержать ровно 10 цифр'
        return null
    }

    const handleAdd = async () => {
        const err = validateForm(form)
        if (err) return showMsg('err', err)
        setLoading(true)
        try {
            await apiFetch('/addcontact', {
                method: 'POST',
                body: JSON.stringify({ ...form, number: getRawDigits(form.number) }),
            })
            setForm(EMPTY)
            showMsg('ok', '✅ Контакт добавлен')
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
            showMsg('ok', '🗑 Контакт удалён')
            loadContacts()
        } catch (e) {
            showMsg('err', e.message)
        }
    }

    const startEdit = (c) => {
        setEditId(c.id)
        setEditForm({ name: c.name, number: formatPhone(c.number), note: c.note || '' })
    }

    const handleUpdate = async () => {
        const err = validateForm(editForm)
        if (err) return showMsg('err', err)
        try {
            await apiFetch(`/contacts/${editId}`, {
                method: 'PUT',
                body: JSON.stringify({ id: editId, ...editForm, number: getRawDigits(editForm.number) }),
            })
            setEditId(null)
            showMsg('ok', '💾 Контакт обновлён')
            loadContacts()
        } catch (e) {
            showMsg('err', e.message)
        }
    }

    const searchLower = search.toLowerCase()
    const searchDigits = search.replace(/\D/g, '')
    const filtered = contacts.filter(c => {
        const nameMatch = (c.name || '').toLowerCase().includes(searchLower)
        const noteMatch = (c.note || '').toLowerCase().includes(searchLower)
        const numberMatch = searchDigits.length > 0
            ? (c.number || '').replace(/\D/g, '').includes(searchDigits)
            : false
        return nameMatch || noteMatch || numberMatch
    })

    const getInitials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const avatarColors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6']
    const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length]

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f1f4fd; }
        .contact-row { transition: background 0.15s; }
        .contact-row:hover { background: #f8f9ff !important; }
        .btn-primary { transition: transform 0.1s, box-shadow 0.1s, background 0.15s; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.35); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .action-btn { transition: opacity 0.15s, transform 0.1s; opacity: 0.75; cursor: pointer; }
        .action-btn:hover { opacity: 1; transform: scale(1.08); }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        input::placeholder { color: #a8b5cc; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c7d0e8; border-radius: 99px; }
      `}</style>

            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f1f4fd 0%, #e8ecf8 100%)', fontFamily: "'Nunito', sans-serif", padding: '32px 16px' }}>
                {/* Header */}
                <div style={{ maxWidth: 740, margin: '0 auto 24px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>Телефонная книга</h1>
                    {status === 'checking' && <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>⏳ Подключение к серверу...</p>}
                    {status === 'error' && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>🔴 Нет связи с сервером</p>}
                </div>

                {/* Message */}
                {msg && (
                    <div className="fade-in" style={{
                        maxWidth: 740, margin: '0 auto 16px',
                        padding: '12px 18px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                        background: msg.type === 'ok' ? '#f0fdf4' : '#fff1f2',
                        border: `1.5px solid ${msg.type === 'ok' ? '#86efac' : '#fca5a5'}`,
                        color: msg.type === 'ok' ? '#15803d' : '#dc2626',
                        whiteSpace: 'pre-wrap', fontFamily: msg.type === 'ok' ? "'Nunito'" : "'DM Mono', monospace",
                    }}>
                        {msg.text}
                    </div>
                )}

                {/* Add form card */}
                <div style={{ maxWidth: 740, margin: '0 auto 20px', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(99,102,241,0.10)', padding: '24px 28px' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📕</span>
                        Добавить новый контакт
                    </h2>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                        <TextField
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Имя *"
                            icon="👤"
                            style={{ flex: '1 1 160px' }}
                        />
                        <PhoneInput
                            value={form.number}
                            onChange={(val) => setForm({ ...form, number: val })}
                            style={{ flex: '1 1 160px' }}
                        />
                        <TextField
                            value={form.note}
                            onChange={(e) => setForm({ ...form, note: e.target.value })}
                            placeholder="Заметка"
                            icon="📝"
                            style={{ flex: '1 1 120px' }}
                        />
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleAdd}
                        disabled={loading}
                        style={{
                            padding: '10px 24px', background: loading ? '#576fe0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: '#fff', border: 'none', borderRadius: 10, cursor: loading ? 'default' : 'pointer',
                            fontSize: 14, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
                            boxShadow: '0 4px 14px rgba(99,102,241,0.3)', letterSpacing: '0.01em',
                        }}
                    >
                        {loading ? '⏳ Сохранение...' : '➕ Добавить'}
                    </button>
                </div>

                {/* Contacts card */}
                <div style={{ maxWidth: 740, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(99,102,241,0.10)', padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📋</span>
                            Контакты
                            <span style={{ background: '#f1f4fd', color: '#6366f1', borderRadius: 99, padding: '2px 10px', fontSize: 13, fontWeight: 700 }}>{contacts.length}</span>
                        </h2>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <TextField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." icon="🔍" style={{ minWidth: 180 }} />
                            <button onClick={loadContacts} style={{ padding: '9px 14px', background: '#f1f4fd', border: '2px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', fontSize: 14, color: '#64748b', fontFamily: "'Nunito'" }}>🔄</button>
                        </div>
                    </div>

                    {filtered.length === 0 && status === 'ok' ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                            <div style={{ fontSize: 36, marginBottom: 10 }}>🕳️</div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>{search ? 'Ничего не найдено' : 'Контактов пока нет'}</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {filtered.map((c) => (
                                editId === c.id ? (
                                    <div key={c.id} className="fade-in" style={{ background: '#fafbff', border: '2px solid #c7d2fe', borderRadius: 12, padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                                            <TextField value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="ФИО *" icon="👤" />
                                            <PhoneInput value={editForm.number} onChange={(val) => setEditForm({ ...editForm, number: val })} />
                                            <TextField value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} placeholder="Заметка" icon="📝" />
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={handleUpdate} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Nunito'" }}>💾 Сохранить</button>
                                            <button onClick={() => setEditId(null)} style={{ padding: '8px 18px', background: '#f1f5f9', color: '#64748b', border: '2px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Nunito'" }}>✖ Отмена</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={c.id} className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px', borderRadius: 12, background: 'transparent' }}>
                                        {/* Avatar */}
                                        <div style={{ width: 42, height: 42, borderRadius: 12, background: getColor(c.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0, letterSpacing: '0.02em' }}>
                                            {getInitials(c.name)}
                                        </div>
                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                                            <div style={{ color: '#6366f1', fontSize: 13, fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em', marginTop: 2 }}>
                                                {'+7 (' + formatPhone(c.number)}
                                            </div>
                                            {c.note && <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2, fontStyle: 'italic' }}>{c.note}</div>}
                                        </div>
                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="action-btn" onClick={() => startEdit(c)} title="Изменить"
                                                    style={{ width: 34, height: 34, borderRadius: 8, background: '#fff7ed', border: '1.5px solid #fed7aa', color: '#f97316', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
                                            <button className="action-btn" onClick={() => handleDelete(c.id)} title="Удалить"
                                                    style={{ width: 34, height: 34, borderRadius: 8, background: '#fff1f2', border: '1.5px solid #fecaca', color: '#ef4444', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑</button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}