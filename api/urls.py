from django.conf.urls import patterns, url, include

from rest_framework.urlpatterns import format_suffix_patterns

from .views import TransactionList


urlpatterns = patterns('',
	url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/transactions/', TransactionList.as_view(), name="api_transaction"),
)

urlpatterns = format_suffix_patterns(urlpatterns) 