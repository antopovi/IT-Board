// ============================================================
// IT BOARD - Bacheca Annunci IT | Gruppo Casillo
// Componente React per il portale webapp.molinocasillo.it
// ============================================================
import React, { useState, useMemo } from "react";
import styled from "styled-components";

// ========================
// STYLED COMPONENTS
// ========================
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Header = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #1a73e8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(26, 115, 232, 0.3);
  color: white;
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
  }
  p {
    font-size: 12px;
    color: #718096;
    margin: 0;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AdminButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.active ? "#1a73e8" : "#f0f0f0")};
  color: ${(props) => (props.active ? "#fff" : "#4a5568")};
  &:hover {
    background: ${(props) => (props.active ? "#1557b0" : "#e2e8f0")};
  }
`;

const BackButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    background: #f7fafc;
  }
`;

const StatBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => props.bg};
  color: ${(props) => props.color};
`;

const StatDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => props.color};
`;

const Main = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
`;

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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #718096;
  cursor: pointer;
  white-space: nowrap;
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

// Card annuncio
const PRIORITY_STYLES = {
  critical: { border: "#e53e3e", bg: "#fff5f5", badge: "#e53e3e", badgeBg: "#fed7d7", label: "Critico", icon: "error" },
  warning: { border: "#d69e2e", bg: "#fffff0", badge: "#b7791f", badgeBg: "#fefcbf", label: "Attenzione", icon: "warning" },
  info: { border: "#3182ce", bg: "#ebf8ff", badge: "#2b6cb0", badgeBg: "#bee3f8", label: "Informativo", icon: "info" },
};

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: box-shadow 0.2s;
  opacity: ${(props) => (props.expired ? 0.5 : 1)};
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

const CardTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
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
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const FooterMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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

const ExpiryLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.urgent ? "#e53e3e" : "#a0aec0")};
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

const Footer = styled.footer`
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  p {
    font-size: 12px;
    color: #a0aec0;
    margin: 0;
  }
`;

// Form styled components
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
const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Manutenzione programmata SAP ECC",
    body: "Sabato 12 aprile dalle ore 06:00 alle 12:00 il sistema SAP sar\u00e0 non disponibile per attivit\u00e0 di manutenzione e aggiornamento kernel. Tutti i moduli (FI, CO, MM, SD, PP, QM, WM) saranno interessati. Si prega di completare le attivit\u00e0 urgenti entro venerd\u00ec sera.",
    priority: "critical",
    author: "IT Infrastructure",
    createdAt: "2026-04-09",
    expiresAt: "2026-04-13",
    category: "SAP",
  },
  {
    id: 2,
    title: "Nuova VPN aziendale attiva da luned\u00ec",
    body: "Da luned\u00ec 14 aprile sar\u00e0 attiva la nuova VPN GlobalProtect. Le credenziali restano invariate (dominio CASILLO). Scaricare il nuovo client dal portale Self-Service IT. La vecchia VPN verr\u00e0 disattivata il 21 aprile.",
    priority: "warning",
    author: "IT Security",
    createdAt: "2026-04-08",
    expiresAt: "2026-04-21",
    category: "Rete",
  },
  {
    id: 3,
    title: "Aggiornamento policy password",
    body: "Ricordiamo che dal 1\u00b0 maggio entra in vigore la nuova policy password: minimo 12 caratteri, almeno 1 maiuscola, 1 numero e 1 carattere speciale. Il cambio password verr\u00e0 richiesto automaticamente al prossimo login dopo tale data.",
    priority: "info",
    author: "IT Security",
    createdAt: "2026-04-07",
    expiresAt: "2026-05-15",
    category: "Sicurezza",
  },
  {
    id: 4,
    title: "Nuovo portale documentale SharePoint",
    body: "\u00c8 disponibile il nuovo portale documentale su SharePoint Online per la condivisione dei documenti di progetto. Accesso tramite SSO con le credenziali aziendali Microsoft 365. Formazione online disponibile su Teams.",
    priority: "info",
    author: "IT Applications",
    createdAt: "2026-04-05",
    expiresAt: "2026-05-05",
    category: "Applicazioni",
  },
  {
    id: 5,
    title: "Disservizio stampanti sede Corato",
    body: "Segnaliamo un disservizio temporaneo sulle stampanti di rete della sede di Corato (piano 1 e piano 2). Il team IT sta lavorando alla risoluzione. Utilizzare temporaneamente la stampante del piano terra.",
    priority: "warning",
    author: "IT Helpdesk",
    createdAt: "2026-04-10",
    expiresAt: "2026-04-11",
    category: "Hardware",
  },
  {
    id: 6,
    title: "Workshop: Introduzione a Claude AI per l'ufficio",
    body: "Gioved\u00ec 17 aprile alle 15:00 in sala riunioni Bari si terr\u00e0 un workshop introduttivo su Claude AI e le sue applicazioni in ambito aziendale. Iscrizioni aperte tramite il modulo su Teams. Posti limitati a 20 partecipanti.",
    priority: "info",
    author: "Antonio Povia - IT",
    createdAt: "2026-04-10",
    expiresAt: "2026-04-17",
    category: "Formazione",
  },
];

const CATEGORIES = ["Tutte", "SAP", "Rete", "Sicurezza", "Applicazioni", "Hardware", "Formazione"];

// ========================
// SUB-COMPONENTS
// ========================
function AnnouncementCard({ announcement, onDelete, isAdmin }) {
  const [expanded, setExpanded] = useState(false);
  const style = PRIORITY_STYLES[announcement.priority];
  const isExpired = new Date(announcement.expiresAt) < new Date();
  const daysLeft = Math.ceil(
    (new Date(announcement.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card expired={isExpired}>
      <CardInner borderColor={style.border}>
        <CardHeader>
          <div style={{ flex: 1, minWidth: 0 }}>
            <BadgeRow>
              <Badge bg={style.badgeBg} color={style.badge} borderColor={style.badgeBg}>
                <span className="material-icons">{style.icon}</span>
                {style.label}
              </Badge>
              <Badge>{announcement.category}</Badge>
              {isExpired && <Badge bg="#e2e8f0" color="#718096">Scaduto</Badge>}
            </BadgeRow>
            <CardTitle>{announcement.title}</CardTitle>
          </div>
          <CardActions>
            {isAdmin && (
              <IconButton hoverColor="#e53e3e" hoverBg="#fff5f5" onClick={() => onDelete(announcement.id)} title="Elimina">
                <span className="material-icons">delete</span>
              </IconButton>
            )}
            <IconButton onClick={() => setExpanded(!expanded)}>
              <span className="material-icons">{expanded ? "expand_less" : "expand_more"}</span>
            </IconButton>
          </CardActions>
        </CardHeader>

        {!expanded && <CardPreview>{announcement.body}</CardPreview>}
        {expanded && (
          <CardBody bg={style.bg}>
            <p>{announcement.body}</p>
          </CardBody>
        )}

        <CardFooter>
          <FooterMeta>
            <span>
              <span className="material-icons">edit</span>
              {announcement.author}
            </span>
            <span>
              <span className="material-icons">schedule</span>
              {new Date(announcement.createdAt).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </FooterMeta>
          {!isExpired && (
            <ExpiryLabel urgent={daysLeft <= 2}>
              {daysLeft === 0 ? "Scade oggi" : daysLeft === 1 ? "Scade domani" : `Scade tra ${daysLeft} giorni`}
            </ExpiryLabel>
          )}
        </CardFooter>
      </CardInner>
    </Card>
  );
}

function NewAnnouncementForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    body: "",
    priority: "info",
    category: "Applicazioni",
    author: "IT Team",
    expiresInDays: 7,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const today = new Date();
    const expires = new Date(today);
    expires.setDate(expires.getDate() + form.expiresInDays);
    onAdd({
      id: Date.now(),
      title: form.title,
      body: form.body,
      priority: form.priority,
      category: form.category,
      author: form.author,
      createdAt: today.toISOString().split("T")[0],
      expiresAt: expires.toISOString().split("T")[0],
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>
        <h3>
          <span className="material-icons">add</span>
          Nuovo Annuncio
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
          placeholder="Es: Manutenzione programmata server..."
          required
        />
      </FormField>

      <FormField>
        <label>Messaggio</label>
        <textarea
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Descrivi i dettagli dell'annuncio..."
          rows={3}
          required
        />
      </FormField>

      <FormRow>
        <FormField>
          <label>Priorit\u00e0</label>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="info">Informativo</option>
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

      <FormRow>
        <FormField>
          <label>Autore</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
        </FormField>
        <FormField>
          <label>Scade tra (giorni)</label>
          <input
            type="number"
            value={form.expiresInDays}
            onChange={(e) => setForm({ ...form, expiresInDays: parseInt(e.target.value) || 1 })}
            min={1}
            max={90}
          />
        </FormField>
      </FormRow>

      <FormActions>
        <ButtonSecondary type="button" onClick={onCancel}>Annulla</ButtonSecondary>
        <ButtonPrimary type="submit">
          <span className="material-icons">check</span>
          Pubblica Annuncio
        </ButtonPrimary>
      </FormActions>
    </FormContainer>
  );
}

// ========================
// MAIN COMPONENT
// ========================
export default function ITBoard({ onBack }) {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tutte");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showExpired, setShowExpired] = useState(false);

  const filteredAnnouncements = useMemo(() => {
    return announcements
      .filter((a) => {
        if (!showExpired && new Date(a.expiresAt) < new Date()) return false;
        if (selectedCategory !== "Tutte" && a.category !== selectedCategory) return false;
        if (selectedPriority !== "all" && a.priority !== selectedPriority) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            a.title.toLowerCase().includes(q) ||
            a.body.toLowerCase().includes(q) ||
            a.author.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 };
        if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [announcements, searchQuery, selectedCategory, selectedPriority, showExpired]);

  const handleAdd = (item) => {
    setAnnouncements([item, ...announcements]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const stats = useMemo(() => {
    const active = announcements.filter((a) => new Date(a.expiresAt) >= new Date());
    return {
      total: active.length,
      critical: active.filter((a) => a.priority === "critical").length,
      warning: active.filter((a) => a.priority === "warning").length,
    };
  }, [announcements]);

  return (
    <PageContainer>
      {/* Link a Material Icons (da includere nel portale se non gi\u00e0 presente) */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />

      <Header>
        <HeaderLeft>
          {onBack && (
            <BackButton onClick={onBack}>
              <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span>
              Portale
            </BackButton>
          )}
          <HeaderIcon>
            <span className="material-icons" style={{ fontSize: 22 }}>campaign</span>
          </HeaderIcon>
          <HeaderTitle>
            <h1>IT Board</h1>
            <p>Bacheca Annunci IT \u2014 Gruppo Casillo</p>
          </HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <AdminButton active={isAdmin} onClick={() => setIsAdmin(!isAdmin)}>
            {isAdmin ? "Admin ON" : "Admin"}
          </AdminButton>
          {stats.critical > 0 && (
            <StatBadge bg="#fed7d7" color="#c53030">
              <StatDot color="#e53e3e" />
              {stats.critical}
            </StatBadge>
          )}
          {stats.warning > 0 && (
            <StatBadge bg="#fefcbf" color="#b7791f">
              <StatDot color="#d69e2e" />
              {stats.warning}
            </StatBadge>
          )}
          <StatBadge bg="#bee3f8" color="#2b6cb0">
            <StatDot color="#3182ce" />
            {stats.total} attivi
          </StatBadge>
        </HeaderRight>
      </Header>

      <Main>
        <Toolbar>
          <SearchBox>
            <span className="material-icons">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca annunci..."
            />
          </SearchBox>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
          <Select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
            <option value="all">Tutte le priorit\u00e0</option>
            <option value="critical">Critico</option>
            <option value="warning">Attenzione</option>
            <option value="info">Informativo</option>
          </Select>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={showExpired}
              onChange={(e) => setShowExpired(e.target.checked)}
            />
            Scaduti
          </CheckboxLabel>
        </Toolbar>

        {isAdmin && !showForm && (
          <NewButton onClick={() => setShowForm(true)}>
            <span className="material-icons">add</span>
            Nuovo Annuncio
          </NewButton>
        )}
        {isAdmin && showForm && (
          <NewAnnouncementForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        )}

        <CardList>
          {filteredAnnouncements.length === 0 ? (
            <EmptyState>
              <span className="material-icons">campaign</span>
              <p>Nessun annuncio trovato</p>
              <small>Prova a modificare i filtri di ricerca</small>
            </EmptyState>
          ) : (
            filteredAnnouncements.map((a) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                onDelete={handleDelete}
                isAdmin={isAdmin}
              />
            ))
          )}
        </CardList>

        <Footer>
          <p>IT Board v1.0 \u2014 Gruppo Casillo \u2014 Portale AWS</p>
        </Footer>
      </Main>
    </PageContainer>
  );
}
