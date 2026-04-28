import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', headerAction }) => {
  return (
    <div className={`card ${className}`}>
      {(title || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="card-action">{headerAction}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
      <style>{`
        .card {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          box-shadow: var(--shadow);
        }
        .card-header {
          padding: var(--space-md) var(--space-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }
        .card-title {
          font-size: 16px;
          font-weight: 600;
        }
        .card-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .card-content {
          padding: var(--space-lg);
        }
      `}</style>
    </div>
  );
};

export default Card;
