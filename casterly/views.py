from django.views.generic import TemplateView

from allauth.account.views import LoginView as AllAuthLoginView
from allauth.account.views import SignupView as AllAuthSignupView

from money.models import Account
from .forms import LoginForm, SignupForm


class LoginView(AllAuthLoginView):
    form_class = LoginForm
    template_name = 'casterly/login_form.html'

class SignupView(AllAuthSignupView):
    form_class = SignupForm
    template_name = 'casterly/signup_form.html'


class IndexView(TemplateView):
	template_name = 'index.html'

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		context.update({'accounts': Account.objects.all()})
		return context
