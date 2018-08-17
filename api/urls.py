from django.urls import path
from api.views import *

urlpatterns = [
    path('signupadmin/', SignupAdminView.as_view()),
    path('signupuser/', SignupUserView.as_view()),
    path('music/add/', AddMusicView.as_view()),
    path('music/vote/', VoteView.as_view()),
]
