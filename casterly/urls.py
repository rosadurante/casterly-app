from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from . import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'casterly.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', views.IndexView.as_view(), name="home"),
    url(r'^', include('stats.urls')),
    url(r'^', include('money.urls')),

    url(r'^accounts/login/$', views.LoginView.as_view(), name='account_login'),
    url(r'^accounts/signup/$', views.SignupView.as_view(), name='account_signup'),
    url(r'^accounts/', include('allauth.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
