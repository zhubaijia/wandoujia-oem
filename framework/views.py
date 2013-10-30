import logging

from django.contrib import auth
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET, require_POST

logger = logging.getLogger(__name__)

@require_GET
def welcome(request):
    if request.user.is_authenticated():
        return redirect("/dashboard")
    else:
        return render(request, "login.html") 

@login_required
@require_GET
def dashboard(request):
    logger.debug('dashboard')
    return render(request, "dashboard.html", {"active_tab": "dashboard"})

@login_required
@require_GET
def logout(request):
    auth.logout(request)
    return redirect("/welcome")

