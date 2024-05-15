from rest_framework import serializers
from .models import movies
from .models import Booking

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model=movies
        fields='__all__'
        
class BookingSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()
    movies = MovieSerializer(source='movie', read_only=True)  

    class Meta:
        model = Booking
        fields = ['id', 'movie', 'movies', 'booking_date', 'show_time', 'number_of_tickets', 'ticket_price', 'total_price']  
        read_only_fields = ['total_price', 'movie_details'] 

    def get_total_price(self, obj):
        return obj.calculate_total_price()

    def create(self, validated_data):
        user = self.context['request'].user
        
      
        ticket_price = 250.00 
        
        # Calculate total price
        number_of_tickets = validated_data.get('number_of_tickets', 0)
        total_price = ticket_price * number_of_tickets

        # Create a new Booking instance with the user, ticket price, and total price
        booking = Booking.objects.create(
            user=user,
            ticket_price=ticket_price,
            total_price=total_price,
            **validated_data
        )
        return booking