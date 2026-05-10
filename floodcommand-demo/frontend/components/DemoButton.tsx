'use client';

import { useState } from 'react';

const DEMO_MESSAGES = [
  {
    text: "Bacha aa gaya, ghar mein pani bhar gaya, 4 log phanse hain, Gulshan Iqbal",
    translation: "Child at home, water rising, 4 people trapped, Gulshan Iqbal",
  },
  {
    text: "Buzurg zaakham hain, Edhi center ke paas Lahore, do bachay bhee",
    translation: "Elderly injured, near Edhi center Lahore, 2 children also",
  },
  {
    text: "Family chhath pe phanse, pani aa gaya, Hayatabad Peshawar, 3 log",
    translation: "Family trapped on roof, water rising, Hayatabad Peshawar, 3 people",
  },
];

export default function DemoButton({ socket, onVictimAdded }: any) {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          phone: `+9230${Math.floor(Math.random() * 9000000000000)}`,
        }),
      });

      const data = await response.json();
      console.log('Response:', data);

      // Simulate phone notifications
      setTimeout(() => {
        playNotificationSound();
      }, 3000);

      onVictimAdded();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const playNotificationSound = () => {
    try {
        const audio = new Audio(
        'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
        );
        audio.play().catch(() => {});
    } catch (e) {
        // Ignore audio errors during demo
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">📱 Demo: Send Urdu Messages</h2>
      <p className="text-gray-600 mb-6">
        Click to simulate WhatsApp messages from flood victims
      </p>

      <div className="space-y-3">
        {DEMO_MESSAGES.map((msg, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="font-semibold text-sm">{msg.text}</p>
              <p className="text-xs text-gray-500">{msg.translation}</p>
            </div>
            <button
              onClick={() => sendMessage(msg.text)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-bold w-full sm:w-auto"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500">
        <p className="text-sm text-blue-900">
          💡 <strong>Demo Flow:</strong> Click "Send" → Agents process (3-5s) →
          Victim appears on map → SMS notification simulated (judges' phones buzz)
        </p>
      </div>
    </div>
  );
}
