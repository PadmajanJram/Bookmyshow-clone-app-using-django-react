from django.urls import path
from . import views

urlpatterns=[
    path('signup',views.register,name="signup"),
    path('login',views.login,name="login"),
    path('logout',views.logout,name='logout'),
    path('addmovie',views.movie_Add,name='addmovie'),
    path('listmovie',views.list_movies,name='listmovie'),
    path('viewmovie/<int:id>/',views.view_movie,name='viewmovie'),
    path('editmovie/<int:id>/',views.movie_Edit,name='editmovie'),
    path('disablemovie/<int:id>',views.disable_movie,name='disablemovie'),
    path('deletemovie/<int:id>',views.movie_Delete,name="deletemovie"),
    path('searchmovie/<str:query>/',views.search_movies, name='searchmovie'),
    path('bookticket',views.book_ticket,name='bookticket'),
    path('initiatepayment/', views.initiate_payment, name= "initiatepayment"),
    path('handlepayment/',views.handle_payment,name='handlepayment'),
    path('sendemail/<int:bookingid>/',views.send_email,name='sendemail'),
    path('bookinglist',views.booking_list,name='bookinglist'),
    path('showtime/<int:movie_id>/',views.movie_show_times,name='showtime')
    
]   