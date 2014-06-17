from django.core.urlresolvers import reverse_lazy
from django.views.generic import ListView
from django.views.generic.edit import FormMixin

from .models import Transaction
from .forms import CreateTransactionForm


class TransactionListView(FormMixin, ListView):
    model = Transaction
    form_class = CreateTransactionForm
    template_name = 'money/transaction_list.html'
    success_url = reverse_lazy('transactions_list')

    def get_context_data(self, **kwargs):
        context = super(TransactionListView, self).get_context_data(**kwargs)
        context.update({'form': self.get_form(self.get_form_class())})
        return context

    def post(self, request, *args, **kwargs):
        form = self.get_form(self.get_form_class())

        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        form.save()
        return super(TransactionListView, self).form_valid(form)