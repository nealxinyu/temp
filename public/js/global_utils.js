$('[data-toggle="tooltip"]').tooltip();

function error(data, selector) {
    endLoading(selector);
    const message = $('<div class="alert alert-danger alert-message">');
    const close = $('<button type="button" class="close" data-dismiss="alert">&times</button>');
    message.append(close);
    message.append(data);
    message.appendTo($('body')).show().delay(3000).fadeOut(400);
}

function success(data, selector) {
    endLoading(selector);
    const message = $('<div class="alert alert-success alert-message">');
    const close = $('<button type="button" class="close" data-dismiss="alert">&times</button>');
    message.append(close);
    message.append(data);
    message.appendTo($('body')).show().delay(2000).fadeOut(300);
}

function startLoading(selector) {
    $(selector).css("pointer-events", "none");
    const message = $('<div id="loading" class="alert alert-secondary alert-message">');
    const close = $('<button type="button" class="close close-dark" data-dismiss="alert">&times</button>');
    message.append(close);
    message.append("Loading...");
    message.appendTo($('body'));
}

function endLoading(selector) {
    $(selector).css("pointer-events", "auto");
    $('#loading').remove();
    $('body').find("button").prop("disabled",false);
}