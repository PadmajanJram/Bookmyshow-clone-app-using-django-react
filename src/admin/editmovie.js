import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Edit() {
    const { postId} = useParams();
    const [name, setName] = useState("");
    const [showTimes, setshowTimes] = useState([]);
    const [dateofrelease, setdateofrelease] = useState("");
    const [image, setimage] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const user = useSelector(store => store.auth.user);
    let navigate = useNavigate();
    console.log(postId)

    useEffect(() => {
        const fetchData = async () => {
        axios.get(`http://127.0.0.1:8000/movie/viewmovie/${postId}/`, {
            headers: { 'Authorization': "token " + user.token }
        })
        .then(response => {
            setName(response.data.name);
            setshowTimes(
                response.data.showTimes.map((time) => ({
                  value: time,
                  label: `${time}`,
                }))
            );
            setdateofrelease(response.data.dateofrelease);
            setimage(response.data.image);
            setStartDate(response.data.startDate);
            setEndDate(response.data.endDate);
        })
        .catch(error => {
            console.error('Error fetching post:', error);
        })
    };
    if (user && user.token) {
        fetchData();
    }
    }, [postId, user.token]);

    function updatePost() {
        axios.put(`http://127.0.0.1:8000/movie/editmovie/${postId}/`, {
            name:name,
            showTimes:showTimes.map((time)=>time.value),
            dateofrelease:dateofrelease,
            image: image,
            startDate:startDate,
            endDate:endDate,
        }, {
            headers: { 'Authorization': "token " + user.token }
        })
        .then(response => {
            alert("Edited Succesfully");
            navigate('/listmovie');
        })
        .catch(error => {
            console.error('Error updating Movie:', error);
        });
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
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Update Movie</h1>
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>ShowTimes:</label>
                            <div>
                            <Select isMulti options={showTimeoptions}
                        value={showTimes}
                        onChange={handletimeChange}/>
                             </div>
                        </div>
                        <div className="form-group">
                            <label>Date of Release</label>
                            <input type="date"
                                className="form-control"
                                placeholder="YYYY-MM-DD" 
                                value={dateofrelease} 
                                onChange={(event) => setdateofrelease(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Poster URL:</label>
                            <input
                                type="url"
                                className="form-control"
                                value={image}
                                onChange={(event) => setimage(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                        <label className="edit-label">Show Starting Date</label>
                        <input type="date"
                        className="form-control" 
                        placeholder="YYYY-MM-DD"
                        value={startDate}
                        onChange={(event)=>{setStartDate(event.target.value)}}
                        />
                        </div>
                        <div className="form-group">
                        <label className="edit-label">Show Ending Date</label>
                        <input type="date"
                        className="form-control" 
                        placeholder="YYYY-MM-DD"
                        value={endDate}
                        onChange={(event)=>{setEndDate(event.target.value)}}
                        />
                    </div>
                        <div className="form-group">
                            <button className="btn btn-primary float-right" onClick={updatePost}>Submit</button>
                        </div>     
                        <Link to="/listmovie?" className="btn btn-dark mt-3 +">Back</Link>               
                    </div>
                </div>
            </div>
        </div>
    );
    }



export default Edit;
