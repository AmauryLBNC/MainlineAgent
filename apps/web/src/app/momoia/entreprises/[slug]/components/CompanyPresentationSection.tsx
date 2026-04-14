import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CompanyPresentationSectionProps = {
  eyebrow: string;
  title: string;
  investmentCaseTitle: string;
  overviewParagraphs: string[];
  investmentCasePoints: string[];
};

export function CompanyPresentationSection({
  eyebrow,
  title,
  investmentCaseTitle,
  overviewParagraphs,
  investmentCasePoints,
}: CompanyPresentationSectionProps) {
  return (
    <Card className="app-panel rounded-[2rem] border-0 py-0">
      <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
          {eyebrow}
        </Badge>
        <CardTitle className="app-title text-2xl sm:text-3xl">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="space-y-4">
          {overviewParagraphs.map((paragraph) => (
            <p key={paragraph} className="app-copy text-sm leading-7 sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-3">
          <p className="app-kicker">{investmentCaseTitle}</p>
          <div className="grid gap-3">
            {investmentCasePoints.map((investmentCasePoint) => (
              <div
                key={investmentCasePoint}
                className="app-choice rounded-2xl px-4 py-4"
              >
                <p className="app-copy text-sm leading-7">{investmentCasePoint}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
