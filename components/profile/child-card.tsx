import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ChildCard({
  name,
  age,
  sportInterests,
}: {
  name: string;
  age: number;
  sportInterests: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{age} years old</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {sportInterests.map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
