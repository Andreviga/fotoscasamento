export default function PageTitle({ kicker = '', title, subtitle = '' }) {
  return (
    <header className="stationery-title">
      <span className="wedding-monogram" style={{ '--font-size': '20px', '--letter-spacing': '.36em' }}>
        A <span className="wedding-amp">&amp;</span> N
      </span>
      <div className="stationery-title__rule" />
      {kicker ? <span className="section-kicker mt-3 inline-block">{kicker}</span> : null}
      <h1 className="stationery-title__heading">{title}</h1>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </header>
  );
}
