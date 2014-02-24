'use strict';

angular.module('uHunt.series', ['uHunt.base'])

.factory('series_db', function (create_uhunt_db) {
  return create_uhunt_db('series', {
    'path': 'string',
    'index': 'int',
    'user_filter': 'json',
    'user_filter_chk': 'bool',
    'highlight_uids_chk': 'bool',
  // 'livesubs_table_display': 'bool',
  // 'show_live_submissions': 'int',
  });
})

.directive('uhuntSessionSummary', function (series_db, uhunt_util, uhunt_series_session) {
  return {
    scope: {},
    template: '<table width="100%" style="border: 1px solid gray; margin:0 0 7px 0; font-size:15px" cellspacing="0" cellpadding="4">\
      <thead>\
        <tr class="tablebar">\
        <th width="50" style="font-size:13px">#\
        <th width="180" style="font-size:13px" align="left">User (username)\
        <th width="70" style="font-size:13px">Solved\
        <th ng-repeat="s in uhunt_series_session.sessions" style="font-size:13px">#{{$index + 1}}</th>\
      </thead>\
      <tbody ng-bind-html-unsafe="summary"></tbody>\
      </table>\
    ',
    link: function (scope, element, attrs) {
      scope.uhunt_series_session = uhunt_series_session;
      scope.$watch('uhunt_series_session.loaded', load_summary_ranklist);

      function total_cmp(a, b) { return b.total - a.total; }
      function load_summary_ranklist(o, n) {
        if (uhunt_series_session.length != uhunt_series_session.loaded) return;
        var users = {};
        for (var i = 0; i < uhunt_series_session.length; i++) {
          var u = uhunt_series_session.sessions[i].users;
          for (var uid in u) if (u.hasOwnProperty(uid)) {
            var user = u[uid], ac = 0;
            user.each_pid(function (pid) { if (user.stats(pid).ac) ac++; });
            if (!users[uid]) users[uid] = { solved:[], total:0 };
            users[uid].uid = uid;
            users[uid].name = user.name();
            users[uid].uname = user.uname();
            users[uid].solved[i] = ac;
            users[uid].total += ac;
          }
        }
        var arr = [], s = '';
        for (var uid in users) if (users.hasOwnProperty(uid)) arr.push(users[uid]);
        arr.sort(total_cmp);
        for (var i = 0; i < arr.length; i++) {
          var u = arr[i];
          s += '<tr><td align="center">' + (i+1) + '<td><a class="ellipsis" style="width:165px" uid="' + u.uid +
            '" target="_blank" href="/id/' + u.uid + '">' + u.name + ' (' + u.uname + ')</a>';
          s += '<td align="center" style="font-weight:bold">' + u.total;
          for (var j = 0; j < uhunt_series_session.length; j++)
            s += '<td align="center">' + (u.solved[j] || 0);
        }
        scope.summary = s;
      }
    }
  };
})

.directive('uhuntSession', function (series_db, uhunt_util, uhunt_series_session) {
  return {
    transclude: true,
    scope: {},
    templateUrl: 'partials/session.html',
    link: function (scope, element, attrs) {

      scope.session = uhunt_series_session.create(attrs.problemNumbers.split(','), scope.$eval(attrs.startSbt), scope.$eval(attrs.endSbt));
      scope.problems = uhunt_series_session.sessions[scope.session.id].problems;

      function ranklist_filter(highlight, filter) {
        var conf = series_db.get('user_filter');
        if (!conf) return;
        var highlighted = '';
        uhunt_series_session.user_filter = {};
        for (var i = 0; i < conf.length; i++) {
          var c = conf[i].split(' ');
          for (var j = 1; j < c.length; j++) {
            var uid = uhunt_util.parseInt(c[j]);
            if (filter) uhunt_series_session.user_filter[uid] = true;
            if (highlight) highlighted += 'a[uid="'+uid+'"] { font-weight: bold; color: ' + c[0] + '; }\n';
          }
        }
        // console.log(JSON.stringify(uhunt_series_session.user_filter));
        // console.log(highlighted);
        $('#uhunt_series_ranklist_style').html(highlighted);
        series_db.set('highlight_uids_chk', highlight);
        series_db.set('user_filter_chk', filter);
        for (var sesid in uhunt_series_session.sessions)
          if (uhunt_series_session.sessions.hasOwnProperty(sesid)) {
            var s = uhunt_series_session.sessions[sesid];
            s.update_ranklist();
          }
      }

      var highlight = series_db.exists('highlight_uids_chk') ? series_db.get('highlight_uids_chk') : true;
      ranklist_filter(highlight, series_db.get('user_filter_chk'));

      // TODO: remove hack.
      uhunt_util.ranklist_filter = ranklist_filter;

      function problem_link_color_update() {
        if (!series_db.get('logged-in')) return;
        console.log('update problem colors');
        $('a[num]').each(function (i, el) { uhunt.util.apply_color_class(el); });
      }

      scope.uhunt_series_session = uhunt_series_session;
    }
  };
})

.factory('uhunt_series_session', function (uhunt_problems, series_db, uhunt_rpc, uhunt_poll, uhunt, uhunt_create_user, uhunt_util) {
  var config = {
    length: 0,
    loaded: 0,
    create: create,
    sessions: {},
  };

  function create(problem_numbers, sbt_lo, sbt_hi) {
    var session = {
      id: config.length++,
      problems: [],
      problem_filter: {},
      user_filter: {},
      sbt_lo: Math.floor(sbt_lo / 1000),
      sbt_hi: Math.floor(sbt_hi / 1000),
      users: {}, // For user ranklist.
      ranklist: [],
      live_submissions: [],
      update_ranklist: update_ranklist
    };

    config.sessions[session.id] = session;

    var pids = [], t1 = new Date().getTime();
    for (var i = 0; i < problem_numbers.length; i++) {
      var p = uhunt_problems.num(problem_numbers[i].trim());
      session.problems.push(p);
      session.problem_filter[p.pid] = true;
      pids.push(p.pid);
    }

    function sbt_cmp(a, b) { return a.sbt - b.sbt; }

    function new_submissions(subs) {
      var has_update = false;
      for (var i = 0; i < subs.length; i++) {
        var s = subs[i];
        if (!session.problem_filter[s.pid] || s.sbt < session.sbt_lo || session.sbt_hi < s.sbt) continue;
        uhunt.delta_time.adjust(s.sbt);
        uhunt_poll.insert_sub(session.live_submissions, s, 100);
        if (!session.users[s.uid]) session.users[s.uid] = uhunt_create_user(s.uid);
        session.users[s.uid].update(s);
        has_update = true;
      }
      if (has_update) update_ranklist();
    }

    uhunt_poll.on_new_submissions(new_submissions);
    uhunt_rpc.psubs(pids, session.sbt_lo, session.sbt_hi, function (subs) {
      config.loaded++;
      var t2 = new Date().getTime();
      subs.sort(sbt_cmp);
      new_submissions(subs);
      var t3 = new Date().getTime();
      console.log('session[%d] = %d, RPC %d, SUBS %d', session.id, subs.length, t2-t1, t3-t2);
    });

    function ac_pen_cmp(a, b) { return (a[0] != b[0]) ? (b[0] - a[0]) : (a[1] - b[1]); }
    function digit(t) { t = Math.floor(t); return (t < 10) ? ('0' + t) : t; };
    function format_dhms(t, detail){
      var ret = '', day = false;
      if (t >= 60*60*24) {
        ret += Math.floor(t / 60/60/24) + 'd';
        t %= 60*60*24;
        day = true;
      }
      if (!detail && day) { return ret; }
      ret += digit(t / 60/60);
      if (!day) {
        t %= 60*60;
        ret = ret + ':' + digit(t / 60);
      }
      return ret;
    }

    function update_ranklist() {
      var arr = [], filter = series_db.get('user_filter_chk');
      for (var uid in session.users) if (session.users.hasOwnProperty(uid)) {
        var u = session.users[uid], nac = 0, pen = 0, row = '';
        var bold = (uhunt.user.uid == uid) ? ' style="font-weight:bold" ' : '';
        if (filter && !config.user_filter[uid]) continue;
        for (var i = 0; i < session.problems.length; i++) {
          var p = u.stats(session.problems[i].pid);
          if (p.ac) {
            var cur_pen = p.first_ac_sbt - session.sbt_lo + p.ntry * 20 * 60; // 20 minutes penalty for every wrong try
            pen += cur_pen;
            row += "<td align=center nowrap "+bold+">" + format_dhms(cur_pen, false) + (p.ntry? ("(" + p.ntry + ")") : '');
            nac++;
          } else if (p.ntry) {
            row += "<td align=center style='color:orange' "+bold+"> (" + p.ntry + ")";
          } else {
            row += "<td align=center "+bold+">-";
          }
        }
        arr.push([nac, pen, '<td>&nbsp;<a class="ellipsis" style="width:145px" uid="'+ uid +'" target="_blank" href="/id/' + 
            uid + '">' + u.name() + ' (' + u.uname() + ')</a><td align=right style="padding-right:10px" nowrap ' + 
            bold +'><b>' + nac + '</b> / ' + format_dhms(pen, true) + row]);
      }
      arr.sort(ac_pen_cmp);
      var s = '';
      for (var i = 0; i < arr.length; i++)
        s += '<tr><td align="center">' + (i + 1) + arr[i][2];
      session.ranklist = s;
    };
    return session;
  }
  return config;
})

.directive('uhuntSessionLivesubs', function (livesubs_db, uhunt, uhunt_series_session) {
  return {
    scope: { uhuntSessionLivesubs:'@' },
    templateUrl: 'partials/livesubs.html',
    link: function (scope, element, attrs) {
      scope.limit = livesubs_db.get('limit') || 5;
      scope.show = livesubs_db.exists('show') ? livesubs_db.get('show') : true;
      livesubs_db.scope_setter(scope, ['limit', 'show']);
      scope.live_submissions = uhunt_series_session.sessions[scope.uhuntSessionLivesubs].live_submissions;
      scope.livesub_url = uhunt.livesub_url;
    }
  }
})

    // if (series_db.get('logged-in')) {
    //   uhunt.rpc.subs_pids([series_db.get('logged-in')], interesting_pids_vector, function (res) {
    //     var subs = res[series_db.get('logged-in')];
    //     if (!subs || !subs.subs) {
    //       console.log("Cannot get user subs %d", series_db.get('logged-in'));
    //       return;
    //     }
    //     subs = subs.subs;
    //     for (var i = 0; i < subs.length; i++) {
    //       var s = subs[i];
    //       uhunt.subs.update({ sid: s[0], pid: s[1], ver: s[2], run: s[3], sbt: s[4], lan: s[5], rank: s[6] });
    //       // console.log('pid ' + uhunt.probs.pid(s[1]).num + ' ver ' + s[2]);
    //     }
    //     console.log('uhunt.subs for %d updated, cnt = %d', series_db.get('logged-in'), cnt);
    //     if (--cnt == 0) problem_link_color_update('));
    //   });
    // }

.factory('livesubs_db', function (create_uhunt_db) {
  return create_uhunt_db('livesubs', {
    'show': 'bool',
    'limit': 'int',
  });
})


;
/*

  function update_ranklist_status(index, ser) {
    var status = '', ser = series.series[index], c = uhunt.util.now();
    if (ser.start_sbt > c){
      var t = uhunt.tpl.format_time_v(ser.start_sbt - c, 1);
      if (t===false) status = 'Contest start date: ' + uhunt.tpl.format_date(ser.start_sbt);
      else status = 'Will start in: ' + t;
    }
    else if (ser.end_sbt < c) status = 'Contest has ended';
    else {
      var t = uhunt.tpl.format_time_v(ser.end_sbt - c, 1);
      if (t===false) status = 'Contest end date: ' + uhunt.tpl.format_date(ser.end_sbt);
      else status = 'Time remaining: <font color=yellow>' + t + '</font>';
    }
    $('#uhunt_widget_contest_status_' + index).html(status);
  }
*/
