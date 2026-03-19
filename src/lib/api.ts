import type { Event, Notification, Project, ProjectMember, Recommendation, Task, User } from "./types";

const storage = {
  token: "auth_token",
  email: "auth_email",
} as const;

type ProjetRaw = {
  id?: unknown;
  titre?: unknown;
  desc?: unknown;
  chefProjet?: unknown;
  organisation?: unknown;
  deadline?: unknown;
  status?: unknown;
  progression?: unknown;
  membres?: unknown;
  ressources?: unknown;
};

type RessourceRaw = {
  nom?: unknown;
  valeur?: unknown;
};

type TacheRaw = {
  id?: unknown;
  titre?: unknown;
  description?: unknown;
  echeance?: unknown;
  status?: unknown;
  progression?: unknown;
};

type UserRaw = {
  id?: unknown;
  email?: unknown;
  name?: unknown;
  role?: unknown;
};

function getAuthToken() {
  return localStorage.getItem(storage.token);
}

function getAuthEmail() {
  return localStorage.getItem(storage.email) || "";
}

function asString(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v);
}

function asNumber(v: unknown): number {
  if (v === undefined || v === null) return 0;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function apiJson<T>(input: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(input, {
    ...init,
    headers,
  });

  if (!res.ok) {
    // For some screens we prefer "empty" over failing the whole UI.
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

function mapProjectStatus(status: string | undefined): Project["statut"] {
  switch ((status || "").toUpperCase()) {
    case "EN_ATTENTE":
      return "Planifié";
    case "EN_COURS":
      return "En cours";
    case "TERMINE":
      return "Terminé";
    case "ANNULE":
      return "Planifié";
    default:
      return "Planifié";
  }
}

function mapTaskStatus(status: string | undefined): Task["statut"] {
  switch ((status || "").toUpperCase()) {
    case "EN_ATTENTE":
      return "Non commencée";
    case "EN_COURS":
      return "En cours";
    case "TERMINE":
      return "Terminée";
    case "ANNULE":
      return "Non commencée";
    default:
      return "Non commencée";
  }
}

function mapProject(p: ProjetRaw): Project {
  const emails: string[] = Array.isArray(p.membres) ? (p.membres as unknown[]).map(asString) : [];
  const chefEmail: string = asString(p.chefProjet);

  return {
    id: asString(p.id),
    titre: asString(p.titre),
    description: asString(p.desc),
    categorie: asString(p.organisation),
    dateDebut: "", // not present in current backend entity shape
    dateFin: p.deadline ? asString(p.deadline) : "",
    chefDeProjet: chefEmail,
    chefDeProjetNom: chefEmail,
    statut: mapProjectStatus(asString(p.status)),
    progression: asNumber(p.progression),
    membres: emails.map((email) => ({
      id: email,
      userId: email,
      nom: email,
      email,
      role: email === chefEmail ? "Chef" : "Membre actif",
    })),
    ressources: (
      Array.isArray(p.ressources) ? (p.ressources as unknown[]).map((r) => r as RessourceRaw) : []
    ).map((r) => ({
      nom: asString(r.nom),
      lien: asString(r.valeur),
    })),
  };
}

function mapTask(t: TacheRaw, projectId: string, assigneeEmail: string): Task {
  return {
    id: asString(t.id),
    titre: asString(t.titre),
    description: asString(t.description),
    assigneA: assigneeEmail,
    assigneNom: assigneeEmail,
    dateDebut: "",
    deadline: t.echeance ? asString(t.echeance) : "",
    priorite: "Low",
    statut: mapTaskStatus(asString(t.status)),
    projectId,
  };
}

export const fetchCurrentUser = async (): Promise<User | null> => {
  const email = getAuthEmail();
  if (!email) return null;

  try {
    const u = await apiJson<UserRaw>(`/auth/users/${encodeURIComponent(email)}`);
    const name = asString(u.name || u.email);
    const parts = String(name).trim().split(/\s+/);
    const prenom = parts.length > 1 ? parts[0] : name;
    const nom = parts.length > 1 ? parts.slice(1).join(" ") : "";

    return {
      id: asString(u.id),
      prenom,
      nom,
      email: asString(u.email) || email,
      role: ((): User["role"] => {
        const r = asString(u.role).toUpperCase();
        if (r === "ORGANISATION") return "organization";
        if (r === "ADMIN") return "admin";
        return "student";
      })(),
      avatar: undefined,
      faculte: "",
      specialite: "",
      competences: [],
      idUniversitaire: "",
    };
  } catch {
    return null;
  }
};

export const fetchMembers = async (): Promise<ProjectMember[]> => {
  // Not implemented in current Spring services.
  return [];
};

export const fetchProjects = async (): Promise<Project[]> => {
  const projectsRaw = await apiJson<ProjetRaw[]>(`/projets`);
  return projectsRaw.map(mapProject);
};

export const fetchProject = async (id: string): Promise<Project> => {
  const p = await apiJson<ProjetRaw>(`/projets/${encodeURIComponent(id)}`);
  return mapProject(p);
};

export const fetchTasks = async (): Promise<Task[]> => {
  const email = getAuthEmail();
  if (!email) return [];

  const projectsRaw = await apiJson<ProjetRaw[]>(`/projets`);
  const projectIds = projectsRaw.map((p) => asString(p.id)).filter(Boolean);

  const tasksNested = await Promise.all(
    projectIds.map(async (projectId) => {
      try {
        const tasksRaw = await apiJson<TacheRaw[]>(
          `/projets/${encodeURIComponent(projectId)}/taches/membre/${encodeURIComponent(email)}`
        );
        return tasksRaw.map((t) => mapTask(t, projectId, email));
      } catch {
        return [];
      }
    })
  );

  return tasksNested.flat();
};

export const fetchTask = async (id: string): Promise<Task | undefined> => {
  const tasks = await fetchTasks();
  return tasks.find((t) => t.id === id);
};

// Endpoints not present in current Spring services yet.
// Return empty arrays so the UI doesn't crash on 404s.
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    return await apiJson<Event[]>(`/events`);
  } catch {
    return [];
  }
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    return await apiJson<Notification[]>(`/notifications`);
  } catch {
    return [];
  }
};

export const fetchRecommendations = async (): Promise<Recommendation[]> => {
  try {
    return await apiJson<Recommendation[]>(`/recommendations`);
  } catch {
    return [];
  }
};

export const fetchCompetences = async (): Promise<string[]> => {
  try {
    return await apiJson<string[]>(`/lists/competences`);
  } catch {
    return [];
  }
};

export const fetchFacultes = async (): Promise<string[]> => {
  try {
    return await apiJson<string[]>(`/lists/facultes`);
  } catch {
    return [];
  }
};
