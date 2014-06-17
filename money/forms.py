from django.forms import ModelForm

from crispy_forms.bootstrap import StrictButton
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout

from .models import Transaction

class CreateTransactionForm(ModelForm):

    class Meta:
        model = Transaction
        fields = ['account', 'category', 'description', 'when', 'amount', 'kind']

    def __init__(self, *args, **kwargs):
        super(CreateTransactionForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = 'create-transaction-form'
        self.helper.form_class = 'form-inline'

        self.helper.layout = Layout(
            'account',
            'category',
            'description',
            'when',
            'amount',
            'kind',
            StrictButton('Create', css_class="btn-default", type="submit")
        )