from allauth.account.forms import LoginForm as AllAuthLoginForm
from allauth.account.forms import SignupForm as AllAuthSignupForm
from crispy_forms.bootstrap import FormActions
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit


class LoginForm(AllAuthLoginForm):
    """
    Shouldn't rewrite any functionality from allauth.accounts.forms.LoginForm,
    just plug crispy forms in
    """

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = 'login-form'
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-lg-2'
        self.helper.field_class = 'col-lg-8'

        self.helper.layout = Layout(
            'login',
            'password',
            'remember',
            FormActions(
                Submit('save', 'Log in'),
                css_class="col-sm-offset-2 col-sm-10",
            )
        )

class SignupForm(AllAuthSignupForm):
    """
    Shouldn't rewrite any functionality from allauth.accounts.forms.SignUpForm,
    just plug crispy forms in
    """

    def __init__(self, *args, **kwargs):
        super(SignupForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_id = 'signup-form'
        self.helper.form_class = 'form-horizontal'
        self.helper.label_class = 'col-lg-2'
        self.helper.field_class = 'col-lg-8'

        self.helper.layout = Layout(
            'username',
            'email',
            'password1',
            'password2',
            FormActions(
                Submit('save', 'Sign Up'),
                css_class="col-sm-offset-2 col-sm-10",
            )
        )
