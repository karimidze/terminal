	const keypressEnter = new KeyboardEvent("keypress", {
			  view: window,
			  keyCode: 13,
			  bubbles: true,
			  cancelable: true
			});
			
	function autoprint(text){
		var el = document.querySelector('#terminal');
		var nodes = el.querySelectorAll("p > #curso");
		var last = nodes[nodes.length-1];
		function typeText(text, delay, i) {
			$(last).append(text.charAt(i))
				.delay(delay)
				.promise()
				.done(function() {
				  if(i<text.length) {
					i++;
					typeText(text, delay, i);  
				  }
			});  
		}
		typeText(text, 50, 0);
	}
	
    var commands = {};
	  
	commands.reg = function(args){
		  var output = "";
		  if (args[1]&&args[2])	{
			trySaveUser(args[1],args[2]);
			return "";
		  }
		  else return "login/pass can't be empty";
	}
	
	function getSessionData(){
		$.ajax({
			url: "getSessionData.php",
			type: "GET"
		});
	}
	
	function returnResponse( responseData, login ) {
		var el = document.querySelector('#terminal');
		var nodes = el.querySelectorAll("p > #curso");
		var last = nodes[nodes.length-1];
		autoprint(responseData);
		last.dispatchEvent(keypressEnter);
		if (responseData == "Вы успешно вошли на сайт!"){
			var el = document.querySelectorAll("#terminalUser");
			el[el.length-1].innerHTML = ""+login+"@terminal.js&gt;";
			el[el.length-1].style.color = "#ff3300";
		}
		// Do what you want with the data
		console.log();
	}

	function trySaveUser(login, password){
		$.ajax({
			url: "save_user.php",
			type: "POST",
			data: {
					'login': login,
					'password':password
			},
			success: function ( data, status, XHR ) {
				returnResponse(data);
			}
		});
	}
	
	commands.login = function(args){
		var output = "";
		if (args[1]&&args[2]) {
		login(args[1],args[2], output);
		return "";
		}
	  else return "login/pass can't be empty";
	}
	
	function login(login,password,output){
		$.ajax({
			url: "login.php",
			type: "POST",
			data: {
					'login': login,
					'password':password
			},
			success: function ( data, status, XHR ) {
				returnResponse(data, login);
			}
		});
	}
	  
	commands.A = function(){
		return "<div id=\"QRAscii\" style=\"line-height: 1em; letter-spacing: 0em; font-family: monospace; display: block;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;█▀▀▀▀▀█&nbsp;█▀▀█&nbsp;▀▀██&nbsp;█▀▀▀▀▀█&nbsp;&nbsp;<br>&nbsp;&nbsp;█&nbsp;███&nbsp;█&nbsp;&nbsp;▀&nbsp;▄▄&nbsp;█▀█&nbsp;█&nbsp;███&nbsp;█&nbsp;&nbsp;<br>&nbsp;&nbsp;█&nbsp;▀▀▀&nbsp;█&nbsp;█▄▄▀█▀&nbsp;█▄&nbsp;█&nbsp;▀▀▀&nbsp;█&nbsp;&nbsp;<br>&nbsp;&nbsp;▀▀▀▀▀▀▀&nbsp;█▄▀&nbsp;▀▄▀▄█&nbsp;▀▀▀▀▀▀▀&nbsp;&nbsp;<br>&nbsp;&nbsp;▀██▄&nbsp;▀▀▄▀▀&nbsp;▀█▄█▄&nbsp;█▀██&nbsp;&nbsp;█▀&nbsp;&nbsp;<br>&nbsp;&nbsp;▄&nbsp;█▄█▄▀█▄▀█▄██▀&nbsp;▀█▀▄█▀█&nbsp;▄&nbsp;&nbsp;<br></div>";
	}
	commands.B = function(){
		return "<div id=\"QRAscii\" style=\"line-height: 1em; letter-spacing: 0em; font-family: monospace; display: block;\">&nbsp;&nbsp;▀████&nbsp;▀&nbsp;▄▀█&nbsp;▀▀▄▀▄▀&nbsp;▀█▄▄██&nbsp;&nbsp;<br>&nbsp;&nbsp;▀▀&nbsp;▄▄&nbsp;▀▄▀&nbsp;&nbsp;█&nbsp;█▀&nbsp;▀▀█&nbsp;▀█▄▀&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;▀▀▀▀&nbsp;&nbsp;▀&nbsp;▄▀&nbsp;▄&nbsp;▄█▀█▀▀▀█&nbsp;▀█▀&nbsp;&nbsp;<br>&nbsp;&nbsp;█▀▀▀▀▀█&nbsp;▄▄█&nbsp;▀▄▀&nbsp;█&nbsp;▀&nbsp;█&nbsp;█&nbsp;▄&nbsp;&nbsp;<br>&nbsp;&nbsp;█&nbsp;███&nbsp;█&nbsp;&nbsp;█&nbsp;▀▄▀▄▀████▀▀▀█&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;█&nbsp;▀▀▀&nbsp;█&nbsp;███▄██▀▄▄&nbsp;▀&nbsp;&nbsp;▀&nbsp;▀▀&nbsp;&nbsp;<br>&nbsp;&nbsp;▀▀▀▀▀▀▀&nbsp;▀▀▀&nbsp;&nbsp;&nbsp;▀▀&nbsp;▀▀▀▀▀&nbsp;&nbsp;▀&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br></div>";
	}
	commands.C = function(){
		return "не всё то, <a href=\"http://ya.ru\">чем</a> кажется";
	}
	
	commands.help = function() {
	var output = "<div>" +
				"<ul>" +
				"<li><strong>help</strong> - display this help.</li>" +
				"<li><strong>hello NAME</strong> - displays a greeting for NAME.</li>" +
				"<li><strong>weather LOCATION</strong> - show weather for LOCATION</li>" +
				"</ul></div>";
	
	return output;
	};
	
	commands.hello = function(args) {autoprint("<a href=\"http://ya.ru\">ADSDSDADSDA</a>");
		if(args.length < 2) return "<p>Hello. Why don't you tell me your name?</p>";
		return "Hello " + args[1];
	};
	
	Terminal.init(document.getElementById("terminal"), commands);
	commands.help();
