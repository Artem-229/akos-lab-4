import { useState } from "react";
import { TAGS } from "./constants";

export default function Modal({ contact, onClose, onSave }) {
  const [form, setForm] = useState(
    contact || { full_name: "", phone: "", note: "", tag: "Другое" }
  );
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSave() {
    if (!form.full_name.trim() || !form.phone.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,15,35,0.35)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        zIndex: 200, backdropFilter: "blur(12px)",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "28px 28px 0 0",
        width: "100%", maxWidth: 600,
        boxShadow: "0 -8px 60px rgba(0,0,0,0.15)",
        animation: "slideUp 0.3s ease",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
        </div>

        <div style={{ padding: "16px 24px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 20, fontWeight: 800, color: "#1a1a2e" }}>
              {contact ? "✏️ Редактировать" : "✨ Новый контакт"}
            </h2>
            <button onClick={onClose} style={{
              background: "#f5f5f7", border: "none", borderRadius: "50%",
              width: 36, height: 36, cursor: "pointer", fontSize: 18, color: "#888",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            Категория
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {TAGS.map(tag => (
              <button
                key={tag.label}
                onClick={() => updateField("tag", tag.label)}
                style={{
                  background: form.tag === tag.label ? tag.bg : "#f5f5f7",
                  border: `2px solid ${form.tag === tag.label ? tag.color : "transparent"}`,
                  borderRadius: 20, padding: "6px 16px", cursor: "pointer",
                  fontSize: 13, fontWeight: 700,
                  color: form.tag === tag.label ? tag.color : "#9ca3af",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 8 }}>
            👤 ФИО
          </label>
          <input
            value={form.full_name}
            onChange={e => updateField("full_name", e.target.value)}
            placeholder="Иванов Иван Иванович"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#c4b5fd"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />

          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 8, marginTop: 16 }}>
            📞 Телефон
          </label>
          <input
            value={form.phone}
            onChange={e => updateField("phone", e.target.value)}
            placeholder="+7 (999) 000-00-00"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#c4b5fd"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />

          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 8, marginTop: 16 }}>
            💬 Заметка
          </label>
          <textarea
            value={form.note}
            onChange={e => updateField("note", e.target.value)}
            placeholder="Необязательно..."
            rows={3}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
            onFocus={e => e.target.style.borderColor = "#c4b5fd"}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={onClose} style={cancelButtonStyle}>Отмена</button>
            <button onClick={handleSave} disabled={saving} style={{ ...saveButtonStyle, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Сохранение..." : "💾 Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  background: "#fafafa", border: "1.5px solid #e5e7eb",
  borderRadius: 14, padding: "12px 14px",
  fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#1a1a2e",
  outline: "none",
};

const cancelButtonStyle = {
  flex: 1, padding: "14px", background: "#f5f5f7", border: "none",
  borderRadius: 14, fontFamily: "'Nunito', sans-serif",
  fontSize: 15, fontWeight: 700, color: "#9ca3af", cursor: "pointer",
};

const saveButtonStyle = {
  flex: 2, padding: "14px",
  background: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
  border: "none", borderRadius: 14, fontFamily: "'Nunito', sans-serif",
  fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer",
  boxShadow: "0 4px 20px rgba(167,139,250,0.4)",
};
