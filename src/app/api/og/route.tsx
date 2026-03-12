import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = {
  width: 1200,
  height: 630
};

function LeafCluster({ side }: { side: 'left' | 'right' }) {
  const isRight = side === 'right';

  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        [side]: 54,
        width: 220,
        height: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.78,
        transform: isRight ? 'scaleX(-1)' : 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 4,
          height: 360,
          borderRadius: 999,
          background: '#8ca391',
          transform: 'rotate(-18deg)'
        }}
      />
      {[
        { top: 84, left: 86, rotate: -48 },
        { top: 124, left: 108, rotate: -22 },
        { top: 176, left: 64, rotate: -66 },
        { top: 232, left: 108, rotate: -18 },
        { top: 292, left: 54, rotate: -62 }
      ].map((leaf) => (
        <div
          key={`${side}-${leaf.top}-${leaf.left}`}
          style={{
            position: 'absolute',
            top: leaf.top,
            left: leaf.left,
            width: 86,
            height: 32,
            borderRadius: '100% 0 100% 0',
            border: '2px solid #6f8475',
            background: 'rgba(111, 132, 117, 0.18)',
            transform: `rotate(${leaf.rotate}deg)`
          }}
        />
      ))}
    </div>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(180deg, #fbfaf7 0%, #f7f6f2 100%)',
          color: '#0f4f3d',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top, rgba(201,179,126,0.24), transparent 32%), radial-gradient(circle at 12% 10%, rgba(111,132,117,0.12), transparent 18%), radial-gradient(circle at 88% 14%, rgba(111,132,117,0.12), transparent 18%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 28,
            borderRadius: 34,
            border: '1px solid #c9b37e'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 44,
            borderRadius: 24,
            border: '1px solid #e8e3d7'
          }}
        />
        <LeafCluster side="left" />
        <LeafCluster side="right" />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            padding: '78px 128px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 999,
              border: '1px solid rgba(201, 179, 126, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 42,
              letterSpacing: '0.08em',
              background: 'rgba(255,255,255,0.5)',
              fontFamily: 'Georgia, serif'
            }}
          >
            A &amp; N
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#6f8475'
            }}
          >
            03 de maio de 2026
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: 'Georgia, serif',
              fontSize: 76,
              lineHeight: 1,
              letterSpacing: '0.03em'
            }}
          >
            André &amp; Nathália
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 30,
              lineHeight: 1.45,
              color: '#52685a',
              maxWidth: 820
            }}
          >
            Cerimônia às 16h • Rua das Araribás, 25 • São Bernardo do Campo/SP
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 27,
              lineHeight: 1.5,
              color: '#6f8475',
              maxWidth: 700
            }}
          >
            Convite digital com informações do casamento e lista de presentes.
          </div>
        </div>
      </div>
    ),
    size
  );
}