from allauth.account.views import LoginView as AllAuthLoginView

from .forms import LoginForm


class LoginView(AllAuthLoginView):
    form_class = LoginForm
    template_name = 'casterly/login_form.html'
