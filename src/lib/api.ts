const API_URL = '/api';

export const fetchCurrentUser = () => fetch(`${API_URL}/users/current`).then(res => res.json());
export const fetchMembers = () => fetch(`${API_URL}/members`).then(res => res.json());
export const fetchProjects = () => fetch(`${API_URL}/projects`).then(res => res.json());
export const fetchProject = (id: string) => fetch(`${API_URL}/projects/${id}`).then(res => res.json());
export const fetchTasks = () => fetch(`${API_URL}/tasks`).then(res => res.json());
export const fetchTask = (id: string) => fetch(`${API_URL}/tasks/${id}`).then(res => res.json());
export const fetchEvents = () => fetch(`${API_URL}/events`).then(res => res.json());
export const fetchNotifications = () => fetch(`${API_URL}/notifications`).then(res => res.json());
export const fetchRecommendations = () => fetch(`${API_URL}/recommendations`).then(res => res.json());
export const fetchCompetences = () => fetch(`${API_URL}/lists/competences`).then(res => res.json());
export const fetchFacultes = () => fetch(`${API_URL}/lists/facultes`).then(res => res.json());
