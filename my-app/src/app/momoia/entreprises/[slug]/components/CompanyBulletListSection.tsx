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
    <div className="premium-panel px-8 py-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-2xl text-slate-900">{title}</h2>
      <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
