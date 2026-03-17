import { 
  LayoutDashboard, FolderKanban, CalendarDays, BarChart3, Bell, 
  Lightbulb, User, LogOut, GraduationCap, Building2, ShieldCheck,
  ListTodo, Users, Settings
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/lib/auth-context';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';

const studentNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Mes Projets', url: '/projects', icon: FolderKanban },
  { title: 'Mes Tâches', url: '/tasks', icon: ListTodo },
  { title: 'Événements', url: '/events', icon: CalendarDays },
  { title: 'Recommandations', url: '/recommendations', icon: Lightbulb },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Profil', url: '/profile', icon: User },
];

const orgNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Projets', url: '/projects', icon: FolderKanban },
  { title: 'Événements', url: '/events', icon: CalendarDays },
  { title: 'Membres', url: '/members', icon: Users },
  { title: 'Statistiques', url: '/statistics', icon: BarChart3 },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Profil', url: '/profile', icon: Settings },
];

const adminNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Étudiants', url: '/admin/students', icon: GraduationCap },
  { title: 'Organisations', url: '/admin/organizations', icon: Building2 },
  { title: 'Statistiques', url: '/statistics', icon: BarChart3 },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { userRole, userName, logout } = useAuth();

  const navItems = userRole === 'admin' ? adminNav : userRole === 'organization' ? orgNav : studentNav;
  const roleLabel = userRole === 'admin' ? 'Admin' : userRole === 'organization' ? 'Organisation' : 'Étudiant';
  const RoleIcon = userRole === 'admin' ? ShieldCheck : userRole === 'organization' ? Building2 : GraduationCap;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display font-bold text-sm text-sidebar-foreground">FST Projects</h2>
                <p className="text-xs text-sidebar-foreground/60">Faculté des Sciences</p>
              </div>
            </div>
          ) : (
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center mx-auto">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent">
              <RoleIcon className="h-4 w-4 text-sidebar-primary" />
              <span className="text-xs font-medium text-sidebar-accent-foreground">{roleLabel}</span>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User + Logout */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <User className="h-4 w-4 text-sidebar-foreground" />
                </div>
                <span className="text-xs text-sidebar-foreground truncate max-w-[120px]">{userName}</span>
              </div>
              <button onClick={logout} className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={logout} className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground mx-auto block">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
