import { useState } from 'react';

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<number[]>([]);
  const [input, setInput] = useState('');

  const handleEnqueue = () => {
    if (!input) return;
    setQueue([...queue, parseInt(input)]);
    setInput('');
  };

  const handleDequeue = () => {
    setQueue(queue.slice(1));
  };

  const handleReset = () => {
    setQueue([]);
    setInput('');
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-8">
        <div className="flex flex-col mb-4 md:mb-0">
          <label className="font-medium mb-1">Value</label>
          <input
            type="number"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 42"
          />
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={handleEnqueue}
          >
            Enqueue
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
            onClick={handleDequeue}
            disabled={queue.length === 0}
          >
            Dequeue
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex items-center bg-white rounded shadow p-4 min-h-[100px]">
        {queue.length === 0 && <div className="text-gray-400">Queue is empty</div>}
        {queue.map((value, idx) => (
          <div
            key={idx}
            className={`w-20 h-10 flex items-center justify-center mx-2 rounded border-2 transition-all duration-150
              ${idx === 0 ? 'bg-blue-400 border-blue-700 text-white font-bold' : 'bg-blue-100 border-blue-300 text-gray-700'}`}
          >
            {value}
            {idx === 0 && <span className="ml-2 text-xs">(front)</span>}
          </div>
        ))}
      </div>
    </div>
  );
} 