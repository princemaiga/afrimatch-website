import React from 'react';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '6rem', color: '#059669', margin: 0 }}>
          {statusCode || 'Error'}
        </h1>
        <p style={{ color: '#6b7280', marginTop: '1rem' }}>
          {statusCode === 404 ? 'Page not found' : 'An error occurred'}
        </p>
        <a href="/" style={{ 
          display: 'inline-block',
          marginTop: '2rem',
          background: '#059669',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: '9999px',
          textDecoration: 'none'
        }}>
          Go Home
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode: number }, err?: { statusCode: number } }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
