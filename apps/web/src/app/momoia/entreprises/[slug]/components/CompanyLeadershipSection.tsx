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
    <div className="premium-panel px-8 py-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-2xl text-slate-900">{leaderName}</h2>
      <p className="mt-2 text-sm uppercase tracking-[0.26em] text-slate-500">
        {leaderRole}
      </p>
      <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
        {biographyParagraphs.map((biographyParagraph) => (
          <p key={biographyParagraph}>{biographyParagraph}</p>
        ))}
      </div>
      <ul className="mt-5 space-y-2 text-sm text-slate-600">
        {highlightPoints.map((highlightPoint) => (
          <li key={highlightPoint}>- {highlightPoint}</li>
        ))}
      </ul>
      {websiteUrl ? (
        <div className="mt-6">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            {websiteLabel}
          </a>
        </div>
      ) : null}
    </div>
  );
}
