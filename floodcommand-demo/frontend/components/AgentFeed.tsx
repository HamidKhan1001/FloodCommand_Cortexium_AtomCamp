'use client';

interface Agent {
  name: string;
  color: string;
}

const AGENTS: Record<string, Agent> = {
  INTAKE: { name: 'Intake', color: 'blue' },
  TRIAGE: { name: 'Triage', color: 'yellow' },
  GEO: { name: 'Geo', color: 'purple' },
  DISPATCH: { name: 'Dispatch', color: 'green' },
  NOTIFY: { name: 'Notify', color: 'pink' },
};

export default function AgentFeed({ victims }: { victims: any[] }) {
  const logs: any[] = [];

  // Generate logs from victims
  victims.forEach((victim) => {
    const baseTime = new Date(victim.created_at);

    logs.push({
      timestamp: baseTime,
      agent: 'INTAKE',
      message: `Parsed Urdu: "${victim.name}" at ${victim.latitude.toFixed(2)}, ${victim.longitude.toFixed(2)}`,
    });

    logs.push({
      timestamp: new Date(baseTime.getTime() + 500),
      agent: 'TRIAGE',
      message: `Severity: ${victim.severity}/5 (${['STABLE', 'CAUTION', 'URGENT', 'CRITICAL', 'EMERGENCY'][victim.severity - 1]})`,
    });

    logs.push({
      timestamp: new Date(baseTime.getTime() + 1000),
      agent: 'GEO',
      message: `GPS resolved: ${victim.latitude.toFixed(4)}, ${victim.longitude.toFixed(4)}`,
    });

    logs.push({
      timestamp: new Date(baseTime.getTime() + 1500),
      agent: 'DISPATCH',
      message: `NGO matched: ${victim.intake?.location || 'Location'} region`,
    });

    logs.push({
      timestamp: new Date(baseTime.getTime() + 2000),
      agent: 'NOTIFY',
      message: `2x SMS sent: Victim + NGO (ETA: ~12 min)`,
    });
  });

  // Sort by timestamp (newest first)
  const sortedLogs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">🤖 Agent Activity Feed (Real-time)</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto font-mono text-sm">
        {sortedLogs.length === 0 ? (
          <p className="text-gray-500">Waiting for agents to process messages...</p>
        ) : (
          sortedLogs.map((log, idx) => {
            const agent = AGENTS[log.agent] || { name: log.agent, color: 'gray' };
            return (
              <div key={idx} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded">
                <span className={`px-2 py-1 rounded text-xs font-bold text-white bg-${agent.color}-600 whitespace-nowrap`}>
                  {agent.name}
                </span>
                <p className="text-gray-800 flex-1">{log.message}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
