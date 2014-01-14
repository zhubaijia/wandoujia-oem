# -*- coding: utf-8 -*-
from django import forms
from oplog.models import OPLOG_TYPE_CHOICE
from mgr.models import Staff
from datetime import datetime
from django_select2 import *
from framework.widgets import Select2WidgetCN

class OpLogForm(forms.Form):
	username_list = [(-1, '--------')]
	username_list.extend(Staff.objects.order_by('username').values_list('id', 'username'))
	username = Select2ChoiceField(choices=username_list, required=True, label=u'用户', widget=Select2WidgetCN())
	
	type_list = [(-1, '--------')]
	type_list.extend(OPLOG_TYPE_CHOICE)
	type = Select2ChoiceField(choices=type_list, required=True, label=u'操作', widget=Select2WidgetCN())
	
	from_date = forms.DateTimeField(initial=datetime.today())
	to_date = forms.DateTimeField(initial=datetime.today())

