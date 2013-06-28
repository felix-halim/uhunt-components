angular.module('uHunt.problem_search', ['uHunt.base', 'uHunt.statistics'])

.factory('problem_search_db', function (create_uhunt_db) {
  return create_uhunt_db('problem-search', {
    'number': 'int',
    'show': 'bool',
    'max_subs': 'int',
    'max_rank': 'int',
    'show_last': 'string',
    'subs_top': 'string',
  });
})

.directive('uhuntProblemSearch', function (uhunt_problems, uhunt, uhunt_rpc, problem_search_db, uhunt_util) {
  return {
    replace: true,
    scope: { number:'=uhuntProblemSearch', show:'=', hide:'=', search:'=', },
    templateUrl: 'partials/problem-search.html',
    link: function (scope, element, attrs) {
      scope.your_last_submissions = [];
      scope.number = problem_search_db.get('number') || '';
      scope.search = search;
      scope.show = problem_search_db.get('show') || false;
      scope.max_last_subs = problem_search_db.get('max_subs') || 5;
      scope.show_last = problem_search_db.get('show_last') || 'last';
      scope.max_rank = problem_search_db.get('max_rank') || 5;
      scope.show_top = problem_search_db.get('subs_top') || 'top';
      scope.uhunt_problems = uhunt_problems;

      scope.hide = function () { problem_search_db.set('show', scope.show = false); };
      scope.is_valid_search = function () { return uhunt_problems.num(scope.number) && scope.show; };
      scope.font_weight = function (sub) { return sub.uid == uhunt.user.uid ? 'bold' : ''; };

      scope.set_max_last_subs = function (n) {
        problem_search_db.set('max_subs', n);
        scope.max_last_subs = n;
        search();
      };

      scope.set_show_last = function (show) {
        problem_search_db.set('show_last', show);
        scope.show_last = show;
        search();
      };

      scope.set_max_rank = function (amt) {
        problem_search_db.set('max_rank', amt);
        scope.max_rank = amt;
        search();
      };

      scope.set_show_top = function (show) {
        problem_search_db.set('subs_top', show);
        scope.show_top = show;
        search();
      };

      scope.$watch('number', search);
      scope.$watch('uhunt_problems.version', function () { search(); });
      uhunt.user.on('update', function () { search(); });

      function update_ranklist(arr) { scope.ranklist = arr; }
      function sbt_cmp(a,b) { return b.sbt - a.sbt; }
      function search(newVal, oldVal) {
        var number = scope.number;
        if (newVal && newVal != oldVal) scope.show = true;
        console.log('search' +
          ', new=' + newVal + ', old=' + oldVal +
          ', num=' + number + 
          ', p=' + uhunt_problems.num(number) +
          ', valid=' + scope.is_valid_search());
        if (!scope.is_valid_search()) return;
        var p = uhunt_problems.num(number);
        if (p) {
          var v = Math.floor(p.num/100);
          scope.ext_problem_url1 = 'http://uva.onlinejudge.org/external/'+v+'/'+p.num+'.html';
          scope.ext_problem_url2 = 'http://acm.uva.es/p/v'+v+'/'+p.num+'.html';
          scope.problem_url = 'http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem='+p.pid;
          scope.submit_url = 'http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=submit_problem&problemid='+p.pid+'&category=24';
          scope.stats_url = 'http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=problem_stats&problemid='+p.pid+'&category=24';

          problem_search_db.set('number', p.num);

          var ss = [];
          uhunt.user.each_pid(p.pid, function (sid, sub) {
            sub.name = uhunt.user.name();
            sub.uname = uhunt.user.uname();
            ss.push(sub);
          });
          ss.sort(sbt_cmp);

          scope.your_last_submissions = ss;
          problem_search_db.set('show', scope.show = true);
          scope.search_title = p.tit;
          scope.search_error = '';

          if (scope.show_last == 'last') {
            uhunt_rpc.psubs_limit(p.pid, 0, uhunt_util.now() + 60 * 60 * 24 * 30, scope.max_last_subs, function (arr) {
              arr.sort(sbt_cmp);
              scope.last_submissions = arr;
            });
          } else {
            scope.last_submissions = scope.your_last_submissions;
          }

          if (scope.show_top == 'top') {
            uhunt_rpc.prank(p.pid, 1, scope.max_rank, update_ranklist);
          } else {
            var half = Math.floor((scope.max_rank - 1) / 2);
            uhunt_rpc.pranknearby(p.pid, uhunt.user.uid, half, half + 1, update_ranklist);
          }

        } else {
          if (number != '') {
            scope.search_error = 'No result for: ' + number + '.';
          }
          problem_search_db.set('show', scope.show = false);
        }
      }
    }
  };
})
