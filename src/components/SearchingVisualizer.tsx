import { useState, useRef } from 'react';

const algorithms = [
  { name: 'Linear Search', value: 'linear' },
  { name: 'Binary Search', value: 'binary' },
];

function randomArray(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1).sort((a, b) => a - b);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SearchingVisualizer() {
  const [array, setArray] = useState<number[]>(randomArray(20));
  const [algorithm, setAlgorithm] = useState('linear');
  const [isSearching, setIsSearching] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [target, setTarget] = useState('');
  const stopRef = useRef(false);

  const reset = () => {
    setArray(randomArray(20));
    setActiveIndex(null);
    setFoundIndex(null);
    setIsSearching(false);
    stopRef.current = false;
  };

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value);
    reset();
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  const handleStop = () => {
    stopRef.current = true;
    setIsSearching(false);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setFoundIndex(null);
    stopRef.current = false;
    if (!target) return;
    let arr = array.slice();
    let tgt = parseInt(target);
    switch (algorithm) {
      case 'linear':
        await linearSearch(arr, tgt);
        break;
      case 'binary':
        await binarySearch(arr, tgt);
        break;
      default:
        break;
    }
    setIsSearching(false);
  };

  // Searching Algorithms
  const linearSearch = async (arr: number[], tgt: number) => {
    for (let i = 0; i < arr.length; i++) {
      if (stopRef.current) return;
      setActiveIndex(i);
      await sleep(speed);
      if (arr[i] === tgt) {
        setFoundIndex(i);
        return;
      }
    }
    setFoundIndex(-1);
    setActiveIndex(null);
  };

  const binarySearch = async (arr: number[], tgt: number) => {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
      if (stopRef.current) return;
      let mid = Math.floor((left + right) / 2);
      setActiveIndex(mid);
      await sleep(speed);
      if (arr[mid] === tgt) {
        setFoundIndex(mid);
        return;
      } else if (arr[mid] < tgt) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    setFoundIndex(-1);
    setActiveIndex(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-8">
        <div className="flex flex-col mb-4 md:mb-0">
          <label className="font-medium mb-1">Algorithm</label>
          <select
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={algorithm}
            onChange={handleAlgorithmChange}
            disabled={isSearching}
          >
            {algorithms.map((alg) => (
              <option key={alg.value} value={alg.value}>{alg.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col mb-4 md:mb-0">
          <label className="font-medium mb-1">Speed</label>
          <input
            type="range"
            min="50"
            max="500"
            value={speed}
            onChange={handleSpeedChange}
            className="w-40"
            disabled={isSearching}
          />
        </div>
        <div className="flex flex-col mb-4 md:mb-0">
          <label className="font-medium mb-1">Target</label>
          <input
            type="number"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={target}
            onChange={e => setTarget(e.target.value)}
            disabled={isSearching}
            placeholder="Enter value"
          />
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSearch}
            disabled={isSearching || !target}
          >
            Play
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 disabled:opacity-50"
            onClick={handleStop}
            disabled={!isSearching}
          >
            Pause
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            onClick={reset}
            disabled={isSearching}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex items-end h-32 bg-white rounded shadow p-4 overflow-x-auto">
        {array.map((value, idx) => (
          <div
            key={idx}
            className={`mx-0.5 flex flex-col items-center justify-end flex-1 transition-all duration-75
              ${foundIndex === idx ? 'bg-green-400' :
                activeIndex === idx ? 'bg-red-400' : 'bg-blue-400'}
            `}
            style={{ height: `${value * 2}px`, minWidth: '24px' }}
          >
            <span className="text-xs text-gray-700 mb-1">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-gray-500 text-sm">
        {foundIndex === -1 && !isSearching && target ? (
          <span>Value not found.</span>
        ) : foundIndex !== null && foundIndex >= 0 && !isSearching ? (
          <span>Value found at index {foundIndex}.</span>
        ) : (
          <span>Searching visualized. Green = found, Red = current index.</span>
        )}
      </div>
    </div>
  );
} 