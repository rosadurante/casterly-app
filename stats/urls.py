from django.conf.urls import patterns, url

from .views import DashboardView, CompareStatsView

urlpatterns = patterns('',
	url(r'^dashboard$', DashboardView.as_view(), name="dashboard_view"),
    url(r'^compare$', CompareStatsView.as_view(), name="compare_view"),
)