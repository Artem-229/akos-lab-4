import Avatar from "./Avatar";
import { TAGS } from "./constants";

export default function ContactDetail({ contact, onEdit, onDelete, onClose, deleting, isMobile }) {
  const [bgColor] = [contact.full_name];
  const tag = TAGS.find(t => t.label === contact.tag);

  const content = (
    <div style={{
      background: "rgba(255,255,255,0.97)",
      borderRadius: isMobile ? "28px 28px 0 0" : 24,
      overflow: "hidden",
      boxShadow: isMobile ? "0 -8px 60px rgba(0,0,0,0.12)" : "0 8px 40px rgba(167,139,250,0.12)",
      border: isMobile ? "none" : "1px solid rgba(233,213,255,0.6)",
      animation: isMobile ? "slideUp 0.3s ease" : "slideInRight 0.3s ease",
    }}>
      {isMobile && (
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e5e7eb" }} />
        </div>
      )}

      <div style={{ padding: "24px", borderBottom: "1px solid rgba(233,213,255,0.4)", background: "linear-gradient(135deg, #f5f0ff, #fdf8ff)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <Avatar name={contact.full_name} size={60} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {contact.full_name}
            </h2>
            {tag && (
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700,
                color: tag.color, background: tag.bg,
                border: `1px solid ${tag.color}66`,
                borderRadius: 20, padding: "2px 10px",
              }}>
                {tag.label}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.7)", border: "none", borderRadius: "50%",
            width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#9ca3af",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>×</button>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{ background: "#fafafa", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
            📞 Телефон
          </p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e" }}>{contact.phone}</p>
        </div>

        {contact.note && (
          <div style={{ background: "#fffbf0", borderRadius: 14, padding: "16px", marginBottom: 12, border: "1px solid #fef3c7" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              💬 Заметка
            </p>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{contact.note}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={() => onEdit(contact)}
            style={{ flex: 1, padding: "12px", background: "#f5f0ff", border: "1px solid #e9d5ff", borderRadius: 14, fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: "#7c3aed", cursor: "pointer" }}
          >✏️ Изменить</button>
          <button
            onClick={() => onDelete(contact.id)}
            disabled={deleting === contact.id}
            style={{ flex: 1, padding: "12px", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 14, fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: "#ef4444", cursor: "pointer", opacity: deleting === contact.id ? 0.5 : 1 }}
          >
            {deleting === contact.id ? "⏳" : "🗑️ Удалить"}
          </button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{ position: "fixed", inset: 0, background: "rgba(15,15,35,0.3)", zIndex: 150, backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end" }}
      >
        {content}
      </div>
    );
  }

  return content;
}
