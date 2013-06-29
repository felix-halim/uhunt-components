'use strict';

angular.module('uHunt.chat', ['uHunt.base'])

.factory('chat_db', function (create_uhunt_db) {
  return create_uhunt_db('chat', {
    'username': 'string',
    'uhunt-code': 'string',
    'invisible': 'bool',
    'logged-in': 'bool',
  });
})

.directive('uhuntChat', function ($window, $timeout, uhunt_rpc, chat_db, uhunt_util, uhunt_poll, uhunt) {
  return {
    replace: true,
    scope: {},
    templateUrl: 'partials/chat.html',
    link: function (scope, element, attrs) {
      scope.width = attrs.width || 560;
      scope.height = attrs.height || 255;
      scope.uname_width = 140;
      scope.post_height =  18;
      scope.chat_height = scope.height - scope.post_height - 20;
      scope.message_width = scope.width - scope.uname_width - 15;

      scope.messages = uhunt_poll.uhunt_chats;
      scope.whos_here = uhunt_poll.whos_here;
      scope.username = chat_db.get('username');
      scope.password = chat_db.get('uhunt-code');
      scope.is_invisible = chat_db.get('invisible');
      scope.signed_in_user = '[ Sign In ]';
      scope.logging_in = false;
      scope.is_logged_in = false;
      scope.post_text = '';

      scope.toggle_invisible = function () {
        scope.is_invisible = !scope.is_invisible;
        chat_db.set('invisible', scope.is_invisible);
      };

      scope.sign_in = function () {
        if (!scope.password || scope.password.trim().length == 0) return;
        scope.logging_in = true;
        var ts = new Date().getTime();
        var digest = uhunt_util.MD5(ts + ';' + scope.password);
        uhunt_rpc.login(uhunt_poll.poll_sesid, scope.username, digest, ts, scope.is_invisible, function (ok) {
          console.log(scope.username + ' login = ' + ok);
          if (ok === 'ok') {
            chat_db.set('username', scope.username);
            chat_db.set('uhunt-code', scope.password);
            chat_db.set('logged-in', true);
            scope.signed_in_user = '[ ' + scope.username + ' ]';
            scope.show_login_dialog = false;
            scope.is_logged_in = true;
            scope.signed_in_as = scope.username;
          } else if (ok === 'invalid code') {
            alert('Invalid UVa username / uHunt code');
            scope.signed_in_user = '[ Sign In ]';
          }
          scope.logging_in = false;
          uhunt_poll.update_whos_here();
        });
      };

      $window.onbeforeunload = function () {
        var xhr = new XMLHttpRequest();
        if (!xhr) return;
        xhr.open("post", uhunt.web_url + '/chat/leave/' + uhunt_poll.poll_sesid, false);
        xhr.send();
      };

      uhunt_poll.on_new_session(function () {
        // TODO: why wait 1 sec?
        if (chat_db.get('logged-in')) $timeout(scope.sign_in, 1000);
      });

      scope.sign_out = function () {
        scope.logging_in = true;
        uhunt_rpc.logout(uhunt_poll.poll_sesid, function (ok) {
          console.log(scope.username + ' logout = ' + ok);
          chat_db.set('logged-in', false);
          scope.is_logged_in = false;
          scope.signed_in_user = '[ Sign In ]';
          scope.logging_in = false;
          uhunt_poll.update_whos_here();
        });
      };

      scope.post_message = function () {
        if (scope.post_text.length > 255) {
          alert("Your message is "+ (scope.post_text.length - 255) + " characters too long.");
        } else if (scope.post_text.length > 0 && !scope.post_chat_disabled) {
          scope.post_chat_disabled = true;
          uhunt_rpc.chat_post(uhunt_poll.poll_sesid, scope.post_text, function (res) {
            if (res == 'ok') {
              scope.post_text = '';
            } else if (res === 'need login') {
              alert('You need to sign in to post a message');
              scope.show_login_dialog = true;
            } else {
              alert('Error connecting to the server');
            }
            scope.post_chat_disabled = false;
          });
        }
        return false;
      }
    }
  };
})


.directive('scrollIf', function () {
  return function (scope, element, attrs) {
    setTimeout(function () {
      if (scope.$eval(attrs.scrollIf)) {
        var el = element[0].parentElement;
        el.scrollTop = el.scrollHeight;
      }
    });
  };
})


.filter('uhunt_duration', function () {
  return function (since) {
    var delta = new Date().getTime() - since;
    var dur = Math.max(0,Math.floor(delta / 1000 / 60));
    if (dur < 60) { return dur + 'm'; }
    dur = Math.floor(dur / 60);
    if (dur < 24) { return dur + 'h'; }
    if (dur < 24 * 30) { return Math.floor(dur / 24) + 'd'; }
    return Math.floor(dur / 24 / 30) + 'M';
  };
})

;
