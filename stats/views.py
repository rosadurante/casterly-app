from django.views.generic import TemplateView


class DashboardView(TemplateView):
    template_name = 'stats/dashboard_view.html'


class CompareStatsView(TemplateView):
    template_name = 'stats/compare_view.html'
