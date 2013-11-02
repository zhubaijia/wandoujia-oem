from django import template

register = template.Library()

@register.filter
def get_groups(user):
    return ','.join([str(g.id) for g in user.groups.all()])
    
