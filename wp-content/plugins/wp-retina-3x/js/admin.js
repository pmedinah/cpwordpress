/* GENERATE RETINA IMAGES ACTION */

var current;
var maxPhpSize = wr3x_admin_server.maxFileSize;
var ids = [];
var errors = 0;
var ajax_action = "generate"; // generate | delete

function wr3x_display_please_refresh() {
	wr3x_refresh_progress_status();
	jQuery('#wr3x_progression').html(jQuery('#wr3x_progression').html() + " - " + wr3x_admin_server.i18n.Refresh);
}

function wr3x_refresh_progress_status() {
	var errortext = "";
	if ( errors > 0 ) {
		errortext = ' - ' + errors + ' error(s)';
	}
	jQuery('#wr3x_progression').text(current + "/" + ids.length +
		" (" + Math.round(current / ids.length * 100) + "%)" + errortext);
}

function wr3x_do_next () {
	var data = { action: 'wr3x_' + ajax_action, attachmentId: ids[current - 1] };
	data.nonce = wr3x_admin_server.nonce[data.action];

	wr3x_refresh_progress_status();
	jQuery.post(ajaxurl, data, function (response) {
		try {
			reply = jQuery.parseJSON(response);
		}
		catch (e) {
			reply = null;
		}
		if ( !reply || !reply.success )
			errors++;
		else {
			wr3x_refresh_media_sizes(reply.results);
			if (reply.results_full)
				wr3x_refresh_full(reply.results_full);
		}
		if (++current <= ids.length)
			wr3x_do_next();
		else {
			current--;
			wr3x_display_please_refresh();
		}
	}).fail(function () {
		errors++;
		if (++current <= ids.length)
			wr3x_do_next();
		else {
			current--;
			wr3x_display_please_refresh();
		}
	});
}

function wr3x_do_all () {
	current = 1;
	ids = [];
	errors = 0;
	var data = { action: 'wr3x_list_all', issuesOnly: 0 };
	data.nonce = wr3x_admin_server.nonce[data.action];

	jQuery('#wr3x_progression').text(wr3x_admin_server.i18n.Wait);
	jQuery.post(ajaxurl, data, function (response) {
		reply = jQuery.parseJSON(response);
		if (reply.success = false) {
			alert('Error: ' + reply.message);
			return;
		}
		if (reply.total == 0) {
			jQuery('#wr3x_progression').html(wr3x_admin_server.i18n.Nothing_to_do);
			return;
		}
		ids = reply.ids;
		jQuery('#wr3x_progression').text(current + "/" + ids.length + " (" + Math.round(current / ids.length * 100) + "%)");
		wr3x_do_next();
	});
}

function wr3x_delete_all () {
	ajax_action = 'delete';
	wr3x_do_all();
}

function wr3x_generate_all () {
	ajax_action = 'generate';
	wr3x_do_all();
}

// Refresh the dashboard retina full with the results from the Ajax operation (Upload)
function wr3x_refresh_full (results) {
	jQuery.each(results, function (id, html) {
		jQuery('#wr3x-info-full-' + id).html(html);
		jQuery('#wr3x-info-full-' + id + ' img').attr('src', jQuery('#wr3x-info-full-' + id + ' img').attr('src')+'?'+ Math.random());
		jQuery('#wr3x-info-full-' + id + ' img').on('click', function (evt) {
			wr3x_delete_full( jQuery(evt.target).parents('.wr3x-file-row').attr('postid') );
		});
	});
}

// Refresh the dashboard media sizes with the results from the Ajax operation (Replace or Generate)
function wr3x_refresh_media_sizes (results) {
	jQuery.each(results, function (id, html) {
		jQuery('#wr3x-info-' + id).html(html);
	});
}

function wr3x_generate (attachmentId, retinaDashboard) {
	var data = { action: 'wr3x_generate', attachmentId: attachmentId };
	data.nonce = wr3x_admin_server.nonce[data.action];

	jQuery('#wr3x_generate_button_' + attachmentId).text(wr3x_admin_server.i18n.Wait);
	jQuery.post(ajaxurl, data, function (response) {
		var reply = jQuery.parseJSON(response);
		if (!reply.success) {
			alert(reply.message);
			return;
		}
		jQuery('#wr3x_generate_button_' + attachmentId).html(wr3x_admin_server.i18n.Generate);
		wr3x_refresh_media_sizes(reply.results);
	});
}

/* REPLACE FUNCTION */

function wr3x_stop_propagation(evt) {
	evt.stopPropagation();
	evt.preventDefault();
}

function wr3x_delete_full(attachmentId) {
	var data = {
		action: 'wr3x_delete_full',
		isAjax: true,
		attachmentId: attachmentId
	};
	data.nonce = wr3x_admin_server.nonce[data.action];

	jQuery.post(ajaxurl, data, function (response) {
		var data = jQuery.parseJSON(response);
		if (data.success === false) {
			alert(data.message);
		}
		else {
			wr3x_refresh_full(data.results);
			wr3x_display_please_refresh();
		}
	});
}

function wr3x_load_details(attachmentId) {
	var data = {
		action: 'wr3x_retina_details',
		isAjax: true,
		attachmentId: attachmentId
	};
	data.nonce = wr3x_admin_server.nonce[data.action];

	jQuery.post(ajaxurl, data, function (response) {
		var data = jQuery.parseJSON(response);
		if (data.success === false) {
			alert(data.message);
		}
		else {
			jQuery('#meow-modal-info .loading').css('display', 'none');
			jQuery('#meow-modal-info .content').html(data.result);
		}
	});
}

function wr3x_filedropped (evt) {
	wr3x_stop_propagation(evt);
	var files = evt.dataTransfer.files;
	var count = files.length;
	if (count < 0) {
		return;
	}

	var wr3x_replace = jQuery(evt.target).parent().hasClass('wr3x-fullsize-replace');
	var wr3x_upload = jQuery(evt.target).parent().hasClass('wr3x-fullsize-retina-upload');

	function wr3x_handleprogress(prg) {
		console.debug("Upload of " + prg.srcElement.filename + ": " + prg.loaded / prg.total * 100 + "%");
	}

	function wr3x_uploadFile(file, attachmentId, filename) {
		var action = "";
		if (wr3x_replace) {
			action = 'wr3x_replace';
		}
		else if (wr3x_upload) {
			action = 'wr3x_upload';
		}
		else {
			alert("Unknown command. Contact the developer.");
		}
		var data = new FormData();
	data.append('file', file);
		data.append('action', action);
		data.append('attachmentId', attachmentId);
		data.append('isAjax', true);
		data.append('filename', filename);
		data.append('nonce', wr3x_admin_server.nonce[action]);

		// var data = {
		// 	action: action,
		// 	isAjax: true,
		// 	filename: evt.target.filename,
		// 	data: form_data,
		// 	attachmentId: attachmentId
		// };

		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			contentType: false,
			processData: false,
			data: data,
			success: function (response) {
				jQuery('[postid=' + attachmentId + '] td').removeClass('wr3x-loading-file');
				jQuery('[postid=' + attachmentId + '] .wr3x-dragdrop').removeClass('wr3x-hover-drop');
				try {
					var data = jQuery.parseJSON(response);
				}
				catch (e) {
					alert("The server-side returned an abnormal response. Check your PHP error logs and also your browser console (WP Retina 3x will try to display it there).");
					console.debug(response);
					return;
				}
				if (wr3x_replace) {
					var imgSelector = '[postid=' + attachmentId + '] .wr3x-info-thumbnail img';
					jQuery(imgSelector).attr('src', jQuery(imgSelector).attr('src')+'?'+ Math.random());
				}
				if (wr3x_upload) {
					var imgSelector = '[postid=' + attachmentId + '] .wr3x-info-full img';
					jQuery(imgSelector).attr('src', jQuery(imgSelector).attr('src')+'?'+ Math.random());
				}
				if (data.success === false) {
					alert(data.message);
				}
				else {
					if ( wr3x_replace ) {
						wr3x_refresh_media_sizes(data.results);
					}
					else if ( wr3x_upload ) {
						wr3x_refresh_full(data.results);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				jQuery('[postid=' + attachmentId + '] td').removeClass('wr3x-loading-file');
				jQuery('[postid=' + attachmentId + '] .wr3x-dragdrop').removeClass('wr3x-hover-drop');
				alert("An error occurred on the server-side. Please check your PHP error logs.");
		  }
		});
	}
	var file = files[0];
	if (file.size > maxPhpSize) {
		jQuery(this).removeClass('wr3x-hover-drop');
		alert( "Your PHP configuration only allows file upload of a maximum of " + (maxPhpSize / 1000000) + "MB." );
		return;
	}
	var postId = jQuery(evt.target).parents('.wr3x-file-row').attr('postid');
	jQuery(evt.target).parents('td').addClass('wr3x-loading-file');
	wr3x_uploadFile(file, postId, file.name);
}

jQuery(document).ready(function () {
	jQuery('.wr3x-dragdrop').on('dragenter', function (evt) {
		wr3x_stop_propagation(evt);
		jQuery(this).addClass('wr3x-hover-drop');
	});

	jQuery('.wr3x-dragdrop').on('dragover', function (evt) {
		wr3x_stop_propagation(evt);
		jQuery(this).addClass('wr3x-hover-drop');
	});

	jQuery('.wr3x-dragdrop').on('dragleave', function (evt) {
		wr3x_stop_propagation(evt);
		jQuery(this).removeClass('wr3x-hover-drop');
	});

	jQuery('.wr3x-dragdrop').on('dragexit', wr3x_stop_propagation);

	jQuery('.wr3x-dragdrop').each(function (index, elem) {
		this.addEventListener('drop', wr3x_filedropped);
	});

	jQuery('.wr3x-info, .wr3x-button-view').on('click', function (evt) {
		jQuery('#meow-modal-info-backdrop').css('display', 'block');
		jQuery('#meow-modal-info .content').html("");
		jQuery('#meow-modal-info .loading').css('display', 'block');
		jQuery('#meow-modal-info').css('display', 'block');
		jQuery('#meow-modal-info').focus();
		var postid = jQuery(evt.target).parents('.wr3x-info').attr('postid');
		if (!postid)
			postid = jQuery(evt.target).parents('.wr3x-file-row').attr('postid');
		wr3x_load_details(postid);
	});

	jQuery('#meow-modal-info .close, #meow-modal-info-backdrop').on('click', function (evt) {
		jQuery('#meow-modal-info').css('display', 'none');
		jQuery('#meow-modal-info-backdrop').css('display', 'none');
	});

	jQuery('.wr3x-info-full img').on('click', function (evt) {
		wr3x_delete_full( jQuery(evt.target).parents('.wr3x-file-row').attr('postid') );
	});

	jQuery('#meow-modal-info').bind('keydown', function (evt) {
		if (evt.keyCode === 27) {
			jQuery('#meow-modal-info').css('display', 'none');
			jQuery('#meow-modal-info-backdrop').css('display', 'none');
		}
	});

	/**
	 * Retina Uploader
	 */
	(function ($) {
		/**
		 * @constructor
		 */
		function Upload(File) {
			if (!this.validate(File)) return; // Invalid file
			this.file = File;
			this.loaded = 0;
			this.total = 0;
			this.doms = {
				wrap: null,
				filename: null,
				progress: null,
				percent: null,
				bar: null
			};
			this.request();
		}
		Upload.prototype.getProgress = function (Mul = 1) {
			if (!this.total) return 0;
			var r = (this.loaded / this.total) * Mul;
			return Math.round(r * 10) / 10;
		}
		Upload.prototype.validate = function (File) {
			var err;
			if (!'type' in File || !File.type)
				err = 'Unknown File Type';
			else if (!File.type.match(/^image\//)) // Not image
				err = 'Unsupported File Type';

			if (err) {
				console.error(err);
				alert(err);
				return false;
			}
			return true;
		}
		Upload.prototype.request = function () {
			var self = this;
			var action = 'wr3x_retina_upload';
			var data = new FormData();
			data.append('action', action);
			data.append('isAjax', true);
			data.append('nonce', wr3x_admin_server.nonce[action]);
			data.append('file', this.file);
			data.append('filename', this.file.name);

			this.show();

			$.ajax({
				type: 'POST',
				url: ajaxurl,
				contentType: false,
				processData: false,
				data: data,
				// Custom XHR
				xhr: function () {
					var xhr = new XMLHttpRequest();
					// Watch upload progress
					xhr.upload.addEventListener('progress', function (ev) {
						if (!ev.lengthComputable) return xhr;
						self.loaded = ev.loaded;
						self.total = ev.total;
						self.update();
					}, false);
					return xhr;
				}

			}).done(function (response) {
				try {
					response = $.parseJSON(response);
				} catch (e) { // Malformed Response
					self.abort();
					console.error(e);
					alert('Invalid Response');
					return;
				}
				if (!response.success) { // App Error
					self.abort();
					var msg = 'message' in response ?
						response.message : 'Error';
					console.error(msg);
					alert(msg);
					return;
				}
				// Remove the progress indicator
				self.doms.progress.remove();

				// Edit Link
				$('<a class="edit-attachment">')
					.attr('href', response.media.edit_url)
					.attr('target', '_blank')
					.text('Edit')
					.prependTo(self.doms.wrap);

				// Show the thumbnail
				$('<img class="pinkynail">')
					.attr('src', response.media.src[0])
					.prependTo(self.doms.wrap);

				// Just mocking the built-in behavior
				self.doms.filename
					.removeClass('original')
					.addClass('new');

			}).fail(function (e) { // HTTP Error
				self.abort();
				var msg = e.status + ' ' + e.statusText;
				console.error(msg);
				alert(msg + '\n' + 'An error occurred on the server-side. Please check your PHP error logs.');
			});
		}
		Upload.prototype.show = function () {
			// Ideal HTML:
			// <div class="media-item child-of-0" id="media-item">
			//   <div class="progress">
			//     <div class="percent">100%</div>
			//     <div class="bar" style="width: 200px;"></div>
			//   </div>
			//   <div class="filename original">image.jpg</div>
			// </div>
			this.doms.wrap = $('<div class="media-item wr3x-retina-uploaded">');
			this.doms.filename = $('<div class="filename original">')
				.text(this.file.name)
				.appendTo(this.doms.wrap);

			this.doms.wrap.appendTo('#media-items'); // First Appearance
		}
		Upload.prototype.update = function () {
			if (!this.doms.progress) { // Initialize the progress bar
				this.doms.progress = $('<div class="progress">').prependTo(this.doms.wrap);
				this.doms.percent = $('<div class="percent">').appendTo(this.doms.progress);
				this.doms.bar = $('<div class="bar">').appendTo(this.doms.progress);
			}
			this.doms.percent.text(this.getProgress(100) + '%');
			this.doms.bar.css('width', this.getProgress(200) + 'px');
		}
		Upload.prototype.abort = function () {
			this.doms.wrap.remove();
		}

		/** Initialize DOMs **/

		// Drag & Drop Area
		var dnd = $('#wr3x_drag-drop-area')
		dnd.on('dragenter dragover', function (ev) {
			wr3x_stop_propagation(ev);
			$(this).addClass('wr3x-hover-drop');

		}).on('dragleave dragexit', function (ev) {
			wr3x_stop_propagation(ev);
			$(this).removeClass('wr3x-hover-drop');

		}).on('drop', function (ev) {
			wr3x_stop_propagation(ev);
			$(this).removeClass('wr3x-hover-drop');
			var _ev = ev.originalEvent;
			var files = _ev.dataTransfer.files;
			for (var i = 0; i < files.length; i++) new Upload(files[i]);
		});

		// File Selector
		var selector = $('#wr3x_file-selector');
		selector.on('change', function (ev) {
			var files = ev.target.files;
			for (var i = 0; i < files.length; i++) new Upload(files[i]);
		});
		var btn = $('#wr3x_file-select-button');
		btn.on('click', function (ev) {
			selector.trigger('click');
		});

	})(jQuery);
});
