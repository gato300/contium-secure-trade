import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import { mockUsers, roleLabels } from '@/lib/mockData';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a <span className="text-gradient">CONTIUM</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Plataforma de verificación documental con arquitectura Zero Trust para comercio exterior.
          </p>
          
          <div className="mt-12 p-6 rounded-xl bg-card/50 backdrop-blur border border-border/50">
            <Lock className="w-6 h-6 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Esta es una <strong>demo técnica</strong>. Selecciona un rol para explorar la plataforma con permisos simulados.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col p-6 lg:p-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="self-start mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <div className="text-center mb-8 lg:hidden">
              <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">CONTIUM</h1>
            </div>

            <h2 className="text-2xl font-bold mb-2">Selecciona tu rol</h2>
            <p className="text-muted-foreground mb-8">
              Cada rol tiene permisos y vistas específicas en la plataforma.
            </p>

            <RoleSelector 
              selectedRole={selectedRole} 
              onSelectRole={setSelectedRole} 
            />

            {/* Login button */}
            {selectedRole && (
              <div className="mt-8 animate-fade-in">
                <div className="glass-card p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <p className="font-medium">{mockUsers[selectedRole].name}</p>
                      <p className="text-xs text-muted-foreground">{mockUsers[selectedRole].company}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={handleLogin}
                >
                  Ingresar como {roleLabels[selectedRole]}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
