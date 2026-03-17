import { DashboardLayout } from '@/components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchRecommendations } from '@/lib/api';
import { Recommendation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function RecommendationsPage() {
  const { data: recommendations = [], isLoading } = useQuery<Recommendation[]>({ queryKey: ['recommendations'], queryFn: fetchRecommendations });

  if (isLoading) return <DashboardLayout><div className="p-8 text-center text-muted-foreground">Chargement des recommandations...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Projets recommandés pour vous</h1>
            <p className="text-sm text-muted-foreground">Basé sur vos compétences et intérêts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(r => (
            <div key={r.id} className="bg-card rounded-xl border p-6 shadow-card hover:shadow-elevated transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-xs">{r.categorie}</Badge>
                <div className="flex items-center gap-1">
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{r.competenceMatch}%</span>
                  </div>
                </div>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{r.titre}</h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {r.competences.map(c => (
                  <Badge key={c} variant="outline" className="text-xs bg-muted/50">{c}</Badge>
                ))}
              </div>
              <Link to={`/projects/${r.projetId}`}>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  Voir projet <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
