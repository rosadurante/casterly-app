from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from django.contrib import admin
admin.autodiscover()

from . import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'casterly.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', TemplateView.as_view(template_name="index.html"), name="home"),
    url(r'^accounts/login/$', views.LoginView.as_view(), name='account_login'),
    url(r'^accounts/signup/$', views.SignupView.as_view(), name='account_signup'),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
