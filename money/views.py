from django.core.urlresolvers import reverse_lazy
from django.views.generic import ListView # , CreateView, DeleteView
from django.views.generic.edit import FormMixin

from .models import Transaction
from .forms import CreateTransactionForm

# Create your views here.

class FormListView(FormMixin, ListView):
    http_method_names = [u'get', u'post']

    def get_queryset(self):
        return self.model.objects.get_query_set()

    def get_context_data(self, **kwargs):
        context = super(FormListView, self).get_context_data(**kwargs)

        if 'form' not in context:
            context['form'] = self.form

        return context

    def get(self, request, *args, **kwargs):
        # Processing form
        self.form = self.get_form(
            self.get_form_class()
        )

        return super(FormListView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        form = self.get_form(
            self.get_form_class()
        )

        if form.is_valid():
            form.save()
            return self.form_valid(form)
        else:
            return self.form_invalid(form)


class TransactionView(FormListView):
    model = Transaction
    form_class = CreateTransactionForm
    template_name = 'money/transaction_list.html'
    # TODO: find the way to use the url name here.
    success_url = '/transactions/'