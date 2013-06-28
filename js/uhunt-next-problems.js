angular.module('uHunt.next-problems', ['uHunt.base'])

.factory('nextp_db', function (create_uhunt_db) {
  return create_uhunt_db('nextp', {
    'sort_desc': 'bool',
    'sort_column': 'string',
    'np_view_which': 'int',
    'selected_volume': 'int',
    'show_next_problems': 'int',
  });
})

.directive('uhuntNextProblems', function (uhunt_rpc, nextp_db, uhunt_util, uhunt_poll, uhunt, uhunt_problems) {
  return {
    replace: true,
    // scope: { number:'=uhuntProblemSearch', show:'=', hide:'=', search:'=', },
    templateUrl: 'partials/next-problems.html',
    link: function (scope, element, attrs) {
      console.time('NextProblemsCtrl');
      // 0:pid, 1:localid, 2:title, 3:dacu, 4:min_runtime, 5:min_memory, 6:ac, 7:nos, 8:panos, 9:run, 10:diff

      function valid_column(){
        var av_cols = ['pid','num','tit','dacu','mrun','mmem','ac','nos','panos','run','diff'];
        for (var i = 0; i < av_cols.length; i++)
          if (nextp_db.get('sort_desc') == av_cols[i]) return true;
        return false;
      }

      if (!valid_column()) nextp_db.set('sort_column', 'dacu');
      scope.sort_desc = nextp_db.get('sort_desc') || true;
      scope.sort_column = nextp_db.get('sort_column');
      scope.view_which = nextp_db.get('np_view_which') || 0; // 0:unsolved, 1:solved, 2:both
      scope.volume = nextp_db.get('selected_volume') || 0;

      // if (view_which == 0) $('#npv_unsolved').css('color', 'lightgreen');
      // else if (view_which == 1) $('#npv_solved').css('color', 'lightgreen');
      // else $('#npv_both').css('color', 'lightgreen');

      scope.max_next_problems = nextp_db.get('show_next_problems') || 25;
      scope.set_max_next_problems = function (n) {
        nextp_db.set('show_next_problems', n);
        scope.max_next_problems = n;
      };

      function next_comparator(a, b) {
        if (a[scope.sort_column] == undefined) return 1;
        if (b[scope.sort_column] == undefined) return -1;
        var x = a[scope.sort_column], y = b[scope.sort_column];
        var c = (x < y) ? -1 : ((x > y)? 1 : 0);
        return scope.sort_desc? -c : c;
      }

      scope.set_which = function (idx) {
        nextp_db.set('np_view_which', scope.view_which = idx);
        scope.show_table();
      }

      scope.sort_next_by = function (sc) {
        if (scope.sort_column == sc){
          scope.sort_desc = !scope.sort_desc;
          nextp_db.set('sort_desc', scope.sort_desc);
        } else {
          scope.sort_column = sc;
          nextp_db.set('sort_column', scope.sort_column);
        }
        scope.show_table();
      };

      function show(n) {
        n = Math.min(100, Math.max(25, uhunt_util.parseInt(n)));
        nextp_db.set('show_next_problems', n);
        scope.show_table();
      }

      var volumes = {}, volume_all = [], volume_ac = {}, volume_list = [], next_comparator;

      scope.column_color = function (sc, color) {
        return scope.sort_column == sc ? color : '';
      };

      scope.show_table = function (v) {
        if (v === undefined) v = scope.volume;
        nextp_db.set('selected_volume', v);
        scope.volume = v;
        scope.volume_name = v==0?'ALL':('v'+v);
        scope.colspan = (scope.view_which == 0) ? 8 : 11;
        var vids = (v == 0)? volume_all : volumes[v], cands = [];
        for (var i = 0; i < vids.length; i++) switch (scope.view_which) {
          case 0 : if (!uhunt.user.stats(vids[i].pid).ac) cands.push(vids[i]); break; // unsolved
          case 1 : if ( uhunt.user.stats(vids[i].pid).ac) cands.push(vids[i]); break; // solved
          default: cands.push(vids[i]); // both
        }
        cands.sort(next_comparator);
        for (var i = 0; i < cands.length; i++){
          var p = cands[i];
          p.color = (i%2)? (scope.sort_desc? '#BBEEBB' : '#EEBBBB') : (scope.sort_desc? '#CCFFCC' : '#FFCCCC');
          p.st = uhunt.user.stats(p.pid);
        }
        scope.next_problems = cands;
      };

      scope.uhunt_problems = uhunt_problems;
      scope.$watch('uhunt_problems.version', refresh);
      uhunt.user.on('update', refresh);

      function refresh() {
        volumes = {}; volume_all = []; volume_ac = {}; volume_list = [];
        uhunt_problems.each(function (pid, p) {
          var vol = Math.floor(p.num/100);
          if (!volumes[vol]){ volumes[vol] = []; volume_ac[vol] = 0; volume_list.push(vol); }
          volumes[vol].push(p);
          volume_all.push(p);
          var s = uhunt.user.stats(pid);
          if (s.ac) {
            p.run = s.mrun;
            p.mrun = Math.min(p.mrun, s.mrun);
      //        p.mmem = Math.min(p.mmem, s.mmem);
            p.diff = p.run - p.mrun;
            p.rank = Math.max(1,s.rank);
            volume_ac[vol]++;
          }
        });

        var vol_bars = [], sumac = 0, sumnos = 0;
        volume_list.sort(function (a, b) { return a - b; });
        for (var i = 0; i < volume_list.length; i++){
          var v = volume_list[i];
          vol_bars.push({ index: v, name: 'v' + v, percentage: Math.floor(volume_ac[v] * 100 / volumes[v].length) });
          sumac += volume_ac[v];
          sumnos += volumes[v].length;
        }
        vol_bars.push({ index: 0, name: 'ALL', percentage: Math.floor(sumac * 100 / sumnos) });
        scope.volumes = vol_bars;

        scope.show_table();

        // var sel_vol = nextp_db.get('selected_volume');
        // $('.vol_row_'+sel_vol).each(function(i,a){ if (a.getAttribute) show_table(a); });

        // $.render_runtime = function(){
        //   submissions.ac_pids.sort(function(a,b){ // sort by decreasing runtime difference
        //     var da = submissions.min_runtime[problems.pid_key[a][0]] - problems.pid_key[a][4];
        //     var db = submissions.min_runtime[problems.pid_key[b][0]] - problems.pid_key[b][4];
        //     return db - da;
        //   });

        //   var s = '';
        //   for (var i=0; i<submissions.ac_pids.length && i<25; i++){
        //     var pid = submissions.ac_pids[i],
        //       p = problems.pid_key[pid],
        //       b = submissions.min_runtime[pid];
        //     s += '<tr><td>' + (i+1) +
        //       '<td>' + $.pid_link(p[0],p[1]) +
        //       '<td><span style="float:right">' + $.discuss(p[1]) + '</span>' + $.problem_a(p,200) +
        //       '<td>' + tpl.format_ms(b) +
        //       '<td>' + tpl.format_ms(p[4]) +
        //       '<td>' + tpl.format_ms(b-p[4]);
        //   }
        //   $('#runtime_tbody').html(s);
        // }
        // $.render_runtime();
      }
      console.timeEnd('NextProblemsCtrl');
    }
  };
})

;