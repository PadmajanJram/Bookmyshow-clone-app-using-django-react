# Generated by Django 5.0.2 on 2024-04-22 09:48

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movieback', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('booking_date', models.DateField()),
                ('show_time', models.CharField(blank=True, choices=[], max_length=8)),
                ('number_of_tickets', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('ticket_price', models.DecimalField(decimal_places=2, default=250, max_digits=10)),
                ('total_price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='movieback.movies')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
