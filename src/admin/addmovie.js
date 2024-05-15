import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import checkAuth from "../auth/checkAuth";
import Select from "react-select";
import Navbar from "../components/Navbar";


function AddMovie(){
    const [name, setName] = useState('');
    const [showTimes, setshowTimes] = useState('');
    const [dateOfRelease, setDateOfRelease] = useState('');
    const [image, setImage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();
    const user = useSelector(store => store.auth.user);

      function handleSubmit(event){

        event.preventDefault();
        axios.post('http://127.0.0.1:8000/movie/addmovie',{
            name:name,
            showTimes:showTimes.map((time)=>time.value),
            dateofrelease:dateOfRelease,
            image: image,
            startDate:startDate,
            endDate:endDate,
          }, {
            headers: { 'Authorization': "token " + user.token }
        })
        .then(response=> {
                alert("Movie Added Sucessfully")
                navigate("/listmovie");
               
        }).catch((error)=>console.log(error))
    }

    const showTimeoptions=[
      {value:'11:30 AM',label:'11:30 AM'},
      {value:'02:30 PM',label:'02:30 PM'},
      {value:'05:00 PM',label:'05:00 PM'},
      {value:'09:00 PM',label:'09:00 PM'} 
  ]
  const handletimeChange=(selectedShowtime)=>{
      setshowTimes(selectedShowtime)
  }

      return (
        <div>
          <Navbar/>
          <h3 className="text-center">ADD MOVIE</h3>
          <br/>
            <div className="container card p-2">
            <div className="row ">
              <div className="col-8 offset-2">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label>
            Movie Name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            </div>
          <label>
          ShowTimes:</label>
          <Select isMulti options={showTimeoptions}
          value={showTimes}
          
          onChange={handletimeChange}/>
          <label>
            Date of Release:</label>
            <input
              type="date"
              value={dateOfRelease}
              className="form-control"
              onChange={(e) => setDateOfRelease(e.target.value)}
            />
          
          <label>
            Start Date:</label><br/>
            <input
              type="date"
              value={startDate}
              className="form-control"
              onChange={(e) => setStartDate(e.target.value)}
            />
          
          <label>
            End Date:</label><br/>
            <input
              type="date"
              value={endDate}
              className="form-control"
              onChange={(e) => setEndDate(e.target.value)}
            />
          
          <label>
            Image URL:</label>
            <input
              type="url"
              value={image}
              className="form-control"
              onChange={(e) => setImage(e.target.value)}
            />
          
          <button className="btn btn-primary btn-block float-right" type="submit">Add Movie</button>
        </form>
        </div>
        </div>
        </div>
                  
        </div>
      );
}
export default checkAuth(AddMovie);