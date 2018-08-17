from django.urls import path
from api.views import *
from rest_framework.routers import DefaultRouter
from django.conf.urls import url, include

router = DefaultRouter()
router.register(r'listmusic', MusicViewSet)
urlpatterns = [
	url(r'^', include(router.urls)),
    path('signupadmin/', SignupAdminView.as_view()),
    path('signupuser/', SignupUserView.as_view()),
    path('music/add/', AddMusicView.as_view()),
    path('music/vote/', VoteView.as_view()),
]
