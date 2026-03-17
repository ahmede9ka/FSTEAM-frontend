import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateEventPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/events');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold">Créer un événement</h1>
        <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-xl border p-6">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input placeholder="Titre de l'événement" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Décrivez l'événement..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Compétition">Compétition</SelectItem>
                <SelectItem value="Conférence">Conférence</SelectItem>
                <SelectItem value="Séminaire">Séminaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Lieu</Label>
            <Input placeholder="Amphithéâtre A" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date & Heure</Label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label>Nombre de places</Label>
              <Input type="number" placeholder="100" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Affiche</Label>
            <Input type="file" accept="image/*" />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/events')}>Annuler</Button>
            <Button type="submit" className="gradient-primary border-0 text-primary-foreground">Créer</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
