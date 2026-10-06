import React from 'react';
import '../../styles/Admin/StatCard.css';

/**
 * label:  small caption, e.g. "Total Revenue"
 * value:  the headline figure, e.g. "$42,318"
 * trend:  optional string, e.g. "+12.4%" or "-3.1%"
 */
const StatCard = ({ label, value, trend }) => {
  const isDown = typeof trend === 'string' && trend.trim().startsWith('-');

  return (
    <div className="stat-card">
      <span className="stat-card__accent" />
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
      {trend && (
        <span className={`stat-card__trend ${isDown ? 'down' : 'up'}`}>
          {trend}
        </span>
      )}
    </div>
  );
};

export default StatCard;