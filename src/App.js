import React from 'react';
import Navbar from './components/Navbar';
import { Link } from 'react-router-dom';

function App() {
  return(
  <div style={{ textAlign: 'center' }} className="background-container Movie" >
    <Navbar/>
    <h1 className='text-white'><b>SHOWMAN</b></h1>
    <br/>
    <br/>
    <br/>

    <h5 className='text-white'> Cinema at your Fingertips..</h5>
    <Link to={"/Register"} className="btn btn-primary">Create Account</Link>

    <br/>
    <p className='text-white'>Already have an Account <Link to={"/login"}>Login</Link></p>
  </div>
);
}
export default App;