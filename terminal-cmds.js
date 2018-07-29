	const event = new KeyboardEvent("keypress", {
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
		//last.dispatchEvent(event);
	}

	
    var commands = {};
	  
	commands.reg = function(args){
		  var output = "<p>ur login: " + args[1] + "</p>" + "<p>ur pass: " + args[2] + "</p>";
		  var test = "";
		  if (args[1]&&args[2])	{
			return saveuser(args[1],args[2], test);
		  }
		  else return "login/pass can't be empty";
	}

	function saveuser(login,password,test){
		var jqXHR = $.ajax({
			type: "POST",
			url: "save_user.php",
			data: {
				'login': login,
				'password':password
			},
			async: false
		});
		test = jqXHR.responseText;
		return test;
	}
	  
	commands.A = function(){
		return "<div id=\"QRAscii\" style=\"line-height: 1em; letter-spacing: 0em; font-family: monospace; display: block;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;█▀▀▀▀▀█&nbsp;█▀▀█&nbsp;▀▀██&nbsp;█▀▀▀▀▀█&nbsp;&nbsp;<br>&nbsp;&nbsp;█&nbsp;███&nbsp;█&nbsp;&nbsp;▀&nbsp;▄▄&nbsp;█▀█&nbsp;█&nbsp;███&nbsp;█&nbsp;&nbsp;<br>&nbsp;&nbsp;█&nbsp;▀▀▀&nbsp;█&nbsp;█▄▄▀█▀&nbsp;█▄&nbsp;█&nbsp;▀▀▀&nbsp;█&nbsp;&nbsp;<br>&nbsp;&nbsp;▀▀▀▀▀▀▀&nbsp;█▄▀&nbsp;▀▄▀▄█&nbsp;▀▀▀▀▀▀▀&nbsp;&nbsp;<br>&nbsp;&nbsp;▀██▄&nbsp;▀▀▄▀▀&nbsp;▀█▄█▄&nbsp;█▀██&nbsp;&nbsp;█▀&nbsp;&nbsp;<br>&nbsp;&nbsp;▄&nbsp;█▄█▄▀█▄▀█▄██▀&nbsp;▀█▀▄█▀█&nbsp;▄&nbsp;&nbsp;<br></div>";
	}
	commands.B = function(){
		return "<div id=\"QRAscii\" style=\"line-height: 1em; letter-spacing: 0em; font-family: monospace; display: block;\">&nbsp;&nbsp;▀████&nbsp;▀&nbsp;▄▀█&nbsp;▀▀▄▀▄▀&nbsp;▀█▄▄██&nbsp;&nbsp;<br>&nbsp;&nbsp;▀▀&nbsp;▄▄&nbsp;▀▄▀&nbsp;&nbsp;█&nbsp;█▀&nbsp;▀▀█&nbsp;▀█▄▀&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;▀▀▀▀&nbsp;&nbsp;▀&nbsp;▄▀&nbsp;▄&nbsp;▄█▀█▀▀▀█&nbsp;▀█▀&nbsp;&nbsp;<br>&nbsp;&nbsp;█▀▀▀▀▀█&nbsp;▄▄█&nbsp;▀▄▀&nbsp;█&nbsp;▀&nbsp;█&nbsp;█&nbsp;▄&nbsp;&nbsp;<br>&nbsp;&nbsp;█&nbsp;███&nbsp;█&nbsp;&nbsp;█&nbsp;▀▄▀▄▀████▀▀▀█&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;█&nbsp;▀▀▀&nbsp;█&nbsp;███▄██▀▄▄&nbsp;▀&nbsp;&nbsp;▀&nbsp;▀▀&nbsp;&nbsp;<br>&nbsp;&nbsp;▀▀▀▀▀▀▀&nbsp;▀▀▀&nbsp;&nbsp;&nbsp;▀▀&nbsp;▀▀▀▀▀&nbsp;&nbsp;▀&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br></div>";
	}
	commands.C = function(){
		return "<a href=\"http://ya.ru\">Test</a>"
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
