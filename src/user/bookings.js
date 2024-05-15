import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import Navbar from '../components/Navbar';
import jsPDF from 'jspdf';
import "./bookings.css";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(store => store.auth.user);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/movie/bookinglist', {
          headers: {
            Authorization: "token " + user.token,
          },
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user.token]);

  useEffect(() => {
    const generateQRCodes = async () => {
      // Generate QR code for each booking
      for (const booking of bookings) {
        try {
          const qrCodeData = `
            Movie Name: ${booking.movies.name}
            Booking ID: ${booking.id}
            Booking Date: ${booking.booking_date}
            Show Time: ${booking.show_time}
            Number of Tickets: ${booking.number_of_tickets}
            Total Price: ${booking.total_price}
          `;
          const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
          booking.qrCode = qrCodeDataURL;
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
      setBookings([...bookings]);
    };

    if (!loading) {
      generateQRCodes();
    }
  }, [bookings, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDownloadPDF = async (booking) => {
    try {
      const qrCodeData = `
                           SHOWMAN BOOKING DETAILS

        Movie Name: ${booking.movies.name}
        Booking ID: ${booking.id}
        Booking Date: ${booking.booking_date}
        Show Time: ${booking.show_time}
        Number of Tickets: ${booking.number_of_tickets}
        Total Price: ${booking.total_price}
      `;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);

      const doc = new jsPDF();
      doc.text(qrCodeData, 20, 20); // Add QR code data as text
      doc.addImage(qrCodeDataURL, 'JPEG', 70, 80, 75, 75); // Add QR code image
      doc.save(`booking_${booking.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bookings-container" id="booking-details">
        <h1 className="bookings-title" style={{ textAlign:'center'}}>My Bookings</h1>
        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found.</p>
        ) : (
          <ul className="bookings-list">
            {bookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                <h3 className="movie-name">{booking.movies.name}</h3>
                <p className="booking-id">Booking ID: {booking.id}</p>
                <p className="booking-date">Booking Date: {booking.booking_date}</p>
                <p className="show-time">Show Time: {booking.show_time}</p>
                <p className="number-of-tickets">Number of Tickets: {booking.number_of_tickets}</p>
                <p className="total-price">Total Price: {booking.total_price}</p>
                <div><img src={booking.qrCode} alt={`QR Code for booking ${booking.id}`} style={{ height: "150px" }} /></div>
                <button onClick={() => handleDownloadPDF(booking)}>Download PDF</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
