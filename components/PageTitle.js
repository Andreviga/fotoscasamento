export default function PageTitle({ kicker = '', title, subtitle = '' }) {
  return (
    <div className="section-header">
      {kicker ? <span className="section-kicker">{kicker}</span> : null}
      <h1 className="mt-3 text-4xl sm:text-5xl text-cocoa">{title}</h1>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      <div className="mx-auto mt-4 h-[2px] w-24 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent" />
    </div>
  );
}
