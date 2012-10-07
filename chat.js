/* Licensed under the GNU Affero General Public License
 * Users interacting with this program over a network are allowed to receive 
 * the source for this program.
 */

var room_id = window.location.pathname.substr(1,5);
document.getElementsByTagName("title")[0].text = "Chattus - " + room_id;

setInterval(function() {
    $.getJSON("/"+room_id+"?get_log", function(response) {
	var chat_content = '<ol>';
	for (var i = 0; i < response.length; i++) {
	    var date = new Date(1000*response[i]['time']);
	    chat_content += '<li>';
	    chat_content += '<span class=post_date>' + 
		(date.getHours()>9?'':'0') + date.getHours() + ':' + 
		(date.getMinutes()>9?'':'0') + date.getMinutes() + 
		'</span> - <span class=post_name>' + response[i]['name'] + 
		'</span> - <span class="post_content">' + 
		response[i]['content'] + '</span>';
	    chat_content += '</li>';
	}
	chat_content += '</ol>';
	$('#messages').html(chat_content);
    });
}, 2000);

function __Chat() {
    var name = "Unnamed";
    $('#form').submit(function (e) {
	e.preventDefault();
	var message = $('#form_message').val().trim().replace(/\s+/g, ' ');
	$('#form_message').val('');
	if (message.substr(0,6) == "/name ") {
	    var end = message.indexOf(' ', 6);
	    if (end < 6)
		end = message.length;
	    name = message.substring(6, end);
	    if (name.length == 0)
		name = "Unnamed";
	    $('#form_message').attr('placeholder', '');
	}
	else {
	    $.get("/"+room_id+"?post_message", 
		  {name:name,content:message});
	}
    });
}
new __Chat();