# encoding: utf-8
from django.db import models

from .managers import TransactionManager

KINDS = (
    ('in', 'In'),
    ('out', 'Out'),
)


class Account(models.Model):
    name = models.CharField(max_length=300)

    def __unicode__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=300)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u'Category'
        verbose_name_plural = u'Categories'


class Transaction(models.Model):
    account = models.ForeignKey(Account, related_name='transactions')
    category = models.ForeignKey(Category, related_name='transactions')

    description = models.CharField(max_length=300)
    when = models.DateField()
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    kind = models.CharField(max_length=3, choices=KINDS)

    objects = TransactionManager()

    def __unicode__(self):
        if self.kind == 'out':
            operation_sign = '-'
        else:
            operation_sign = ''

        description = self.description
        if len(description) > 20:
            description = '%s...' % description[:20].strip()

        return u"%(when)s - %(description)s - %(sign)s£%(amount).2f" % {
            'when': self.when.strftime("%Y/%m/%d"),
            'description': description,
            'sign': operation_sign,
            'amount': self.amount
        }
