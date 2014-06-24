from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin

from money.models import Transaction
from money.serializers import TransactionSerializer


class TransactionList(ListModelMixin, GenericAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)