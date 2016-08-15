from django.views.generic import TemplateView

from money.models import Account


class IndexView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context.update({'accounts': Account.objects.all()})
        return context
