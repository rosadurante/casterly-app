from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
	url(r'^dashboard$', views.DashboardView.as_view(), name="dashboard_view"),
    url(r'^compare$', views.CompareStatsView.as_view(), name="compare_view")
    # url(r'^transactions/create/$', views.TransactionsCreate.as_view(), name="transactions_create"),
    # url(r'^transactions/(?P<id>\d+)/delete/$', views.TransactionsDelete.as_view(), name="transactions_delete")
)