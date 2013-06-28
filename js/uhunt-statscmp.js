angular.module('uHunt.statscmp', ['uHunt.base'])

.factory('statscmp_db', function (create_uhunt_db) {
  return create_uhunt_db('statscmp', {
    'cmp_expr': 'string',
  });
})

.directive('uhuntStatscmp', function (uhunt_rpc, statscmp_db, uhunt, uhunt_problems, cpbook1_numbers, cpbook2_numbers, cpbook3_numbers) {
  return {
    replace: true,
    // scope: { number:'=uhuntProblemSearch', show:'=', hide:'=', search:'=', },
    templateUrl: 'partials/statscmp.html',
    link: function (scope, element, attrs) {
      console.time('StatscmpCtrl');
      function intcmp(a,b){ return a - b; }

      function printSet(x){
        var sb = '';
        for (var i=0; i<x.length; i++){
          var p = uhunt_problems.num(x[i]);
          if (p){
            var st = uhunt.user.stats(p.pid);
            sb += '<a class="' + uhunt.problem_classes(p) +'" href="' + uhunt.problem_link(p.num) + 
              '" style="text-decoration:none" target="_blank">' + p.num + '</a> ';
          }
        }
        return sb;
      }

      function intersect(x,y){
        if (unames_gathering) return false;
        var xi=0, yi=0, ret = [];
        while (xi<x.length && yi<y.length){
          if (intcmp(x[xi],y[yi])<0) xi++;
          else if (intcmp(x[xi],y[yi])>0) yi++;
          else { ret.push(y[yi++]); xi++; }
        }
        return ret;
      }

      function union(x,y){
        if (unames_gathering) return false;
        var xi=0, yi=0, ret = [];
        while (xi<x.length && yi<y.length){
          if (intcmp(x[xi],y[yi])<0) ret.push(x[xi++]);
          else if (intcmp(x[xi],y[yi])>0) ret.push(y[yi++]);
          else { ret.push(y[yi++]); xi++; }
        }
        while (xi<x.length) ret.push(x[xi++]);
        while (yi<y.length) ret.push(y[yi++]);
        return ret;
      }

      function subtract(x,y){
        if (unames_gathering) return false;
        var xi=0, yi=0, ret = [];
        while (xi<x.length && yi<y.length){
          if (intcmp(x[xi],y[yi])<0) ret.push(x[xi++]);
          else if (intcmp(x[xi],y[yi])>0) yi++;
          else { xi++; yi++; }
        }
        while (xi<x.length) ret.push(x[xi++]);
        return ret;
      }

      function next_token(){
        if (error_parsing) return 0;
        if (pos >= input_expr.length) return look = -1;
        var token = input_expr.charAt(pos++);
        while (token==' ' && pos < input_expr.length) token = input_expr.charAt(pos++);
        var c = token;
        while (c!='&' && c!='-' && c!='+' && c!='(' && c!=')' && pos < input_expr.length){
          c = input_expr.charAt(pos++);
          if (c!='&' && c!='-' && c!='+' && c!='(' && c!=')') token += c; else { pos--; break; }
        }
        return look = token.trim();
      }

      function match(x){
        if (error_parsing) return 0;
        if (x!=look) error_parsing = true;
        next_token();
      }

      function eval_var(v){
        if (unames_gathering){
          if (typeof cmp_users[v] == 'undefined') cmp_users[v] = 'unset';
          cur_users[v] = 'new';
        }
        match(v);
        return cmp_users[v];
      }

      function bracket(){
        if (error_parsing) return 0;
        if (look=='(') {
          match('(');
          var res = term();
          match(')');
          return res;
        }
        return eval_var(look);
      }

      function term(){
        if (error_parsing) return 0;
        var ret = bracket();
        while (!error_parsing && look!=-1){
          if (look=='&') { match('&'); ret = intersect(ret,bracket()); }
          else if (look=='+') { match('+'); ret = union(ret,bracket()); }
          else if (look=='-') { match('-'); ret = subtract(ret,bracket()); }
          else if (look==')') break;
          else error_parsing = true;
        }
        return ret;
      }

      function parse(){
        pos = 0;
        error_parsing = false;
        look = next_token();
        cur_users = {};
        result = term();
        if (look != -1) error_parsing = true;
        return !error_parsing;
      }

      var input_expr, pos, error_parsing, look, result, cmp_users = {}, cur_users = {}, unames_gathering,
          S = [], CP1 = [], CP1S = [], CP2 = [], CP2S = [], CP3 = [], CP3S = [];

      function unique(arr) {
        for (var i = 0, j = 1; j < arr.length; j++) {
          if (arr[i] != arr[j]) {
            i++;
            if (i != j) arr[i] = arr[j];
          }
        }
        arr.length = i + 1;
      }

      // call this to initialize before use! (make sure the probs already set up)
      function initialize() {
        uhunt_problems.each(function(pid,p){ S.push(p.num); });
        S.sort(intcmp);
        cmp_users['S'] = S;
        for (var i = 0; i < cpbook1_numbers.length; i++) {
          var num = cpbook1_numbers[i];
          CP1.push(Math.abs(num));
          if (num < 0) CP1S.push(-num);
        }
        for (var i = 0; i < cpbook2_numbers.length; i++) {
          var num = cpbook2_numbers[i];
          CP2.push(Math.abs(num));
          if (num < 0) CP2S.push(-num);
        }
        for (var i = 0; i < cpbook3_numbers.length; i++) {
          var num = cpbook3_numbers[i];
          CP3.push(Math.abs(num));
          if (num < 0) CP3S.push(-num);
        }
        cmp_users['cp1'] = CP1;
        cmp_users['cp1s'] = CP1S;
        cmp_users['cp2'] = CP2;
        cmp_users['cp2s'] = CP2S;
        cmp_users['cp3'] = CP3;
        cmp_users['cp3s'] = CP3S;
        CP1.sort(intcmp);
        CP1S.sort(intcmp);
        CP2.sort(intcmp);
        CP2S.sort(intcmp);
        CP3.sort(intcmp);
        CP3S.sort(intcmp);
        unique(CP1);
        unique(CP1S);
        unique(CP2);
        unique(CP2S);
        unique(CP3);
        unique(CP3S);

        var username = uhunt.user.uname();
        scope.cmp_expr = statscmp_db.get('cmp_expr') || ('felix_halim - ' + username);
      }
      initialize();

      function process(e, id) {
        if (!e) var e = window.event;
        var code;
        if (e.keyCode) code = e.keyCode;
        else if (e.which) code = e.which;
        if (code==13) execute_cmp_exp(id);
      }

      function clear() { cur_users = {}; cmp_users = {S:S, cp1:CP1, cp1s:CP1S, cp2:CP2, cp2s:CP2S, cp3:CP3, cp3s:CP3S}; };

      scope.clear = function () { clear(); scope.cmp_expr = ''; };
      scope.execute_cmp_exp = function (expr) {
        function doit(){
          unames_gathering = false;
          parse();
          scope.cmp_expr_res = "<i><b>Result of <span style='color:red'>"+color_op(expr)+"</span> : ("+
            result.length+" items) </b></i><p style='font-size:10px'>" + printSet(result) + '</p>';
        }

        if (expr.length == 0) {
          scope.cmp_expr_res = '';
          return;
        }

        statscmp_db.set('cmp_expr', expr);
        var el = {}, but = {};
        el.disabled = 'disabled';
        but.disabled = 'disabled';
        // statscmp_db.set(id, expr);
        input_expr = expr; //.toLowerCase();
        unames_gathering = true;
        if (!parse()){
          el.disabled = '';
          but.disabled = '';
          return "Error occured during parsing, make sure you type a correct expression";
        } else {
          var fetch_unames = [];
          for (var uname in cur_users)
            if (cmp_users[uname]=='unset')
              fetch_unames.push(uname);

          if (fetch_unames.length > 0){
            uhunt_rpc.solved_bits(fetch_unames, function(res){
              var invalids = '';
              for (var i=0; i<res.length; i++){
                if (res[i].solved===false){
                  invalids += res[i].username + "\n";
                } else {
                  var s = res[i].solved, arr = [];
                  for (var j=0; j<s.length; j++) for (var k=0; k<(1<<5); k++)
                    if ((s[j] & (1<<k)) && uhunt_problems.pid((j<<5) + k)) arr.push(uhunt_problems.pid((j<<5) + k).num);
                  arr.sort(intcmp);
                  cmp_users[res[i].username] = arr;
                }
              }
              if (invalids.length > 0) return "Invalid username(s) :\n" + invalids;
              else doit();
              el.disabled = '';
              but.disabled = '';
            });
          } else {
            doit();
            el.disabled = '';
            but.disabled = '';
          }
        }
      };

      function color_op(s){
        var res = "";
        for (var i=0; i<s.length; i++){
          var c = s.charAt(i)
          if (c!='&' && c!='-' && c!='+' && c!='(' && c!=')') res += c;
          else res += "<font color=blue> "+c+" </font>";
        }
        return res;
      }
      console.timeEnd('StatscmpCtrl');
    }
  };
})

;
