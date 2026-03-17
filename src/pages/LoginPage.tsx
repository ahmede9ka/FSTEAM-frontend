import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loginAs, setLoginAs] = useState<UserRole>('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const names: Record<UserRole, string> = { student: 'Ahmed Ben Ali', organization: 'Club IEEE FST', admin: 'Admin FST' };
    login(loginAs, names[loginAs]);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">FST Projects</span>
            </Link>
            <h1 className="font-display text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground mt-1">Accédez à votre espace</p>
          </div>

          {/* Demo role selector */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {(['student', 'organization', 'admin'] as UserRole[]).map(r => (
              <button key={r} onClick={() => setLoginAs(r)}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${loginAs === r ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {r === 'student' ? 'Étudiant' : r === 'organization' ? 'Organisation' : 'Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="votre.email@fst.utm.tn" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Link to="#" className="text-xs text-primary hover:underline">Mot de passe oublié ?</Link>
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Connexion</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Pas de compte ? <Link to="/signup/student" className="text-primary hover:underline">Créer un compte</Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="text-center text-primary-foreground/90 max-w-md">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="font-display text-3xl font-bold mb-4">Faculté des Sciences de Tunis</h2>
          <p className="text-primary-foreground/60">Votre plateforme de gestion de projets et d'événements universitaires</p>
        </div>
      </div>
    </div>
  );
}
