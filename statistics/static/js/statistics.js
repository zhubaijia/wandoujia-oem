(function(window) {
    function parseDate(value) {
        var regex = /(\d{4})-(\d\d)-(\d\d)/;
        var result = value.match(regex);
        var year = parseInt(result[1], 10);
        var month = parseInt(result[2], 10);
        var date = parseInt(result[3], 10);
        return new Date(year, month-1, date, 0);
    }

    function table_map(data, names) {
        var result = {};
        _.each(data, function(item) {
            if(names.indexOf(item.name) != -1) {
                result[item.name] = item.value; 
            }
        });

        return result;
    }

    var table_options = {
        bProcessing: true,
        bLengthChange: false,
        bSort: false,
        bFilter: false,
        bServerSide: true,
        bRetrieve: true,
        oLanguage: {
            oPaginate: {
                sFirst: '第一页',
                sLast: '最后一页',
                sNext: '&raquo;',
                sPrevious: '&laquo;'
            },
            sEmptyTable: '暂无记录',
            sInfo: '共 _TOTAL_ 次安装',
            sInfoEmpty: '暂无记录',
            sProcessing: '正在查询，请稍等...',
            sZeroRecords: '暂无记录'
        }
    };

    function Period(from, to) {
        var that = this;
        this.$from = $(from);
        this.$to = $(to);
        this.$from.change(function() {
            var from_date = parseDate(that.$from.val());
            that.$to.datetimepicker('setStartDate', from_date);

            if (!that.$to.val()) return;

            var to_date = parseDate(that.$to.val());
            if(to_date.getTime() < fromDate.getTime()) {
                that.$to.datetimepicker('setDate', startDate);
            }
        });
    }

    window.statistics = {
        parseDate: parseDate,
        table_map: table_map,
        table_options: table_options,
        period: Period
    };
})(window);
