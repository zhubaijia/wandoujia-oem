from django.conf.urls import patterns, url

urlpatterns = patterns('oplog.views',
    # query
    url(r'^$','get_oplog'),
)
