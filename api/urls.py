from django.conf.urls import url, include

from rest_framework import routers

from .views import TransactionViewSet

router = routers.DefaultRouter()
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    # url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/', include(router.urls, namespace='api')),
]
