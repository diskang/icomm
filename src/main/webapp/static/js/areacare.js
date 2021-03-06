var areacare={
  areatemp:[],
  name:'',
  areawork_id:'',
  method:'',
  sid:'',
  item_id:'',
  obj:{ staff_id:'',
        area_ids:[],
        end_date:'',
  },
  careid:-1,
	drawAreaCareList:function(){
    min=timeline2.getCurrentTime();
		$(".inf").addClass('hide');
		$("#areacareshow").removeClass('hide');
    $("#areadutypanel").addClass('hide');
    areacare.updateareatree();
  },

  init:function(){
    container = document.getElementById('areaitemvision');
    options = {
      editable:{add:true,
        remove:true},
      margin:{item:0},
      dataAttributes:['all'],
      onAdd: function (item, callback) {
        areacare.method='post';
        areacare.areawork_id='';
        $("#areadutypanel").removeClass('hide')
        $("#areachecktree").tree("loadData",areacare.areatemp);
        $("#areacarer-end").attr('value',null);
        callback(null); // cancel item creation
      },

      onUpdate: function (item, callback) {
        areacare.method='put';
        areacare.areawork_id='/'+item.id;
        $("#areachecktree").tree("loadData",areacare.areatemp);
        for(var i in item.area_ids){
          var node=$("#areachecktree").tree('find',item.area_ids[i]);
            if(node)$("#areachecktree").tree("check",node.target);
        }
        $("#areadutypanel").removeClass('hide')
        $("#areacarer-end").attr('value',item.end);
        callback(null); // cancel updating the item
      },

      onRemove: function (item, callback) {
        if (confirm('确定要删除？')) {
          var infoUrl=rhurl.origin+'/gero/'+gid+'/areawork/'+item.id;
          $.ajax({
            url: infoUrl, 
            type:'delete', 
            timeout:deadtime,
            error: function(XMLHttpRequest, textStatus, errorThrown){
                leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
            }, 
            success: function(result){
                areacare.drawAreaCareList();
            } 
        }); 
        }
        callback(null); // cancel deletion

      }
    };
    timeline2 = new vis.Timeline(container, [], options);
    // timeline2.clear({items: true});
    //timeline2.setItems(items2);
  },

  updateareacarer:function(){
    $('#areacarercont li').remove();
    $.ajax({
        type: "get",
        data:{page:1,rows:65535,sort:'ID',role:"房间护工"},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+'/gero/'+gid+'/staff',
        timeout:deadtime,
        success: function (msg) {
            if(areacare.careid==-1) areacare.careid=msg.entities[0].staff_id;
            areacare.caretemp=[];
            for(var i in msg.entities){
            var temp={
              id:msg.entities[i].staff_id,
              text:msg.entities[i].name,
              iconCls:'icon-blank',
            }
            areacare.caretemp.push(temp);
          }
          $("#areacarercont").tree("loadData",areacare.caretemp);
          var node = $('#areacarercont').tree('find',areacare.careid);
          $('#areacarercont').tree('select', node.target);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });
  },


  createTreeNode:function(node){
        this.id=node.id;
        this.text=node.name;
        this.children=[];
        iconCls='icon-blank';
        this.attributes={"type":node.type,"level":node.level}
    },
  findTreeChildren:function(id){
        var result=[];
        for(var i in areacare.temparea){
            if(areacare.temparea[i].parent_id===id){
                result.push(areacare.temparea[i]);
            }
        }
        return result;
    },
  createTreeData:function(node){
        var result=[];
        var childs= areacare.findTreeChildren(node.id);
        if (childs.length!==0){
            for(var i in childs){
                var temp= new areacare.createTreeNode(childs[i]);
                if (areacare.findTreeChildren(childs[i].id).length!==0 && childs[i].level!==3){
                    temp.children=areacare.createTreeData(childs[i]);
                }
                result.push(temp);
            }
        }
        return result;
    },

  updateareatree:function(){
    $('#areachecktree li').remove();
    $('#areachecktree ul').remove();
    $.ajax({
        type: "get",
        data:{page:1,rows:65535,sort:'ID'},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+'/gero/'+gid+'/area',
        timeout:deadtime,
        success: function (msg) {
          areacare.temparea=msg.entities;
          areacare.areatemp=areacare.createTreeData({"id":0,"types":0});
          $("#areachecktree").tree("loadData",areacare.areatemp);
          areacare.updateareacarer();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });

  },
  getList:function(id ,name){
    areacare.careid=id;
    timeline2.clear({items:true});
    $("#areadutypanel").addClass('hide');
    areacare.name=name;
    areacare.sid=id;
    $.ajax({
        type: "get",
        data:{page:1,rows:65535,sort:'ID',"staff_id":id},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+'/gero/'+gid+'/areawork',
        timeout:deadtime,
        success: function (msg) {
          var cache=[];
          var cache2=msg.entities;
          var tem;
          for(var i=0;i<cache2.length-1;i++){
            for (var j=i+1;j<cache2.length;j++){
              if(cache2[i].end_date>cache2[j].end_date){
                tem=cache2[i];cache2[i]=cache2[j];cache2[j]=tem;
              }
            }
          }
          for(var i in cache2){
            var result;
            if(i!=0) {result={id:msg.entities[i].id,content:areacare.name,start:cache2[i-1].end_date,end:cache2[i].end_date,area_ids:cache2[i].area_ids}}
              else {result={id:msg.entities[i].id,content:areacare.name,start:min,end:cache2[i].end_date,area_ids:cache2[i].area_ids}}
            cache.push(result);
          }
          var items2 = new vis.DataSet(cache);
          timeline2.setItems(items2);

          timeline2.setSelection(cache[0].id);
          areacare.method='put';
          areacare.areawork_id='/'+cache[0].id;
          $("#areachecktree").tree("loadData",areacare.areatemp);
          for(var i in cache[0].area_ids){
            var node=$("#areachecktree").tree('find',cache[0].area_ids[i]);
              if(node)$("#areachecktree").tree("check",node.target);
          }
          $("#areadutypanel").removeClass('hide')
          $("#areacarer-end").attr('value',cache[0].end);
          
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });
  },
  buttonclk:function(){
    areacare.obj.staff_id=areacare.sid;
    areacare.obj.end_date=$("#areacarer-end").val();
    var nodes = $('#areachecktree').tree('getChecked', ['checked']);
    if(nodes){
      areacare.obj.area_ids=[];
      for (var i  in nodes){
          areacare.obj.area_ids.push(nodes[i].id);
        }
      var infoUrl=rhurl.origin+'/gero/'+gid+'/areawork'+areacare.areawork_id;
        $.ajax({
            url: infoUrl, 
            type:areacare.method, 
            data:JSON.stringify(areacare.obj), 
            dataType:"json",
            contentType: "application/json;charset=utf-8",
            timeout:deadtime,
            error: function(XMLHttpRequest, textStatus, errorThrown){
                leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
            }, 
            success: function(result){
                areacare.drawAreaCareList();
            } 
        }); 
      }
  }

  
}