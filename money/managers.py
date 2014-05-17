from django.db.models.aggregates import Sum
from django.db.models.manager import Manager
from django.db.models.query import QuerySet


class TransactionQuerySet(QuerySet):

    def expenses(self):
        return self.filter(kind='out')

    def income(self):
        return self.filter(kind='in')

    def __total_amount(self):
        return self.aggregate(Sum('amount'))['amount__sum']

    def expended_amount(self):
        return self.expenses().__total_amount()

    def income_amount(self):
        return self.income().__total_amount()

    def total_balance(self):
        return self.income_amount() - self.expended_amount()


class TransactionManager(Manager):

    def get_query_set(self):
        return TransactionQuerySet(self.model)

    def expenses(self):
        return self.get_query_set().expenses()

    def income(self):
        return self.get_query_set().income()

    def expended_amount(self):
        return self.get_query_set().expended_amount()

    def income_amount(self):
        return self.get_query_set().income_amount()

    def total_balance(self):
        return self.get_query_set().total_balance()

