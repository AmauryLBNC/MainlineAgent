import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CompanyBulletListSectionProps = {
  eyebrow: string;
  title: string;
  items: string[];
};

export function CompanyBulletListSection({
  eyebrow,
  title,
  items,
}: CompanyBulletListSectionProps) {
  return (
    <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
      <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
          {eyebrow}
        </Badge>
        <CardTitle className="app-title text-2xl sm:text-3xl">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
        {items.map((item) => (
          <div key={item} className="app-choice rounded-2xl px-4 py-4">
            <p className="app-copy text-sm leading-7">{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
