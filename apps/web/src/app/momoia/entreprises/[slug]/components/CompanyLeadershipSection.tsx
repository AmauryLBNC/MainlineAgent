import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CompanyLeadershipSectionProps = {
  eyebrow: string;
  leaderName: string;
  leaderRole: string;
  biographyParagraphs: string[];
  highlightPoints: string[];
  websiteUrl: string | null;
  websiteLabel: string;
};

export function CompanyLeadershipSection({
  eyebrow,
  leaderName,
  leaderRole,
  biographyParagraphs,
  highlightPoints,
  websiteUrl,
  websiteLabel,
}: CompanyLeadershipSectionProps) {
  return (
    <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
      <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
          {eyebrow}
        </Badge>
        <CardTitle className="app-title text-2xl sm:text-3xl">
          {leaderName}
        </CardTitle>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground">
          {leaderRole}
        </p>
      </CardHeader>
      <CardContent className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="space-y-4">
          {biographyParagraphs.map((biographyParagraph) => (
            <p
              key={biographyParagraph}
              className="app-copy text-sm leading-7 sm:text-base"
            >
              {biographyParagraph}
            </p>
          ))}
        </div>

        <div className="grid gap-3">
          {highlightPoints.map((highlightPoint) => (
            <div key={highlightPoint} className="app-choice rounded-2xl px-4 py-4">
              <p className="app-copy text-sm leading-7">{highlightPoint}</p>
            </div>
          ))}
        </div>

        {websiteUrl ? (
          <Button asChild variant="outline" className="rounded-full px-5">
            <a href={websiteUrl} target="_blank" rel="noreferrer">
              {websiteLabel}
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
