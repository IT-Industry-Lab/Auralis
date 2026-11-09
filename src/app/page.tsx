import { Button } from '@/shared/ui/Button';

export default function HomePage() {
  return (
    <div>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="text">Text</Button>
      <Button fullWidth>Full width</Button>
    </div>
  );
}
