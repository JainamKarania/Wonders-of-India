import HomeScreen from './Components/HomeScreen'
import './App.css'
import { BrowserRouter ,Routes, Route } from 'react-router-dom'
import AboutPage from "./pages/AboutPage";
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
function App() {
 return (
    <>
      <div>
       <BrowserRouter>
       <Routes>
        <Route index element = {<HomeScreen/>} />
        <Route path='/home' element = {<HomeScreen />}/>
        <Route path='/aboutpage' element = {<AboutPage/>}/>
        <Route path='/booking' element = {<BookingPage/>}/>
        <Route path='/contact' element = {<ContactPage/>}/>
       </Routes>
       </BrowserRouter>
      </div>  
      </>
  )
}

export default App
