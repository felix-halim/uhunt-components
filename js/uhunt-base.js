'use strict';

/*
This script contains the instances necessary to build something meaningful.

Author: Felix Halim <felix.halim@gmail.com>
*/

/*global $, io, alert, MD5, window, document, localStorage */

angular.module('uHunt.base', [])

// Helper functions.
.factory('uhunt_util', function ($http, $timeout, $filter) {
  function unescape_html(s) { return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#92;/g, '\\')
    .replace(/&#47;/g, '/')
    .replace(/&#39;/g, '\'');
  }

  function Listener() { this.listeners = []; }
  Listener.prototype.listen = function (f) { this.listeners.push(f); };
  Listener.prototype.notify = function () {
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i].apply(null, arguments);
    }
  };

  // This is cool, it updates things.
  (function tick() { $timeout(tick, 1000); })();

  function ajax(method, url, params, cb) {
    $http({ method:method, url:url, params:params, cache:false, timeout:55000 }).success(cb)
      .error(function() { $timeout(function () { ajax(method, url, params, cb); }, 10000); });
  }

  function sync_ajax(method, url, params, cb) {
    jQuery.ajax({ type: method, url: url, data: params, success: cb, async: false });
  }

  return {
    http: ajax,
    sync_http: sync_ajax,
    parseInt: function (v) { v = parseInt(v, 10); return isNaN(v) ? 0 : v; },
    now: function () { return Math.floor(new Date().getTime() / 1000); },
    Listener: Listener,
    parse_uid_from_path: function (path, default_uid) {
      if (!path || path.indexOf("/id/") !== 0) return default_uid;
      return this.parseInt(path.substring(4));
    },
    format_ms: function (ms) {
      if ((!ms && ms!==0) || ms > 100000) return '-';
      var sec = Math.floor(ms/1000); ms %= 1000;
      return sec + '.' + (ms < 10 ? '00' : (ms < 100 ? '0' : '')) + ms;
    },
    format_ago: function (t, back) {
      var w = new Date().getTime() / 1000 - t;
      if (back<=5 && w < 60) { return Math.ceil(w) + ' secs ago'; }
      if (back<=4 && w < 60*60) { return Math.floor(w/60) + ' mins ago'; }
      if (back<=3 && w < 24*60*60) { return Math.floor(w/60/60) + ' hours ago'; }
      if (back<=2 && w < 30*24*60*60) { return Math.floor(w/60/60/24) + ' days ago'; }
      if (back<=1 && w < 365*24*60*60) { return Math.floor(w/60/60/24/30) + ' months ago'; }
      return $filter('date')(t * 1000, 'yyyy-MM-dd HH:mm');
    },
    escape_html: function (s) { return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\\/g, '&#92;')
      .replace(/\//g, '&#47;')
      .replace(/'/g, '&#39;');
    },
    unescape_html: unescape_html,
    safe_parse_json: function (json_text) { return JSON.parse(unescape_html(json_text)); },
    MD5: function(e){function m(h,g){var j,i,n,l,k;n=h&2147483648;l=g&2147483648;j=h&1073741824;i=g&1073741824;k=(h&1073741823)+(g&1073741823);if(j&i)return k^2147483648^n^l;return j|i?k&1073741824?k^3221225472^n^l:k^1073741824^n^l:k^n^l}function o(h,g,j,i,n,l,k){h=m(h,m(m(g&j|~g&i,n),k));return m(h<<l|h>>>32-l,g)}function p(h,g,j,i,n,l,k){h=m(h,m(m(g&i|j&~i,n),k));return m(h<<l|h>>>32-l,g)}function q(h,g,j,i,n,l,k){h=m(h,m(m(g^j^i,n),k));return m(h<<l|h>>>32-l,g)}function r(h,g,j,i,n,l,k){h=m(h,m(m(j^
(g|~i),n),k));return m(h<<l|h>>>32-l,g)}function s(h){var g="",j="",i;for(i=0;i<=3;i++){j=h>>>i*8&255;j="0"+j.toString(16);g+=j.substr(j.length-2,2)}return g}var f=[],t,u,v,w,a,b,c,d;e=function(h){h=h.replace(/\r\n/g,"\n");for(var g="",j=0;j<h.length;j++){var i=h.charCodeAt(j);if(i<128)g+=String.fromCharCode(i);else{if(i>127&&i<2048)g+=String.fromCharCode(i>>6|192);else{g+=String.fromCharCode(i>>12|224);g+=String.fromCharCode(i>>6&63|128)}g+=String.fromCharCode(i&63|128)}}return g}(e);f=function(h){var g,
j=h.length;g=j+8;for(var i=((g-g%64)/64+1)*16,n=Array(i-1),l=0,k=0;k<j;){g=(k-k%4)/4;l=k%4*8;n[g]|=h.charCodeAt(k)<<l;k++}g=(k-k%4)/4;l=k%4*8;n[g]|=128<<l;n[i-2]=j<<3;n[i-1]=j>>>29;return n}(e);a=1732584193;b=4023233417;c=2562383102;d=271733878;for(e=0;e<f.length;e+=16){t=a;u=b;v=c;w=d;a=o(a,b,c,d,f[e+0],7,3614090360);d=o(d,a,b,c,f[e+1],12,3905402710);c=o(c,d,a,b,f[e+2],17,606105819);b=o(b,c,d,a,f[e+3],22,3250441966);a=o(a,b,c,d,f[e+4],7,4118548399);d=o(d,a,b,c,f[e+5],12,1200080426);c=o(c,d,a,b,f[e+
6],17,2821735955);b=o(b,c,d,a,f[e+7],22,4249261313);a=o(a,b,c,d,f[e+8],7,1770035416);d=o(d,a,b,c,f[e+9],12,2336552879);c=o(c,d,a,b,f[e+10],17,4294925233);b=o(b,c,d,a,f[e+11],22,2304563134);a=o(a,b,c,d,f[e+12],7,1804603682);d=o(d,a,b,c,f[e+13],12,4254626195);c=o(c,d,a,b,f[e+14],17,2792965006);b=o(b,c,d,a,f[e+15],22,1236535329);a=p(a,b,c,d,f[e+1],5,4129170786);d=p(d,a,b,c,f[e+6],9,3225465664);c=p(c,d,a,b,f[e+11],14,643717713);b=p(b,c,d,a,f[e+0],20,3921069994);a=p(a,b,c,d,f[e+5],5,3593408605);d=p(d,
a,b,c,f[e+10],9,38016083);c=p(c,d,a,b,f[e+15],14,3634488961);b=p(b,c,d,a,f[e+4],20,3889429448);a=p(a,b,c,d,f[e+9],5,568446438);d=p(d,a,b,c,f[e+14],9,3275163606);c=p(c,d,a,b,f[e+3],14,4107603335);b=p(b,c,d,a,f[e+8],20,1163531501);a=p(a,b,c,d,f[e+13],5,2850285829);d=p(d,a,b,c,f[e+2],9,4243563512);c=p(c,d,a,b,f[e+7],14,1735328473);b=p(b,c,d,a,f[e+12],20,2368359562);a=q(a,b,c,d,f[e+5],4,4294588738);d=q(d,a,b,c,f[e+8],11,2272392833);c=q(c,d,a,b,f[e+11],16,1839030562);b=q(b,c,d,a,f[e+14],23,4259657740);
a=q(a,b,c,d,f[e+1],4,2763975236);d=q(d,a,b,c,f[e+4],11,1272893353);c=q(c,d,a,b,f[e+7],16,4139469664);b=q(b,c,d,a,f[e+10],23,3200236656);a=q(a,b,c,d,f[e+13],4,681279174);d=q(d,a,b,c,f[e+0],11,3936430074);c=q(c,d,a,b,f[e+3],16,3572445317);b=q(b,c,d,a,f[e+6],23,76029189);a=q(a,b,c,d,f[e+9],4,3654602809);d=q(d,a,b,c,f[e+12],11,3873151461);c=q(c,d,a,b,f[e+15],16,530742520);b=q(b,c,d,a,f[e+2],23,3299628645);a=r(a,b,c,d,f[e+0],6,4096336452);d=r(d,a,b,c,f[e+7],10,1126891415);c=r(c,d,a,b,f[e+14],15,2878612391);
b=r(b,c,d,a,f[e+5],21,4237533241);a=r(a,b,c,d,f[e+12],6,1700485571);d=r(d,a,b,c,f[e+3],10,2399980690);c=r(c,d,a,b,f[e+10],15,4293915773);b=r(b,c,d,a,f[e+1],21,2240044497);a=r(a,b,c,d,f[e+8],6,1873313359);d=r(d,a,b,c,f[e+15],10,4264355552);c=r(c,d,a,b,f[e+6],15,2734768916);b=r(b,c,d,a,f[e+13],21,1309151649);a=r(a,b,c,d,f[e+4],6,4149444226);d=r(d,a,b,c,f[e+11],10,3174756917);c=r(c,d,a,b,f[e+2],15,718787259);b=r(b,c,d,a,f[e+9],21,3951481745);a=m(a,t);b=m(b,u);c=m(c,v);d=m(d,w)}return(s(a)+s(b)+s(c)+
s(d)).toLowerCase()},
  };
})

// uHunt default configurations. It should be overriden to "uhunt" in the main html.
.factory('uhunt_config', function (uhunt_util, uhunt_create_user) {
  var delta_time_amt = 0;

  var algorithmist = {};
  [ 119, 10058, 10306, 10341, 10672, 11235, 11292, 11450, 11506, 11512, 11517, 11947, 11974 ].forEach(function (num) {
    algorithmist[num] = true;
  });

  return {
    user            : uhunt_create_user(0),
    chat_room       : 'uhunt',
    api_url         : 'http://uhunt.felix-halim.net',
    web_url         : 'http://uhunt.felix-halim.net',
    // web_url         : 'http://localhost:8084',
    use_session     : true,
    max_livesubs    : 100,
    algorithmist    : algorithmist,
    livesub_url     : 'http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=19',
    problem_link    : function (num) { return 'http://uva.onlinejudge.org/external/' + Math.floor(num/100) + '/' + num + '.html'; },
    problem_classes : function (p) {
      if (p && this.user.uid) {
        var st = this.user.stats(p.pid);
        var ago = (uhunt_util.now() - st.last_sbt) / 60 / 60 / 24;
        return 'prob ' +
            (st.ac ? 'sub_ac' :
            st.ntry ? 'sub_wa' : 'sub_none') + ' ' + 
            ((ago <= 2) ? 'sub_2d' :
              (ago <= 7) ? 'sub_7d' :
              (ago <= 31) ? 'sub_1m' :
              (st.mrun == p.mrun)? 'sub_best' : '');
      }
      return 'prob sub_none';
    },
    'verdict_map' : {
       0: { name: "- In queue -",         short_name: "QU",   color: "#000000"}, // OT
      10: { name: "SubmissionErr",        short_name: "SE",   color: "#000000"}, // OT
      15: { name: "Can't be judged",      short_name: "CJ",   color: "#000000"}, // OT
      20: { name: "- In queue -",         short_name: "QU",   color: "#000000"}, // OT
      30: { name: "Compile error",        short_name: "CE",   color: "#AAAA00"},
      35: { name: "Restricted function",  short_name: "RF",   color: "#000000"}, // OT
      40: { name: "Runtime error",        short_name: "RE",   color: "#00AAAA"},
      45: { name: "Output limit",         short_name: "OL",   color: "#000066"},
      50: { name: "Time limit",           short_name: "TL",   color: "#0000FF"},
      60: { name: "Memory limit",         short_name: "ML",   color: "#0000AA"},
      70: { name: "Wrong answer",         short_name: "WA",   color: "#FF0000"},
      80: { name: "PresentationE",        short_name: "PE",   color: "#666600"},
      90: { name: "Accepted",             short_name: "AC",   color: "#00AA00"},
    },
    'language_map': {
      1: { name: 'ANSI C',  color: 'darkorange' },
      2: { name: 'Java',    color: 'red' },
      3: { name: 'C++',     color: 'blue' },
      4: { name: 'Pascal',  color: 'black' },
    },
    // To make sure the local time is later than server time (so no negative time shown).
    'delta_time': {
      get: function () { return delta_time_amt; },
      adjust: function (t) { delta_time_amt = Math.max(delta_time_amt || 0, t - uhunt_util.now()); },
    },
  };
})

// To communicate with uHunt API backend.
.factory('uhunt_rpc', function (uhunt_util, uhunt_config) {
  return {
    // Goes to uhunt.web_url. It is proprietary, do not use it!
    spoll: function(poll_sesid, ids, cb) { uhunt_util.http('GET', uhunt_config.web_url + '/poll/' + poll_sesid + '/' + JSON.stringify(ids), { }, cb); },
    whos_here: function(room, cb) { uhunt_util.http('GET', uhunt_config.web_url + '/chat/whos_here/' + room, { }, cb); },
    chat_post: function (poll_sesid, text, cb) { uhunt_util.http('POST', uhunt_config.web_url + '/chat/post/' + poll_sesid, { text: text }, cb); },
    vcontest_gen: function(c, cb) { uhunt_util.http('POST', uhunt_config.web_url + '/vcontest-gen', c, cb); },
    logout: function(poll_sesid, cb) { uhunt_util.http('POST', uhunt_config.web_url + '/chat/logout/' + poll_sesid, { }, cb); },
    login: function (poll_sesid, uname, digest, ts, invi, cb) { uhunt_util.http('POST', 
      uhunt_config.web_url + '/chat/login/' + poll_sesid + '/' + uname + '/' + digest + '/' + ts + '/' + invi, { }, cb); },

    // Goes to uhunt_config.api_url.
    uname2uid: function(uname, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/uname2uid/' + uname, { }, cb); },
    cpbook: function(version, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/cpbook/' + version, { }, cb); },
    poll: function(poll_id, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/poll/' + poll_id, { }, cb); },
    problem_by_num : function(pnum, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/p/num/' + pnum, { }, cb); },
    problems: function (cb) { uhunt_util.sync_http('GET', uhunt_config.api_url + '/api/p', { }, cb); },
    psubs: function (pids, sbt_lo, sbt_hi, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/p/subs/' + pids.join(',') + '/' + sbt_lo + '/' + sbt_hi, { }, cb); },
    psubs_limit: function (pid, sbt_lo, sbt_hi, limit, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/p/subs/' + pid + '/' + sbt_lo + '/' + sbt_hi + '/' + limit, { }, cb); },
    subs_since: function (uid, sid, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/subs-user/' + uid, { sid: sid }, cb); },
    subs_pids: function (uids, pids, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/subs-pids/' + uids.join(',') + '/' + pids.join(',') + '/0', { }, cb); },
    subs_nums : function(uids, pnums, cb){ uhunt_util.http('GET', uhunt_config.api_url + '/api/subs-nums/' + uids.join(',') + '/' + pnums.join(',') + '/0', { }, cb); },
    ranklist: function(uid, nabove, nbelow, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/ranklist/'+uid+'/'+nabove+'/'+nbelow, { }, cb); },
    pranknearby: function(pid, uid, nabove, nbelow, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/p/ranklist/'+pid+'/'+uid+'/'+nabove+'/'+nbelow, { }, cb); },
    prank: function(pid, start, count, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/p/rank/'+pid+'/'+start+'/'+count, { }, cb); },
    subs_count: function (pid, sbt, back, jump, cb) { uhunt_util.http('GET', uhunt_config.api_url + '/api/p/count/'+pid+'/'+sbt+'/'+back+'/'+jump, { }, cb); },
    solved_bits: function(unames, cb) {
      if (uhunt_util.parseInt(unames[0]) === unames[0]) {
        uhunt_util.http('GET', uhunt_config.api_url + '/api/solved-bits/' + unames.join(','), { }, cb);
      } else {
        uhunt_util.http('GET', uhunt_config.api_url + '/api/solved-bits', { unames: JSON.stringify(unames) }, cb);
      }
    },
  };
})

// Periodic polling to get updates for submissions and chats.
.factory('uhunt_poll', function ($timeout, $filter, uhunt, uhunt_util, uhunt_problems, uhunt_rpc) {
  var subs = [];              // Contains last submissions.
  var uhunt_chats = [];
  var out_of_sync = 0;
  var new_submissions_listeners = new uhunt_util.Listener();
  var new_session_listeners = new uhunt_util.Listener();

  var config = {
    poll_sesid: 0,
    live_submissions: subs,
    uhunt_chats: uhunt_chats,
    whos_here: { "users": [], "server":1366577487063, "count":0 },
    on_new_session: function (f) { new_session_listeners.listen(f); },
    on_new_submissions: function (f) { new_submissions_listeners.listen(f); },
    update_whos_here: whos_here,
    insert_sub: insert_sub,
  }

  var ids = { lastsubs: 0 };  // The last poll id.
  ids[uhunt.chat_room] = 0;

  (function start_poll() {
    if (uhunt_problems.ready()) { // Do initialize the poll when the problems are ready.
      poll(); // Start periodic poll.
      console.log('periodic poll started');
    } else {
      console.log('start_poll delayed');
      setTimeout(start_poll, 100);
    }
  })();

  function insert_sub(subs, sub, cap) {
    for (var i = 0; i < subs.length; i++) {
      if (sub.sid > subs[i].sid) return subs.splice(i, 0, sub);   // New submission.
      if (sub.sid == subs[i].sid) return subs[i] = sub;           // Update existing submission.
    }
    if (subs.length < cap) subs.push(sub);                   // New submission.
    if (subs.length > cap) subs.splice(subs.length, subs.length - cap);
  }

  function add_submission(sub) {
    // console.log(sub.id + ' ' + JSON.stringify(sub));
    if (ids.lastsubs && ids.lastsubs + 1 != sub.id) {
      console.error('lastsubs out of sync ' + (ids.lastsubs + 1) + ' != ' + sub.id);
      out_of_sync = 1;
    }
    ids.lastsubs = sub.id;
    if (typeof sub.sid !== 'number') return console.error('Invalid submission: ' + JSON.stringify(sub));
    sub.p = uhunt_problems.pid(sub.pid);
    uhunt.delta_time.adjust(sub.sbt);
    insert_sub(subs, sub, uhunt.max_livesubs);
  }

  function numbers_to_discussions(m) {
    var s = '', i, k, msg = m.split(' ');
    for (i = 0; i < msg.length; i++){
      var prefix = '', suffix = '';
      for (k = 0; k < msg[i].length; k++){
        var ch = msg[i].charAt(k);
        if (suffix.length > 0) { suffix += ch; }
        else if (('0'<=ch && ch<='9') || ('a'<=ch && ch<='z') || ('A'<=ch && ch<='Z')) { prefix += ch; }
        else { suffix += ch; }
      }
      if (i>0) { s += ' '; }
      if (uhunt_problems.num(prefix)){
        var p = uhunt_problems.num(prefix);
        s += '<a class="' + uhunt.problem_classes(p) + '" href="' + uhunt.problem_link(p.num) + '" target="_blank">' + p.num + '</a> (' +
          '<a href="http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=problem_stats&problemid=' + p.pid + '&category=24" target="_blank" class="nou">r</a>|' +
          '<a href="http://acm.uva.es/board/search.php?keywords=' + p.num + '" class="nou" target="_blank">d</a>)' + uhunt_util.escape_html(suffix);
      } else {
        s += uhunt_util.escape_html(msg[i]);
      }
    }
    return s;
  }

  function format_chat_message(chat) {
    if (chat.userid == 14031984) {
      var v = JSON.parse(chat.message);
      if (v.rank1pid) {
        var p = uhunt_problems.pid(v.rank1pid);
        if (p) {
          return chat.message = '<tt style="color:green; font-size:12px"><i>uHunt</i>&gt; ' +
            '<a href="#/id/' + v.uid + '" style="font-weight:bold; color: green; text-decoration:none">' + 
            uhunt_util.escape_html(v.uname) + '</a> gets <b>Rank 1</b> for ' +
            numbers_to_discussions(p.num + '') + (v.run? (' at ' + uhunt_util.format_ms(v.run) + 's') : '') + '</tt>';
        }
      } else {
        console.error(chat);
      }
    }
    return  chat.message = '<a target="_blank" style="text-decoration:none; font-weight:bold; font-style:italic" href="' + 
      '#/id/'+ chat.userid+'">' + uhunt_util.escape_html(chat.uname) + '</a>&gt; ' + numbers_to_discussions(chat.message);
  }

  function add_chat(chat) {
    format_chat_message(chat);
    if (ids[uhunt.chat_room] && ids[uhunt.chat_room] + 1 != chat.id) {
      // console.error('CHAT OUT OF SYNC ' + (ids[uhunt.chat_room] + 1) + ' != ' + chat.id);
    }
    ids[uhunt.chat_room] = chat.id;
    // console.log(chat);
    if (uhunt_chats.length < 1000) uhunt_chats.push(chat);
    if (uhunt_chats.length > 1000) uhunt_chats.splice(uhunt_chats.length, uhunt_chats.length - 1000);
  }

  function process1(data) {
    if (data['lastsubs']) {
      var arr = data['lastsubs'];
      var has_update = false;
      for (var i = 0; i < arr.length; i++) {
        add_submission(arr[i]);
        if (arr[i].uid == uhunt.user.uid) {
          uhunt.user.update(arr[i]);
          has_update = true;
        }
      }
      if (arr.length > 0) new_submissions_listeners.notify(arr);
      if (has_update) uhunt.user.notify_all();
      if (out_of_sync === 1) {
        out_of_sync = 2;
        uhunt_rpc.subs_since(uhunt.user.uid, uhunt.user.lastId(), function (res) {
          var arr = res.subs;
          for (var i = 0; i < arr.length; i++){ 
            var s = arr[i];
            uhunt.user.update({ sid:s[0], pid:s[1], ver:s[2], run:s[3], sbt:s[4], lan:s[5], rank:s[6] });
          }
          out_of_sync = 0;
          console.log('submissions is now in sync');
        });
      }
    }
    if (data[uhunt.chat_room]) {
      var arr = data[uhunt.chat_room];
      for (var i = 0; i < arr.length; i++) add_chat(arr[i]);
    }
  }

  function process2(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].type == 'lastsubs') add_submission(data[i].msg);
      else if (data[i].type == 'chat') add_chat(data[i].msg);
      else continue;
    }
    if (data.length > 0) poll_id = data[data.length - 1].id;
  }

  function since_cmp(a, b) {
    var A = a.uname.toLowerCase();
    var B = b.uname.toLowerCase();
    return A < B ? -1 : (A > B ? 1 : 0);
  }

  var whos_here_promise = true;
  function whos_here() { // Refresh every 1 minute.
    $timeout.cancel(whos_here_promise);
    uhunt_rpc.whos_here(uhunt.chat_room, function (data) {
      config.whos_here.count = data.count;
      config.whos_here.server = data.server;
      config.whos_here.users.length = 0;
      for (var uid in data) if (data.hasOwnProperty(uid)) {
        if (uid == 'count' || uid == 'server') continue;
        config.whos_here.users.push(data[uid]);
      }
      config.whos_here.users.sort(since_cmp);
      whos_here_promise = $timeout(whos_here, 60000);
    });
  }
  whos_here();

  function poll() { // Refresh every 1 second with long polling.
    if (uhunt.use_session) {
      uhunt_rpc.spoll(config.poll_sesid, ids, function (data) {
        if (config.poll_sesid != data.sesid) {
          config.poll_sesid = data.sesid;
          new_session_listeners.notify();
        }
        // console.log('poll ' + ids.lastsubs);
        process1(data.msgs);
        $timeout(poll, 1000);
      });
    } else {
      uhunt_rpc.poll(poll_id, function (data) {
        process2(data);
        $timeout(poll, 1000);
      });
    }
  };

  return config;
})


// Stores values that persist across page reload.
.factory('create_uhunt_db', function (uhunt_util) {

  function Database(prefix, new_keys) {
    this.prefix = prefix;
    this.keys = {};
    for (var key in new_keys) {
      if (new_keys.hasOwnProperty(key)) {
        this.keys[this.prefix + '-' + key] = new_keys[key];
      }
    }
  }

  Database.prototype.set = function (key, val) {
    key = this.prefix + '-' + key;
    if (val === null || val === undefined) {
      alert('Sets db to null/undefined for ' + key);
    }
    try {
      switch (this.keys[key]) {
        case 'int': localStorage[key] = val; break;
        case 'string': localStorage[key] = val; break;
        case 'bool': localStorage[key] = val ? '1' : '0'; break;
        case 'json': localStorage[key] = JSON.stringify(val); break;
        default: alert('Set key not defined: ' + key); break;
      }
    } catch (e) {
      console.error(JSON.stringify(e));
    }
  };

  Database.prototype.get = function (key) {
    key = this.prefix + '-' + key;
    switch (this.keys[key]) {
      case 'int': return uhunt_util.parseInt(localStorage[key]);
      case 'string': return localStorage[key];
      case 'bool': return localStorage[key] === '1';
      case 'json': 
        var val = localStorage[key];
        return val ? JSON.parse(localStorage[key]) : null;
      default: alert('Get key not defined: ' + key); break;
    }
  };

  Database.prototype.exists = function (key) {
    key = this.prefix + '-' + key;
    return localStorage[key] !== null && localStorage[key] !== undefined;
  }

  Database.prototype.unset = function (key) {
    localStorage.removeItem(this.prefix + '-' + key);
  };

  Database.prototype.scope_setter = function (scope, attrs) {
    var thisRef = this;
    attrs.forEach(function (attr) {
      scope['set_' + attr] = function (value) {
        thisRef.set(attr, value);
        scope[attr] = value;
      };
    });
  };

  var prefixes = [];
  return function (namespace, keys) {
    for (var i = 0; i < prefixes.length; i++) {
      if (prefixes[i].indexOf(namespace) === 0) {
        alert('Existing namespace "' + prefixes[i] + '" conflict with "' + namespace + '"');
        return false;
      } else if (namespace.indexOf(prefixes[i]) === 0) {
        alert('New namespace "' + namespace + '" conflict with "' + prefixes[i] + '"');
        return false;
      }
    }
    prefixes.push(namespace);
    return new Database(namespace, keys);
  };
})


.factory('uhunt_db', function (create_uhunt_db) {
  return create_uhunt_db('uhunt', {
    'probs': 'json',
    'last_problem_reload': 'int',
  });
})


// Provides the problem database.
.factory('uhunt_problems', function (uhunt_rpc, uhunt_db, uhunt_util) {
  var pid_key = {}; // index by pid
  var num_key = {}; // index by problem number (localid)
  var lastId = 0;   // the largest problem id
  var refresh = 0;
  var obj = {
    parse: parse,
    reload: reload,
    version: 0,

    ready: function () { return pid_key.hasOwnProperty(36); },

    level: function(dacu) { return 10 - Math.floor(Math.min(10, Math.log(dacu))); },

    // Returns the problem object by problem number.
    num: function(num){
      if (!num_key.hasOwnProperty(num)) { return false; }
      return num_key[num];
    },

    // Returns the problem object by problem id, if not exists.
    pid: function(pid) {
      if (!pid_key.hasOwnProperty(pid)) {
        // if (!pid) throw new Error('no pid');
        // console.error('pid does not exist: ' + pid);
        // throw new Error(pid);
        reload();
        return null;
       }
      return pid_key[pid];
    },

    // Returns the last problem id.
    lastId: function() { return lastId; },

    // Loop through all the problems.
    each: function(f) { for (var pid in pid_key) if (pid_key.hasOwnProperty(pid)) f(pid, pid_key[pid]); }
  };

  // Parse raw data from the API and update this wrapper.
  function parse(arr) {
    for (var i = 0; i < arr.length; i++){
      var a = arr[i], p = { pid:a[0], num:a[1], tit:a[2], dacu:a[3], mrun:a[4], mmem:a[5],
        nover:a[6], sube:a[7], cbj:a[8], inq:a[9], ce:a[10], rf:a[11], re:a[12],
        ole:a[13], tle:a[14], mle:a[15], wa:a[16], pe:a[17], ac:a[18], rtl:a[19], nos:0 };
      for (var j = 0; j < 13; j++) { p.nos += a[6 + j]; }
      p.panos = Math.floor(p.ac / p.nos * 100);
      pid_key[p.pid] = num_key[p.num] = p;
      lastId = Math.max(lastId, p.pid);
    }
  }

  // Refresh the global statistics of all problems.
  function reload() {
    if (refresh) return; else refresh = 1; // Prevent duplicate reloads.
    console.log('Reloading problems');
    uhunt_rpc.problems(function (arr) {
      parse(arr);
      uhunt_db.set('probs', arr);
      uhunt_db.set('last_problem_reload', uhunt_util.now());
      console.log('refreshed problems');
      refresh = 0;
      obj.version++;
    });
  }

  // Update problem statistics once a day.
  var last_problem_reload = uhunt_util.now() - uhunt_db.get('last_problem_reload');
  if (last_problem_reload < 0 || last_problem_reload > 1000 * 60 * 60 * (12 + Math.random() * 12)) reload();

  // Try initialize the problems from cache if exists.
  var problem_json = uhunt_db.get('probs');
  if (problem_json) {
    console.log('load problems from db');
    parse(problem_json);
  }

  return obj;
})


.directive('uhuntLanguage', function (uhunt) {
  return {
    template: '<span>{{language}}</span>',
    link: function (scope, element, attrs) {
      var lan = attrs.uhuntLanguage;
      scope.language = (!uhunt.language_map[lan] || !uhunt.language_map[lan].name) ? '- ? -' : uhunt.language_map[lan].name;
    }
  }
})

.directive('uhuntRuntime', function (uhunt_util) {
  return {
    template: '<span>{{runtime}}</span>',
    link: function (scope, element, attrs) {
      scope.runtime = uhunt_util.format_ms(uhunt_util.parseInt(attrs.uhuntRuntime));
    }
  };
})

.directive('uhuntBestRuntime', function (uhunt_util, uhunt_problems) {
  return {
    template: '<a target="_blank" class="nou" href="http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=problem_stats&problemid={{pid}}&category=24">{{run}}</a>',
    link: function (scope, element, attrs) {
      scope.pid = attrs.uhuntBestRuntime;
      if (!scope.pid) return;
      scope.run = uhunt_problems.ready() ? uhunt_util.format_ms(uhunt_problems.pid(scope.pid).mrun) : '';
    }
  };
})

.directive('uhuntRank', function () {
  return {
    template: '<span>{{rank}}</span>',
    link: function (scope, element, attrs) {
      scope.rank = (!attrs.uhuntRank || attrs.uhuntRank == '-1') ? '-' : attrs.uhuntRank;
    }
  };
})

.filter('uhunt_format_ago', function ($filter, uhunt, uhunt_util) {
  return function (sbt) {
    return uhunt_util.format_ago(sbt - uhunt.delta_time.get(), 2);
  };
})


.directive('uhuntNameUname', function () {
  return {
    scope: { name:'@', uname:'@', uid:'@', width:'@' },
    template: '<a class="ellipsis" style="margin-left:5px; width:{{width - 10}}px" target="_blank" href="/id/{{uid}}">{{name + " (" + uname + ")"}}</a>',
  };
})

.directive('uhuntVerdict', function (uhunt) {
  return {
    template: '<span style="font-weight:bold; color:{{ver.color}}">&nbsp;{{ver.name}}</span>',
    link: function (scope, element, attrs) {
      scope.ver = uhunt.verdict_map[attrs.uhuntVerdict];
    }
  };
})

.directive('uhuntProblemTitle', function (uhunt_problems, uhunt) {
  return {
    // replace: true,
    scope: { uhuntProblemTitle:'@', width:'@' },
    template:
      '<a class="ellipsis" style="margin-left:5px; width:{{width - 60 - algorithmist_width}}px; color:black;" target="_blank" ' +
        'href="http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem={{p.pid}}">' +
        '{{title}} ' +
      '</a>',
    link: function (scope, element, attrs) {
      scope.algorithmist_width = 0;
      if (uhunt_problems.ready() && (scope.p = uhunt_problems.pid(scope.uhuntProblemTitle))) {
        if (uhunt.algorithmist[scope.p.num]) {
          scope.algorithmist_width = 15;
        }
        scope.title = scope.p.tit;
      } else {
        scope.title = '--- ? ---'
      }
    }
  };
})

.directive('uhuntDiscuss', function (uhunt_problems, uhunt) {
  return {
    template:
      '<span ng-if="exists"><a class="nou" target="_blank" href="http://www.algorithmist.com/index.php/UVa_{{number}}">&pi;</a> | </span>' +
      '<a class="nou" target="_blank" href="http://acm.uva.es/board/search.php?keywords={{number}}">discuss</a>',
    link: function (scope, element, attrs) {
      scope.number = attrs.uhuntDiscuss;
      scope.exists = uhunt.algorithmist[scope.number];
    }
  };
})

.directive('uhuntProblem', function (uhunt_problems, uhunt) {
  return {
    template: '<a class="{{classes}}" href="{{link}}" target="_blank">{{number}}</a>',
    link: function (scope, element, attrs) {
      if (uhunt_problems.ready()) {
        var p = uhunt_problems.pid(attrs.uhuntProblem);
        scope.classes = p ? uhunt.problem_classes(p) : 'nou';
        scope.link = p ? uhunt.problem_link(p.num) : '#';
        scope.number = p ? p.num : ' - ';
      }
    }
  };
})


// Creates new User object that maintains its statistics.
.factory('uhunt_create_user', function (uhunt_util) {
  return function (uid) {
    var pid_key = {}; // index by pid, then by sid : pid_key[pid][sid] = {ver,run,mem,sbt,lan}
    var pid_stats = {}; // the stats of this pid : ac, nos, ntry, last_sbt, rank, first_ac_sbt, mrun, mmem
    var sid2pid = {}; // index by sid; sid2pid[sid] = pid
    var sids = [];
    var sorted_sids = true;  // the list of sids, and the sorted flag
    var name = false;
    var uname = false;
    var listener = new uhunt_util.Listener();

    function clear() {
      pid_key = {};
      pid_stats = {};
      sid2pid = {};
      sids = [];
      sorted_sids = true;
      name = false;
      uname = false;
    }

    function on(event, func) {
      if (event == 'update') listener.listen(func);
      if (sids.length) func(); // There has been update.
    }

    function notify_all() {
      console.log('uhunt_user.update ' + listener.listeners.length);
      listener.notify();
    }

    // retrieve the last submission id of the current user
    function lastId() { return (sids.length > 0) ? sids[sids.length-1] : 0; }

    function set_name(_name) { name = _name; }
    function set_uname(_uname) { uname = _uname; }

    // new submissions should update this wrapper using this method
    function update(s) {
      // console.log(s);
      if (!name) set_name(s.name);
      if (!uname) set_uname(s.uname);
      if (!pid_key[s.pid]) { pid_key[s.pid] = {}; }
      pid_stats[s.pid] = false;   // reset the stats when this pid is updated
      pid_key[s.pid][s.sid] = s;
      if (!sid2pid[s.sid]) {
        if (sorted_sids && s.sid < lastId()) { sorted_sids = false; }
        sids.push(s.sid);
      }
      sid2pid[s.sid] = s.pid;
    }

    // loop through all problem ids contained in this user's submissions
    function each_pid(pid, f) {
      if (typeof pid == 'function') {
        for (var i in pid_key) if (pid_key.hasOwnProperty(i)) pid(i);
      } else if (pid_key[pid]) {
        var sids = pid_key[pid];
        for (var sid in sids) if (sids.hasOwnProperty(sid)) f(sid, sids[sid]);
      }
    }

    // return a statistics of the problem submitted by the user
    function stats(pid) {
      if (pid_stats[pid]) { return pid_stats[pid]; }
      var st = { ac:false, nos:0, ntry:0, last_sbt:-1e100,
        rank:1e100, first_ac_sbt:1e100, mrun:1e100, mmem:1e100 };
      var p = pid_key[pid]; if (!p) { return st; }
      var sid;
      for (sid in p){
        var s = p[sid];
        st.nos++;
        st.last_sbt = Math.max(st.last_sbt, s.sbt);
        if (s.ver === 90){ // 90 means accepted
          st.ac = true;
          st.first_ac_sbt = Math.min(st.first_ac_sbt, s.sbt);
          st.mrun = Math.min(st.mrun, s.run);
  //        st.mmem = Math.min(st.mmem, s.mem);
          st.rank = Math.min(st.rank, s.rank);
        }
      }
      if (!st.ac) { st.ntry = st.nos; } // all the subs are the number of try
      else { each_pid(pid, function(sid,s){ if (s.sbt < st.first_ac_sbt) { st.ntry++; } }); } // ntry before ac
      pid_stats[pid] = st;
      return st;
    }

    // the number of submissions of the user
    function nos(){ return sids.length; }

    // the histogram of various verdicts
    function substats_count() {
      var cnt = {}, pid, sid;
      for (pid in pid_key) if (pid_key.hasOwnProperty(pid)) {
        var p = pid_key[pid];
        for (sid in p){
          var s = p[sid];
          if (!cnt[s.ver]) { cnt[s.ver] = 0; }
          cnt[s.ver]++;
        }
      }
      return cnt;
    }

    // loop through the last 'n' submissions of this user
    function each_last_subs(n, f) {
      if (!sorted_sids){
        sorted_sids = true;
        sids.sort(function(a,b){ return a-b; });
      }
      var i;
      for (i=0; i<n && i<sids.length; i++){
        var sid = sids[sids.length-i-1];
        var pid = sid2pid[sid];
        f(i, sid, pid, pid_key[pid][sid]);
      }
    }

    return {
      uid: uid,
      on: on,
      update: update,
      clear: clear,
      notify_all: notify_all,
      lastId: lastId,
      each_pid: each_pid,
      stats: stats,
      nos: nos,
      substats_count: substats_count,
      each_last_subs: each_last_subs,
      set_name: set_name,
      set_uname: set_uname,
      name: function(){ return name; },
      uname: function(){ return uname; }
    };
  };
})

.directive('uhuntBar', function () {
  return {
    replace: true,
    scope: { width: '@', percent: '@', color: '@', height: '@' },
    template:
      '<table cellpadding="0" cellspacing="0">\
        <tr height="{{height}}">\
          <td width="{{ (Math.floor(percent / 10) / 10) * width}}" style="" bgcolor="{{color}}"></td>\
          <td style="border: 1px solid {{color}}"></td>\
        </tr>\
      </table>',
    link: function (scope, element, attrs) { scope.Math = Math; },
  };
})

;
