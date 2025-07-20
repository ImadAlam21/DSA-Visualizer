import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import SortingVisualizer from './components/SortingVisualizer'
import SearchingVisualizer from './components/SearchingVisualizer'
import TreeVisualizer from './components/TreeVisualizer'
import GraphVisualizer from './components/GraphVisualizer'
import StackVisualizer from './components/StackVisualizer'
import QueueVisualizer from './components/QueueVisualizer'
import './App.css'

const categories = [
  { name: 'Sorting', path: '/sorting' },
  { name: 'Searching', path: '/searching' },
  { name: 'Trees', path: '/trees' },
  { name: 'Graphs', path: '/graphs' },
  { name: 'Stacks', path: '/stacks' },
  { name: 'Queues', path: '/queues' },
]

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-8 text-blue-600">DSA Visualizer</h2>
          <nav className="flex-1">
            <ul className="space-y-4">
              {categories.map(cat => (
                <li key={cat.path}>
                  <Link to={cat.path} className="block px-3 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 text-xs text-gray-400">by L. Gautam</div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-10">
          <Routes>
            <Route path="/sorting" element={<SortingVisualizer />} />
            <Route path="/searching" element={<SearchingVisualizer />} />
            <Route path="/trees" element={<TreeVisualizer />} />
            <Route path="/graphs" element={<GraphVisualizer />} />
            <Route path="/stacks" element={<StackVisualizer />} />
            <Route path="/queues" element={<QueueVisualizer />} />
            <Route path="*" element={<Navigate to="/sorting" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
