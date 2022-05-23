/* SEP https://www.prodesigns.com/backend/js/jquery-validation-1.16.0/additional-methods2.js */

$(function () {

    $.validator.addMethod("email2", function (value, element) {
        return this.optional(element) || /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
    }, 'Please enter a valid email address.');

    $.validator.addMethod("unique2", function (value, element, param) {
        var $found = false;
        var data = {};
        data[param.field || $(element).attr('name')] = value;
        $.ajax({
            url: param.url,
            type: param.type || 'GET',
            data: $.extend(data, param.data || {}),
            async: false,
            success: function (data) {
                $found = data.available || false;
            }
        });
        return $found;
    }, 'Already exists in our database.');

    $.validator.addMethod("minRequired", function (value, element, param) {
        var nm = $(element).attr('name');
        if ($(element).is(':checkbox')) {
            return $(element).closest('form').find('[name="' + nm + '"]:checked').length >= param;
        }
        var count = 0;
        $(element).closest('form').find('[name="' + nm + '"]').each(function () {
            if ($(this).val() != '') {
                count++;
            }
        });
        return count >= param;
    }, "You must select at least one!");


    $.validator.addMethod("mobile", function (value, element, param) {
        return value.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !value.match(/0{5,}/);
    }, "Please enter valid mobile number.");

    $.validator.addMethod("requiredIfEmpty", function (value, element, param) {
        var $rel = $(param);
        if ($(element).val() !== '') {
            return true;
        } else if ($rel.is(':checkbox')) {
            return $rel.is(':checked');
        } else if ($rel.is(':file')) {
                return $rel[0].files.length > 0;
        } else {
            return $rel.val() !== '';
        }
    }, "This field is required");

    $.validator.addMethod('maxFileSize', function (value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        for (i = 0; i < element.files.length; i++) {
            if (element.files[i].size > param) {
                return false;
            }
        }
        return true;
    }, 'File size must be less than {0}');

    $.validator.addMethod('maxFileCount', function (value, element, param) {
        return this.optional(element) || element.files.length <= param;
    }, 'Max file selection is {0}');
    
    $.validator.addMethod('commaSepretorMin', function (value, element, param) {
        var val_r = value.split(',');
        var count = 0;
        $.each(val_r, function(i, v){
            var val = v.trim();
            if(val != ''){
                count++;
            }
        });
        return this.optional(element) || count >= param;
    }, 'Minimum comma Sepretor value is {0}');
});

/* SEP https://www.prodesigns.com/frontend/js/script.js */

var enable_change_url_without_reload = false;
var user_channel = '';


window.alert = function (message) {
    $('#model_alert').modal('show');
    $('#set_alert_warning').html(message);

}

function removealert($cls){
    $.post(window.Laravel.ajaxRequests, {
        _token: window.Laravel.csrfToken,
        action: 'removeAlertSetSession',
        alert_class:$cls
    });
}
function countChar(obj,counter) {
    var len = obj.value.length;
    if (len >= counter) {
        obj.value = obj.value.substring(0, counter);
    }
    $(obj).next('.textcounter').text(counter - len);  
};


function UTCDateToLocalDate(utctime) { // HC
    //console.log(print_date);
    //var date = new Date('6/29/2011 4:52:48 PM UTC');
    //var date = new Date('{{ \Carbon\Carbon::now()->format("m/d/Y H:i:s A") }} UTC');
    var date = new Date(utctime);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var strTime = hours + ':' + minutes + ' ' + ampm;
    
    var diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);
    
    
    if(diff < 60 ||(day_diff == 0 && diff < 60)){
        return "just now";
    }else if(day_diff == 0 && diff < 120){
        return "1 minute ago";
    }else if(day_diff == 0 && diff < 3600){
        return Math.floor(diff / 60) + " minutes ago"; 
    }else if(day_diff == 0 && diff < 7200){
        return "1 hour ago";
    }else if(day_diff == 0 && diff < 86400){
        return Math.floor(diff / 3600) + " hours ago";
    }else if( day_diff == 1 ){
        return "Yesterday "+strTime;
//    }else if( day_diff < 7 ){
//        return day_diff + " days ago"; 
//    }else if( day_diff < 31 ){
//        return Math.ceil(day_diff / 7) + " weeks ago";
}else{
    
    return monthNames[date.getMonth()] + "-" + date.getDate() + ", " + strTime;
}
}

function UTCTime(){
    var now = new Date(); 
    var my_utc = (now.getUTCMonth()+1)+'/'+now.getUTCDate()+'/'+now.getUTCFullYear()+' '+now.getUTCHours()+':'+now.getUTCMinutes()+':'+now.getUTCSeconds()+' '+(now.getUTCHours() >= 12 ? 'PM' : 'AM')+' UTC';
    return my_utc;
}
function updateTime(){
    $('.convert_time').each(function(){
        var UTC_time = $(this).attr('datetime');
        var local_time = UTCDateToLocalDate(UTC_time);
        $(this).html(local_time);
    });
}

setInterval(function(){
    updateTime();
},10000);


$(document).ready(function () {
       updateTime(); // Update Local time
       user_channel = $("input[name='user_id']").val();
       
//    function h(e) {
//        $(e).css({'height':'auto','overflow-y':'hidden'}).height(e.scrollHeight);
//      }
//      $('textarea').each(function () {
//        h(this);
//      }).on('input', function () {
//        h(this);
//      });
//  
    // Scroll Down chat after page is ready
    $('.msg_container_base').animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 1000);
    listenForScrollEvent($("#chat_container"));
    
    $('#btn-chat').prop('disabled', true);
    
    $('body').on('keydown','#btn-input-chat',function(){
        var text = $(this).html();
        
        if(text == '<span>Type here...</span>'){
            $(this).html('');
        }

    });
    /*
    $('body').on('blur','#btn-input-chat',function(){
        var text = $(this).html();
        //alert(text.length);
        if(text.length == 0 || text == '<br>'){
           // $(this).html('<span>Type here...</span>');
        }
    }); */
    
    $('body').on('keydown','#btn-input-chat',function(e){
        
        if((e.shiftKey && e.keyCode == 13 ) || (e.ctrlKey && e.keyCode == 13 )){
           
        }else if(e.keyCode == 13){
            $('#form_chat').submit();
            return false;
            
        }
        
        //e.preventDefault();
        //alert('enter');
        
    });

//    

//    $("#btn-chat").bind("paste", function(e){
//        alert('123');
//        // access the clipboard using the api
//        //var pastedData = e.originalEvent.clipboardData.getData('text');
//        //alert(pastedData);
//    } );

/* Home page content start */
var home_chat_section = '0';

$('body').on('click','.section_chat',function(){
    
    var get_html ='<div class="homepage-chat" ><div class="prodesign-chats" id="">'+ $('.prodesign-chats').eq(0).html()+'</div></div>';
    $('#homepage-chat').html(get_html);
    $('.prodesign-chats').eq(1).remove();
    
    $('#add_chat_section').show();
    
    $('#icon_minim').show();
    $('#chat-window').slideDown('slow');
    
    
    $('html, body').animate({
        scrollTop: $("#add_chat_section").offset().top
    }, 1000);
  
    home_chat_section = $('#add_chat_section').offset().top - $('#add_chat_section').outerHeight() - 540;
  
});

    $(window).scroll(function () {
        var scroll_height = $(this).scrollTop();

        if (home_chat_section != '0' && $("#add_chat_section").is(':visible')) {
            
            if (home_chat_section > scroll_height) {
                $('#home-chat-bubble').fadeIn('slow');
            } else {
                $('#home-chat-bubble').fadeOut('slow');
                $('#home-pro-chat-button').find('.msg-count').html('0');
            }
        }
    });
    $('body').on('click','#home-chat-bubble',function(){
        $('html, body').animate({
            scrollTop: $("#add_chat_section").offset().top
        }, 1000);
    });
    
    
    
    

/* Home page content start */
$.each($2,function(i,f){
    if(typeof f === 'function'){
        f();
    }
});




//    $(document).on('cbox_open',function(){
//      $(document.body).css('position','fixed');
//    }).on('cbox_closed',function(){
//      $(document.body).css('position','');
//    });    

var lazy_load_images = true;
if(lazy_load_images){
    var scroll_offset = 2000;
    $(document).scroll(function () {
        var dst = $(document).scrollTop();
        var wdh = $(window).height();
        $("img.sipl-lazy[data-src]").each(function(){
            var ths = $(this);
            if(ths.offset().top < (dst + wdh + scroll_offset)){
                ths.attr('src', ths.data('src')).removeAttr('data-src');
            }
        });
    }).trigger('scroll');
} else {
    $("img.sipl-lazy[data-src]").each(function(){
        var ths = $(this);
        ths.attr('src', ths.data('src')).removeAttr('data-src');
    });
}

$(window).resize(function () {
    $(".portfolio ul.portfolio-items > li.pf-item").css('height', $(".portfolio ul.portfolio-items > li.pf-item").width() + 15.17);
}).trigger('resize');

$('a.page-scroll').bind('click', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top - 65)
    }, 300);
    event.preventDefault();
});
    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 60
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 60
        }
    })

    __user_ping();
    //notification.get();

    /* activating current manu item */
    $("[href='" + window.location.href.split('?')[0] + "'], [href='" + window.location.href + "']").parent('li').addClass('active');

    /* enabling bootstrap tooltip and popover */
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    /* bootstrap carousel touch support */
    var xClick_123 = 0;
    var offset_123 = 5;
    $(".carousel.touchsupport").on("touchstart", function (event) {
        var xClick = event.originalEvent.touches[0].pageX;
        
        $(this).one("touchmove", function (event) {
            var xMove = event.originalEvent.touches[0].pageX;
            if (Math.floor(xClick - xMove) > offset_123) {
                $(this).carousel('next');
                
            } else if (Math.floor(xClick - xMove) < -(offset_123)) {
                $(this).carousel('prev');
            }
        });
    }).on("touchend", function () {
        $(this).off("touchmove");
    }).bind('slide.bs.carousel', function (e) {
        /* bind bootstrap slide event */
        if (typeof carousel_slide_event === 'function') {
            carousel_slide_event(e);
        }
    }).on("mousedown", function (event) {
        event.preventDefault();
        xClick_123 = event.originalEvent.clientX;        
    }).on("mouseup", function (event) {
        event.preventDefault();
        xClick_123 = 0;        
    }).on("mousemove", function (event) {
        if(xClick_123 !== 0) {
            var xMove = event.originalEvent.clientX;
            if (Math.floor(xClick_123 - xMove) > offset_123) {
                $(this).carousel('next');
                xClick_123 = 0;
            } else if (Math.floor(xClick_123 - xMove) < -(offset_123)) {
                $(this).carousel('prev');
                xClick_123 = 0;
            }            
        }
    }).bind('slid.bs.carousel', function (e) {
        var current_page_index = $('#spceial-pro-landing-slider .active').attr('data-slide-to');
        $('#set_current_page_counter').html(eval(current_page_index) + 1);
    });



    $('#news-letter-form').submit(function () {
        $.ajax({
            url: window.Laravel.ajaxRequests,
            data: {
                action: 'submit_news_letter_form',
                _token: window.Laravel.csrfToken,
                news_letter_email: $('[name="news_letter_email"]').val()
            },
            type: 'post',
            success: function (data) {
                if (data.status == 'OK') {
                    $("#news-letter-form").html('<div class="alert alert-success">' + data.msg + '</div>');
                } else {
                    $("#news-letter-form").find('.error').text(data.msg);
                }
            },
            error: function (data) {
                alert('An error occure while submitting form.');
            }
        });
        return false;
    });

    if (typeof after_documentReady === 'function') {
        after_documentReady();
    }

});

/* change url withour reloading page */
if (enable_change_url_without_reload) {
    $(function () {
        $('a').click(a_click);
        window.history.pushState({
            "html": $("#page-content").html(),
            "pageTitle": document.title,
            "pageSlug": $("body").attr('data-pageslug')
        }, "", window.location.href);

    });
    function prosetUrlSupportPushState(urlPath) {
        $("#page-content").html($('#page-loader-tpl').html());
        $.get(urlPath, {request: 'content-only'}, function (data) {
            $("#page-content").html(data.html);
            document.title = data.pageTitle;
            $('body').attr('class', function (i, c) {
                return c.replace(/(^|\s)page-\S+/g, '');
            }).addClass('page-' + data.pageSlug).attr('data-pageslug', data.pageSlug);
            window.history.pushState({
                "html": data.html,
                "pageTitle": data.pageTitle,
                "pageSlug": data.pageSlug
            }, "", urlPath);
            $("a").unbind('click').click(a_click).parent('li').removeClass('active');
            $("[href='" + window.location.href.split('?')[0] + "'], [href='" + window.location.href + "']").parent('li').addClass('active');
            
        }).fail(function (data) {
            
            $("#page-content").html($('#page-error-tpl').html());
            alert('Something going wrong. Please try againg.');
        });
    }
    function a_click(e) {
        url = $(this).attr('href');
        if (typeof window.history.pushState === 'function' && arrayEleStartWithStr(url, window.Laravel.pushStateUrls) !== -1) {
            prosetUrlSupportPushState(url);
            e.preventDefault();
        }
        return true;
    }
    window.onpopstate = function (e) {
        if (e.state) {
            $("#page-content").html(e.state.html);
            document.title = e.state.pageTitle;
            $('body').attr('class', function (i, c) {
                return c.replace(/(^|\s)page-\S+/g, '');
            }).addClass('page-' + e.state.pageSlug).attr('data-pageslug', e.state.pageSlug);
        }
    };

    function arrayEleStartWithStr(str, strArray) {
        for (var j = 0; j < strArray.length; j++) {
            if (str.indexOf(strArray[j]) === 0) {
                return j;
            }
        }
        return -1;
    }
}
/* end change url withour reloading page */


var notification = {
    limit: 10,
    offset: 0,
    load_more: true,
    types: {
        'App\\Notifications\\NewOrderAdded': {
            image: '/backend/img/designservices/categories/1491803536-SP%20Banner%20580x400.jpg',
            title: 'Congrats! Order has been placed successfully.'
        },
        'App\\Notifications\\PaymentReceived': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'New Payment'
        },
        'App\\Notifications\\UserRegister': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'Welcome on board!'
        },
        'App\\Notifications\\AdminNewMessage': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'New Message.'
        },
        'App\\Notifications\\OrderAutoCompleteNotification': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'Order Set as "Complete" Automatically.'
        },
        'App\\Notifications\\OrderRefundAcceptedNotification': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'Refund Request Accepted!.'
        },
        'App\\Notifications\\OrderRefundRejectedNotification': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'Refund Request Rejected!'
        },
        'App\\Notifications\\AdminNewMessage': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'New Message'
        },
        'App\\Notifications\\OrderCompleteNotification': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'Order Completed Successfully!'
        },
        'App\\Notifications\\OrderUpgradeNotification': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'Order Upgraded Successfully!'
        },
        'default': {
            image: '/backend/img/users/user2-160x160.jpg',
            title: 'New Notification'
        }
    },
    get: function () {
        
        
        
        $('.more-notifi')
        .attr('data-org-html', $('.more-notifi').html())
        .html('Loading...')
        .prop('disabled', true);
        $.post(window.Laravel.ajaxRequests, {
            _token: window.Laravel.csrfToken,
            // action: "user_ping",
            action: "get_notification",
            limit: notification.limit,
            offset: notification.offset
        }, function (data) {
            
            //console.log(data);
            var html = '';
            $.each(data, function (i, n) {

                if(n.data.url.indexOf('http') != -1){
                    var base_url =  n.data.url;
                }else{
                    var base_url = window.Laravel.siteUrl + n.data.url;
                }
                base_url = base_url.replace("admin/", "dashboard/");
                
                //var html = '';
                html += '<li class="is_new media ' + (n.read_at == null ? 'notify_read' : '') + '">';
                    html += '<a class="order-notify" href="' + base_url + '">';
                        html += '<div class="media-left"><div class="afterlogin-notify-img">';
                            html += '<img src="http://via.placeholder.com/250/f2f2f2?text=M">';
                        html += '</div></div> ';
                        html += '<div class="media-body media-middle">';
                            if (typeof notification.types[n.type] !== 'undefined') {
                                html += '<h5 class="heading">' + notification.types[n.type].title + '</h5>';
                            } else {
                                html += '<h5 class="heading">' + notification.types.default.title + '</h5>';
                            }    
                            html += '<p class="detail">' + n.data.msg + '</p>';
                            html += '<p class="notifytime">' + n.diff_created_at + '</p>';
                        html += '</div>';
                    html += '</a>';
                html += '</li>';
                
                
                
                /*
                html += '<li class=" ' + (n.read_at == null ? 'is_new' : '') + '">';
                html += '<a class="order-notify"  href="' + base_url + '">';
                html += '<div class="notifycontent">';
                if (typeof notification.types[n.type] !== 'undefined') {
                    html += '<h5 class="heading">' + notification.types[n.type].title + '</h5>';
                } else {
                    html += '<h5 class="heading">' + notification.types.default.title + '</h5>';
                }
                html += '<p class="detail">' + n.data.msg + '</p>';
                html += '<p class="notifytime">' + n.diff_created_at + '</p>';
                html += '</div>';
                html += '<div class="clearfix"></div>';
                html += '</a>';
                html += '</li>'; */
            });
            console.log(data.length);
            if (data.length < notification.limit) {
                notification.load_more = false;
                //$('.more-notifi').prop('disabled', true);
                // html += '<li>No notifications...</li>';
            } else {
                notification.offset = eval(notification.offset) + eval(notification.limit);
                //$('.more-notifi').prop('disabled', false);
            }
            if (html == '') {
                html = '<li style="padding:10px;text-align:center;">No More Notifications...</li>';
                notification.offset = -1;
            }
            $('#header_notifications').append(html);
            
//            $('.more-notifi')
//            .html($('.more-notifi').data('org-html'))
//            .parent('li')
//            .before(html);
    
            notification.get_count();
            $('#header_notifications_loader').hide();
            
        });
    },
    get_count: function () {
        
        $.post(window.Laravel.ajaxRequests, {
            _token: window.Laravel.csrfToken,
            action: "get_notification_count"
        }, function (data) {
            $.each(data,function(i,v){
                if(v.notification_count != 0){
                    $('.notification-menu .badge').remove();
                    $('.main_menu_heade_badge').remove();
                    $('.notification-menu a.add_notification_counter').append('<span class="badge">'+v.notification_count+'</span>');
                    $('.main_menu_head_menu').after('<div id="" class="badge toggle_notification main_menu_heade_badge">&nbsp;</div>');
                }else{
                    $('.notification-menu .badge').remove();
                    $('.main_menu_heade_badge').remove();
                }
            });
        });
    }
};



setInterval(notification.get_count(), 1000 * 30);

/* user ping */
var __user_ping = function () {
    $.post(window.Laravel.ajaxRequests, {
        _token: window.Laravel.csrfToken,
        action: "user_ping"
    });
};
setInterval(__user_ping, 1000 * 60 * 2);

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a target="_blank" href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

$(document).ready(function () {

    $('#header_notifications').on('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            //alert();
            
            if(notification.load_more){
                $('#header_notifications_loader').show();
                notification.get();
            }
        }
    });
    
    $('.messages').each(function(){
        var get_html = $(this).html();
       // console.log(get_html);
       $(this).html(urlify(get_html));
   });
    
    
    $('.more-notifi').click(function (e) {
        //e.stopPropagation();
        //notification.get();
    });

    var sideslider = $('[data-toggle=collapse-side]');
    var sel = sideslider.attr('data-target');
    var sel2 = sideslider.attr('data-target-2');
    sideslider.click(function (event) {
        $(sel).toggleClass('in');
        $(sel2).toggleClass('out');
        $('body').toggleClass('out');

    });

    $('.navbar a.submenu').on('click', function (e) {
        var $el = $(this);
        var $parent = $(this).offsetParent(".dropdown-menu");
        $(this).parent("li").toggleClass('open');

        if (!$parent.parent().hasClass('nav')) {
            $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
        }

        $('.nav li.open').not($(this).parents("li")).removeClass("open");

        return false;
    });
});

var AutoGrowTextArea = function (ths) {
    return false;
};

/* socket start */

//Number.prototype.padLeft = function (base, chr) {
//    var len = (String(base || 10).length - String(this).length) + 1;
//    return len > 0 ? new Array(len).join(chr || '0') + this : this;
//}
//function GetFormattedDate() {
//    var d = new Date,
//            dformat = [d.getDate().padLeft(), (d.getMonth() + 1).padLeft()].join('/') +
//            ', ' +
//            [d.getHours().padLeft(),
//                d.getMinutes().padLeft()].join(':');
//    return dformat;
//
//}

function formatAMPM() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}



//if(localStorage.getItem("user_receiver_id") != null){
//    var user_receiver_id = localStorage.getItem("user_receiver_id");
//}else{
//    var user_receiver_id = '';
//}
//console.log(user_receiver_id);

var user_receiver_id = '';

$(function () {

$('body').on('paste', '#btn-input-chat', function (e) {
    setTimeout(function ()
    {
        var check = $('#btn-input-chat').html();
        check = check.replace(/<br\s*\/?>/gi,'');
        if (check.trim().length > 0) {
            $('#btn-chat').prop('disabled', false);
        } else {
            $('#btn-chat').prop('disabled', true);
        }
    },500);
    
});

$(document).on('keyup', '#btn-input-chat', function (e) {
    var check = $(this).html();
    check = check.replace(/<br\s*\/?>/gi,'');
    if (check.trim().length > 0) {
        $('#btn-chat').prop('disabled', false);
    } else {
        $('#btn-chat').prop('disabled', true);
    }
});

$(document).on('submit', '#chat_details', function (e) {
    e.preventDefault();
    $('#set_user').val($('#chat_details_name').val());
        //$('#set_email').val($('#chat_details_email').val());
        
        $('#chat_details').hide();
        
        $('#chat_container').show();
//        $('.msg_container_base').show();
//        $('#chat_body').show();
$('#user_chat_form').show();

        //Set name message
        var token = $("input[name='_token']").val();
        var user = $("input[name='user']").val();
        var user_id = $("input[name='user_id']").val();
        
        $.ajax({
            type: "POST",
            url: window.Laravel.siteUrl+'/sendmessage',
            dataType: "json",
            data: {'_token': token,
            'message_type': 'setting',
            'user': user,
            'sender_id': user_id,
            'receiver_id': user_receiver_id,
            'sender_type': 'web_user',
        },
        success: function (data) {
                    //console.log(data);
                }
            });
        
    });

$(document).on('submit', '#form_chat', function (e) {
    e.preventDefault();
    $('.emoji-cont').slideUp(500);
    var token = $("input[name='_token']").val();
    var chat_image_url = $('#chat_image_url').val();
    var user = $("input[name='user']").val();
    var user_id = $("input[name='user_id']").val();
    var msg = $.trim($("#btn-input-chat").html());

    if (msg != '' && msg != '<br>') {
        var today = new Date();
        var minute = today.getMinutes();
            var hours = today.getHours(); //January is 0!
            
            var input_msg = $('#btn-input-chat').html().replace(/<(?!br\s*\/?)[^>]+>/g, '');
            
            var msg2 =''
            +'<div class="pro-chat-msg-container msgbase-send">'
            +'<div class="media">'
            +'<div class="media-left pro-chat-avatar"></div>'
            +'<div class="media-body">'
            +'<div class="pro-chat-msg chat-msg-send">'
            +'<div class="pro-chat-msg-box">'
            +'<p>'+ urlify(input_msg) +'</p>'
            +'</div>'
            +'<div class="pro-chat-info">'
            +'<span class="chat-user-nm"></span>'
            +'<span class="chat-msg-time convert_time" datetime="'+ UTCTime() +'">just now</span>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</div>';
            
            $('#chat_body').append(msg2);
            $('.msg_container_base').animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 1000);
            
            if($('#chat-bubble').length){
                $('#pro-chat-button').find('.msg-count').html('0');
            }
            $(".msg").html('');
            
            $.ajax({
                type: "POST",
                url: window.Laravel.siteUrl+'/sendmessage',
                dataType: "json",
                data: {'_token': token,
                'message': msg,
                'user': user,
                'user_id': user_id,
                'sender_id': user_id,
                'receiver_id': user_receiver_id,
                'title': window.location.href,
                'sender_type': 'web_user',
                'image_url': chat_image_url,
                'email': $('#set_email').val(),
                'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                'page_service': $("input[name='page_service']").val(),

            },
            success: function (data) {
                
                if($('#set_user').val()==""){
                    $('#chat_details').show();
                    //$('.msg_container_base').hide();
                    $('#chat_container').hide();
                    //$('#chat_body').hide();
                    $('#user_chat_form').hide();
                    
                    
                }
            }
        });

        } else {
            //alert("Please Add Message.");
        }

        //$("#chat_body").animate({ scrollTop: $('#chat_body').prop("scrollHeight")}, 1000);
        $(this)[0].reset();
        $('#btn-chat').prop('disabled', true);

    });

function chat_ui_toggle(){
    $('#chat-window').slideToggle(400,function(){
        var change_icon = $(this).is(":visible");
            if(change_icon){ // if true(Visible) 
              $('#pro-chat-button').html('<span class="chat-close">x</span>');  
              $('#btn-input-chat').focus();
              $('#btn-chat').prop('disabled', true);
              $('.msg_container_base').animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 1000);
              
            }else{ // if false(Hidden) 
              $('#pro-chat-button').html('<i class="fa fa-envelope-o"></i>');  
              
              var get_html ='<div class="homepage-chat" ><div class="prodesign-chats" id="">'+ $('.prodesign-chats').eq(0).html()+'</div></div>';
              $('#homepage-chat').html(get_html);
              
          }
      });
}
$(document).on('click', '.icon_minim', function (e) {
    $('.homepage-chat').remove();
    chat_ui_toggle();
    
});


//    $(document).on('click', '.icon_minim', function (e) {
//        var $this = $(this);
//
//        if ($('#minim_chat_window').hasClass('panel-collapsed')) {
//            $('#chat_window_1').show();
//            $('#chat_panel').css('margin-bottom', '0px');
//
//            $('#chat_panel').find('.panel-body').slideDown();
//            $('#minim_chat_window').removeClass('panel-collapsed');
//            $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
//
//            $('#pro-livechat').hide();
//            $('.msg_container_base').animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 1000);
//            
//        } else {
//            $('#chat_panel').find('.panel-body').slideUp();
//            $('#minim_chat_window').addClass('panel-collapsed');
//            $('#minim_chat_window').addClass('glyphicon-plus').removeClass('glyphicon-minus');
//            $('#pro-livechat').show();
//            
//            //alert('hardik');
//            //$(document.body).css('position','fixed');
//
//            $('#chat_panel').css('margin-bottom', '-40px');
//            setTimeout(function () {
//                $('#chat_window_1').hide();
//            }, 450);
//        }
//    });

$(document).on('click', '#new_chat', function (e) {
    var size = $(".chat-window:last-child").css("margin-left");
    size_total = parseInt(size) + 400;

    var clone = $("#chat_window_1").clone().appendTo(".container");
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
        //$(this).parent().parent().parent().parent().remove();
        $("#chat_window_1").remove();
    });

});

/* socket end */

$(document).ready(function(e){
    $("img").error(function(e){
        $(this).attr('src',window.Laravel.siteUrl+"/frontend/img/not-available.jpg");
        if($(this).parent().hasClass('cat-img')){
            $(this).width("360px");
            $(this).height("220px");
        }
    });
});

$(document).on('click','#btn-chat-file',function(e){
    e.preventDefault();
    //alert('hii');
    $('#chat-image').trigger('click');
});

function checkextension() {
  var file = document.querySelector("#chat-image");
  return ( /\.(jpe?g|png|gif)$/i.test(file.files[0].name));
  
  //if ( /\.(jpe?g|png|gif)$/i.test(file.files[0].name) === false ) { alert("not an image!"); }
}
$(document).on('change', '#chat-image', function(e) {
    //e.preventDefault();
    if ($('#chat-image')[0].files[0] != "undefined") {
        var formData = new FormData();
        formData.append('attachments', $('#chat-image')[0].files[0]);

        formData.append('_token', $("input[name='_token']").val());
        formData.append('action', "uploadchatimage");
        // formData.append('order_id', window.order.orderid);

        if(checkextension()){
         
         $.ajax({
            type: 'POST',
            //url: '{!! URL::to("admin") !!}' window.Laravel.ajaxRequests,
            url: window.Laravel.siteUrl + '/public-ajax',
            data: formData,
            //cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            beforeSend: function(){
                $('#chat_body').append($('#tpl_chat_loader').html());
                $('.msg_container_base').animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 1000);
                    //$('#chat_body').animate({scrollTop: $('#chat_body').prop("scrollHeight")}, 1000);
                },
                success: function(data) {
                //console.log(data);
                if (data.status == true) {
                    //addmsg({msg_type: 'attechment', "attachment": data.path});
                    
                    var token = $("input[name='_token']").val();
                    var chat_image_url = $('#chat_image_url').val();
                    var user = $("input[name='user']").val();
                    var user_id = $("input[name='user_id']").val();
                    var msg = '';
                    //var receiver_id = user_receiver_id;
                    
                    var msg2 =''
                    +'<div class="pro-chat-msg-container pro-chat-msg-img msgbase-send">'
                    +'<div class="media">'
                    +'<div class="media-left pro-chat-avatar"></div>'
                    +'<div class="media-body">'
                    +'<div class="pro-chat-msg chat-msg-send">'
                    +'<div class="pro-chat-msg-box">'
                    +'<p>'
                    +'<a download="" target="_black" href="'+ data.full_path +'"> '
                    +'<img src="'+ data.full_path +'" height="100"/> '
                    +'</a>'
                    +'</p>'
                    +'</div>'
                    +'<div class="pro-chat-info">'
                    +'<span class="chat-user-nm"></span>'
                    +'<span class="chat-msg-time convert_time" datetime="'+ UTCTime() +'">just now</span>'
                    /* +'<span class="chat-msg-time">'+ formatAMPM() +'</span>' */
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    
                    $('#chat_loader').remove();
                    
                    $('#chat_body').append(msg2).animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 1000);
                    
                    
                        // Scroll After image fully loaded
                        $("img").on('load', function() { 
                            $('.msg_container_base').animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 1000);
                        });
                        $.ajax({
                            type: "POST",
                            url: window.Laravel.siteUrl+'/sendmessage',
                            dataType: "json",
                            data: {'_token': token,
                            'message': msg,
                            'user': user,
                            'user_id': user_id,
                            'sender_id': user_id,
                            'receiver_id': user_receiver_id,
                            'title': window.location.href,
                            'sender_type': 'web_user',
                            'image_url': chat_image_url,
                            'msg_type': 'image',
                            'attechment': data.path,
                        },
                        success: function (data) {
                            $(".msg").html('');
                        }
                    });
                        

                    } else {
                        alert("Some issue occures in image uploading");
                    }
                },
                error: function(data) {
                //console.log('error');
            }
        });

}else{
 alert('Invalid image format.');
}


}

});


/** chat typing indicator */
//$(document).on('keyup', '#btn-input-chat', function (e) {
//    
//    var user = $("input[name='user']").val();
//    var sender_id = $("input[name='user_id']").val();
//    var receiver_id = user_receiver_id;
//    socket.emit('typing', { 'user': user,'sender_id' : sender_id,'receiver_id' : receiver_id });
//});



var typing_flag = 0;





/** Chat History */
var paginate_current_page = 1;
var paginate_last_page = 2;


function listenForScrollEvent(el) {
    el.on("scroll", function () {
        el.trigger("custom-scroll");
    });
    
}
$("body").on("custom-scroll", "#chat_container", function () {
    var pos = $('#chat_container').scrollTop();
    //console.log(pos);
    
    if (pos == 0) {
       // alert(paginate_current_page);
       var old_height = $('#chat_body').prop('scrollHeight');
       chat_history();
       $('.msg_container_base').scrollTop(eval($('#chat_body').prop("scrollHeight")) - eval(old_height));
   }
});

function chat_history(){

    var user_id = $("input[name='user_id']").val();

    $.ajax({
        type: "POST",
        url: window.Laravel.ajaxRequests,
        async:false,
        data: {
            '_token': window.Laravel.csrfToken,
            'action': 'chat_records',
            'sender_id': user_id,
            'page': eval(paginate_current_page) + 1,
        },
        beforeSend: function(){
         $('#chat_body').prepend($('#tpl_chat_data_loader').html());
           //$('.msg_container_base').animate({scrollTop: $('.msg_container_base').prop("scrollHeight")}, 1000);
       },
       success:function(mydata){
        $('#chat_data_loader').remove();
        
        /* Set pagination variabel */
        paginate_current_page = mydata.data.current_page;
        paginate_last_page = mydata.data.last_page;
        $('#chat_body').prepend(mydata.html);
        updateTime();
        
            //console.log(mydata);

        }
    });
}

/* Chat History **/


/*$(document).on('click','.order-review-submit-button',function(e){
    e.preventDefault();
    
    $.post(window.Laravel.ajaxRequests, {
        action: "order_givereview",
        _token: window.Laravel.csrfToken
    }).done(function (data) { 

    });
});*/

var resize_post_wrap = function () {

    $('.service-list-box').each(function () {
        var maxheight = 0;
        $(".service-panel").height('100%');
        $(".service-panel").children().each(function () {
            maxheight = ($(this).height() > maxheight ? $(this).height() : maxheight);
        });
        $(".service-panel").height(maxheight);
    });

    
 };
$(window).resize(function () {
    resize_post_wrap();
});

$(window).on('load', function () {
    resize_post_wrap();
});



$("#ckAlert").click(function(){
        $(".alert").slideUp();  
    });

$(document).on('click','.review-pop-up',function(e){
    $('#order-review-form .order_id').val($(this).attr('data-id'));
});

(function($, window, document, undefined) {
    $('.inputfile').each(function() {
        var $input = $(this),
            $label = $input.next('.input-file-btn'),
            labelVal = $label.html();

        $input.on('change', function(e) {
            var fileName = '';

            if (this.files && this.files.length > 1)
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            else if (e.target.value)
                fileName = e.target.value.split('\\').pop();

            if (fileName)
                $label.find('span').html(fileName);
            else
                $label.html(labelVal);
        });

        // Firefox bug fix
        $input
            .on('focus', function() {
                $input.addClass('has-focus');
            })
            .on('blur', function() {
                $input.removeClass('has-focus');
            });
    });
})(jQuery, window, document);