from django.core.urlresolvers import reverse_lazy
from django.views.generic import ListView
from django.views.generic.edit import FormMixin

from .models import Transaction, Account
from .forms import CreateTransactionForm, CreateAccountForm

class CreateListView(FormMixin, ListView):
    def get_context_data(self, **kwargs):
        context = super(CreateListView, self).get_context_data(**kwargs)
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
        return super(CreateListView, self).form_valid(form)


class TransactionListView(CreateListView):
    model = Transaction
    form_class = CreateTransactionForm
    template_name = 'money/transaction_list.html'
    success_url = reverse_lazy('transactions_list')


class AccountListView(CreateListView):
    model = Account
    form_class = CreateAccountForm
    template_name = 'money/account_list.html'
    success_url = reverse_lazy('account_list')

