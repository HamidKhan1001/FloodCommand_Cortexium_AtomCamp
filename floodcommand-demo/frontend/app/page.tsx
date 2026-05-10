'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AgentFeed from '@/components/AgentFeed';
import StatsPanel from '@/components/StatsPanel';
import DemoButton from '@/components/DemoButton';
import io from 'socket.io-client';

// Map must be dynamically imported because it relies on the window object
const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Dashboard() {
  const [socket, setSocket] = useState<any>(null);
  const [victims, setVictims] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalVictims: 0,
    totalDispatched: 0,
    averageETA: 0,
  });

  useEffect(() => {
    // Connect to backend
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✓ Connected to backend');
    });

    newSocket.on('victim_added', (message: any) => {
      if (message.data) {
        setVictims((prev) => [message.data, ...prev]);
      }
    });

    setSocket(newSocket);

    // Fetch initial victims
    fetchVictims();
    const interval = setInterval(fetchVictims, 3000);

    return () => {
      clearInterval(interval);
      newSocket.disconnect();
    };
  }, []);

  const fetchVictims = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/victims');
      const data = await res.json();
      setVictims(data);

      const statsRes = await fetch('http://localhost:8000/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🚨 FloodCommand
        </h1>
        <p className="text-gray-300">
          Autonomous Disaster Response - Demo MVP
        </p>
      </header>

      {/* Demo Controls */}
      <DemoButton socket={socket} onVictimAdded={fetchVictims} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Stats */}
        <div className="lg:col-span-1">
          <StatsPanel stats={stats} />
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <MapComponent victims={victims} />
        </div>
      </div>

      {/* Feed */}
      <div className="mt-8">
        <AgentFeed victims={victims} />
      </div>
    </div>
  );
}
