from django.conf.urls import url

from .views import DashboardView, CompareStatsView

urlpatterns = [
    url(r'^dashboard$', DashboardView.as_view(), name="dashboard_view"),
    url(r'^compare$', CompareStatsView.as_view(), name="compare_view"),
]
