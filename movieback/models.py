from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class movies(models.Model):
    name=models.CharField(max_length=150)
    showTimes=models.JSONField(max_length=50)
    dateofrelease=models.DateField()
    image=models.URLField(max_length=200,help_text="Enter the URL Movie Poster")
    startDate=models.DateField()
    endDate=models.DateField()
    disabled=models.BooleanField(default=False)
    
    def __str__(self):
        return self.name
    
class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(movies, on_delete=models.CASCADE)
    booking_date = models.DateField()
    show_time = models.CharField(max_length=10) # Provide empty choices for now
    number_of_tickets = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=250)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.name} - {self.show_time} - {self.booking_date}"

    def calculate_total_price(self):
        return self.number_of_tickets * self.ticket_price

    def save(self, *args, **kwargs):
        # Fetch available show times for the associated movie
        available_show_times = self.movie.showTimes
        # Update the choices attribute with the fetched show times
        self._meta.get_field('show_time').choices = [(time, time) for time in available_show_times]
        super().save(*args, **kwargs)
