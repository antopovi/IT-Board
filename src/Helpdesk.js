// ============================================================
// HELPDESK - Gestione Ticket IT | Gruppo Casillo
// Sezione per apertura e gestione richieste di assistenza IT
// ============================================================
import React, { useState, useMemo } from "react";
import styled from "styled-components";

// ========================
// STYLED COMPONENTS
// ========================
const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;
  .material-icons {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #a0aec0;
  }
  input {
    width: 100%;
    padding: 8px 12px 8px 36px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
    }
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  outline: none;
  cursor: pointer;
  &:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  }
`;

const NewButton = styled.button`
  width: 100%;
  margin-bottom: 24px;
  padding: 14px;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #718096;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  &:hover {
    border-color: #1a73e8;
    color: #1a73e8;
    background: rgba(26, 115, 232, 0.04);
  }
`;

const PRIORITY_STYLES = {
  critical: { border: "#e53e3e", bg: "#fff5f5", badge: "#e53e3e", badgeBg: "#fed7d7", label: "Critico", icon: "error" },
  warning: { border: "#d69e2e", bg: "#fffff0", badge: "#b7791f", badgeBg: "#fefcbf", label: "Attenzione", icon: "warning" },
  info: { border: "#3182ce", bg: "#ebf8ff", badge: "#2b6cb0", badgeBg: "#bee3f8", label: "Normale", icon: "info" },
};

const STATUS_STYLES = {
  aperto: { badge: "#2b6cb0", badgeBg: "#bee3f8", label: "Aperto", icon: "inbox" },
  in_corso: { badge: "#b7791f", badgeBg: "#fefcbf", label: "In Corso", icon: "autorenew" },
  risolto: { badge: "#2f855a", badgeBg: "#c6f6d5", label: "Risolto", icon: "check_circle" },
  chiuso: { badge: "#4a5568", badgeBg: "#e2e8f0", label: "Chiuso", icon: "lock" },
};

const STATUS_ORDER = ["aperto", "in_corso", "risolto", "chiuso"];

const CATEGORIES = ["Tutte", "SAP", "Rete", "Sicurezza", "Applicazioni", "Hardware", "Formazione", "Altro"];

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: box-shadow 0.2s;
  opacity: ${(props) => (props.closed ? 0.6 : 1)};
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardInner = styled.div`
  border-left: 4px solid ${(props) => props.borderColor};
  padding: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => props.bg || "#f0f0f0"};
  color: ${(props) => props.color || "#4a5568"};
  border: 1px solid ${(props) => props.borderColor || "transparent"};
  .material-icons {
    font-size: 14px;
  }
`;

const TicketId = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #a0aec0;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1a202c;
  margin: 4px 0 0;
  line-height: 1.3;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconButton = styled.button`
  padding: 6px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #a0aec0;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  .material-icons {
    font-size: 18px;
  }
  &:hover {
    color: ${(props) => props.hoverColor || "#4a5568"};
    background: ${(props) => props.hoverBg || "#f7fafc"};
  }
`;

const CardPreview = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #718096;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardBody = styled.div`
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background: ${(props) => props.bg};
  p {
    font-size: 14px;
    color: #4a5568;
    line-height: 1.6;
    margin: 0;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const FooterMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #a0aec0;
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .material-icons {
    font-size: 14px;
  }
`;

const StatusSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  background: #fff;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  .material-icons {
    font-size: 40px;
    color: #cbd5e0;
    margin-bottom: 12px;
  }
  p {
    color: #718096;
    font-size: 14px;
    margin: 0;
  }
  small {
    color: #a0aec0;
    font-size: 12px;
  }
`;

const FormContainer = styled.form`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1a202c;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .material-icons {
    color: #1a73e8;
  }
`;

const FormField = styled.div`
  margin-bottom: 16px;
  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 4px;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    font-family: inherit;
    &:focus {
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
    }
  }
  textarea {
    resize: none;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const ButtonSecondary = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #f0f0f0;
  color: #4a5568;
  transition: background 0.2s;
  &:hover {
    background: #e2e8f0;
  }
`;

const ButtonPrimary = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #1a73e8;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  .material-icons {
    font-size: 18px;
  }
  &:hover {
    background: #1557b0;
  }
`;

// ========================
// DATI DI ESEMPIO
// ========================
const INITIAL_TICKETS = [
  {
    id: "TKT-1042",
    title: "Outlook non si connette al server Exchange",
    description: "Da questa mattina Outlook mostra errore di connessione al server. Ho già riavviato il PC ma il problema persiste. Impossibile inviare o ricevere email.",
    status: "in_corso",
    priority: "critical",
    category: "Applicazioni",
    requester: "Maria Rossi - Amministrazione",
    assignee: "IT Helpdesk",
    createdAt: "2026-04-21T08:30:00",
    updatedAt: "2026-04-22T09:15:00",
  },
  {
    id: "TKT-1041",
    title: "Richiesta nuova casella email per collaboratore",
    description: "Serve attivare la casella email per il nuovo collaboratore Luca Bianchi (assunto dal 02/05). Dominio molinocasillo.it, gruppo Commerciale.",
    status: "aperto",
    priority: "info",
    category: "Applicazioni",
    requester: "HR - Giulia Verdi",
    assignee: "",
    createdAt: "2026-04-21T14:20:00",
    updatedAt: "2026-04-21T14:20:00",
  },
  {
    id: "TKT-1040",
    title: "Stampante piano 2 Corato non stampa",
    description: "La stampante multifunzione Ricoh del piano 2 segnala errore 'toner exhausted' ma il toner è stato appena sostituito.",
    status: "aperto",
    priority: "warning",
    category: "Hardware",
    requester: "Andrea Lops - Logistica",
    assignee: "IT Helpdesk",
    createdAt: "2026-04-20T10:05:00",
    updatedAt: "2026-04-20T10:05:00",
  },
  {
    id: "TKT-1039",
    title: "Reset password VPN",
    description: "Non riesco più ad accedere alla VPN dal portatile aziendale. Probabile password scaduta.",
    status: "risolto",
    priority: "info",
    category: "Rete",
    requester: "Paolo Neri - Commerciale",
    assignee: "IT Security",
    createdAt: "2026-04-19T09:00:00",
    updatedAt: "2026-04-19T11:30:00",
  },
  {
    id: "TKT-1038",
    title: "Accesso negato a cartella condivisa \\\\fileserver\\Progetti",
    description: "Dopo l'ultimo aggiornamento non accedo più alla cartella condivisa dei progetti. Ricevo errore 'accesso negato'.",
    status: "chiuso",
    priority: "warning",
    category: "Rete",
    requester: "Francesca Pugliese - Qualità",
    assignee: "IT Infrastructure",
    createdAt: "2026-04-15T13:45:00",
    updatedAt: "2026-04-18T16:00:00",
  },
];

// ========================
// SUB-COMPONENTS
// ========================
function TicketCard({ ticket, onDelete, onStatusChange, isAdmin }) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_STYLES[ticket.priority];
  const status = STATUS_STYLES[ticket.status];
  const isClosed = ticket.status === "chiuso";

  return (
    <Card closed={isClosed}>
      <CardInner borderColor={priority.border}>
        <CardHeader>
          <div style={{ flex: 1, minWidth: 0 }}>
            <BadgeRow>
              <Badge bg={status.badgeBg} color={status.badge}>
                <span className="material-icons">{status.icon}</span>
                {status.label}
              </Badge>
              <Badge bg={priority.badgeBg} color={priority.badge}>
                <span className="material-icons">{priority.icon}</span>
                {priority.label}
              </Badge>
              <Badge>{ticket.category}</Badge>
            </BadgeRow>
            <TicketId>{ticket.id}</TicketId>
            <CardTitle>{ticket.title}</CardTitle>
          </div>
          <CardActions>
            {isAdmin && (
              <IconButton
                hoverColor="#e53e3e"
                hoverBg="#fff5f5"
                onClick={() => onDelete(ticket.id)}
                title="Elimina ticket"
              >
                <span className="material-icons">delete</span>
              </IconButton>
            )}
            <IconButton onClick={() => setExpanded(!expanded)}>
              <span className="material-icons">{expanded ? "expand_less" : "expand_more"}</span>
            </IconButton>
          </CardActions>
        </CardHeader>

        {!expanded && <CardPreview>{ticket.description}</CardPreview>}
        {expanded && (
          <CardBody bg={priority.bg}>
            <p>{ticket.description}</p>
          </CardBody>
        )}

        <CardFooter>
          <FooterMeta>
            <span>
              <span className="material-icons">person</span>
              {ticket.requester}
            </span>
            {ticket.assignee && (
              <span>
                <span className="material-icons">engineering</span>
                {ticket.assignee}
              </span>
            )}
            <span>
              <span className="material-icons">schedule</span>
              {new Date(ticket.createdAt).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </FooterMeta>
          {isAdmin ? (
            <StatusSelect
              value={ticket.status}
              onChange={(e) => onStatusChange(ticket.id, e.target.value)}
              title="Cambia stato"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_STYLES[s].label}
                </option>
              ))}
            </StatusSelect>
          ) : null}
        </CardFooter>
      </CardInner>
    </Card>
  );
}

function NewTicketForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "info",
    category: "Applicazioni",
    requester: sessionStorage.getItem("User") || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.requester.trim()) return;
    const now = new Date().toISOString();
    onAdd({
      id: `TKT-${Date.now().toString().slice(-6)}`,
      title: form.title.trim(),
      description: form.description.trim(),
      status: "aperto",
      priority: form.priority,
      category: form.category,
      requester: form.requester.trim(),
      assignee: "",
      createdAt: now,
      updatedAt: now,
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>
        <h3>
          <span className="material-icons">support_agent</span>
          Nuovo Ticket
        </h3>
        <IconButton type="button" onClick={onCancel}>
          <span className="material-icons">close</span>
        </IconButton>
      </FormHeader>

      <FormField>
        <label>Titolo</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Es: Outlook non si avvia..."
          required
        />
      </FormField>

      <FormField>
        <label>Descrizione</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descrivi il problema o la richiesta in dettaglio..."
          rows={4}
          required
        />
      </FormField>

      <FormRow>
        <FormField>
          <label>Priorità</label>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="info">Normale</option>
            <option value="warning">Attenzione</option>
            <option value="critical">Critico</option>
          </select>
        </FormField>
        <FormField>
          <label>Categoria</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.filter((c) => c !== "Tutte").map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FormField>
      </FormRow>

      <FormField>
        <label>Richiedente</label>
        <input
          type="text"
          value={form.requester}
          onChange={(e) => setForm({ ...form, requester: e.target.value })}
          placeholder="Nome Cognome - Reparto"
          required
        />
      </FormField>

      <FormActions>
        <ButtonSecondary type="button" onClick={onCancel}>Annulla</ButtonSecondary>
        <ButtonPrimary type="submit">
          <span className="material-icons">send</span>
          Apri Ticket
        </ButtonPrimary>
      </FormActions>
    </FormContainer>
  );
}

// ========================
// MAIN COMPONENT
// ========================
export default function Helpdesk({ isAdmin }) {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tutte");
  const [selectedStatus, setSelectedStatus] = useState("open");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        if (selectedStatus === "open" && (t.status === "risolto" || t.status === "chiuso")) return false;
        if (selectedStatus !== "open" && selectedStatus !== "all" && t.status !== selectedStatus) return false;
        if (selectedCategory !== "Tutte" && t.category !== selectedCategory) return false;
        if (selectedPriority !== "all" && t.priority !== selectedPriority) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.requester.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const statusOrder = { aperto: 0, in_corso: 1, risolto: 2, chiuso: 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        const priorityOrder = { critical: 0, warning: 1, info: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tickets, searchQuery, selectedCategory, selectedStatus, selectedPriority]);

  const handleAdd = (ticket) => {
    setTickets([ticket, ...tickets]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setTickets(
      tickets.map((t) =>
        t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  return (
    <>
      <Toolbar>
        <SearchBox>
          <span className="material-icons">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca ticket per titolo, ID o richiedente..."
          />
        </SearchBox>
        <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="open">Attivi (aperti + in corso)</option>
          <option value="all">Tutti gli stati</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{STATUS_STYLES[s].label}</option>
          ))}
        </Select>
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
        <Select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
          <option value="all">Tutte le priorità</option>
          <option value="critical">Critico</option>
          <option value="warning">Attenzione</option>
          <option value="info">Normale</option>
        </Select>
      </Toolbar>

      {!showForm && (
        <NewButton onClick={() => setShowForm(true)}>
          <span className="material-icons">add</span>
          Apri nuovo Ticket
        </NewButton>
      )}
      {showForm && <NewTicketForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}

      <CardList>
        {filteredTickets.length === 0 ? (
          <EmptyState>
            <span className="material-icons">support_agent</span>
            <p>Nessun ticket trovato</p>
            <small>Prova a modificare i filtri o apri un nuovo ticket</small>
          </EmptyState>
        ) : (
          filteredTickets.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              isAdmin={isAdmin}
            />
          ))
        )}
      </CardList>
    </>
  );
}
