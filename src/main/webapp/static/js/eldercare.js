var eldercare={
  eldertemp:[],
  name:'',
  carework_id:'',
  method:'',
  sid:'',
	drawElderCareList:function(){
    min=timeline.getCurrentTime();
		$(".inf").addClass('hide');
		$("#eldercareshow").removeClass('hide');
     $("#elderdutypanel").addClass('hide')
    eldercare.updateeldercarer();
    eldercare.updateeldertree();
},
  init:function(){
    var container = document.getElementById('careitemvision');
    var options = {
      editable:{add:true,
        remove:true},
      margin:{item:0},
      dataAttributes:['all'],
      onAdd: function (item, callback) {
        eldercare.method='post';
        $("#elderdutypanel").removeClass('hide')
        $("#elderchecktree").tree("loadData",eldercare.eldertemp);
        callback(null); // cancel item creation
      },

      onUpdate: function (item, callback) {
        
        eldercare.method='put';
        $("#elderdutypanel").removeClass('hide')
        callback(null); // cancel updating the item
    },

    onRemove: function (item, callback) {
      if (confirm('Remove item ' + item.content + '?')) {
        callback(item); // confirm deletion
      }
      else {
        callback(null); // cancel deletion
      }
    }
    };
    timeline = new vis.Timeline(container, [], options);
    // timeline.clear({items: true});
    //timeline.setItems(items2);
  },

  updateeldercarer:function(){
    $('#eldercarercont li').remove();
    $.ajax({
        type: "get",
        data:{page:1,rows:65535,sort:'ID'},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+'/gero/'+gid+'/staff',
        timeout:deadtime,
        success: function (msg) {
            var parent=document.getElementById("eldercarercont");
            for(var i in msg.entities){
                var dt=document.createElement('li');
                dt.setAttribute('pid',msg.entities[i].user_id);
                var a=document.createElement('a');
                a.innerHTML=msg.entities[i].name;
                dt.appendChild(a);
                parent.appendChild(dt);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });
  },
  updateeldertree:function(){
    $('#elderchecktree li').remove();
    $.ajax({
        type: "get",
        data:{page:1,rows:65535,sort:'ID'},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+'/gero/'+gid+'/elder',
        timeout:deadtime,
        success: function (msg) {
          eldertemp=[];
          for(var i in msg.entities){
            var temp={
              id:msg.entities[i].user_id,
              text:msg.entities[i].name,
              iconCls:'icon-blank',
            }
            eldercare.eldertemp.push(temp);
          }
          $("#elderchecktree").tree("loadData",eldercare.eldertemp);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });

  },
  getList:function(id ,name){
    timeline.clear({items:true});
    $("#elderdutypanel").addClass('hide');
    eldercare.name=name;
    eldercare.sid=id;
    $.ajax({
        type: "get",
        data:{page:1,rows:65535,sort:'ID',"staff_id":id},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+'/gero/'+gid+'/carework',
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
            if(i!=0) {result={id:msg.entities[i].id,content:eldercare.name,start:cache2[i-1].end_date,end:cache2[i].end_date,elder_ids:cache2[i].elder_ids}}
              else {result={id:msg.entities[i].id,content:eldercare.name,start:min,end:cache2[i].end_date,elder_ids:cache2[i].elder_ids}}
            cache.push(result);
          }
          var items2 = new vis.DataSet(cache);
          timeline.setItems(items2);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });
  },
  buttonclk:function(){
    authority.obj.name=document.getElementById("pname").value;
    authority.obj.notes=document.getElementById("pnotes").value;
    authority.obj.permission=document.getElementById("ppermission").value;
    authority.obj.href=document.getElementById("phref").value;
    authority.obj.icon=document.getElementById("picon").value;
    authority.obj.api=document.getElementById("papi").value;
    var infoUrl=rhurl.origin+'/gero/'+gid+'/carework'+'';
        $.ajax({
            url: infoUrl, 
            type:eldercare.method, 
            data:JSON.stringify(authority.obj), 
            dataType:"json",
            contentType: "application/json;charset=utf-8",
            timeout:deadtime,
            error: function(XMLHttpRequest, textStatus, errorThrown){
                leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
            }, 
            success: function(result){
                authority.drawAuthorityList();
            } 
        }); 
  }

  
}