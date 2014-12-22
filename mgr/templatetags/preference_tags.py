import logging
import datetime
from django import template
from mgr.models import Preference
from django.forms.models import model_to_dict


logger = logging.getLogger(__name__)
register = template.Library()

CSS_SOURCE = '''
<style>
.navbar .navbar-brand {
    background-image: url(%s);
}
</style>
<link rel="stylesheet" href="/bootstrap/bootstrap.css?color=%s&navbar_color=%s">
'''


@register.simple_tag
def preference():
    preference = Preference.getPreference()

    logger.debug(preference)
    source = CSS_SOURCE % (preference.get('logo', '../img/tianyin_logo_navigation.png'), 
                preference.get('color'), preference.get('navbar_color'))
    logger.debug(source)
    return source
