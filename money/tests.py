# encoding: utf-8

from datetime import date
from decimal import Decimal

from django.test import TestCase
from model_mommy import mommy

from money.models import Account, Category, Transaction

# writing these tests while I'm on a plane with babies
# I'm not responsible of the quality of these tests.

# You have been warned

class TransactionModelTestCase(TestCase):

    def setUp(self):
        super(TransactionModelTestCase, self).setUp()
        self.account = Account.objects.create(name='Account')
        self.category = Category.objects.create(name='Category')

    def test_unicode_method_short_description(self):
        transaction = Transaction.objects.create(
            account=self.account,
            category=self.category,
            description='Short description',
            when=date(2014, 5, 10),
            amount=Decimal('4'),
            kind='in'
        )

        self.assertEqual(
            unicode(transaction),
            u'2014/05/10 - Short description - £4.00'
        )

    def test_unicode_method_long_description(self):
        transaction = Transaction.objects.create(
            account=self.account,
            category=self.category,
            description='This is a very long description',
            when=date(2014, 5, 10),
            amount=Decimal('4'),
            kind='in'
        )

        self.assertEqual(
            unicode(transaction),
            u'2014/05/10 - This is a very long... - £4.00'
        )

    def test_unicode_method_negative_amount(self):
        transaction = Transaction.objects.create(
            account=self.account,
            category=self.category,
            description='Short description',
            when=date(2014, 5, 10),
            amount=Decimal('4'),
            kind='out'
        )

        self.assertEqual(
            unicode(transaction),
            u'2014/05/10 - Short description - -£4.00'
        )

    def test_unicode_method_negative_amount_and_decimals(self):
        transaction = Transaction.objects.create(
            account=self.account,
            category=self.category,
            description='Short description',
            when=date(2014, 5, 10),
            amount=Decimal('4.5'),
            kind='out'
        )

        self.assertEqual(
            unicode(transaction),
            u'2014/05/10 - Short description - -£4.50'
        )

    def test_unicode_method_long_decimal_round_up(self):
        transaction = Transaction.objects.create(
            account=self.account,
            category=self.category,
            description='Short description',
            when=date(2014, 5, 10),
            amount=Decimal('2456.576'),
            kind='in'
        )

        self.assertEqual(
            unicode(transaction),
            u'2014/05/10 - Short description - £2456.58'
        )

    def test_unicode_method_long_decimal_round_down(self):
        transaction = Transaction.objects.create(
            account=self.account,
            category=self.category,
            description='Short description',
            when=date(2014, 5, 10),
            amount=Decimal('2456.574'),
            kind='in'
        )

        self.assertEqual(
            unicode(transaction),
            u'2014/05/10 - Short description - £2456.57'
        )


class TransactionQuerySetTestCase(TestCase):

    def test_expenses_method(self):
        mommy.make(
            'money.Transaction',
            kind='out',
            _quantity=10,
        )
        mommy.make(
            'money.Transaction',
            kind='in',
            _quantity=5,
        )

        self.assertEqual(Transaction.objects.expenses().count(), 10)
        self.assertEqual(
            list(set(Transaction.objects.expenses().values_list('kind', flat=True))),
            ['out'],
        )

    def test_income_method(self):
        mommy.make(
            'money.Transaction',
            kind='out',
            _quantity=10,
        )
        mommy.make(
            'money.Transaction',
            kind='in',
            _quantity=5,
        )

        self.assertEqual(Transaction.objects.income().count(), 5)
        self.assertEqual(
            list(set(Transaction.objects.income().values_list('kind', flat=True))),
            ['in'],
        )

    def test_expended_amount_method(self):
        mommy.make(
            'money.Transaction',
            kind='in',
            _quantity=5,
        )
        mommy.make('money.Transaction', kind='out', amount=Decimal('5'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('50'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('2.75'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('7'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('0.25'))

        self.assertEqual(
            Transaction.objects.expended_amount(),
            Decimal('65')
        )

    def test_income_amount_method(self):
        mommy.make(
            'money.Transaction',
            kind='out',
            _quantity=5,
        )
        mommy.make('money.Transaction', kind='in', amount=Decimal('5'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('50'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('2.75'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('7'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('0.25'))

        self.assertEqual(
            Transaction.objects.income_amount(),
            Decimal('65')
        )

    def test_total_balance_is_zero(self):
        mommy.make('money.Transaction', kind='out', amount=Decimal('5'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('50'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('2.75'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('7'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('0.25'))

        mommy.make('money.Transaction', kind='in', amount=Decimal('5'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('50'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('2.75'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('7'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('0.25'))

        self.assertEqual(Transaction.objects.total_balance(), Decimal('0'))

    def test_total_balance_positive(self):
        mommy.make('money.Transaction', kind='out', amount=Decimal('5'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('50'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('2.75'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('0.25'))

        mommy.make('money.Transaction', kind='in', amount=Decimal('5'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('50'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('2.75'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('7'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('0.25'))

        self.assertEqual(Transaction.objects.total_balance(), Decimal('7'))

    def test_total_balance_negative(self):
        mommy.make('money.Transaction', kind='out', amount=Decimal('5'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('50'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('2.75'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('7'))
        mommy.make('money.Transaction', kind='out', amount=Decimal('0.25'))

        mommy.make('money.Transaction', kind='in', amount=Decimal('5'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('50'))
        mommy.make('money.Transaction', kind='in', amount=Decimal('0.25'))

        self.assertEqual(Transaction.objects.total_balance(), Decimal('-9.75'))

