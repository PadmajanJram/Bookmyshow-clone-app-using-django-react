from datetime import datetime
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth.forms import UserCreationForm
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from movieback.models import  movies
from movieback.serializers import MovieSerializer
from django.db.models import Q
from .models import Booking, movies
from .serializers import BookingSerializer, MovieSerializer
import razorpay

@api_view(['POST'])
@permission_classes((AllowAny,))
def register(request):
    form = UserCreationForm(data=request.data)
    if form.is_valid():
        user = form.save()
        return Response("account created successfully", status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate user
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user is an admin
    if user.is_staff:
        role = "admin"
    else:
        role = "user"
    
    # Generate token
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({'token': token.key, 'role': role}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def logout(request: HttpRequest):
    try:
        # Delete the token associated with the current user
        Token.objects.filter(user=request.user).delete()
        
        # Logout the user
        logout(request._request)
        
        return Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['POST'])
@permission_classes([IsAdminUser,])
def movie_Add(request):
    if request.method=='POST':
        serializer=MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((IsAdminUser,))
def list_movies(request):
    movie = movies.objects.all()
    serializer = MovieSerializer(movie, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def list_movies(request):
    movie = movies.objects.all()
    serializer = MovieSerializer(movie, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser,IsAuthenticated,])
def view_movie(request, id):
    try:
        movie = movies.objects.get(id=id)
    except movies.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)
    
    serializer = MovieSerializer(movie)
    return Response(serializer.data)

@api_view(['PUT', 'GET'])
@permission_classes([IsAdminUser])
def movie_Edit(request, id):
    movie = get_object_or_404(movies, id=id)

    if request.method == 'GET':
        serializer = MovieSerializer(movie)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = MovieSerializer(movie, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes((IsAdminUser,))
def disable_movie(request,id):
        movie=movies.objects.get(id=id)
        movie.disabled= not movie.disabled
        movie.save()
        serializer=MovieSerializer(movie)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
@api_view(['DELETE'])
@permission_classes([IsAdminUser,])
def movie_Delete(request,id):
    try:
        movie=movies.objects.get(id=id)
        movie.delete()
        return Response(f"{movie} Deleted")
    except movies.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
def movie_show_times(request, movie_id):
    movie = get_object_or_404(movies, pk=movie_id)
    showTimes = movie.showTimes
    return JsonResponse({'showtimes': showTimes})
    
    
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def search_movies(request, query):
    try:
        query_date = datetime.strptime(query, '%Y-%m-%d').date()
        movie = movies.objects.filter(Q(startDate__lte=query_date) & Q(endDate__gte=query_date))
    except ValueError:
        movie=movies.objects.filter(name__istartswith=query)
    serializer = MovieSerializer(movie, many=True)
    print(f"Serialized Data: {serializer.data}")
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_ticket(request):
    
    serializer = BookingSerializer(data=request.data, context={'request': request})

    if serializer.is_valid():
        booking_instance = serializer.save()
        booking_id = booking_instance.id
        return Response({'message': 'Booking successful', 'booking_id': booking_id}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=400)
    
razorpay_client = razorpay.Client(auth=("rzp_test_1sXz8RplkyPm8I", "2BJslu0AnMPHza7CmI6aeiag"))
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def initiate_payment(request):
    if request.method == "POST":
        amount = request.data.get("amount")
        if amount is None or not isinstance(amount, (int, float)):
            return JsonResponse({'error': 'Invalid amount'}, status=400)

        amount_in_paise = int(amount * 250)  

        try:
            order_response = razorpay_client.order.create({'amount': amount_in_paise, 'currency': 'INR'})
            return JsonResponse(order_response)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def handle_payment(request):
    if request.method == "POST":
        # Extract payment details from request
        data = request.data
        # movies = Booking.objects.get(pk=pk)
        # Handle payment success or failure
        razorpay_payment_id = data.get('razorpay_payment_id')
        if razorpay_payment_id:
            return JsonResponse({'status': 'success'})
        else:
            # Payment failed
            return JsonResponse({'status': 'failure', 'error': 'razorpay_payment_id missing'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def booking_list(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    user_bookings = Booking.objects.filter(user=request.user)
    serializer = BookingSerializer(user_bookings, many=True)
    return Response(serializer.data)

from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import send_mail

csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def send_email(request,bookingid):
    movie=Booking.objects.get(pk=bookingid)

    subject = "Booking"
    from_email = "user123@gmail.com"
    recipient_list = ["your_mailtrap_inbox@mailtrap.io"]
    html_message = render_to_string('email.html', {'booking': movie})
    plain_message = strip_tags(html_message)
    send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)
    return HttpResponse('Email sent successfully')

