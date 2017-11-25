;(function(){
    'use strict';
    
    var $form_add_task = $(".add-task");
    var task_list = {};
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
            render_task_list();
            $input.val(null);
        }  
    });
    
    function add_task(new_task){        
        task_list.push(new_task);       
        store.set("task_list", task_list);               
        return true;
    }
    function init(){ 
        task_list = store.get("task_list") || [];
        if (task_list.length) render_task_list();
    }
    function render_task_list(){
        var $task_list = $(".task-list");
        $task_list.html("");
        for (var i=0; i<task_list.length; i++){
             var $task = render_task_tpl(task_list[i]);
             $task_list.append($task);
        }
    }
    function render_task_tpl(data){
        var list_item_tpl = '<div class="task-items">' +
                                '<span><input type="checkbox" name="" id=""></span>' +
                                '<span class="task-content">' +data.content+ '</span>' +
                                '<span>delete</span>' +
                                '<span>detail</span>' +
                            '</div>';
        return $(list_item_tpl);
    }

    // 删除任务
    
})();