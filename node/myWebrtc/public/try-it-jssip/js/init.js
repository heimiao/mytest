$(document).ready(function() {

	// Global variables.
	PageTitle = "JsSIP tryit";
	document.title = PageTitle;

	register_checkbox = $("#phone > .status #register");

	phone_dialed_number_screen = $("#phone > .controls  input.destination");

	phone_call_button = $("#phone > .controls > .dialbox > .dial-buttons > .call");

	phone_chat_button = $("#phone > .controls > .dialbox > .dial-buttons > .chat");

	phone_dialpad_button = $("#phone > .controls > .dialpad .button");

	soundPlayer = document.createElement("audio");
	soundPlayer.volume = 1;

	// Local variables.

	var sip_uri = null;
	var sip_password = "";
	var ws_uri = "";

	var ws_was_connected = false;

	var login_form = $("#login-form");
	var login_inputs = $("#login-box input");
	var login_sip_uri = $("#login-box input#sip_uri");
	var login_sip_password = $("#login-box input#sip_password");
	var login_ws_uri = $("#login-box input#ws_uri");

	var theme01 = $("#themes > div.theme01");
	var theme02 = $("#themes > div.theme02");
	var theme03 = $("#themes > div.theme03");
	var theme04 = $("#themes > div.theme04");

	// Initialization.
	$("#login-page").height($(window).height());
	$("#login-page").width($(window).width());

	$(window).resize(function(event) {
		$("#login-page").height($(window).height());
		$("#login-page").width($(window).width());
	});

	login_form.submit(function() {

		if(login_sip_uri.val() != "")
			sip_uri = login_sip_uri.val();
		if(login_sip_password.val() != "")
			sip_password = login_sip_password.val();
		if(login_ws_uri.val() != "") {
			ws_uri = login_ws_uri.val();
		}

		if(!sip_uri) {
			alert("Please fill SIP uri field");
			return false;
		} else if(!ws_uri) {
			alert("Please fill WS URI field");
			return false;
		}

		phone_init();
		return false;
	});

	/*  login_inputs.focus(function() {
	    if ($(this).hasClass("unset")) {
	      $(this).val("");
	      $(this).removeClass("unset");
	    }
	  });

	  login_sip_uri.blur(function() {
	    if ($(this).val() == "") {
	      $(this).addClass("unset");
	      $(this).val("SIP URI (i.e: sip:alice@example.com)");
	    }
	  });

	  login_sip_password.blur(function() {
	    if ($(this).val() == "") {
	      $(this).addClass("unset");
	      $(this).val("SIP password");
	    }
	  });

	  login_ws_uri.blur(function() {
	    if ($(this).val() == "") {
	      $(this).addClass("unset");
	      $(this).val("WS URI (i.e: ws://example.com)");
	    }
	  });*/

	theme01.click(function(event) {
		$("body").removeClass();
		$("body").addClass("bg01");
	});

	theme02.click(function(event) {
		$("body").removeClass();
		$("body").addClass("bg02");
	});

	theme03.click(function(event) {
		$("body").removeClass();
		$("body").addClass("bg03");
	});

	theme04.click(function(event) {
		$("body").removeClass();
		$("body").addClass("bg04");
	});

	register_checkbox.change(function(event) {
		if($(this).is(":checked")) {
			console.warn("register_checkbox has been checked");
			// Don't change current status for now. Registration callbacks will do it.
			register_checkbox.attr("checked", false);
			// Avoid new change until the registration action ends.
			register_checkbox.attr("disabled", true);
			MyPhone.register();
		} else {
			console.warn("register_checkbox has been unchecked");
			// Don't change current status for now. Registration callbacks will do it.
			register_checkbox.attr("checked", true);
			// Avoid new change until the registration action ends.
			register_checkbox.attr("disabled", true);
			MyPhone.unregister();
		}
	});

	// NOTE: Para hacer unregister_all (esquina arriba-dcha un cuadro
	// transparente de 20 x 20 px).
	$("#unregister_all").click(function() {
		MyPhone.unregister('all');
	});

	// NOTE: Para desconectarse/conectarse al WebSocket.
	$("#ws_reconnect").click(function() {
		if(MyPhone.transport.connected)
			MyPhone.transport.disconnect();
		else
			MyPhone.transport.connect();
	});

	phone_call_button.click(function(event) {
		GUI.phoneCallButtonPressed();
	});

	phone_chat_button.click(function(event) {
		GUI.phoneChatButtonPressed();
	});

	phone_dialpad_button.click(function() {
		if($(this).hasClass("digit-asterisk"))
			sound_file = "asterisk";
		else if($(this).hasClass("digit-pound"))
			sound_file = "pound";
		else
			sound_file = $(this).text();
		soundPlayer.setAttribute("src", "sounds/dialpad/" + sound_file + ".ogg");
		soundPlayer.play();

		phone_dialed_number_screen.val(phone_dialed_number_screen.val() + $(this).text());
		//phone_dialed_number_screen.focus();
	});

	phone_dialed_number_screen.keypress(function(e) {
		// Enter pressed? so Dial.
		if(e.which == 13)
			GUI.phoneCallButtonPressed();
	});

	function phone_init() {
		$("#phone > .status .user").text(sip_uri);

		var configuration = {
			'outbound_proxy_set': ws_uri,
			'uri': sip_uri,
			'display_name': '',
			'password': sip_password,
			'register_expires': 600,
			'secure_transport': false,
			'stun_server': 'stun:aliax.net',
			'trace_sip': true,
			'hack_ip_in_contact': true,
			'hack_via_tcp': true
		};

		try {
			MyPhone = new JsSIP.UA(configuration);
		} catch(e) {
			console.log(e);
			alert("JsSIP error:\n" + e);
			window.location.reload(false);
			return;
		}

		// Transport connection/disconnection callbacks
		MyPhone.on('connected', function(e) {
			document.title = PageTitle;
			GUI.setStatus("connected");
			// Habilitar el phone.
			$("#phone .controls .ws-disconnected").hide();

			ws_was_connected = true;
		});

		MyPhone.on('disconnected', function(e) {
			document.title = PageTitle;
			GUI.setStatus("disconnected");
			// Deshabilitar el phone.
			$("#phone .controls .ws-disconnected").show();
			// Eliminar todas las sessiones existentes.
			$("#sessions > .session").each(function(i, session) {
				GUI.removeSession(session, 2000);
			});

			if(!ws_was_connected) {
				alert("WS connection error:\n\n- WS close code: " + e.data.code + "\n- WS close reason: " + e.data.reason);
				window.location.reload(false);
			}
		});

		// Call/Message reception callbacks
		MyPhone.on('newSession', function(e) {
			GUI.new_session(e)
		});

		MyPhone.on('newMessage', function(e) {
			GUI.new_message(e)
		});

		// Registration/Deregistration callbacks
		MyPhone.on('registered', function(e) {
			console.info('Registered');
			GUI.setStatus("registered");
		});

		MyPhone.on('unregistered', function(e) {
			console.info('Deregistered');
			GUI.setStatus("connected");
		});

		MyPhone.on('registrationFailed', function(e) {
			console.info('Registration failure');
			GUI.setStatus("connected");

			if(!e.data.response) {
				alert("SIP registration error:\n" + e.data.cause);
			} else {
				alert("SIP registration error:\n" + e.data.response.status_code.toString() + " " + e.data.response.reason_phrase)
			}
			window.location.reload(false);
		});

		// Start
		MyPhone.start();

		$("#login-page").fadeOut(1000, function() {
			$(this).remove();
		});
	}

});