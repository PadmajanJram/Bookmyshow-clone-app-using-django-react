import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./auth/Login";
import Register from "./auth/register";
import Addmovie from "./admin/addmovie";
import Listmovie from "./admin/listmovie";
import Editmovie from "./admin/editmovie";
import View from "./user/viewuser"
import Booking from './user/booking';
import BookingsPage from "./user/bookings";


const router = createBrowserRouter([

{path: '/', element: <App/> },
{path: 'register', element: <Register/> },
{path: 'login', element:<Login/>},
{path: 'Addmovie', element: <Addmovie/>},
{path: 'listmovie', element: <Listmovie/>},
{path: 'editmovie/:postId', element: <Editmovie/>},
{path: 'viewuser', element: <View/>},
{path: 'booking/:movieId', element: <Booking/>},
{path: 'bookings', element: <BookingsPage/>}

]);

export default router;