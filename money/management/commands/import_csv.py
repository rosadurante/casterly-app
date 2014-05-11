# encoding: utf-8
import codecs
import csv
import logging
from datetime import datetime
from decimal import Decimal
from os import path

from django.core.management.base import BaseCommand, CommandError

from money.models import Account, Category, Transaction

logger = logging.getLogger('main')


class UTF8Recoder:
    """
    Iterator that reads an encoded stream and reencodes the input to UTF-8
    """
    def __init__(self, f, encoding):
        self.reader = codecs.getreader(encoding)(f)

    def __iter__(self):
        return self

    def next(self):
        return self.reader.next().encode("utf-8")


class UnicodeReader:
    """
    A CSV reader which will iterate over lines in the CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        f = UTF8Recoder(f, encoding)
        self.reader = csv.reader(f, dialect=dialect, **kwds)

    def next(self):
        row = self.reader.next()
        return [unicode(s, "utf-8") for s in row]

    def __iter__(self):
        return self


ACCOUNT, CATEGORY, DESCRIPTION, DATE, AMOUNT, KIND = range(6)


class Command(BaseCommand):

    def process_row(self, row):
        account, _ = Account.objects.get_or_create(name=row[ACCOUNT])
        category, _ = Category.objects.get_or_create(name=row[CATEGORY])
        transaction = Transaction.objects.create(
            account=account,
            category=category,
            description=row[DESCRIPTION],
            when=datetime.strptime(row[DATE], "%d/%m/%Y").date(),
            amount=Decimal(row[AMOUNT][1:].replace(',', '')),
            kind=row[KIND],
        )

    def parse_csv(self, csv_file):
        with open(csv_file, 'rb') as f:
            reader = UnicodeReader(f)
            i = 0
            for row in reader:
                i += 1
                self.process_row(row)

    def handle(self, *args, **options):
        try:
            csv_file, = args
        except ValueError:
            raise CommandError("Please insert file path")

        if not path.exists(csv_file):
            raise CommandError("Please enter a numeric value!")

        self.parse_csv(csv_file)
