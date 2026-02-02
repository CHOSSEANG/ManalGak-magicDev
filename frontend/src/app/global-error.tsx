// src/app/global-error.tsx
'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body>
        <main style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '400px',
          }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              문제가 발생했어요
            </h1>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              일시적인 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해 주세요.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
