from django.conf.urls import patterns, url

from .views import TransactionListView, AccountListView

urlpatterns = patterns('',
	url(r'^accounts$', AccountListView.as_view(), name="accounts_list"),
    url(r'^transactions$', TransactionListView.as_view(), name="transactions_list")
    # url(r'^transactions/create/$', views.TransactionsCreate.as_view(), name="transactions_create"),
    # url(r'^transactions/(?P<id>\d+)/delete/$', views.TransactionsDelete.as_view(), name="transactions_delete")
)
