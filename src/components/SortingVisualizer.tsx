import { useState, useRef } from 'react';

const algorithms = [
  { name: 'Bubble Sort', value: 'bubble' },
  { name: 'Selection Sort', value: 'selection' },
  { name: 'Insertion Sort', value: 'insertion' },
];

function randomArray(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>(randomArray(30));
  const [algorithm, setAlgorithm] = useState('bubble');
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const stopRef = useRef(false);

  const reset = () => {
    setArray(randomArray(30));
    setActiveIndices([]);
    setSortedIndices([]);
    setIsSorting(false);
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
    setIsSorting(false);
  };

  const handleSort = async () => {
    setIsSorting(true);
    stopRef.current = false;
    setSortedIndices([]);
    let arr = array.slice();
    switch (algorithm) {
      case 'bubble':
        await bubbleSort(arr);
        break;
      case 'selection':
        await selectionSort(arr);
        break;
      case 'insertion':
        await insertionSort(arr);
        break;
      default:
        break;
    }
    setIsSorting(false);
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
  };

  // Sorting Algorithms
  const bubbleSort = async (arr: number[]) => {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) return;
        setActiveIndices([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray(arr.slice());
        }
        await sleep(speed);
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
    }
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setActiveIndices([]);
  };

  const selectionSort = async (arr: number[]) => {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (stopRef.current) return;
        setActiveIndices([minIdx, j]);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
        await sleep(speed);
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray(arr.slice());
      setSortedIndices((prev) => [...prev, i]);
    }
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setActiveIndices([]);
  };

  const insertionSort = async (arr: number[]) => {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        if (stopRef.current) return;
        setActiveIndices([j, j + 1]);
        arr[j + 1] = arr[j];
        setArray(arr.slice());
        await sleep(speed);
        j--;
      }
      arr[j + 1] = key;
      setArray(arr.slice());
      setSortedIndices((prev) => [...prev, i]);
    }
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setActiveIndices([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-8">
        <div className="flex flex-col mb-4 md:mb-0">
          <label className="font-medium mb-1">Algorithm</label>
          <select
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={algorithm}
            onChange={handleAlgorithmChange}
            disabled={isSorting}
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
            min="10"
            max="300"
            value={speed}
            onChange={handleSpeedChange}
            className="w-40"
            disabled={isSorting}
          />
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSort}
            disabled={isSorting}
          >
            Play
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 disabled:opacity-50"
            onClick={handleStop}
            disabled={!isSorting}
          >
            Pause
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            onClick={reset}
            disabled={isSorting}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex items-end h-64 bg-white rounded shadow p-4 overflow-x-auto">
        {array.map((value, idx) => (
          <div
            key={idx}
            className={`mx-0.5 flex-1 rounded-t transition-all duration-75
              ${sortedIndices.includes(idx) ? 'bg-green-400' :
                activeIndices.includes(idx) ? 'bg-red-400' : 'bg-blue-400'}
            `}
            style={{ height: `${value * 2}px`, minWidth: '10px' }}
          />
        ))}
      </div>
      <div className="mt-4 text-gray-500 text-sm">Sorting visualized with animated bars. Green = sorted, Red = active comparison.</div>
    </div>
  );
} 