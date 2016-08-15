from django.conf.urls import url

from .views import TransactionListView, AccountListView

urlpatterns = [
    url(r'^accounts$', AccountListView.as_view(), name="accounts_list"),
    url(r'^transactions$', TransactionListView.as_view(), name="transactions_list")
]
