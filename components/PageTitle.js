export default function PageTitle({ kicker = '', title, subtitle = '' }) {
  return (
    <header className="stationery-title">
      <p className="stationery-title__monogram">A&amp;N</p>
      <div className="stationery-title__rule" />
      {kicker ? <span className="section-kicker mt-3 inline-block">{kicker}</span> : null}
      <h1 className="stationery-title__heading">{title}</h1>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </header>
  );
}
