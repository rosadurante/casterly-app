from django.db import models

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


class Transaction(models.Model):
    account = models.ForeignKey(Account, related_name='transactions')
    category = models.ForeignKey(Category, related_name='transactions')

    description = models.CharField(max_length=300)
    when = models.DateField()
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    kind = models.CharField(max_length=3, choices=KINDS)

    def __unicode__(self):
        return "%s - %s - %.2f" % (
            self.when.strftime("%Y/%m/%d"), self.description[:20], self.amount
        )
