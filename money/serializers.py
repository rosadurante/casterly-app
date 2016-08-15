from rest_framework.serializers import ModelSerializer

from .models import Transaction, Account, Category


class CategorySerializer(ModelSerializer):

    class Meta:
        model = Category
        fields = ('name', )


class AccountSerializer(ModelSerializer):

    class Meta:
        model = Account
        fields = ('name', )


class TransactionSerializer(ModelSerializer):
    account = AccountSerializer()
    category = CategorySerializer()

    class Meta:
        model = Transaction
        fields = ('account', 'category', 'description', 'when', 'amount', 'kind')
