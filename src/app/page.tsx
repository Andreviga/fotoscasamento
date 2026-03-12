import InviteActions from '@/components/InviteActions';
import './invite.css';

const weddingInfoUrl = 'https://andrenathalia03052026.site/';
const giftListUrl = 'https://andrenathalia03052026.site/#presentes';
const fullAddress = 'Rua das Araribás, 25 — São Bernardo do Campo — SP — CEP 09840-210';
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

export default function HomePage() {
  return (
    <main className="invite-page">
      <article className="invite" aria-label="Convite digital do casamento de André e Nathália">
        <span className="invite__foliage invite__foliage--top-left" aria-hidden="true" />
        <span className="invite__foliage invite__foliage--top-right" aria-hidden="true" />
        <span className="invite__foliage invite__foliage--bottom-left" aria-hidden="true" />
        <span className="invite__foliage invite__foliage--bottom-right" aria-hidden="true" />

        <div className="invite__content">
          <header className="invite__header">
            <div className="invite__monogram">A &amp; N</div>
            <p className="invite__eyebrow">03 de maio de 2026</p>
            <h1 className="invite__names">André &amp; Nathália</h1>
            <p className="invite__lede">
              Com alegria, convidamos você para celebrar conosco um dos dias mais importantes das nossas vidas.
            </p>
          </header>

          <section className="invite__details" aria-label="Detalhes do casamento">
            <article className="detail-card">
              <p className="detail-card__label">Data e horário</p>
              <h2 className="detail-card__title">03 de maio de 2026, às 16h</h2>
              <p className="detail-card__text">Cerimônia e recepção em uma tarde feita para celebrar com quem amamos.</p>
            </article>

            <article className="detail-card detail-card--wide">
              <p className="detail-card__label">Local</p>
              <h2 className="detail-card__title">Rua das Araribás, 25</h2>
              <p className="detail-card__text">São Bernardo do Campo — SP — CEP 09840-210</p>
              <InviteActions address={fullAddress} mapsUrl={mapsUrl} />
            </article>

            <article className="detail-card">
              <p className="detail-card__label">Mensagem</p>
              <p className="detail-card__text">
                Sua presença já é o nosso maior presente. Se desejar, reunimos em seguida as informações do casamento e a nossa lista de presentes.
              </p>
            </article>
          </section>

          <section className="invite__cta" aria-label="Links principais">
            <p className="invite__section-label">Acessos principais</p>
            <div className="invite__cta-group">
              <a className="invite-button invite-button--primary" href={weddingInfoUrl}>
                Acessar informações do casamento
              </a>
              <a className="invite-button invite-button--secondary" href={giftListUrl}>
                Acessar lista de presentes
              </a>
            </div>

            <p className="invite__section-label invite__section-label--spaced">Links completos</p>
            <div className="invite__link-list">
              <a className="invite__text-link" href={weddingInfoUrl}>
                https://andrenathalia03052026.site/
              </a>
              <a className="invite__text-link" href={giftListUrl}>
                https://andrenathalia03052026.site/#presentes
              </a>
            </div>
          </section>

          <footer className="invite__footer">André & Nathália • 03 de maio de 2026</footer>
        </div>
      </article>
    </main>
  );
}
