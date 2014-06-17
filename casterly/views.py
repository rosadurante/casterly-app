from allauth.account.views import LoginView as AllAuthLoginView
from allauth.account.views import SignupView as AllAuthSignupView

from .forms import LoginForm, SignupForm


class LoginView(AllAuthLoginView):
    form_class = LoginForm
    template_name = 'casterly/login_form.html'

class SignupView(AllAuthSignupView):
    form_class = SignupForm
    template_name = 'casterly/signup_form.html'