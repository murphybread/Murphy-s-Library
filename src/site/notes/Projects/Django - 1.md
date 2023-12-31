---
{"dg-publish":true,"permalink":"/Projects/Django - 1/","tags":["Django","Python","Backend","Framework","110_10_a_1"],"noteIcon":"0","created":"2023-12-15T21:35:22.090+09:00","updated":"2024-01-01T01:17:53.722+09:00"}
---


#Project
[[Projects/Project\|Project]]
작성날짜: 2023-12-15
Goal이 없는 Project는 취미에 불과하며, Project 없는 Goal은 망상에 불과하다.

```tasks
path includes projects
```


추가로 배울것 
템플릿
DB연동 with Model

# 주제
# 기한: 2023.00.00 ~ 2023.12.20
# 목표
# 결과물
# 관련 내용


```
django 설치확인
django-admin

django 프로젝트 만들기
django-admin startproject myproject .
django-admin startproject [project name] [directory path]

세부 동작 명령어 확인
python manage.py

파이썬 서버 동작
python manage.py runserver
python manage.py runserver [port]

Django 컴포넌트임 앱만들기
django-admin startapp myapp
django-admin startapp <app name>

```


라우팅 흐름
(인터넷 망)유저 -> 
(장고 망)프로젝트 ->
(앱 망)앱->뷰 -> 함수

네트워크 구분을 다음과 같이 구분한 것은 같은 줄의 경우 같은 디렉토리 내에 있다는 의미

## 상세한 라우팅 흐름
### 인터넷망
유저 ->
http://127.0.0.1:8000/
뒤의 도메인은 변경 가능


### 장고 망
프로젝트 ->
내용은 myproject의 urls.py에서 라우팅
먼저 기본적으로 제공되는 설명중 another urlconf를 참조해서 작성
1. include 모듈을 import하기
2. appname.urls 형식을통해 어느 앱으로 보낼지 선택

```python
"""myproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("myapp.urls"))
]
``` 
### 여기서 주목할 점은 path의 ""에서 볼수 있듯이 어디로 라우팅하냐에따라 앱의 어디로 보낼지를 정함

### 앱망
앱 ->뷰 
myapp의 urls에서 해당 내용 확인
앱에서 해당 파일을 쓰기 위해 import views
앱으로 들어온`경로`에 따라 어느 모듈의 함수로 보낼지 설정
특히 여기서 `<id>` 같은 경우 id는 임의로 정할 수 있는데 중요한 것은 동적으로 처리가 됨

```python
from django.urls import path, include
from myapp import views

urlpatterns = [
    path("", views.index),
    path("create", views.create),
    path("read/<id>/", views.read),
]

```


뷰->응답생성
views.py에서 해당 내용 확인
쉽게 처리하기위해 `HttpResponse` 모듈 import하여 사용
함수에서 파라미터인 request 이름자체는 임의로 설정 가능
read에대한 라우팅의 경우 동적으로 전달받는 `id` 값을 다음과 같이 인수로 받아서 사용

```python
from django.shortcuts import render, HttpResponse


# Create your views here.
def index(request):
    return HttpResponse("Welcome!")


def create(request):
    return HttpResponse("Create")


def read(request, id):
    return HttpResponse("Read" + id)


```