import { useState, useEffect, useCallback } from "react";
import { getContacts, createContact, updateContact, deleteContact } from "./api";
import { TAGS } from "./constants";
import Avatar from "./Avatar";
import Modal from "./Modal";
import ContactDetail from "./ContactDetail";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function PhoneBook() {
  const [contacts, setContacts]       = useState([]);
  const [search, setSearch]           = useState("");
  const [activeTag, setActiveTag]     = useState(null);
  const [modalContact, setModalContact] = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [selected, setSelected]       = useState(null);
  const [deleting, setDeleting]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);

  const isMobile = useIsMobile();

  const loadContacts = useCallback(async () => {
    try {
      const data = await getContacts();
      setContacts(Array.isArray(data) ? data : []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function handleSave(form) {
    if (modalContact) {
      await updateContact(modalContact.id, form);
    } else {
      await createContact(form);
    }
    await loadContacts();
  }

  async function handleDelete(id) {
    setDeleting(id);
    await deleteContact(id);
    if (selected?.id === id) setSelected(null);
    await loadContacts();
    setDeleting(null);
  }

  function openAddModal() {
    setModalContact(null);
    setShowModal(true);
  }

  function openEditModal(contact) {
    setModalContact(contact);
    setShowModal(true);
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone?.includes(search) ||
      contact.note?.toLowerCase().includes(search.toLowerCase());

    const matchesTag = !activeTag || contact.tag === activeTag;

    return matchesSearch && matchesTag;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fdf8ff; }
        @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp   { from { transform: translateY(100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(12px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes spin      { to { transform: rotate(360deg) } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #e9d5ff; border-radius: 2px; }
        ::placeholder { color: #d1d5db !important; }
      `}</style>

    
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 400, height: 400, top: "-10%", left: "-5%", borderRadius: "50%", background: "radial-gradient(circle, rgba(253,230,138,0.25), transparent 70%)", filter: "blur(40px)", animation: "floatA 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 300, height: 300, top: "60%", right: "-8%", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,181,253,0.2), transparent 70%)", filter: "blur(40px)", animation: "floatB 22s ease-in-out infinite" }} />
      </div>

      <div style={{ minHeight: "100vh", fontFamily: "'Nunito', sans-serif", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>

        <header style={{
          background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(233,213,255,0.5)",
          padding: "0 20px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>📒</span>
            <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 900, color: "#1a1a2e" }}>
              Телефонная <span style={{ color: "#a78bfa" }}>книга</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!isMobile && (
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", lineHeight: 1 }}>{contacts.length}</p>
                <p style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700 }}>КОНТАКТОВ</p>
              </div>
            )}
            <button onClick={openAddModal} style={{
              background: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
              border: "none", borderRadius: 14,
              padding: isMobile ? "8px 14px" : "10px 20px",
              fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 800,
              color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 16px rgba(167,139,250,0.4)",
            }}>+ Добавить</button>
          </div>
        </header>

        <main style={{
          flex: 1, display: "flex",
          flexDirection: isMobile ? "column" : "row",
          maxWidth: 1100, margin: "0 auto", width: "100%",
          padding: isMobile ? "16px 16px 90px" : "24px",
          gap: 20,
        }}>

    
          <div style={{ width: isMobile ? "100%" : 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск..."
                style={{
                  width: "100%", background: "rgba(255,255,255,0.8)",
                  border: "1.5px solid rgba(233,213,255,0.6)", borderRadius: 14,
                  padding: "11px 14px 11px 40px",
                  fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#1a1a2e", outline: "none",
                }}
                onFocus={e => e.target.style.borderColor = "#c4b5fd"}
                onBlur={e => e.target.style.borderColor = "rgba(233,213,255,0.6)"}
              />
            </div>

            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              <button
                onClick={() => setActiveTag(null)}
                style={{
                  flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: !activeTag ? "#ede9fe" : "rgba(255,255,255,0.7)",
                  fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
                  color: !activeTag ? "#7c3aed" : "#9ca3af",
                }}
              >
                Все · {contacts.length}
              </button>
              {TAGS.map(tag => (
                <button
                  key={tag.label}
                  onClick={() => setActiveTag(activeTag === tag.label ? null : tag.label)}
                  style={{
                    flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: activeTag === tag.label ? tag.bg : "rgba(255,255,255,0.7)",
                    fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
                    color: activeTag === tag.label ? tag.color : "#9ca3af",
                  }}
                >
                  {tag.label} · {contacts.filter(c => c.tag === tag.label).length}
                </button>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 20, border: "1px solid rgba(233,213,255,0.5)", flex: 1, overflow: "auto", padding: 8 }}>

              {loading && (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ width: 24, height: 24, border: "2px solid #e9d5ff", borderTopColor: "#a78bfa", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" }} />
                </div>
              )}

              {error && (
                <p style={{ fontSize: 12, color: "#f87171", fontWeight: 600, padding: 16 }}>
                  ⚠️ Сервер недоступен · порт 8080
                </p>
              )}

              {!loading && filteredContacts.length === 0 && (
                <p style={{ fontSize: 13, color: "#d1d5db", textAlign: "center", padding: 32 }}>Пусто</p>
              )}

              {filteredContacts.map((contact, index) => {
                const tag = TAGS.find(t => t.label === contact.tag);
                const isSelected = selected?.id === contact.id;

                return (
                  <div
                    key={contact.id}
                    onClick={() => setSelected(contact)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 12px", borderRadius: 14, cursor: "pointer",
                      background: isSelected ? "rgba(196,181,253,0.18)" : "transparent",
                      border: `1.5px solid ${isSelected ? "#c4b5fd" : "transparent"}`,
                      marginBottom: 2,
                      animation: `fadeIn 0.3s ease ${index * 0.04}s both`,
                    }}
                  >
                    <Avatar name={contact.full_name} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {contact.full_name}
                      </p>
                      <p style={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {contact.phone}
                      </p>
                    </div>
                    {tag && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: tag.color, flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {!isMobile && (
            <div style={{ flex: 1, minWidth: 0 }}>
              {selected ? (
                <ContactDetail
                  contact={selected}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onClose={() => setSelected(null)}
                  deleting={deleting}
                  isMobile={false}
                />
              ) : (
                <div style={{
                  height: "100%", minHeight: 400,
                  background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)",
                  borderRadius: 24, border: "1.5px dashed rgba(196,181,253,0.5)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 44, marginBottom: 12 }}>👈</span>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#c4b5fd" }}>Выберите контакт</p>
                  <p style={{ fontSize: 13, color: "#d1d5db", marginTop: 4 }}>чтобы увидеть детали</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {isMobile && selected && (
        <ContactDetail
          contact={selected}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onClose={() => setSelected(null)}
          deleting={deleting}
          isMobile={true}
        />
      )}

      {showModal && (
        <Modal
          contact={modalContact}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
