'use client';

export default function StatsPanel({ stats }: { stats: any }) {
  const cards = [
    { label: 'Total Victims', value: stats.totalVictims, color: 'blue' },
    { label: 'Dispatched', value: stats.totalDispatched, color: 'green' },
    { label: 'Avg ETA (min)', value: stats.averageETA, color: 'orange' },
    { label: 'Active NGOs', value: 15, color: 'purple' },
  ];

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white border-l-4 border-${card.color}-500 rounded-lg shadow p-6`}
        >
          <p className={`text-gray-600 text-sm font-bold mb-2`}>
            {card.label}
          </p>
          <p className={`text-4xl font-bold text-gray-900`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
