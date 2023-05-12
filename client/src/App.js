import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Login from './components/Register';
function App() {
  return (
  <Router>
    <Routes>
        <Route exact path='/' element={<>  
          <Navbar/>
          <Home/>
        </>
        }/>
         <Route exact path='/Home' element={<>
          <Navbar/>
          <Home/>
          </>
      }/>
        <Route exact path='/Login' element={<>
           <Login/>
            </>
        }/>
        <Route exact path='/Register' element={<>
           <Register/>
            </>
        }/>
       
    </Routes>    
  </Router>

  );
}

export default App;
