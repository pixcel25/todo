from django.shortcuts import render
from rest_framework.decorators import  api_view
from rest_framework.response import Response
# Create your views here.

from .serializers import serializers,TaskSerializer
from .models import Task
@api_view(['GET',])

def apioverveiw(request):
    return Response("hi")


@api_view(['GET'])

def tasklist(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)




@api_view(['GET'])

def taskdetail(request,n):
    tasks = Task.objects.get(id=n)
    serializer = TaskSerializer(tasks, many=False)
    return Response(serializer.data)



@api_view(['POST'])

def taskcreate(request):
    serializer = TaskSerializer(data = request.data)
    
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)




@api_view(['POST'])

def taskupdate(request,id):
   task = Task.objects.get(id = id)
   serializer = TaskSerializer(instance = task,data = request.data)
   if serializer.is_valid():
     serializer.save()
   return Response(serializer.data)



@api_view(['DELETE'])

def taskdelete(request,id):
   task = Task.objects.get(id = id)
   task.delete()
   return Response("delete sucessful")