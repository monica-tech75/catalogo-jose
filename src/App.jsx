import { useEffect } from 'react';
import Home from './pages/Home'
import './App.css'

function App() {

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(granted => {
        console.log(granted ? "✅ Storage is persistent" : "⚠️ Storage is temporary");
      });
    }
  }, []);

  return (
    <>
     <Home />
    </>
  )
}

export default App
