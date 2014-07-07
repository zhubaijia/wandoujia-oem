#!/usr/bin/env python
#coding: utf-8
import os
import sys


if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "og.settings")

    from app.models import Subject
    Subject(name='编辑推荐', code='recommends').save()
    Subject(name='单机游戏', code='games').save()
    Subject(name='礼包放送', code='gifts').save()
    Subject(name='网络游戏', code='onlinegames').save()
    Subject(name=u'装机必备', code='zone1').save()
    Subject(name=u'上升最快', code='zone2').save()


