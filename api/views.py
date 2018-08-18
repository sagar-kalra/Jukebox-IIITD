from django.shortcuts import render, Http404
from api.serializers import *
from rest_framework.generics import UpdateAPIView, ListAPIView, CreateAPIView
from api.models import Student, Centre, Course, User
from rest_framework.views import APIView
from api.models import Student, Centre, Test, Question, Section, Option
from rest_framework import viewsets
from api.utils import parser
from datetime import datetime
from rest_framework.response import Response
from django.core.mail import send_mail
#from django.shortcuts import get_object_or_404
import json
import uuid
#from django.db.models import F
from rest_framework import viewsets

def get_super_admin(user):
    type_of_user = user.type_of_user
    if type_of_user == 'student':
        super_admin = user.student.super_admin
    elif type_of_user == 'staff':
        super_admin = user.staff.super_admin
    else:
        super_admin = user.superadmin
    return super_admin


class MusicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer
    class Meta:
            ordering=['-id']

class SignupAdminView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        first_name, last_name, email, contact_number= request.data['first_name'], request.data['last_name'],  request.data['email'],request.data['contact_number']
        user = User.objects.create(first_name = first_name, last_name = last_name, email = email, phone = contact_number,steem_posting_key = request.data['steem_posting_key'] ,password = request.data['password'],type_of_user = "superadmin", username = request.data['username'], profile_photo = request.data['image'])
        user.set_password(request.data['password'])
        user.save()
        return Response({
            'detail' : 'successfull',
            })

class AddMusicView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        music = Music.objects.create(music = request.data['music'], user = request.user, title = request.data['title'], cover = request.data['cover'], artist = request.data['artist'])
        return Response({
            'detail':'successfull'
            })

class SignupUserView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        first_name, last_name, email, contact_number = request.data['first_name'], request.data['last_name'],  request.data['email'],request.data['contact_number']
        user = User.objects.create(first_name = first_name, last_name = last_name, email = email, phone = contact_number, type_of_user = "user", username = request.data['username'], profile_photo = request.data['image'], steem_posting_key = request.data['steem_posting_key'])
        user.set_password(request.data['password'])
        user.save()
        student  = Student.objects.create(user = user)
        return Response({
            'detail' : 'successfull',
            })

class VoteView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        vote, created = Vote.objects.get_or_create(music = Music.objects.get(id = request.data['musicId']))
        vote.vote_up+=1
        vote.save()
        return Response({
            'detail' : 'successfull'
            })