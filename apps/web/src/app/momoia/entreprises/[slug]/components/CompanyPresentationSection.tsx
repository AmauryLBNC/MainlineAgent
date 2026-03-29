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
    <div className="premium-panel px-8 py-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-2xl text-slate-900">{title}</h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
        {overviewParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-display text-xl text-slate-900">
          {investmentCaseTitle}
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {investmentCasePoints.map((investmentCasePoint) => (
            <li key={investmentCasePoint}>- {investmentCasePoint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
