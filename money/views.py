from django.core.urlresolvers import reverse_lazy
from django.views.generic import ListView

from .models import Transaction, Account


class TransactionListView(ListView):
    model = Transaction
    template_name = 'money/transaction_list.html'
    success_url = reverse_lazy('transactions_list')


class AccountListView(ListView):
    model = Account
    template_name = 'money/account_list.html'
    success_url = reverse_lazy('accounts_list')
