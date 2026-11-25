from django.shortcuts import render


def intro(request):
    return render(request, 'game/video.html')


def game(request):
    return render(request, 'game/index.html')
