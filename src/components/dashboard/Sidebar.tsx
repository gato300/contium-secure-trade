import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  FilePlus, 
  CheckCircle,
  LogOut,
  Package,
  ShoppingCart,
  FileCheck,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { roleLabels } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const roleIcons = {
  exportador: Package,
  importador: ShoppingCart,
  agente_aduanas: FileCheck,
  autoridad: Shield,
};

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const RoleIcon = roleIcons[user.role];

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
    ...(user.role === 'exportador' || user.role === 'agente_aduanas' 
      ? [{ icon: FilePlus, label: 'Registrar', path: '/register' }] 
      : []),
    ...(user.role === 'autoridad' 
      ? [{ icon: CheckCircle, label: 'Verificar', path: '/verify' }] 
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg text-sidebar-foreground">CONTIUM</span>
            <p className="text-xs text-sidebar-foreground/60">Demo</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 mx-4 mt-4 rounded-xl bg-sidebar-accent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <RoleIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{roleLabels[user.role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
