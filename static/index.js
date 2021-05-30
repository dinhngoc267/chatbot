/* ---------- CHAT BOT ENGINE JS ----------- */

function chatBot() {
  
	// current user input
	this.input;
	this.question_index = -1;
	/**
	 * respondTo
	 * 
	 * return nothing to skip response
	 * return string for one response
	 * return array of strings for multiple responses
	 * 
	 * @param input - input chat string
	 * @return reply of chat-bot
	 */
	this.setInput = function(input) {
		this.input = input.toLowerCase();
	}

	this.respondTo = function(input) {
	
		this.input = input.toLowerCase();
		
		// if((this.match('(hi|sup|hello|hey|hola|howdy)(\\s|!|\\.|$)') || this.match('(yes|of course|sure)(\\s|!|\\.|$)')) && this.question_index==0) {
		// 	$.ajax({
		// 		cache:false,
		// 		type: 'GET',
		// 		url: "/get-first-question",
		// 		contentType: "application/json",
		// 		success:  function(data) {         
		// 			return data.response   
		// 		//do what you what with return data
		// 		}
		// 	});
		// }
			//return encodeURI("<b>u</b>m... hi?");
    
		if(this.match('what[^ ]* up') || this.match('sup') || this.match('how are you'))
			return "this codepen thing is pretty cool, huh?";
		
		else if(this.match('l(ol)+') || this.match('(ha)+(h|$)') || this.match('lmao'))
			return "what's so funny?";
		
		else if(this.match('^no+(\\s|!|\\.|$)'))
			return "don't be such a negative nancy :(";
		
		else if(this.match('(cya|bye|see ya|ttyl|talk to you later)'))
			return ["alright, see you around", "good teamwork!"];
		
		else if(this.match('(dumb|stupid|is that all)'))
			return ["hey i'm just a proof of concept", "you can make me smarter if you'd like"];
		
		//else if(this.input == 'noop')
		return null;
		
	}
	
	/**
	 * match
	 * 
	 * @param regex - regex string to match
	 * @return boolean - whether or not the input string matches the regex
	 */
	this.match = function(regex) {
	
		return new RegExp(regex).test(this.input);
	}
}

/* ---------- START INDEX JS ----------- */

$(async function() {

	// chat aliases
	var you = 'You';
	var robot = 'Chatbot';
	
	// slow reply by 400 to 800 ms
	var delayStart = 400;
	var delayEnd = 2000;
	
	// initialize
	var bot = new chatBot();
	var chat = $('.chat');
	var waiting = 0;
	$('.busy').text(robot + ' is typing...');
	
	// submit user input and get chat-bot's reply
	var submitChat = function() {
		var input = $('.input input').val();
		
		if(input == '') return;
		
		$('.input input').val('');
		updateChat(you, input);
		bot.setInput(input)
		var reply = bot.respondTo(input);
		if(reply != null)
		{
			var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
			$('.busy').css('display', 'block');
			waiting++;
			setTimeout( async function() {
				console.log('reply:',reply)
				if(typeof reply === 'string') {
					updateChat(robot, reply);
				} else {
					for(var r in reply) {
						updateChat(robot, reply[r]);
					}
				}
				if(--waiting == 0) $('.busy').css('display', 'none');
					//do what you what with return data
			}, latency);
			return;
		}

		if((bot.match('(hi|sup|hello|hey|hola|howdy)(\\s|!|\\.|$)') || bot.match('(yes|of course|sure|okay)(\\s|!|\\.|$)')) && bot.question_index==-1) {
			bot.question_index += 1;
			var latency = Math.floor((Math.random() * (delayEnd - delayStart)) + delayStart);
			$('.busy').css('display', 'block');
			waiting++;
			setTimeout( async function() {
				//var reply = await bot.respondTo(input);
				$.ajax({
					cache:false,
					type: 'GET',
					url: "/get-first-question",
					contentType: "application/json",
					success:  function(data) {         
						res = data.result
						console.log(res)
						if(res==true)
						{
							bot.question_index += 1;
						}   
						reply =  data.response
						console.log('reply:',reply)
						if(reply == null) return;
						if(typeof reply === 'string') {
							updateChat(robot, reply);
						} else {
							for(var r in reply) {
								updateChat(robot, reply[r]);
							}
						}
						if(--waiting == 0) $('.busy').css('display', 'none');
							//do what you what with return data
						}
				});
			}, latency);
			return;
		}
		console.log(bot.question_index)
		$.ajax({
			cache:false,
			type: 'POST',
			url: "/",
			contentType: "application/json",
			dataType:'json',
			data:JSON.stringify({'answer':input, 'question_index':bot.question_index}),
			success:  function(data) {
				res = data.result
				console.log(res)
				if(res==true)
				{
					bot.question_index += 1;
				}   

				reply =  data.response
				console.log('reply:',reply)
				if(reply == null) return;
				if(typeof reply === 'string') {
					updateChat(robot, reply);
				} else {
					for(var r in reply) {
						updateChat(robot, reply[r]);
					}
				}
				if(--waiting == 0) $('.busy').css('display', 'none');
					//do what you what with return data
				}
			//do what you what with return data
		});
		
	}
	
	// add a new line to the chat
	var updateChat = function(party, text) {
	
		var style = 'you';
		if(party != you) {
			style = 'other';
		}
		
		var line = $('<div><span class="party"></span> <span class="text"></span></div>');
		line.find('.party').addClass(style).text(party + ':');
		line.find('.text').text(text);
		
		chat.append(line);
		
		chat.stop().animate({ scrollTop: chat.prop("scrollHeight")});
	
	}
	
	// event binding
	$('.input').bind('keydown', function(e) {
		if(e.keyCode == 13) {
			submitChat();
		}
	});
	$('.input a').bind('click', submitChat);
	
	// initial chat state
	updateChat(robot, 'Hi there. We want to ask you some questions!');

});