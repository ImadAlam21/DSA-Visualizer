import { useState } from 'react';

type Node = {
  id: number;
  x: number;
  y: number;
};

type Edge = [number, number];

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * 500) + 50,
    y: Math.floor(Math.random() * 200) + 50,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [traversal, setTraversal] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [algo, setAlgo] = useState<'bfs' | 'dfs'>('bfs');

  const addNode = () => {
    const id = nodes.length;
    const pos = getRandomPosition();
    setNodes([...nodes, { id, ...pos }]);
  };

  const addEdge = () => {
    if (nodes.length < 2) return;
    const a = nodes[nodes.length - 2].id;
    const b = nodes[nodes.length - 1].id;
    setEdges([...edges, [a, b]]);
  };

  const handleSelect = (id: number) => {
    setSelected(id);
  };

  const handleAlgoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgo(e.target.value as 'bfs' | 'dfs');
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setSelected(null);
    setTraversal([]);
    setIsRunning(false);
  };

  const runTraversal = async () => {
    if (selected === null) return;
    setIsRunning(true);
    setTraversal([]);
    if (algo === 'bfs') await bfs(selected);
    else await dfs(selected);
    setIsRunning(false);
  };

  const bfs = async (start: number) => {
    let visited = new Set<number>();
    let queue = [start];
    let order: number[] = [];
    while (queue.length) {
      let node = queue.shift()!;
      if (!visited.has(node)) {
        visited.add(node);
        order.push(node);
        setTraversal([...order]);
        await sleep(400);
        for (let [a, b] of edges) {
          if (a === node && !visited.has(b)) queue.push(b);
          if (b === node && !visited.has(a)) queue.push(a);
        }
      }
    }
  };

  const dfs = async (start: number) => {
    let visited = new Set<number>();
    let order: number[] = [];
    async function visit(node: number) {
      if (visited.has(node)) return;
      visited.add(node);
      order.push(node);
      setTraversal([...order]);
      await sleep(400);
      for (let [a, b] of edges) {
        if (a === node && !visited.has(b)) await visit(b);
        if (b === node && !visited.has(a)) await visit(a);
      }
    }
    await visit(start);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-8">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mb-2 md:mb-0"
          onClick={addNode}
          disabled={isRunning}
        >
          Add Node
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 mb-2 md:mb-0"
          onClick={addEdge}
          disabled={isRunning || nodes.length < 2}
        >
          Add Edge
        </button>
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 md:mb-0"
          value={algo}
          onChange={handleAlgoChange}
          disabled={isRunning}
        >
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
        </select>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 mb-2 md:mb-0"
          onClick={runTraversal}
          disabled={isRunning || selected === null}
        >
          Run {algo.toUpperCase()}
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
          onClick={handleReset}
          disabled={isRunning}
        >
          Reset
        </button>
      </div>
      <div className="bg-white rounded shadow p-4 flex flex-col items-center overflow-auto" style={{ maxWidth: '100%', maxHeight: '400px' }}>
        <div style={{ minWidth: 600, minHeight: 320 }}>
          <svg width={600} height={320}>
            {edges.map(([a, b], i) => {
              const na = nodes.find(n => n.id === a);
              const nb = nodes.find(n => n.id === b);
              if (!na || !nb) return null;
              return (
                <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#888" strokeWidth={2} />
              );
            })}
            {nodes.map(node => (
              <g key={node.id} onClick={() => handleSelect(node.id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={24}
                  fill={selected === node.id ? '#fbbf24' : traversal.includes(node.id) ? '#34d399' : '#60a5fa'}
                  stroke="#222"
                  strokeWidth={2}
                />
                <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize={16} fill="#fff" fontWeight="bold">
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="mt-4 text-gray-500 text-sm">
          {traversal.length > 0 && (
            <span>Traversal order: {traversal.join(' → ')}</span>
          )}
        </div>
      </div>
    </div>
  );
} 