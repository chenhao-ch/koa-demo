$('#loginBtn').click(function() {
  $('.login-view').show();
  $('.register-view').hide();
  $('.list-view').hide();
});
$('#registerBtn').click(function() {
  $('.register-view').show();
  $('.login-view').hide();
  $('.list-view').hide();
});

$('#loginFrom').submit(function(e) {
  $.ajax({
    url: './user/login',
    method: 'post',
    data: $(this).serialize(),
    success: function(d) {
      console.log('./user/login', d);
      if(d && d.id !== undefined) {
        window.userId = d.id;
        $('#userName').text(d.username);
        loadList();
      }
    }
  });
  e.stopPropagation();
  return false;
});
$('#registerForm').submit(function(e) {
  $.ajax({
    url: './user/register',
    method: 'post',
    data: $(this).serialize(),
    success: function(d) {
      console.log('./user/register', d);
      if(d && d.id !== undefined) {
        window.userId = d.id;
        $('#userName').text(d.username);
        loadList();
      }
    }
  });
  e.stopPropagation();
  return false;
});

$('#addBtn').click(function() {
  var text = $('#addText').val();
  $('#addText').val('');
  $.ajax({
    url: './todo/add',
    method: 'POST',
    data: {
      text: text
    },
    success: function(d) {
      console.log(d);
      if(d) {
        var elStr = `<li class="item" data-id="${d.id}">
          <a href="javascript:void(0)" class="remove">x</a>
          <span>${d.text}</span>
        </li>`;
        if($('.list > .item').length > 0) {
          $(elStr).insertBefore($('.list > .item').first());
        } else {
          $('.list').append($(elStr));
        }
        
      } else {
        alert('添加失败');
      }
    }
  });
});

$('.list').delegate('.item > a', 'click', function() {
  var $that = $(this);
  var id = $that.parent().data('id');
  $.ajax({
    url: './todo/remove',
    method: 'POST',
    data: {
      id: id
    },
    success: function(d) {
      if(d.result === 'success') {
        $that.parent().remove();
      } else {
        console.log('fail');
      }
    }
  });
});

function loadList() {
  $('.register-view').hide();
  $('.login-view').hide();
  $('.list-view').show();
  $.ajax({
    url: '/todo/list',
    method: 'GET',
    success: function(d) {
      console.log(d);
      var res = [];
      for(var i = 0, len = d.length; i < len; i++) {
        var item = d[i];
        res.push(`<li class="item" data-id="${item.id}">
          <a href="javascript:void(0)" class="remove">x</a>
          <span>${item.text}</span>
        </li>`);
      }
      $('.list').html(res.join(''));
    }
  });
}

(function(){
  $.ajax({
    url: './user',
    method: 'GET',
    success: function(d) {
      console.log('./user', d);
      if(d && d.id !== undefined) {
        window.userId = d.id;
        $('#userName').text(d.username);
        loadList();
      }
    }
  });
})();