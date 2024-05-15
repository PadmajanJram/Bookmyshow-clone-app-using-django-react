import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./booking.css";

function BookingComponent() {
  const { movieId } = useParams();
  const [showTimes, setShowTimes] = useState([]);
  const user = useSelector((store) => store.auth.user);
  const [formData, setFormData] = useState({
    movie: "",
    booking_date: "",
    show_time: "",
    number_of_tickets: 1,
    total_price: 0,
  });
  let navigate = useNavigate();
  const [bookingId, setBookingId] = useState(null);
  const [rzp, setRzp] = useState(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [confirmationScreen, setConfirmationScreen] = useState(false);

  const fetchShowTimes = async (movieId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/movie/showtime/${movieId}/`
      );
      setShowTimes(response.data.showtimes || []);
      console.log("Show Times:", response.data.showtimes || []);
    } catch (error) {
      console.error("Error fetching show times:", error);
    }
  };

  useEffect(() => {
    if (movieId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        movie: movieId,
      }));
      console.log(movieId);
      fetchShowTimes(movieId);
    }
  }, [movieId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setPaymentInProgress(true);

      // Payment initiation logic goes here
      const paymentRes = await axios.post(
        "http://127.0.0.1:8000/movie/initiatepayment/",
        {
          amount: formData.total_price,
        },
        {
          headers: { Authorization: "token " + user.token },
        }
      );
      console.log("Payment initiated:", paymentRes.data);

      const rzpInstance = new window.Razorpay({
        key: "rzp_test_1sXz8RplkyPm8I",
        amount: formData.total_price * 100,
        currency: "INR",
        name: "SHOW MAN",
        description: "Movie Ticket Booking",
        image: "https://example.com/your_logo.png",
        order_id: paymentRes.data.order_id,
        handler: handlePaymentSuccess,
        prefill: {
          name: user.name,
          contact: user.phone_number,
        },
        theme: {
          color: "#3399cc",
        },
      });
      setRzp(rzpInstance);
      rzpInstance.open();
    } catch (err) {
      console.error("Error:", err);
      alert("Error initiating payment. Please try again later.");
      setPaymentInProgress(false);
    }
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.number_of_tickets]);

  const handlePaymentSuccess = async (response) => {
    try {
      console.log("Payment success:", response);

      const razorpayPaymentId = response?.razorpay_payment_id;
      const handlePaymentRes = await axios.post(
        "http://127.0.0.1:8000/movie/handlepayment/",
        {
          razorpay_payment_id: razorpayPaymentId,
          amount: formData.total_price,
        },
        {
          headers: { Authorization: "token " + user.token },
        }
      );
      console.log("Payment handled:", handlePaymentRes.data);

      // If payment is successful, proceed with booking
      const bookingRes = await axios.post(
        "http://127.0.0.1:8000/movie/bookticket",
        formData,
        {
          headers: { Authorization: "token " + user.token },
        }
      );
      console.log("Booking successful:", bookingRes.data);
      const bookingId = bookingRes.data.booking_id;
      console.log(bookingId);
      setBookingId(bookingId);
      await sendEmail(bookingId);

      setConfirmationScreen(true);
      setPaymentInProgress(false);
    } catch (err) {
      console.error("Error handling payment:", err);
      alert("Error handling payment. Please contact support.");
      setPaymentInProgress(false);
    }
  };

  const calculateTotalPrice = () => {
    const PRICE_PER_TICKET = 250;
    const totalPrice = formData.number_of_tickets * PRICE_PER_TICKET;
    setFormData((prevFormData) => ({
      ...prevFormData,
      total_price: totalPrice,
    }));
  };

  const sendEmail = async (bookingid) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/movie/sendemail/${bookingid}/`,
        null,
        {
          headers: { Authorization: "token " + user.token },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  if (paymentInProgress) {
    return (
      <div class="center-container">
        <div class="dot-spinner">
          <div class="dot-spinner__dot"></div>
          <div class="dot-spinner__dot"></div>
          <div class="dot-spinner__dot"></div>
          <div class="dot-spinner__dot"></div>
          <div class="dot-spinner__dot"></div>
          <div class="dot-spinner__dot"></div>
          <div class="dot-spinner__dot"></div>
          <div class="dot-spinner__dot"></div>
        </div>
      </div>
    );
  }

  if (confirmationScreen) {
    return (
      <>
        <Navbar />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div class="cookieCard text-center">
          <p class="cookieHeading">Booking Confirmation</p>
          <p class="cookieDescription">Your booking ID is: {bookingId}</p>
          <button class="acceptButton btn btn-warning">
            <Link to="/bookings">My Bookings</Link>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="booking-container text-center add Movie text-white">
        <h2>Book Movie Ticket</h2>
        <div className="container card p-2">
          <div className="row ">
            <div className="col-8 offset-2">
              <form onSubmit={handleSubmit} className="booking-form">
                <label className="text-black">
                  Movie:</label>
                  <input
                    type="text"
                    name="movie"
                    value={formData.movie}
                    onChange={handleChange}
                    disabled={!!movieId}
                    className="form-control"
                  />
                
                <label className="form-label text-black">
                  Booking Date:</label>
                  <input
                    type="date"
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                
                <label className="form-label text-black">
                  Show Time:</label>
                  <select
                    name="show_time"
                    value={formData.show_time}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Show Time</option>
                    {showTimes &&
                      showTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                

                <label className="form-label text-black">
                  Number of Tickets:</label>
                  <input
                    type="number"
                    name="number_of_tickets"
                    min="1"
                    value={formData.number_of_tickets}
                    onChange={handleChange}
                    className="form-control"
                  />
                
                <label className="form-label text-black">
                  Total Price:</label>
                  <input
                    type="text"
                    value={formData.total_price.toFixed(2)}
                    readOnly
                    className="form-control"
                  />
                
                <button type="submit" className="btn btn-primary btn-block float-right">
                  Book Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingComponent;
