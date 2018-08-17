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

def get_super_admin(user):
    type_of_user = user.type_of_user
    if type_of_user == 'student':
        super_admin = user.student.super_admin
    elif type_of_user == 'staff':
        super_admin = user.staff.super_admin
    else:
        super_admin = user.superadmin
    return super_admin

class CompleteProfileView(UpdateAPIView):
    serializer_class = StudentSerializer

    def get_queryset(self, *args, **kwargs):
        return Student.objects.filter(user=self.request.user)

    def put(self, request, *args, **kwargs):
        print(request.data)
        response = super(CompleteProfileView, self).put(request,
                                                    *args,
                                                    **kwargs)
        if response.status_code == 200:
            obj = Student.objects.get(id=kwargs['pk'])
            obj.complete = True
            obj.save()
        return response

class CentreViewSet(viewsets.ReadOnlyModelViewSet):
    model = Centre
    serializer_class = CentreSerializer

    def get_queryset(self):
        super_admin = get_super_admin(self.request.user)
        queryset = self.model.objects.filter(super_admin=super_admin)
        return queryset

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    model = Course
    serializer_class = CourseSerializer

    def get_queryset(self):
        super_admin = get_super_admin(self.request.user)
        queryset = self.model.objects.filter(super_admin=super_admin)
        return queryset

class TestFromDocView(APIView):
    def post(self, request, *args, **kwargs):

        test = parser.parse(request.data["doc"])
        testObj = Test.objects.create(title=request.data['title'],
                            course=Course.objects.get(pk=request.data['course']),
                            description=request.data['description'],
                            super_admin=get_super_admin(request.user))
        sections = []
        question_count = [len(test[section]) for section in test]
        questions = []
        options = []
        for section in test:
            sections.append(Section(title=section, test=testObj))
        Section.objects.bulk_create(sections)
        for i in range(len(sections)):
            for question in test[sections[i].title]:
                questions.append(Question(section=sections[i], text=question["question"]))
        Question.objects.bulk_create(questions)

        for i in range(len(sections)):
            for j in range(len(test[sections[i].title])):
                question = test[sections[i].title][j]
                index = j
                if i > 0:
                    index += sum(question_count[:i])
                questionObj = questions[index]
                for option in question["options"]:
                    options.append(Option(text=option[0], correct=option[1], question=questionObj))
        Option.objects.bulk_create(options)
        return Response({ "id" : testObj.pk })

class TestDetailsView(APIView):
    def get(self, request, pk, *args, **kwargs):
        if not request.user or request.user.type_of_user == 'student':
            raise Http404
        testObj = Test.objects.get(pk=pk)
        if testObj.super_admin != get_super_admin(self.request.user):
            raise Http404
        data = TestSerializerFull(testObj).data
        print(data['sections'])
        return Response(data)

class UpdateTestView(UpdateAPIView):
    serializer_class = TestSerializer

    def get_queryset(self):
        super_admin = get_super_admin(self.request.user)
        queryset = Test.objects.filter(super_admin=super_admin)
        return queryset

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class UpdateQuestionView(UpdateAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class CreateQuestionView(CreateAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def post(self, request, *args, **kwargs):
        response = super(CreateQuestionView, self).post(request, *args, **kwargs)
        qid = response.data['id']
        for _ in range(4):
            Option.objects.create(question_id=qid, text="-"*45)
        return response

class UpdateOptionView(UpdateAPIView):
    serializer_class = OptionSerializer
    queryset = Option.objects.all()

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class GetStaffUsersView(ListAPIView):
    serializer_class = StaffSerializer
    queryset = Staff.objects.all()

class GetStudentUsersView(ListAPIView):
    serializer_class = StudentSerializer
    queryset = Student.objects.select_related('user', 'course', 'centre').all()

class AddBulkStudentsView(APIView):
    def post(self, request, *args, **kwargs):
        n = int(request.data['no_of_students'])
        count = 0
        users = []
        passwords = []
        students = []
        existing = [x['username'] for x in User.objects.values('username')]
        while (count < n):
            username = "GE" + uuid.uuid4().hex[:5].upper()
            password = uuid.uuid4().hex[:8].lower()
            if username not in existing:
                existing.append(username)
                user = User(username=username, type_of_user="student")
                user.set_password(password)
                users.append(user)
                passwords.append(password)
                # create user here
                count += 1
        User.objects.bulk_create(users)
        for user in users:
            students.append(Student(user=user, super_admin=get_super_admin(request.user)))
        Student.objects.bulk_create(students)
        return Response({
            "detail": "successfull",
            "users": [(users[i].username, passwords[i]) for i in range(n)]
        })

class AddSectionView(APIView):
    def post(self, request, *args, **kwargs):
        Section.objects.create(test_id=request.data['test'], title=request.data['title']);
        return Response({ "status": "successful" })

class TestListView(ListAPIView):
    serializer_class = TestSerializer

    def get_queryset(self):
        tests = Test.objects.filter(super_admin=get_super_admin(self.request.user)).order_by('-pk')
        return tests

class AddTestManualView(APIView):
    def post(self, request, *args, **kwargs):
        testObj = Test.objects.create(title=request.data['title'],
                            course=Course.objects.get(pk=request.data['course']),
                            description=request.data['description'],
                            super_admin=get_super_admin(request.user))
        Section.objects.create(title="Section 1", test=testObj)
        return Response({ "id" : testObj.pk })

class AddStaffView(APIView):
    def post(self, request, *args, **kwargs):
        name, email, course, centre = request.data['name'], request.data['email'], request.data['course'], request.data['centre']
        existing = [x['username'] for x in User.objects.values('username')]
        user, password = None, ""
        while True:
            username = "ST" + uuid.uuid4().hex[:5].upper()
            password = uuid.uuid4().hex[:8].lower()
            if username not in existing:
                user = User.objects.create(username=username, type_of_user="staff", email=email)
                user.set_password(password)
                user.save()
                break
        user.staff.name = name
        user.staff.course_id = course
        user.staff.centre_id = centre
        user.staff.super_admin = get_super_admin(request.user)
        user.staff.save()
        send_mail(
            'Test Series Staff Account Credentials',
            'username: %s\n pass: %s' %(username, password),
            'gurpreetsinghzomato15@gmail.com',
            [email],
            fail_silently=False,
        )
        return Response({
            "detail": "successfull",
            "username": username,
            "password": password,
        })

class SignupAdminView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        first_name, last_name, email, contact_number, bravecoin_id = request.data['first_name'], request.data['last_name'],  request.data['email'],request.data['contact_number'], request.data['bravecoin_id']
        user = User.objects.create(first_name = first_name, last_name = last_name, email = email, phone = contact_number, password = request.data['password'],type_of_user = "superadmin", username = request.data['username'], profile_photo = request.data['image'])
        user.set_password(request.data['password'])
        user.save()
        return Response({
            'detail' : 'successfull',
            })

class AddMusicView(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        music = Music.objects.create(music = request.data['music'], user = request.user)
        return Response({
            'detail':'successfull'
            })