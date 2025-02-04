import { useState } from 'react'
import './App.css'
import DragDropTables from './components/DragDropTables'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DragDropTables/>
    </>
  )
}

export default App
