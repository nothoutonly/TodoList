;(function(){
    'use strict';
    
    var $form_add_task = $(".add-task")
    ,   task_list = []
    ,   $task_item
    ,   $task_detail = $('.task-detail')
    ,   $task_detail_mask = $('.task-detail-mask')
    ,   $task_delete_trigger
    ,   $task_detail_trigger
    ,   current_index
    ,   $update_form
    ,   $task_detail_content
    ,   $task_detail_content_input
    ;
    
    // 初始化  
    init();

    // 添加任务
    $form_add_task.on("submit", function(e){
        var new_task = {};
        var $input = $(this).find("input[name=content]");
        e.preventDefault();
        new_task.content = $input.val();
        if( !new_task.content ) return;
        if ( add_task(new_task) ){
            refresh_task_list();
            $input.val(null);
        }  
    });
    

    function init(){ 
        task_list = store.get("task_list") || [];
        if (task_list.length) render_task_list();
    }
    function add_task(new_task){        
        task_list.push(new_task);
        refresh_task_list();              
        return true;
    }
    // 刷新localstorage数据并更新模板
    function refresh_task_list(){
        store.set("task_list", task_list);
        render_task_list();
    }
    // 逐个渲染task的内容
    function render_task_list(){
        var $task_list = $(".task-list");
        $task_list.html("");
        for (var i=0; i<task_list.length; i++){
             var $task = render_task_tpl(task_list[i], i);
             $task_list.prepend($task);
        }
        $task_delete_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        listen_task_delete();
        listen_task_detail();
    }
    function render_task_tpl(data, index){
        if( !data || !index) return;
        var list_item_tpl = '<div class="task-items" data-index="' + index + '">' +
                                '<span><input type="checkbox" name="" id=""></span>' +
                                '<span class="task-content">' +data.content+ '</span>' +
                                '<span class="action delete"> 删除</span>' +
                                '<span class="action detail"> 详情</span>' +
                            '</div>';
        return $(list_item_tpl);
    }

    // 删除任务
    function task_delete(index){
        // 如果没有index或者index不存在则直接返回
        if ( index===undefined || !task_list[index] ) return;
        delete task_list[index];
        refresh_task_list();
    }

    function listen_task_delete(){
        $task_delete_trigger.on("click", function(){
            var $item = $(this).parent();
            var tmp = confirm("确定删除？");
            tmp ? task_delete($item.data('index')) : null;
        });
    }
    // 监听打开Task详情后的事件 
    function listen_task_detail(){
        $task_detail_trigger.on('click', function(){
            var $item =  $(this).parent();
            var index = $item.data('index');
            show_task_detail(index);
        });
        var $task_item = $('.task_item');
        $task_item.on('dblclick', function(){
            var index = $(this).data('index');
            show_task_detail(index);
        });
        $task_detail_mask.on('click', function(){
            hide_task_detail();
        });
    }
    // 查看Task详情
    function show_task_detail(index){
        // 生成详情模版
        render_task_detail(index);
        current_index = index;
        // 显示详情模版
        $task_detail.show();
        $task_detail_mask.show();
    }
    // 隐藏Task详情
    function hide_task_detail(){
        $task_detail.hide();
        $task_detail_mask.hide();
    }
    // 更新任务详情
    function render_task_detail(index){
        if (index === undefined || !task_list[index])
            return; 
        var item = task_list[index];
        var tpl =   '<form>'+
                        '<div class="content input_item">'+ 
                        item.content +
                        '</div>' +
                        '<input style="display: none;" class="input_item" type="text" autocomplete="off" autofocus name="content" value="'+(item.content || '')+'">' +
                        '<textarea class="desc input_item" name="desc">' + (item.desc || '') + '</textarea>' +
                        '<div class="remind input_item">' +
                            '<input type="date" name="remind_date" value="'+item.remind_date+'">' +
                            '<button type="submit" class="update_button">更新</button>' +
                        '</div>'+
                    '</form>';
        // 用新模板替换新模板
        $task_detail.html(null).append(tpl);

        $update_form = $task_detail.find('form');
        $task_detail_content = $update_form.find('.content');
        $task_detail_content_input = $update_form.find('[name=content]');
        $task_detail_content.on('dblclick', function(){
            $task_detail_content.hide();
            $task_detail_content_input.show();
        });

        $update_form.on('submit', function(e){
            var data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind_date]').val();
            update_task(index, data);
            hide_task_detail();
        });
    }
    // 更新Task
    function update_task(index, data){
        if (!index || !task_list[index]) return;
        task_list[index] = data;
        refresh_task_list();
    }
    
})();