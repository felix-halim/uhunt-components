angular.module('uHunt.statistics', ['uHunt.base'])

.factory('statistics_db', function (create_uhunt_db) {
  return create_uhunt_db('statistics', {
    'last_n': 'int',
    'show_all': 'bool',
  });
})


.directive('uhuntStatistics', function ($location, uhunt, uhunt_rpc, uhunt_util, statistics_db, uhunt_problems) {
  return {
    replace: true,

    templateUrl: 'partials/statistics.html',

    link: function (scope, element, attrs) {
      scope.name = uhunt.user.name();
      scope.username = uhunt.user.uname();

      scope.show_all = statistics_db.get('show_all'); 
      if (scope.show_all != 'less' && scope.show_all != 'more')
        scope.show_all = 'less';

      scope.uhunt_problems = uhunt_problems;
      scope.$watch('uhunt_problems.version', refresh);

      var solved_problems = [], tried = [];

      scope.set_last_n = function (n) {
        n = n || statistics_db.get('last_n');
        statistics_db.set('last_n', n);
        var s = [];
        var no_p = {}, has_p = uhunt_problems.ready();
        uhunt.user.each_last_subs(n = n || 5, function (i, sid, pid, sub) {
          sub.p = has_p ? uhunt_problems.pid(pid) : no_p;
          s.push(sub);
        });
        scope.last_submissions = s;
      };

      scope.update_solved_problems = function (show_all) {
        if (show_all) statistics_db.set('show_all', scope.show_all = show_all);
        var s = '';
        var n = Math.min((scope.show_all == 'less') ? 500 : 1e10, solved_problems.length);
        for (var i = 0; i < n; i++) {
          var p = solved_problems[i];
          s += '<a style="text-decoration:none;" class="' + uhunt.problem_classes(p) + 
               '" href="' + uhunt.problem_link(p.num) + '" target="_blank">' + p.num + '</a> ';
        }
        scope.solved_problems = s;
        scope.show_more = (scope.show_all == 'less' && solved_problems.length > 500);
      };

      function num_cmp(a,b){ return a.num - b.num; }

      uhunt.user.on('update', refresh);
      function refresh() {
        console.log('statistics refresh ' + uhunt.user.nos());
        scope.name = uhunt.user.name();
        scope.username = uhunt.user.uname();
        solved_problems = []; tried = [];
        uhunt_problems.each(function(pid, p) {
          p.st = uhunt.user.stats(pid);
          if (p.st.ac) solved_problems.push(p);
          else if (p.st.ntry > 0) tried.push(p);
        });
        tried.sort(num_cmp);
        solved_problems.sort(num_cmp);
        scope.update_solved_problems();
        var s = '';
        for (var i = 0; i < tried.length; i++) {
          var p = tried[i];
          s += '<a style="text-decoration:none;" class="' + uhunt.problem_classes(p) + 
               '" href="' + uhunt.problem_link(p.num) + '" target="_blank">' + p.num + '</a> ';
        }
        scope.tried_problems = s;
        scope.tried = tried;
        scope.n_solved = solved_problems.length;
        scope.n_submissions = uhunt.user.nos();
        scope.set_last_n();
      }
    }
  };
})

.factory('uhunt_progress_renderer', function (uhunt_rounded_rectangle, uhunt_util) {
  return function (canvas, title, first_sbt, inc_amt, uhunt_util) {
    if (!canvas.getContext) return false;
    var width = canvas.width, height = canvas.height;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "#EEEEEE";
    uhunt_rounded_rectangle(ctx,width,height,10);

    var x1 = 15.5, x2 = width-37, y1 = 30.5, y2 = height-18.5;
    ctx.textAlign = 'center';
    var len = 0;
    for (var i = 0; i < inc_amt.length; i++) len += inc_amt[i];
    if (len == 0){
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("No Progress Yet", x1+30, y1+60);
      return false;
    }

    var start = first_sbt[0], end = uhunt_util.now();
    var ylen = y2 - y1, ygap = ylen / len;
    var xlen = x2 - x1, tlen = Math.max(1, end - start);

    // Year Grid
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "black";
    ctx.beginPath();
    for (var Y=new Date().getFullYear(), i=0; i<100; i++,Y--){
      var time = Math.floor(new Date(Y, 0, 1, 1, 1, 1, 1).getTime()/1000);
      if (start <= time && time <= end){
        var x = x1 + ((time-start)/tlen) * xlen;
        x = Math.floor(x) + 0.5;
        ctx.moveTo(x,y1); ctx.lineTo(x,y2);
        ctx.moveTo(x,y1); ctx.lineTo(x,y2);
        var year = Y%100;
        if (year < 10) year = '0'+year;
        ctx.fillText(year, x-1, y2+11, 20);
      } else if (time < start) break;
    }
    ctx.strokeStyle = "#CCCCCC";
    ctx.stroke();

    // Number of AC grid
    ctx.beginPath();
    ctx.textAlign = 'left';
    ctx.textBaseLine = 'middle';
    var inc = Math.floor(len / 7 + 1);
    for (var Y=0; Y<len; Y+=inc){
      var yy = Math.floor(y2 - (Y/len) * ylen) + 0.5;
      ctx.moveTo(x1,yy); ctx.lineTo(x2,yy);
      if (Y) ctx.fillText(Y >= 1e5 ? (Math.floor(Y*1e-3)+'K') : Y, x2+3, yy+3);
    }
    ctx.moveTo(x1,y1); ctx.lineTo(x2,y1);
    ctx.strokeStyle = "#CCCCCC";
    ctx.stroke();

    ctx.beginPath();
    var prevX = -1, prevY = -1, counter = 0, time = first_sbt[0];
    for (var i=0; i<=len; i++){
      var nx = Math.floor(x1 + ((time-start)/tlen) * xlen) + 0.5;
      var ny = Math.floor(y2 - (ygap*counter)) + 0.5;
      if (prevX!=nx){
        if (prevX==-1) ctx.moveTo(nx,ny);
        else ctx.lineTo(nx,ny);
      }
      prevX = nx;
      prevY = ny;
      if (i == len) break;
      time = first_sbt[i];
      counter += inc_amt[i];
    }
    if (prevX != x2) ctx.lineTo(x2,prevY);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = '#0000FF';
    ctx.fillText(len >= 1e5 ? (Math.floor(len*1e-3) + 'K') : len, x2+3, y1+3);

    ctx.textAlign = 'center';
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = '#000';
    ctx.fillText(title, (width) / 2, y1-12);
  };
})

.directive('progressStatistics', function (uhunt, uhunt_problems, uhunt_util, uhunt_progress_renderer) {
  return function (scope, element, attrs) {
    scope.uhunt_problems = uhunt_problems;
    scope.$watch('uhunt_problems.version', refresh);
    uhunt.user.on('update', refresh);
    function refresh() {
      console.time('progressStatistics');
      var first_ac_sbt = [], inc_amt = [];
      uhunt_problems.each(function (pid) {
        var s = uhunt.user.stats(pid);
        if (s.ac) {
          first_ac_sbt.push(s.first_ac_sbt);
          inc_amt.push(1);
        }
      });
      first_ac_sbt.sort(function(a,b){ return a-b; });
      uhunt_progress_renderer(element[0], 'Progress over the Years', first_ac_sbt, inc_amt, uhunt_util);
      console.timeEnd('progressStatistics');
    }
  };
})

.directive('problemProgressStatistics', function (uhunt_problems, uhunt_rpc, uhunt_util, uhunt_progress_renderer) {
  return function (scope, element, attrs) {
    scope.uhunt_problems = uhunt_problems;
    scope.$watch('uhunt_problems.version', refresh);
    scope.$watch(attrs.problemProgressStatistics, refresh);
    function refresh() {
      console.time('problemProgressStatistics');
      var number = scope.$eval(attrs.problemProgressStatistics);
      var p = uhunt_problems.num(number);
      if (!p) return;
      var sbt = uhunt_util.now(), back = 50, jump = 3;
      uhunt_rpc.subs_count(p.pid, sbt, back, jump, function (inc_amt) {
        if (inc_amt.length != 51) console.error('length expected ' + back + ', observed ' + inc_amt.length);
        var first_sbt = [], onemo = 60 * 60 * 24 * 30;
        for (var i = 0; i <= back; i++) first_sbt.push(sbt - (back - i) * onemo * jump);
        uhunt_progress_renderer(element[0], 'Submissions over the Years', first_sbt, inc_amt, uhunt_util);
        console.timeEnd('problemProgressStatistics');
      });
    }
  };
})

.directive('problemSubmissionStatistics', function (uhunt_problems, uhunt_statistics_renderer) {
  return function (scope, element, attrs) {
    scope.$watch(attrs.problemSubmissionStatistics, function () {
      var number = scope.$eval(attrs.problemSubmissionStatistics);
      var p = uhunt_problems.num(number);
      if (!p) return;
      var cnt = {OT:0};
      ['AC','PE','WA','TL','ML','CE','RE'].forEach(function (sname) {
        cnt[sname] = 0;
        switch (sname) {
          case 'TL' : cnt[sname] = p.tle; break;
          case 'ML' : cnt[sname] = p.mle; break;
          default : cnt[sname] = p[sname.toLowerCase()];
        }
      });
      ['SE','CJ','QU','RF','OL'].forEach(function (sname) {
        switch (sname) {
          case 'SE' : cnt['OT'] += p.sube; break;
          case 'CJ' : cnt['OT'] += p.cbj; break;
          case 'QU' : cnt['OT'] += p.inq; break;
          case 'OL' : cnt['OT'] += p.ole; break;
          default : cnt['OT'] += p[sname.toLowerCase()];
        }
      });
      uhunt_statistics_renderer(element[0], cnt);
    });
  };
})

.factory('uhunt_statistics_renderer', function (uhunt, uhunt_rounded_rectangle, uhunt_sname2code) {
  return function (canvas, cnt) {
    if (!canvas.getContext) return false;
    var width = canvas.width, height = canvas.height;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "#EEEEEE";
    uhunt_rounded_rectangle(ctx,width,height,10);

    ctx.textAlign = 'center';

    var padding = 10, gap = 3;
    var x1 = padding + 0.5, x2 = width - padding + 0.5;
    var y1 = padding + 0.5, y2 = height - padding - 8.5;
    ctx.beginPath();
    ctx.moveTo(x1,y2); ctx.lineTo(x2,y2);
    ctx.strokeStyle = 'black';
    ctx.stroke(); // baseline

    var order = ['AC','PE','WA','TL','ML','CE','RE','OT'];
    var ncnt = [], maxcnt = 0, sumcnt = 0, fcolor = [];
    for (var o=0; o<order.length; o++){
      var code = uhunt_sname2code[order[o]];
      var color = code? uhunt.verdict_map[code].color : '#000';
      fcolor.push(color);
      if (!cnt[order[o]]) cnt[order[o]] = 0;
      ncnt.push(cnt[order[o]]);
      maxcnt = Math.max(maxcnt, cnt[order[o]]);
      sumcnt += cnt[order[o]];
    }
    if (maxcnt == 0){
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('No Submission Yet', width/2, y1+50);
      return false;
    }

    // draw the bars
    var barsize = (x2-x1-padding-(gap*(order.length-1))) / order.length;
    for (var i=0; i<order.length; i++){
      var x = x1 + padding/2 + i*barsize + i*gap;
      var h = Math.ceil((ncnt[i] / maxcnt) * (y2-y1-30));
      ctx.fillStyle = fcolor[i];
      ctx.strokeStyle = fcolor[i];
      ctx.fillRect(x, y2-h-0.5, barsize, h);
      var LO = cnt[order[i]]>0? Math.log(cnt[order[i]]) : 0;
      var d = Math.ceil(LO / Math.log(10));
      var a = (barsize - d*5) / 2;
      ctx.font = '9px sans-serif';
      ctx.fillText(cnt[order[i]], x+(barsize/2), y2-h-6);
      ctx.fillText(order[i], x+(barsize/2), y2+10);
    }
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Submissions Statistics', width/2, y1+7);
  }
})

.directive('submissionStatistics', function (uhunt, uhunt_statistics_renderer, uhunt_sname2code) {
  return function (scope, element, attrs) {
    uhunt.user.on('update', function () {
      console.time('submissionStatistics');
      var cc = uhunt.user.substats_count(), cnt = {OT:0};
      ['AC','PE','WA','TL','ML','CE','RE'].forEach(function (sname) {
        var code = uhunt_sname2code[sname];
        if (code) cnt[sname] = cc[code];
      });
      ['SE','CJ','QU','RF','OL'].forEach(function (sname) {
        var code = uhunt_sname2code[sname];
        if (code && cc[code]) cnt['OT'] += cc[code];
      });
      uhunt_statistics_renderer(element[0], cnt);
      console.timeEnd('submissionStatistics');
    });
  };
})

.factory('uhunt_sname2code', function (uhunt) {
  var sname2code = {};
  for (var code in uhunt.verdict_map)
    sname2code[uhunt.verdict_map[code].short_name] = code;
  return sname2code;  
})

.factory('uhunt_rounded_rectangle', function () {
  return function (ctx, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(radius,0);
    ctx.lineTo(width-radius,0);
    ctx.bezierCurveTo(width,0, width,0, width,radius);
    ctx.lineTo(width, height-radius);
    ctx.bezierCurveTo(width,height, width,height, width-radius,height);
    ctx.lineTo(radius,height);
    ctx.bezierCurveTo(0,height, 0,height, 0,height-radius);
    ctx.lineTo(0,radius);
    ctx.bezierCurveTo(0,0, 0,0, radius,0);
    ctx.fill();
  }
})

;