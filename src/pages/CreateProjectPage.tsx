import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = ['Web Development', 'Intelligence Artificielle', 'IoT', 'Développement Mobile', 'Cybersecurity', 'Data Science'];

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/projects');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold">Nouveau Projet</h1>
        <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-xl border p-6">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input placeholder="Titre du projet" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Décrivez le projet..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Input type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Chef de projet (ID étudiant)</Label>
            <Input placeholder="FST2024001" />
          </div>
          <div className="space-y-2">
            <Label>Ressources (fichiers, liens)</Label>
            <Input type="file" multiple />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/projects')}>Annuler</Button>
            <Button type="submit" className="gradient-primary border-0 text-primary-foreground">Créer projet</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
