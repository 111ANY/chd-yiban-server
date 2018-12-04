define(['jquery', 'bootstrap', 'backend', 'table', 'form','bootstrap-daterangepicker','bootstrap-select'], function ($, undefined, Backend, Table, Form) {
    
    var Controller = {
        index: function () {
            // console.log(param);

            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'dormitorysystem/dormitorylist/index',
                    add_url: 'dormitorysystem/dormitorylist/add',
                    //edit_url: 'bx/repairlist/edit',
                    edit_url: '0',
                    del_url: '0',
                    multi_url: 'dormitorysystem/dormitorylist/multi',
                    free_bed_url: 'dormitorysystem/dormitorylist/freebed',
                    table: 'dormitory_list',
                }
            });

            var table = $("#table");

            table.on('load-success.bs.table', function (e,value,data) {
                var bedIdlist = {};
                $.each(value.rows,function (i,v) {
                        bedIdlist[i] = v.ID;
                    })
                $.ajax({
                    
                        type:'POST',
                        url:$.fn.bootstrapTable.defaults.extend.free_bed_url,
                        data:{
                            key: JSON.stringify(bedIdlist),
                        },
                        success:function(data){
                            $("#table tbody tr").each(function(i,v){
                                data_index = $(this).attr('data-index');
                                $(this).find("td:eq(6)").html(data[i].situation);
                                $(this).find("td:eq(7)").html(data[i].fullBedNum + "/" + data[i].allBedNum);
                            });
                        }
                    })
                //这里可以获取从服务端获取的JSON数据
            });

            // 初始化表格
            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                //pk: 'ID',
                //sortName: 'ID',
                columns: [
                    [
                        {checkbox: true},
                        //{field: 'ID', title: __('ID'),sortable:true,width:50},
                        {field: 'XQ', title: __('校区')},
                        {field: 'LH', title: __('楼号'),sortable:true,width:60},                   
                        {field: 'LC', title: __('楼层'),sortable:true,width:60},
                        {field: 'LD', title: __('楼段')},
                        {field: 'SSH', title: __('宿舍号'),sortable:true,width:80},
                        {field: 'RZQK', title: __('入住情况'),operate:false,formatter:function(value,row,index){}},
                        {field: 'RZBL', title: __('入住比例(入住/总床位)'),operate:false,formatter:function(value,row,index){}},
                        {field: 'XBDM', title: __('类别'),searchList: {"1":__('男宿'),"2":__('女宿')},formatter:function(value){
                            if(value == 1) 
                                return "男宿";
                            if(value == 2) 
                                return "女宿";
                        }},
                        {field: 'operate', width: "160px", title: __('Operate'), table: table, events: Table.api.events.operate,  
                        
                        buttons: [
                                {name: 'dormitoryinfo', title: __('查看宿舍信息'), classname: 'btn btn-xs btn-primary btn-success btn-dormitory  btn-dialog', icon: 'fa fa-gear', url: 'dormitorysystem/dormitorylist/dormitoryinfo?LH={LH}&SSH={SSH}',text: __('操作'), callback: function (data){}},      
                            ],     
                        formatter: Table.api.formatter.operate,               
                    }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
            //取消双击编辑
            table.off('dbl-click-row.bs.table');




        },
        confirmdistribute:function () {
            //时间选择模块
            var now = new Date();
            var time = now.getFullYear() + "-" +((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();
            $('#selecthandletime').daterangepicker({
                "singleDatePicker": true,
                "startDate": time,
            }, );

            $('.selectpicker').selectpicker({   
                title:'未选择',
                liveSearchPlaceholder:'请输入姓名或学号',
                maxOptions:20,
                width:'auto',
            });
            var timeOut = ""; 

            $('#search-user input').bind('input propertychange',function(){
                var key = $(this).val();
                var nj = key.substring(0,4);
                //如果前四位是数字表示是学号

                if (!isNaN(parseInt(nj))) {
                    if (nj <= 2015) {
                        if (key.length >= 11) {
                            clearTimeout(timeOut); 
                            timeOut = setTimeout(function (){                         
                                var postData = {'XH':key};
                                $('#option').empty();
                                $.ajax({
                                    type: 'POST',
                                    url: './dormitorysystem/Dormitorylist/searchStuByXh',
                                    data: postData,
                                    success: function(data) {
                                        var str = "";  
                                        $.each(data, function(key, value) {
                                            str = "<option value=" + value.XH + ">" + value.XH + "-" + value.XM + "-" + value.YXJC + "</option>";
                                            $('#option').append(str);
                                        });
                                        $('#option').selectpicker('render');
                                        $('#option').selectpicker('refresh');
                                        clearTimeout(timeOut); 
                                    }
                                });
                            },100);
                        }
                    } else {
                        if (key.length >= 9) {
                            clearTimeout(timeOut); 
                            timeOut = setTimeout(function (){                         
                                var postData = {'XH':key};
                                $('#option').empty();
                                $.ajax({
                                    type: 'POST',
                                    url: './dormitorysystem/Dormitorylist/searchStuByXh',
                                    data: postData,
                                    success: function(data) {
                                        var str = "";  
                                        $.each(data, function(key, value) {
                                            str = "<option value=" + value.XH + ">" + value.XH + "-" + value.XM + "-" + value.YXJC + "</option>";
                                            $('#option').append(str);
                                        });
                                        $('#option').selectpicker('render');
                                        $('#option').selectpicker('refresh');
                                        clearTimeout(timeOut); 
                                    }
                                });
                            },100);
                        } 
                    } 
                } else if(key != '' && key != null) {
                    clearTimeout(timeOut); 
                    timeOut = setTimeout(function (){                         
                        var postData = {'name':key};
                        $('#option').empty();
                        $.ajax({
                            type: 'POST',
                            url: './dormitorysystem/Dormitorylist/searchStuByName',
                            data: postData,
                            success: function(data) {
                                var str = "";  
                                $.each(data, function(key, value) {
                                    str = "<option value=" + value.XH + ">" + value.XH + "-" + value.XM + "-" + value.YXJC + "</option>";
                                    $('#option').append(str);
                                });
                                $('#option').selectpicker('render');
                                $('#option').selectpicker('refresh');
                                clearTimeout(timeOut);
                                console.log(str); 
                            }
                        });
                    },100);
                }
            });

            $("#search").on('click',function(){
                Fast.api.open("./dormitorysystem/confirmdistribute/search", "搜索", {
                        callback:function(value){
                            //window.location.reload();
                            msg = value.XH + "-" + value.XM + "-" +value.XB;
                            $('#userInfo').val(msg);
                            //在这里可以接收弹出层中使用`Fast.api.close(data)`进行回传的数据
                        }
                    });
                });
            //取消分配
            $('.cancel').on('click',function () {
                Fast.api.close();
            });
            //确定分配
            $('#confirmdistribute').on('click',function () {

                var postdata = {
                    'LH':$('#LH').text(),
                    'CH':$('#CH').text(),
                    'SSH':$('#SSH').text(),
                    'reason':$("input[name='reason']:checked").val(),
                    'info':$('#userInfo').val(),
                    'remark':$('#remark').val(),
                    'newclass':$('#newclass').val(),
                    'handletime':$('#selecthandletime').val(),
                }

                $.ajax({
                    type: 'POST',
                    url: './dormitorysystem/Dormitorylist/addStuRecord',
                    data: postdata,
                    success: function(data) {
                        if (data.status == true) {
                            alert(data.msg);
                            Fast.api.close();
                            window.parent.location.reload();
                        } else{
                            alert(data.msg);
                        }
                    }
                });
            });
        },

        

        confirmdelete: function(){
            //时间选择插件
            //http://www.daterangepicker.com
            var now = new Date();
            var time = now.getFullYear() + "-" +((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();
            $('#selectstarttime').daterangepicker({
                "singleDatePicker": true,
                "startDate": time,
            }, );

            $('#selectendtime').daterangepicker({
                "singleDatePicker": true,
                "startDate": time,
            }, );
            $(document).on('click', '.btn-confirmdelete', function () {
                var mymessage=confirm("确定要移除该床位学生吗？");
                if(mymessage == true){
                   var postdata = {
                    'LH':$('#LH').text(),
                    'CH':$('#CH').text(),
                    'SSH':$('#SSH').text(),
                    'XH':$('#XH').text(),
                    'reason':$("input[name='reason']:checked").val(),
                    'remark':$('#remark').val(),
                    'handletime':$('#selectstarttime').val(),
                    'handleendtime':$('#selectendtime').val(),
                }
                    $.ajax({
                        type: 'POST',
                        url: './dormitorysystem/Dormitorylist/deleteStuRecord',
                        data: postdata,
                        success: function(data) {
                            if (data === true) {
                                alert('移除成功');
                                Fast.api.close();
                                window.parent.location.reload();
                            } else {
                                alert('网络原因移除失败，稍后重试');
                            }
                        }
                    });
                }
            }); 
            $(document).on('click', '.btn-canceldelete', function () {
                Fast.api.close();
            }); 
        },

        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        },
    };   
    return Controller;
});