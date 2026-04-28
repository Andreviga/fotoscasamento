'use client';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="page-header romantic-panel">
      <div className="page-header-brand">
        <span className="wedding-monogram page-monogram">
          A <span className="wedding-amp">&amp;</span> N
        </span>
        <span className="page-header-divider" />
        <span className="page-header-date">03.05.2026</span>
      </div>

      <h2>{title}</h2>

      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  );
}
