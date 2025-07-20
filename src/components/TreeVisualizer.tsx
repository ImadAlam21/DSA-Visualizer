import { useState } from 'react';

type Node = {
  value: number;
  left: Node | null;
  right: Node | null;
  x?: number;
  y?: number;
};

function insertNode(root: Node | null, value: number): Node {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) root.left = insertNode(root.left, value);
  else root.right = insertNode(root.right, value);
  return root;
}

function searchNode(root: Node | null, value: number, path: number[] = []): number[] {
  if (!root) return path;
  path.push(root.value);
  if (root.value === value) return path;
  if (value < root.value) return searchNode(root.left, value, path);
  else return searchNode(root.right, value, path);
}

function inorder(root: Node | null, arr: number[] = []): number[] {
  if (!root) return arr;
  inorder(root.left, arr);
  arr.push(root.value);
  inorder(root.right, arr);
  return arr;
}

function layoutTree(root: Node | null, x: number, y: number, dx: number): Node | null {
  if (!root) return null;
  root.x = x;
  root.y = y;
  layoutTree(root.left, x - dx, y + 80, dx / 1.7);
  layoutTree(root.right, x + dx, y + 80, dx / 1.7);
  return root;
}

function getTreeDepth(root: Node | null): number {
  if (!root) return 0;
  return 1 + Math.max(getTreeDepth(root.left), getTreeDepth(root.right));
}

export default function TreeVisualizer() {
  const [root, setRoot] = useState<Node | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [searchPath, setSearchPath] = useState<number[]>([]);
  const [found, setFound] = useState<number | null>(null);
  const [inorderArr, setInorderArr] = useState<number[]>([]);

  const handleInsert = () => {
    if (!input) return;
    setRoot(r => insertNode(r, parseInt(input)));
    setInput('');
    setSearchPath([]);
    setFound(null);
    setInorderArr([]);
  };

  const handleSearch = () => {
    if (!search) return;
    const path = searchNode(root, parseInt(search));
    setSearchPath(path);
    setFound(path[path.length - 1] === parseInt(search) ? parseInt(search) : null);
  };

  const handleInorder = () => {
    setInorderArr(inorder(root));
  };

  const handleReset = () => {
    setRoot(null);
    setInput('');
    setSearch('');
    setSearchPath([]);
    setFound(null);
    setInorderArr([]);
  };

  const treeDepth = getTreeDepth(root);
  const svgHeight = treeDepth * 80 + 80;
  const treeWithLayout = layoutTree(JSON.parse(JSON.stringify(root)), 350, 40, 120);

  const renderTree = (node: Node | null) => {
    if (!node) return null;
    return (
      <g key={node.value}>
        {node.left && node.x !== undefined && node.y !== undefined && node.left.x !== undefined && node.left.y !== undefined && (
          <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="#888" strokeWidth={2} />
        )}
        {node.right && node.x !== undefined && node.y !== undefined && node.right.x !== undefined && node.right.y !== undefined && (
          <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="#888" strokeWidth={2} />
        )}
        {node.x !== undefined && node.y !== undefined && (
          <>
            <circle
              cx={node.x}
              cy={node.y}
              r={22}
              fill={searchPath.includes(node.value) ? (found === node.value ? '#34d399' : '#f87171') : '#60a5fa'}
              stroke="#222"
              strokeWidth={2}
            />
            <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize={16} fill="#fff" fontWeight="bold">
              {node.value}
            </text>
          </>
        )}
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 mb-8">
        <div className="flex flex-col mb-4 md:mb-0">
          <label className="font-medium mb-1">Insert Value</label>
          <div className="flex space-x-2">
            <input
              type="number"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. 42"
            />
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700"
              onClick={handleInsert}
            >
              Insert
            </button>
          </div>
        </div>
        <div className="flex flex-col mb-4 md:mb-0">
          <label className="font-medium mb-1">Search Value</label>
          <div className="flex space-x-2">
            <input
              type="number"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="e.g. 42"
            />
            <button
              className="bg-green-600 text-white px-3 py-2 rounded shadow hover:bg-green-700"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <div className="flex flex-col mb-4 md:mb-0">
          <label className="font-medium mb-1">Traversal</label>
          <button
            className="bg-purple-600 text-white px-3 py-2 rounded shadow hover:bg-purple-700"
            onClick={handleInorder}
          >
            In-order
          </button>
        </div>
        <button
          className="bg-gray-400 text-white px-3 py-2 rounded shadow hover:bg-gray-500 h-10 mt-4 md:mt-0"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <div className="bg-white rounded shadow p-4 flex flex-col items-center overflow-auto" style={{ maxWidth: '100%', maxHeight: '400px' }}>
        <div style={{ minWidth: 700, minHeight: svgHeight }}>
          <svg width={700} height={svgHeight}>
            {renderTree(treeWithLayout)}
          </svg>
        </div>
        <div className="mt-4 text-gray-500 text-sm">
          {searchPath.length > 0 && (
            <span>Path: {searchPath.join(' → ')} {found !== null ? (found === parseInt(search) ? '(Found)' : '(Not Found)') : ''}</span>
          )}
          {inorderArr.length > 0 && (
            <span> | In-order: {inorderArr.join(', ')}</span>
          )}
        </div>
      </div>
    </div>
  );
} 