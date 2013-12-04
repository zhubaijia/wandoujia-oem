var parsley_options = $.extend({}, parsley.bs_options, {
	validators: {
		phone: function() {
			return {
				validate: function(val) {
					return /^\d{11}$/.test(val);
				},
				priority: 2
			};
		}
	},
	messages: {
		phone: '请输入正确的手机号码'
	}
});

var error_check = suning.decorators.error_check;
var login_check = suning.decorators.login_check;

$(function() {
	var $modal = $("#delete-user");
	var $saveBtn = $(".save", $modal);
	var $cancelBtn = $(".cancel", $modal);

	var user = null;
	$("table").on("click", ".delete", function() {
		user = $(this.parentNode).data();
		$(".user-name", $modal).html(user.username);
		$modal.modal('show');
	});

	function loading() {
		$saveBtn.button('loading');
		$cancelBtn.button('loading');
	}

	function reset() {
		$saveBtn.button('reset');
		$cancelBtn.button('reset');
	}

	$saveBtn.click(function() {
		suning.modal.lock($modal);
		Dajaxice.mgr.delete_user(function(data) {
			suning.modal.unlock($modal);
			if (data.ret_code != 0) {
				toast('error', data.ret_msg);
				return;
			}

			toast('success', '删除成功');
			$modal.modal('hide');
			suning.reload(2000);
		}, {
			id: user.id
		}, {
			error_callback: function() {
				suning.modal.unlock($modal);
				toast('error', NETWORK_ERROR_MSG);
			}
		});
	});
});

$(function() {
	$("select").select2(select2_tip_options);
});

$(function() {
	function bind(form, user) {
		form.id.value = user.id;
		form.username.value = user.username;
		form.realname.value = user.realname;
		form.phone.value = user.phone;
		form.email.value = user.email;
		form.tel.value = user.tel;
		form.introduce.value = user.introduce;
		$("[name=organization]").val(user.organization).trigger('change');

		if (user.type == "employee") {
			$("[name=groups]").val(user.groups.toString().split(",")).trigger('change');
			$("[name=user_permissions]").val(user.permissions.toString().split(",")).trigger('change');
		}
	}

	$("table").on('click', '.edit', function() {
		var user = $(this.parentNode).data();
		var $modal = user.type == "admin" ? $("#add-edit-admin") : $("#add-edit-employee");
		bind($modal.find("form")[0], user);
		$modal.modal('show');
	});
});

$(function() {
	var $modal = $("#reset-password");
	var $form = $("form", $modal);
	var form = $form[0];

	var options = $.extend({}, parsley.bs_options, {
		validators: {
			equal: function() {
				return {
					validate: function(val) {
						return form.password.value == val;
					},
					priority: 2
				}
			}
		},
		messages: {
			equal: '两次输入的密码不相同'
		}
	});

	$modal.on('show.bs.modal', function() {
		$form.parsley(options);
	});

	$modal.on('hide.bs.modal', function() {
		$form.parsley('destroy');
		form.password.value = "";
		form.confirm.value = "";
	});

	$("table").on('click', '.pwd', function() {
		var userid = $(this.parentNode).data("id");
		form.id.value = userid;
		$modal.modal('show');
	});

	$cancelBtn = $(".cancel", $modal);
	$saveBtn = $(".save", $modal);
	$saveBtn.click(function() {
		$form.submit();
	});

	function loading() {
		$saveBtn.button('loading');
		$cancelBtn.button('loading');
	}

	function reset() {
		$saveBtn.button('reset');
		$cancelBtn.button('reset');
	}

	function btn_check(func) {
		return function(data) {
			reset();
			func(data);
		}
	}

	$form.submit(function(e) {
		e.preventDefault();
		if (!$form.parsley('validate')) {
			return;
		}

		loading();
		Dajaxice.mgr.reset_password(btn_check(login_check(error_check(function(data) {
			toast('success', '修改密码成功');
			$modal.modal('hide');
			suning.reload(2000);
		}))), {
			form: $form.serialize(true)
		}, {
			error_callback: function() {
				reset();
				toast('error', NETWORK_ERROR_MSG);
			}
		});
	});
});

$(function() {
	var $modal = $("#add-edit-admin");
	if ($modal.length == 0) {
		return;
	}

	var $form = $modal.find("form");
	var form = $form[0];
	var $saveBtn = $(".save", $modal);
	var $cancelBtn = $(".cancel", $modal);

	$modal.on('show.bs.modal', function() {
		$form.parsley(parsley_options);
		$(".modal-name", $modal).html(form.id.value == "" ? "新增管理员" : "编辑管理员信息");
	});

	$modal.on('hide.bs.modal', function() {
		form.id.value = "";
		form.username.value = "";
		form.realname.value = "";
		form.phone.value = "";
		form.email.value = "";
		form.introduce.value = "";
		$form.parsley('destroy');
	});

	$saveBtn.click(function() {
		$form.submit();
	});

	function loading() {
		$saveBtn.button('loading');
		$cancelBtn.button('loading');
	}

	function reset() {
		$saveBtn.button('reset');
		$cancelBtn.button('reset');
	}

	function btn_check(func) {
		return function(data) {
			reset();
			func(data);
		}
	}

	function field_check(func) {
		return function(data) {
			if (data.ret_code != 0 && data.field) {
				parsley.highlightError(form, data.field);
				toast('error', data.error);
				return;
			}

			func(data);
		}
	}

	$form.submit(function(e) {
		e.preventDefault();
		if (!$form.parsley('validate')) {
			return;
		}

		var func = Dajaxice.mgr.add_edit_admin;
		loading();
		func(btn_check(login_check(field_check(error_check(function(data) {
			toast('success', form.id.value == "" ? '新增管理员成功' : '管理员信息修改成功');
			$modal.modal('hide');
			suning.reload(2000);
		})))), {
			form: $form.serialize(true)
		}, {
			error_callback: function() {
				reset();
				toast('error', NETWORK_ERROR_MSG);
			}
		});
	});
});

$(function() {
	var $modal = $("#add-edit-employee");
	var $form = $modal.find("form");
	var form = $form[0];
	var $saveBtn = $(".save", $modal);
	var $cancelBtn = $(".cancel", $modal);

	$modal.on('show.bs.modal', function() {
		$form.parsley(parsley_options);
		$(".modal-title", $modal).html(form.id.value == "" ? "新增普通用户" : "编辑普通用户");
	});

	$modal.on('hide.bs.modal', function() {
		form.id.value = "";
		form.username.value = "";
		form.realname.value = "";
		form.phone.value = "";
		form.email.value = "";
		form.introduce.value = "";
		$("[name=organization]", form).val("").trigger('change');
		$("[name=groups]", form).val("").trigger('change');
		$("[name=user_permissions]", form).val("").trigger('change');
		$form.parsley('destroy');
	});

	$saveBtn.click(function() {
		$form.submit();
	});

	function loading() {
		$saveBtn.button('loading');
		$cancelBtn.button('loading');
	}

	function reset() {
		$saveBtn.button('reset');
		$cancelBtn.button('reset');
	}

	function btn_check(func) {
		return function(data) {
			reset();
			func(data);
		}
	}

	function field_check(func) {
		return function(data) {
			if (data.ret_code != 0 && data.field) {
				parsley.highlightError(form, data.field);
				toast('error', data.error);
				return;
			}

			func(data);
		}
	}

	$form.submit(function(e) {
		e.preventDefault();
		if (!$form.parsley('validate')) {
			return;
		}

		var func = Dajaxice.mgr.add_edit_employee
		var permissions = "";
		if (form.user_permissions) {
			permissions = ($(form.user_permissions).val() || []).join(",");
		}
		loading();
		func(btn_check(login_check(field_check(error_check(function(data) {
			var msg = form.id.value == '' ? '添加用户成功' : '修改用户信息成功';
			toast('success', msg);
			$modal.modal('hide');
			suning.reload(2000);
		})))), {
			form: $form.serialize(true),
			permissions: permissions
		}, {
			error_callback: btn_check(function() {
				toast('error', NETWORK_ERROR_MSG);
			})
		});
	});
});