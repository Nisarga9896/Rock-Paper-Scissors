from django.urls import path
from . import views

urlpatterns = [
    path('', views.intro, name='intro'),
    path('intro/', views.intro),
    path('game/', views.game, name='home'),
]
