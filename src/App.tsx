import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { Analytics } from "@vercel/analytics/next"


function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
      <Analytics/>
    </BrowserRouter>
  )
  
}

export default App