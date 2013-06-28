angular.module('uHunt.vcontest', ['uHunt.base'])

.factory('vcontest_db', function (create_uhunt_db) {
  return create_uhunt_db('vcontest', {
    'n': 'int',
    'view': 'string',
    'sortby': 'string',
    'sortasc': 'bool',
    'picker_show_unsolved': 'bool',
    'uids': 'string',
  });
})

.directive('uhuntVcontest', function (uhunt_rpc, uhunt_util, vcontest_db, uhunt, uhunt_problems) {
  return {
    replace: true,
    // scope: { number:'=uhuntProblemSearch', show:'=', hide:'=', search:'=', },
    templateUrl: 'partials/vcontest.html',
    link: function (scope, element, attrs) {
      console.time('VContestCtrl');
      var probs = null;
      var ubits = {};
      var plevel = null;

      scope.vcshadow_view = vcontest_db.get('view') || 'unsolved';
      scope.show_unsolved = vcontest_db.get('picker_show_unsolved') || true;
      scope.vcontest_link = false;

      scope.generate_vcontest = function () {
        var c = get_conf();
        if (!c) return;
        if (c.problem_numbers.length == 0 || c.problem_numbers.length == 1 || !c.problem_numbers[0])
          return alert("Please pick at least one problem.");
        scope.is_generating = true;
        scope.vcontest_link_href = '';
        scope.vcontest_link = 'Generating virtual contest ...';
        console.log(JSON.stringify(c));
        uhunt_rpc.vcontest_gen(c, function (res) {
          console.log('ok = ' + res.ok);
          if (res.ok) {
            var url = 'http://uhunt.felix-halim.net/vcontest/'+ res.id;
            scope.vcontest_link_href = url;
            scope.vcontest_link = url;
          } else {
            alert('Failed to generate vcontest.');
          }
          scope.is_generating = false;
        });

    //     $('#vcontest_gen_ta').val('\
    // <!DOCTYPE html>\n\
    // <html>\n\
    // <head>\n\
    // <meta charset="UTF-8">\n\
    // <title>UVa Virtual Contest</title>\n\
    // <link rel="shortcut icon" href="/images/uva-rounded.png" />\n\
    // <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/themes/cupertino/jquery-ui.css" />\n\
    // <link rel="stylesheet" href="http://uhunt.felix-halim.net/css/uhunt-vcontest-1.0.css" />\n\
    // <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></'+'script>\n\
    // <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.min.js"></'+'script>\n\
    // <script type="text/javascript" src="http://uhunt.felix-halim.net/js/uhunt-vcontest-1.1.js"></'+'script>\n\
    // <script>\n\
    // uhunt.vcontest.start({\n\
    //   user_ids: ['+c.user_ids.join(', ')+'],\n\
    //   problem_numbers: ['+c.problem_numbers.join(", ")+'],\n\
    //   start_sbt: '+c.start_sbt+',\n\
    //   end_sbt: '+c.end_sbt+',\n\
    //   ranklist_container: "ranklist_container",\n\
    //   livesubs_container: "livesubs_container",\n\
    // });\n\
    // </'+'script>\n\
    // </head>\n\
    // <body>\n\
    // <div id="livesubs_container"></div>\n\
    // <div id="ranklist_container"></div>\n\
    // </body>\n\
    // </html>');
      };
      function init() {
        $("#datepicker").datepicker({ dateFormat: 'yy-mm-dd', timeFormat: 'hh:mm' });
        $("#datepicker").datepicker("setDate", new Date());
        fix_highlight();
        plevel = null;
        render_problem_picker(2);
      }

      var d = new Date(new Date().getTime() + 1000 * 60 * 10);
      scope.contest_date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      scope.contest_time = d.getHours() + ':' + d.getMinutes();
      scope.duration = '5h';
      if (!vcontest_db.exists('uids'))
        vcontest_db.set('uids', "14942, 18017, 22972, 30959, 31991, 52185, 60556, 67264, 69534, 81816");
      scope.user_ids = vcontest_db.get('uids');
      scope.problem_numbers = '';

      function update_start_sbt(silent){
        var d = scope.contest_date.split('/');
        var t = scope.contest_time.split(':');
        d = new Date(d[0], d[1] - 1, d[2], t[0], t[1]);
        return Math.floor(d.getTime() / 1000);
      }

      function tointarray(v){
        v = v.split(',');
        for (var i=0; i<v.length; i++) v[i] = uhunt_util.parseInt(v[i]);
        return v;
      }

      function get_conf(silent){
        var start_sbt = update_start_sbt(silent);
        if (!silent && !start_sbt) return false;
        var d = scope.duration;
        var dur = parseInt(d, 10);
        if (d.indexOf('w') != -1) dur *= 7 * 24 * 60 * 60;
        else if (d.indexOf('d') != -1) dur *= 24 * 60 * 60;
        else dur *= 60 * 60;
        if (dur > 30 * 24 * 60 * 60) return alert('Setting contest duration more than 1 month is not supported');
        vcontest_db.set('uids', scope.user_ids);
        return {
          user_ids: tointarray(scope.user_ids),
          problem_numbers: tointarray(scope.problem_numbers),
          start_sbt: start_sbt,
          end_sbt: start_sbt? (start_sbt + (isNaN(dur)?0:dur)) : 0,
          contest_id: scope.contest_id,
        };
      }

      function select_pnums(pnums, cid) {
        scope.problem_numbers = pnums.join(', ');
        scope.n_selected = pnums.length;
        scope.contest_id = cid;
      }

      scope.toggle_problem = function ($event) {
        var el = $event.target;
        el.className = (el.className == 'hilite') ? '' : 'hilite';
        var num = el.innerHTML;
        var c = get_conf(true);
        for (var i=0; i<c.problem_numbers.length; i++){
          if (c.problem_numbers[i] == num){
            c.problem_numbers.splice(i, 1);
            select_pnums(c.problem_numbers, 0);
            return;
          }
        }
        c.problem_numbers.push(num);
        select_pnums(c.problem_numbers, 0);
      };
      
      function populate_ubits(uids, cb) {
        var puids = [];
        for (var i=0; i < uids.length; i++)
          if (!ubits.hasOwnProperty(uids[i]))
            puids.push(uids[i]);
        if (puids.length == 0) return cb();
        uhunt_rpc.solved_bits(puids, function (arr) {
          for (var i=0; i<arr.length; i++){
            if (arr[i].solved === false) alert('Invalid UID : ' + arr[i].uid);
            ubits[arr[i].uid] = arr[i].solved;
          }
          cb();
        });
      }

      function calc_solved_pid(uids) {
        var solved = {};
        for (var i = 0; i < uids.length; i++){
          var uid = uids[i], s = ubits[uid];
          for (var j=0; j<s.length; j++) for (var k=0; k<(1<<5); k++)
            if ((s[j] & (1<<k)) && uhunt_problems.pid((j<<5) + k))
              solved[(j<<5) + k] = true;
        }
        return function (uid) { return solved.hasOwnProperty(uid); };
      }

      function calc_levels(solved_pid) {
        if (!plevel) {
          plevel = [];
          uhunt_problems.each(function (pid, p) {
            var lev = Math.max(1, 10 - Math.floor(Math.min(10, Math.log(p.dacu))));
            if (!plevel[lev]) plevel[lev] = [];
            plevel[lev].push(p);
          });
        }
        var levels = [];
        for (var lev = 1; lev <= 10; lev++){
          var ps = plevel[lev];
          for (var i = 0; i < ps.length; i++){
            if (!vcontest_db.get('picker_show_unsolved') || !solved_pid(ps[i].pid)){
              var lev = Math.max(1, 10 - Math.floor(Math.min(10, Math.log(ps[i].dacu))));
              if (!levels[lev]) levels[lev] = [];
              levels[lev].push(ps[i]);
            }
          }
        }
        return levels;
      }

      // Pick 7 random numbers (type 1 = easy, 2 = medium, 3 = uniform).
      scope.picker_type = 2;

      function pick_n(n, levels) {
        var buf = [];
        for (var i=1; i<=10; i++) if (levels[i]){
          var ps = levels[i]; buf[i] = [];
          for (var j=0; j<ps.length; j++){
            var k = Math.floor(Math.random()*ps.length);
            var t = ps[j]; ps[j] = ps[k]; ps[k] = t;
          }
          for (var j=0; j<n && j<ps.length; j++) buf[i].push(ps[j].num);
          ps.sort(function(a,b){ return a.pid - b.pid});
        }
        var pnums = [];
        var per_level_pick = (scope.picker_type==1)? n : (scope.picker_type==2)? 2 : 1;
        while (pnums.length < n){
          var added = false;
          for (var i=1; i<=10; i++) if (buf[i])
            for (var j=0; buf[i].length > 0 && j<per_level_pick && pnums.length < n; j++){
              pnums.push(buf[i].splice(0,1)[0]);
              added = true;
            }
          if (!added) break;
        }
        scope.problem_numbers = pnums.join(', ');
        scope.n_selected = pnums.length;
        return pnums;
      }

      scope.render_problem_picker = function (type) {
        if (type) scope.picker_type = type;
        var c = get_conf(true);
        populate_ubits(c.user_ids, function () {
          var solved_pid = calc_solved_pid(c.user_ids);
          var levels = calc_levels(solved_pid);
          c.problem_numbers = pick_n(7, levels);
          
          // The actual rendering.
          var selected = {}, s = '';
          for (var i=0; i<c.problem_numbers.length; i++)
            selected[c.problem_numbers[i]] = true;
          for (var i=1; i<=10; i++) if (levels.hasOwnProperty(i)){
            var arr = levels[i];
            for (var j=0; j<arr.length; j++)
              arr[j] = '<span style="font-size:10px; cursor:pointer;" '+(selected[arr[j].num]?'class="hilite"':'') +'>' + arr[j].num + '</span>';
            s += '<tr><td align=center>Level '+ i + '<td>' + arr.join(' ');
          }
          scope.n_selected = c.problem_numbers.length;
          scope.picker_tbody = s;
        });
      }

      scope.set_show_unsolved = function (show) {
        vcontest_db.set('picker_show_unsolved', scope.show_unsolved = show);
        scope.render_problem_picker();
      }

      scope.view_picker = '';
      scope.view_problem_picker = function (c) {
        if (c == scope.view_picker) {
          scope.view_picker = '';
        } else if (c == 'past') {
          scope.view_picker = c;
          scope.render_past_contests();
        } else if (c == 'pick') {
          scope.view_picker = c;
          scope.render_problem_picker();
        }
      }

      var contests = {"1":{"id":1,"name":"University of Valladolid Test Local Contest","starttime":963583200,"endtime":963601200,"problems":[10000,10001,10002,10003,10004,10005,10006,10007]},"2":{"id":2,"name":"Taiwan High School Problem Solving Contest 2000","starttime":964918800,"endtime":964936800,"problems":[11000,11001,11002,657,11003]},"3":{"id":3,"name":"University of Valladolid September '2000 Contest","starttime":969289200,"endtime":969303600,"problems":[10008,10009,10010,10011,10012]},"4":{"id":4,"name":"Simple contest by Alex Gevak","starttime":967892400,"endtime":967903200,"problems":[10013,10014]},"5":{"id":5,"name":"ITESM Campus Monterrey 4th Internal ACM Programming Contest 2000","starttime":969717600,"endtime":969732000,"problems":[10015,10016,10017,10018,10019]},"6":{"id":6,"name":"Second Programming Contest of Alex Gevak","starttime":970916400,"endtime":970938000,"problems":[10020,10021,10022,10023,10024,10025,10026]},"7":{"id":7,"name":"University of Valladolid Qualification for SWERC '2000 Local Contest","starttime":972720000,"endtime":972734400,"problems":[10027,10028,10029,10030,10031,10032,10033]},"8":{"id":8,"name":"SWERC '2000 Warm-Up","starttime":973872000,"endtime":973886400,"problems":[10034,10035,10036,10037,10038]},"9":{"id":9,"name":"Parallel Southwestern European Regional Contest","starttime":974631600,"endtime":974649600,"problems":[10039,10040,10041,10042,10043,10044,10045,10046]},"10":{"id":10,"name":"University of Valladolid End Of Millenium Contest","starttime":977994000,"endtime":978008400,"problems":[10047,10048,10049,10050]},"11":{"id":11,"name":"University of Valladolid New Millenium Contest","starttime":978537600,"endtime":978552000,"problems":[10051,10052,10053,10054]},"12":{"id":12,"name":"Bangladesh 2001 Programming Contest","starttime":978681600,"endtime":978703200,"problems":[10055,10056,10057,10058,10059,10060,10061,10062,10063,10064]},"13":{"id":13,"name":"BUET/UVA Occidental (WF Warmup) Contest 1","starttime":979905600,"endtime":979923600,"problems":[10065,10066,10067,10068,10069]},"14":{"id":14,"name":"BUET/UVA Oriental (WF Warmup) Contest 1","starttime":981273600,"endtime":981291600,"problems":[10070,10071,10072,10073,10074]},"15":{"id":15,"name":"BUET/UVA Occidental (WF Warmup) Contest 2","starttime":981723600,"endtime":981741600,"problems":[10075,10076,10077,10078,10079]},"16":{"id":16,"name":"University of Waterloo Local and Internet Contest January 2001","starttime":980618400,"endtime":980629200,"problems":[10080,10081,10082,10083,10084]},"17":{"id":17,"name":"BUET/UVA World Finals Warm-up","starttime":983001600,"endtime":983023200,"problems":[10085,10086,10087,10088,10089,10090,10091,10092,10093,10094,10095]},"18":{"id":18,"name":"TCL Programming Contest","starttime":986630400,"endtime":986646600,"problems":[10096,10097,10098,10099,10100,10101]},"19":{"id":19,"name":"Sergant Pepper's Lonely Programmers Club. Junior Contest 2001","starttime":984659400,"endtime":984673800,"problems":[10102,10103,10104,10105,10106]},"20":{"id":20,"name":"University of Valladolid Local Contest","starttime":989654400,"endtime":989668800,"problems":[10111,10112,10113,10114,10115,10116]},"21":{"id":21,"name":"Universities of Waterloo and Alberta  Spring Contest June 2001","starttime":991501200,"endtime":991512000,"problems":[10123,10124,10125,10126,10127]},"22":{"id":22,"name":"May Day Contest - Hats off to the workers of the world","starttime":988718400,"endtime":988729200,"problems":[10107,10108,10109,10110]},"24":{"id":24,"name":"OIBH Online Programming Contest 1","starttime":990943200,"endtime":990961200,"problems":[10117,10118,10119,10120,10121,10122]},"25":{"id":25,"name":"The 'silver wedding' contest","starttime":993826800,"endtime":993841200,"problems":[10131,10132,10133,10134,10135]},"26":{"id":26,"name":"Technical University of Szczecin Programming Contest 2001","starttime":991996200,"endtime":992014200,"problems":[10128,113,533,756,10129,10130]},"27":{"id":27,"name":"Summer keep-fit 1","starttime":994921200,"endtime":994939200,"problems":[10136,10137,10138,10139,10140,10141,10142]},"28":{"id":28,"name":"Summer keep-fit 2","starttime":996156000,"endtime":996174000,"problems":[10143,10144,10145,10146,10147,10148]},"29":{"id":29,"name":"Summer keep-fit 3","starttime":997995600,"endtime":998017200,"problems":[10149,10150,10151,10152,10153,10154,10155,10156]},"30":{"id":30,"name":"Lazy Summer Bulgarian Programming Contest (Bis)","starttime":998733600,"endtime":998748000,"problems":[10157,10158,10159,10160]},"31":{"id":31,"name":"Randy Game - Programming Contest 2001A","starttime":997527600,"endtime":997542000,"problems":[10161,10162,10163,10164,10165,10166,10167]},"32":{"id":32,"name":"2001 Regionals Warmup Contest","starttime":999329400,"endtime":999358200,"problems":[10168,10169,10170,10171,10172,10173,10174,10175,10176,10177,10178,10179,10180,10181]},"33":{"id":33,"name":"Xylophone's Dessert","starttime":1000447200,"endtime":1000461600,"problems":[10182,10183,10184,10185,10186,10187]},"34":{"id":34,"name":"Universidade do Brasil (UFRJ) Internal Contest Warmup 2001","starttime":1001692800,"endtime":1001703600,"problems":[10188,10189,10190,10191,10192,10193]},"35":{"id":35,"name":"University of Valladolid Final Local Contest","starttime":1004169600,"endtime":1004184000,"problems":[10201,10202,10203,10204,10205,10206]},"36":{"id":36,"name":"Universidade do Brasil (UFRJ) Internal Contest 2001","starttime":1002376800,"endtime":1002394800,"problems":[10194,10195,10196,10197,10198,10199,10200]},"37":{"id":37,"name":"Mindbend 2002 Programming Contest","starttime":1013839200,"endtime":1013853600,"problems":[10229,10230,10231,10232,10233,10234,10235]},"38":{"id":38,"name":"Math &amp; Number Theory Lovers' Contest","starttime":1007193600,"endtime":1007226000,"problems":[10207,10208,10209,10210,10211,10212,10213,10214,10215,10216,10217,10218]},"39":{"id":39,"name":"THE ROCKFORD PROGRAMMING CONTEST 2001","starttime":1008140400,"endtime":1008158400,"problems":[10219,10220,10221,10222,10223]},"40":{"id":40,"name":"World Finals Warmup Oriental Contest","starttime":1015052400,"endtime":1015095600,"problems":[10236,10237,10238,10239,10240,10241,10242,10243,10244,10245]},"41":{"id":41,"name":"World Finals Warmup Occidental Contest","starttime":1015844400,"endtime":1015880400,"problems":[10246,10247,10248,10249,10250,10251,10252,10253,10254,10255,10256]},"42":{"id":42,"name":"University of Waterloo Local and Internet Contest January 2002","starttime":1012068000,"endtime":1012078800,"problems":[10224,10225,10226,10227,10228]},"43":{"id":43,"name":"The Joint Open Contest of Gizycko Private Higher Education Intsitute Karolex and Brest State University, 2002","starttime":1019124000,"endtime":1019142000,"problems":[10263,10264,10265,10266,10267,10268]},"44":{"id":44,"name":"UVA Local Contest - First Round","starttime":1018684800,"endtime":1018699200,"problems":[10257,10258,10259,10260,10261,10262]},"45":{"id":45,"name":"UVA Local Contest - Second Round","starttime":1019894400,"endtime":1019910600,"problems":[10277,10278,10279,10280,10281,10282]},"46":{"id":46,"name":"OIBH Reminiscence Programming Contest","starttime":1019282400,"endtime":1019318400,"problems":[10269,10270,10271,10272,10273,10274,10275,10276]},"47":{"id":47,"name":"The Openner-Math Lovers' Contest","starttime":1022317200,"endtime":1022349600,"problems":[10283,10284,10285,10286,10287,10288,10289,10290,10291,10292,10293,10294]},"48":{"id":48,"name":"University of Waterloo Local and Internet Contest, June 2002","starttime":1022950800,"endtime":1023048000,"problems":[10295,10296,10297,10298,10299]},"49":{"id":49,"name":"The Joint Effort Contest (We and Rodrigo Malta)","starttime":1023534000,"endtime":1023566400,"problems":[10300,10301,10302,10303,10304,10305,10306,10307,10308,10309,10310,10311]},"50":{"id":50,"name":"The Conclusive Contest- The decider.","starttime":1025341200,"endtime":1025373600,"problems":[10312,10313,10314,10315,10316,10317,10318,10319,10320,229,10321,10322,10323,10324]},"51":{"id":51,"name":"The Real Programmers' Contest-1","starttime":1026374400,"endtime":1026399600,"problems":[10325,10326,10327,10328,10329,10330,10331,10332,10333,10334,10335]},"52":{"id":52,"name":"ACM Valladolid Practice Center Monthly Contest - July 2002","starttime":1027771200,"endtime":1027794600,"problems":[10336,10337,10338,10339,10340,10341,10342,10343,10344]},"53":{"id":53,"name":"ACM Valladolid Practice Center Monthly Contest - August 2002","starttime":1030190400,"endtime":1030203000,"problems":[10345,10346,10347,10348,10349,10350,10351,10352]},"54":{"id":54,"name":"ACM Valladolid Practice Center Monthly Contest - September 2002","starttime":1031907600,"endtime":1031929200,"problems":[10353,10354,10355,10356,10357,10358,10359,10360,10361]},"55":{"id":55,"name":"University of Waterloo Local and Internet Contest, Fall 2002","starttime":1032627600,"endtime":1032638400,"problems":[10362,10363,10364,10365,10366]},"56":{"id":56,"name":"Waterloo Second Fall and Internet Contest, 2002","starttime":1033232400,"endtime":1033243200,"problems":[10367,10368,10369,10370,10371]},"57":{"id":57,"name":"UVA Local Contest - Third'2002","starttime":1033804800,"endtime":1033819200,"problems":[10372,10373,10374,10375,10376,10377]},"58":{"id":58,"name":"The 2002 ACM Regionals Warmup Contest","starttime":1035450000,"endtime":1035475200,"problems":[10378,10379,10380,10381,10382,10383,10384,10385,10386]},"59":{"id":59,"name":"UVA Local Contest - Fourth'2002","starttime":1035014400,"endtime":1035028800,"problems":[10387,10388,10389,10390,10391,10392]},"60":{"id":60,"name":"Regionals Warmup Contest 2002, Venue: Southeast University, Dhaka, Bangladesh","starttime":1036211400,"endtime":1036229400,"problems":[10393,10394,10395,10396,10397,10398,10399,10400,10401,10402]},"61":{"id":61,"name":"November 2002 Monthly Contest","starttime":1036832400,"endtime":1036852200,"problems":[10403,10404,10405,10406,10407,10408,10409,10410]},"62":{"id":62,"name":"OIBH Online Programming Contest 2","starttime":1038031200,"endtime":1038067200,"problems":[10411,10412,10413,10414,10415,10416,10417,10418]},"63":{"id":63,"name":"Brightness of Brain Contest","starttime":1042880400,"endtime":1042909200,"problems":[10429,10430,10431,10432,10433,10434,10435,10436,10437,10438]},"64":{"id":64,"name":"January 2003 Monthly Contest. Warm-up for Beverly Hills :-)","starttime":1042268400,"endtime":1042290000,"problems":[10419,10420,10421,10422,10423,10424,10425,10426,10427,10428]},"65":{"id":65,"name":"University of Waterloo Local and Internet Contest, January 2003","starttime":1043517600,"endtime":1043528400,"problems":[10439,10440,10441,10442,10443]},"66":{"id":66,"name":"February 2003 Monthly Contest","starttime":1044691200,"endtime":1044709200,"problems":[10444,10445,10446,10447,10448,10449,10450,10451,10452]},"67":{"id":67,"name":"The Real Programmers' Contest -2 -A BUET Sprinter Contest","starttime":1045900800,"endtime":1045918800,"problems":[10453,10454,10455,10456,10457,10458,10459,10460,10461,10462]},"68":{"id":68,"name":"World Finals 2003 Warmup","starttime":1047373200,"endtime":1047398400,"problems":[10473,10474,10475,10476,10477,10478,10479,10480,10481,10482,10483]},"69":{"id":69,"name":"Return of the Aztecs","starttime":1046422800,"endtime":1046440800,"problems":[10463,10464,10465,10466,10467,10468,10469,10470,10471,10472]},"70":{"id":70,"name":"UVa Local Qualification &amp; April 2003 Monthly Contest","starttime":1051342200,"endtime":1051360200,"problems":[10484,10485,10486,10487,10488,10489,10490,10491]},"71":{"id":71,"name":"May 2003 Monthly Contest","starttime":1053774000,"endtime":1053794400,"problems":[10492,10493,10494,10495,10496,10497,10498,10499]},"72":{"id":72,"name":"June 2003 Monthly Contest","starttime":1055494800,"endtime":1055516400,"problems":[10509,10510,10511,10512,10513,10514,10515,10516,10517,10518]},"73":{"id":73,"name":"Waterloo ACM Programming Contest","starttime":1057424400,"endtime":1057435200,"problems":[10526,10527,10528,10529,10530]},"74":{"id":74,"name":"I Local Contest in Murcia 2003","starttime":1054971000,"endtime":1054985400,"problems":[10500,10501,10502,10503,10504,10505,10506,10507,10508]},"75":{"id":75,"name":"The Diamond Wedding Contest: Elite Panel's 1st Contest","starttime":1059210000,"endtime":1059235200,"problems":[10531,10532,10533,10534,10535,10536,10537,10538]},"76":{"id":76,"name":"THE SAMS' CONTEST","starttime":1056704400,"endtime":1056726000,"problems":[10519,10520,10521,10522,10523,10524,10525]},"77":{"id":77,"name":"UVa OJ August Monthly Contest","starttime":1061629200,"endtime":1061652600,"problems":[10539,10540,10541,10542,10543,10544,10545,10546,10547,10548]},"78":{"id":78,"name":"ACM ICPC Regional Contests - Warmup - First Contest","starttime":1065348000,"endtime":1065366000,"problems":[10559,10560,10561,10562,10563,10564,10565,10566]},"79":{"id":79,"name":"First Fall Waterloo Contest","starttime":1064077200,"endtime":1064088000,"problems":[10549,10550,10551,10552,10553]},"80":{"id":80,"name":"Second Fall Waterloo Contest","starttime":1064682000,"endtime":1064692800,"problems":[10554,10555,10556,10557,10558]},"81":{"id":81,"name":"ACM ICPC Regional Contests - Warmup - Second Contest","starttime":1065882600,"endtime":1065907800,"problems":[10567,10568,10569,10570,10571,10572,10573,10574]},"82":{"id":82,"name":"ICPC Dhaka Regional Contest at BUET, Online (The Day after the actual one)","starttime":1068800400,"endtime":1068818400,"problems":[12050,12051,12052,12053,12054,12055,12056,12057,12058,12059]},"83":{"id":83,"name":"UVa Local Qualification Contest","starttime":1067067000,"endtime":1067081400,"problems":[10575,10576,10577,10578,10579,10580]},"84":{"id":84,"name":"December 2003 Monthly Contest","starttime":1070701200,"endtime":1070719200,"problems":[10581,10582,10583,10584,10585,10586,10587,10588]},"85":{"id":85,"name":"IIUC Online Programming Contest","starttime":1071910800,"endtime":1071932400,"problems":[10589,10590,10591,10592,10593,10594,10595,10596,10597,10598,10599]},"86":{"id":86,"name":"UVa first school online contest","starttime":1073725200,"endtime":1073746800,"problems":[10600,10601,10602,10603,10604,10605,10606,10607,10608]},"87":{"id":87,"name":"January 2004 Monthly Contest","starttime":1074934800,"endtime":1074961800,"problems":[10609,10610,10611,10612,10613,10614,10615,10616,10617]},"88":{"id":88,"name":"Winter Waterloo Contest","starttime":1075572000,"endtime":1075582800,"problems":[10618,10619,10620,10621,10622]},"89":{"id":89,"name":"ACM ICPC World Finals Warmup - 1","starttime":1077354000,"endtime":1077375600,"problems":[10623,10624,10625,10626,10627,10628,10629,10630,10631]},"90":{"id":90,"name":"ACM ICPC World Finals Warmup - 2","starttime":1079186400,"endtime":1079208000,"problems":[10632,10633,10634,10635,10636,10637,10638,10639,10640,10641]},"91":{"id":91,"name":"The FOUNDATION Programming Contest 2004","starttime":1083659400,"endtime":1083677400,"problems":[10642,10643,10644,10645,10646,10647,10648,10649,10650]},"92":{"id":92,"name":"UVa Local and May Monthly Contest","starttime":1085216400,"endtime":1085234400,"problems":[10651,10652,10653,10654,10655,10656,10657,10658]},"93":{"id":93,"name":"II LOCAL CONTEST IN MURCIA","starttime":1086445800,"endtime":1086460200,"problems":[10659,10660,10661,10662,10663,10664,10665,10666,10667]},"94":{"id":94,"name":"Waterloo ACM Programming Contest","starttime":1087059600,"endtime":1087074000,"problems":[10668,10669,10670,10671,10672]},"95":{"id":95,"name":"UVa June 2004 Monthly Contest","starttime":1088240400,"endtime":1088262000,"problems":[10673,10674,10675,10676,10677,10678,10679,10680]},"96":{"id":96,"name":"UVa July 2004 Monthly Contest","starttime":1090659600,"endtime":1090681200,"problems":[10688,10689,10690,10691,10692,10693,10694,10695]},"97":{"id":97,"name":"ICPC Regional Contest Warmup 1","starttime":1096722000,"endtime":1096740000,"problems":[10732,10733,10734,10735,10736,10737,10738,10739]},"98":{"id":98,"name":"ICPC Regional Contest Warmup 2","starttime":1097917200,"endtime":1097938800,"problems":[10740,10741,10742,10743,10744,10745,10746,10747,10748]},"99":{"id":99,"name":"Federal University of Rio Grande do Norte Classifying Contest - Round 1","starttime":1090083600,"endtime":1090098000,"problems":[10681,10682,10683,10684,10685,10686,10687]},"100":{"id":100,"name":"Federal University of Rio Grande do Norte Classifying Contest - Round 2","starttime":1091898000,"endtime":1091916000,"problems":[10696,10697,10698,10699,10700,10701,10702,10703,10704]},"101":{"id":101,"name":"August 2004 Monthly Contest","starttime":1093683600,"endtime":1093701600,"problems":[10705,10706,10707,10708,10709,10710,10711,10712]},"102":{"id":102,"name":"University of Alberta/Waterloo Fall 1 Contest","starttime":1095613200,"endtime":1095624000,"problems":[10713,10714,10715,10716,10717]},"103":{"id":103,"name":"University of Waterloo Fall 2 Contest","starttime":1096131600,"endtime":1096142400,"problems":[10727,10728,10729,10730,10731]},"104":{"id":104,"name":"ACM ICPC Dhaka Regional (Online Version) at Northsouth University, Bangladesh(Semi Live!)","starttime":1097218800,"endtime":1097236800,"problems":[12060,12061,12062,12063,12064,12065,12066,12067]},"105":{"id":105,"name":"Intl. Islamic Univ Chittagong","starttime":1095753600,"endtime":1095771600,"problems":[10718,10719,10720,10721,10722,10723,10724,10725,10726]},"106":{"id":106,"name":"Novosibirsk SU contest 1","starttime":1098608400,"endtime":1098630000,"problems":[10749,10750,10751,10752,10754,10755,10757,10758]},"107":{"id":107,"name":"UVa OJ - A bonus Contest","starttime":1099126800,"endtime":1099170000,"problems":[10759,10760,10761,10762,10763,10764,10765,10766,10753,10756]},"108":{"id":108,"name":"UVa Local Qualification Contest","starttime":1099729800,"endtime":1099747800,"problems":[10767,10768,10769,10770,10771,10772]},"109":{"id":109,"name":"The FOUNDATION Programming 2nd Contest 2004","starttime":1100939400,"endtime":1100957400,"problems":[10773,10774,10775,10776,10777,10778,10779,10780,10781,10782]},"110":{"id":110,"name":"A Warmup for Bangladesh NCPC :)","starttime":1101556800,"endtime":1101571200,"problems":[10783,10784,10785,10786,10787,10788]},"111":{"id":111,"name":"Bangladesh National Computer Programming Contest","starttime":1102143600,"endtime":1102163400,"problems":[10789,10790,10791,10792,10793,10794,10795,10796,10797,10798,10799]},"112":{"id":112,"name":"Abednego's Graph Lovers' Contest 2005","starttime":1105203600,"endtime":1105225200,"problems":[10800,10801,10802,10803,10804,10805,10806,10807,10808]},"113":{"id":113,"name":"Waterloo Winter Contest","starttime":1107626400,"endtime":1107637200,"problems":[10809,10810,10811,10812,10813]},"114":{"id":114,"name":"Programming Contest for Newbies 2005","starttime":1108209600,"endtime":1108225200,"problems":[10814,10815,10816,10817,10818,10819]},"115":{"id":115,"name":"ACM ICPC World Finals Warmup 1","starttime":1110031200,"endtime":1110049200,"problems":[10820,10821,10822,10823,10824,10825,10826,10827,10828,10829]},"116":{"id":116,"name":"ACM ICPC World Finals Warmup 2","starttime":1111222800,"endtime":1111240800,"problems":[10830,10831,10832,10833,10834,10835,10836,10837,10838,10839]},"117":{"id":117,"name":"Contest ACM-BUAP 2005","starttime":1115474400,"endtime":1115492400,"problems":[10840,10841,10842,10843,10844,10845,10846,10847,10848]},"118":{"id":118,"name":"III Local Contest in Murcia","starttime":1116660600,"endtime":1116675000,"problems":[10849,10850,10851,10852,10853,10854,10855]},"119":{"id":119,"name":"The Next Generation - Contest I","starttime":1117270800,"endtime":1117288800,"problems":[10856,10857,10858,10859,10860,10861,10862,10863,10864]},"120":{"id":120,"name":"University of Alberta/Waterloo Spring Contest","starttime":1118509200,"endtime":1118520000,"problems":[10865,10866,10867,10868,10869]},"121":{"id":121,"name":"June 2005 Monthly Contest","starttime":1119690000,"endtime":1119711600,"problems":[10870,10871,10872,10873,10874,10875,10876,10877]},"122":{"id":122,"name":"UVa Monthly Contest August 2005","starttime":1123318800,"endtime":1123336800,"problems":[10887,10888,10889,10890,10891,10892,10893,10894]},"123":{"id":123,"name":"Abednego's Mathy Contest 2005","starttime":1122742800,"endtime":1122760800,"problems":[10878,10879,10880,10881,10882,10883,10884,10885,10886]},"124":{"id":124,"name":"UVa August 2005 Bonus Contest","starttime":1125133200,"endtime":1125147600,"problems":[10895,10896,10897,10898,10899]},"125":{"id":125,"name":"Waterloo ACM Programming Contest 1 (Fall)","starttime":1126976400,"endtime":1126987200,"problems":[10900,10901,10902,10903,10904]},"126":{"id":126,"name":"ACM ICPC Regional Contest 2005 - Dhaka Site - Semilive","starttime":1127466000,"endtime":1127484000,"problems":[12068,12069,12070,12071,12072,12073,12074,12075]},"127":{"id":127,"name":"Waterloo ACM Programming Contest 2 (Fall)","starttime":1127581200,"endtime":1127592000,"problems":[10915,10916,10917,10918,10919]},"128":{"id":128,"name":"UFRN-2005 Contest 1","starttime":1128166200,"endtime":1128177000,"problems":[10920,10921,10922,10923,10924,10925,10926]},"129":{"id":129,"name":"UFRN-2005 Contest 2","starttime":1128771000,"endtime":1128781800,"problems":[10927,10928,10929,10930,10931,10932,10933]},"130":{"id":130,"name":"A Special Contest","starttime":1129366800,"endtime":1129384800,"problems":[10934,10935,10936,10937,10938,10939,10940,10941,10942]},"131":{"id":131,"name":"UVa Local Qualification Contest","starttime":1129905000,"endtime":1129919400,"problems":[10943,10944,10945,10946,10947,10948]},"132":{"id":132,"name":"IIUC Programming Contest","starttime":1127206800,"endtime":1127224800,"problems":[10905,10906,10907,10908,10909,10910,10911,10912,10913,10914]},"133":{"id":133,"name":"ACM-ICPC Regional Contest Warmup","starttime":1130587200,"endtime":1130608800,"problems":[10949,10950,10951,10952,10953,10954,10955,10956,10957,10958]},"134":{"id":134,"name":"Don Giovanni Contest","starttime":1130932800,"endtime":1130947200,"problems":[10420,10959,10960,10961,10962,10963]},"135":{"id":135,"name":"Amirkabir University of Technology Local Contest - Round 2","starttime":1131600600,"endtime":1131622200,"problems":[10964,10965,10966,10967,10968,10969,10970,10971,10972,10973,10974,10975]},"136":{"id":136,"name":"The 2005 ACM Northwestern European Programming Contest","starttime":1131883200,"endtime":1131901200,"problems":[12076,12077,12078,12079,12080,12081,12082,12083,12084]},"137":{"id":137,"name":"Second Programming Contest for Newbies","starttime":1135771200,"endtime":1135785600,"problems":[10976,10977,10978,10979,10980,10981]},"138":{"id":138,"name":"Abednego's Graph Lovers' Contest 2006","starttime":1137870000,"endtime":1137888000,"problems":[10982,10983,10984,10985,10986,10987,10988,10989]},"139":{"id":139,"name":"Warming up for Warmups","starttime":1139657400,"endtime":1139679000,"problems":[10990,10991,10992,10993,10994]},"140":{"id":140,"name":"Winter Waterloo Contest","starttime":1140890400,"endtime":1140901200,"problems":[10995,10996,10997,10998,10999]},"141":{"id":141,"name":"ACM ICPC World Finals Warmup 1","starttime":1141462800,"endtime":1141480800,"problems":[11004,11005,11006,11007,11008,11009,11010,11011]},"142":{"id":142,"name":"ACM ICPC World Finals Warmup 2","starttime":1142683200,"endtime":1142704800,"problems":[11012,11013,11014,11015,11016,11017,11018,11019,11020]},"143":{"id":143,"name":"ACM ICPC World Finals Warmup 3","starttime":1143900000,"endtime":1143914400,"problems":[11021,11022,11023,11024,11025,11026]},"144":{"id":144,"name":"The Next Generation - Contest II","starttime":1147518000,"endtime":1147530600,"problems":[11027,11028,11029,11030,11031,11032,11033]},"145":{"id":145,"name":"Waterloo Spring Contest 2006","starttime":1148749200,"endtime":1148760000,"problems":[11034,11035,11036,11037,11038]},"146":{"id":146,"name":"IV Local Contest in Murcia 2006","starttime":1149319800,"endtime":1149334200,"problems":[11039,11040,11041,11042,11043,11044,11045,11046,11047]},"147":{"id":147,"name":"ACM ICPC: University of Ulm Local Contest","starttime":1153641600,"endtime":1153659600,"problems":[11048,11049,11050,11051,11052,11053,11054,11055]},"148":{"id":148,"name":"ACM ICPC:: UFRN Qualification Contest (Federal University of Rio Grande do Norte, Brazil)","starttime":1154797200,"endtime":1154815200,"problems":[11056,11057,11058,11059,11060,11061,11062,11063]},"149":{"id":149,"name":"Another German Contest","starttime":1155367800,"endtime":1155385800,"problems":[11064,11065,11066,11067,11068,11069,11070,11071,11072,11073]},"150":{"id":150,"name":"A Bangladeshi Contest","starttime":1157187600,"endtime":1157205600,"problems":[11074,11075,11076,11077,11078,11079,11080,11081,11082,11083]},"151":{"id":151,"name":"5th IIUC Inter-University Programming Contest, 2006","starttime":1157788800,"endtime":1157806800,"problems":[11084,11085,11086,11087,11088,11089,11090,11091,11092,11093]},"152":{"id":152,"name":"Amirkabir UT's Annual Contest 2006 Qualification Round","starttime":1158847200,"endtime":1158861600,"problems":[11094,11095,11096,11097,11098,11099]},"153":{"id":153,"name":"ACM ICPC:: Dhaka Regional Contest","starttime":1159002000,"endtime":1159020000,"problems":[12085,12086,12087,12088,12089,12090,12091,12092,12093,12094]},"154":{"id":154,"name":"Waterloo Fall Contest 1","starttime":1159117200,"endtime":1159128000,"problems":[11100,11101,11102,11103,11104]},"155":{"id":155,"name":"Waterloo Fall Contest 2","starttime":1159635600,"endtime":1159646400,"problems":[11105,11106,11107,11108,11109]},"156":{"id":156,"name":"ACM ICPC:: Regional Contests 2006 - Warmup 1","starttime":1160820000,"endtime":1160841600,"problems":[11118,11119,11120,11121,11122,11123,11124,11125,11126,11127,11128]},"157":{"id":157,"name":"Amirkabir UT Annual Programming Contest Final Round (Sponsored by LG - Maadiran)","starttime":1161932400,"endtime":1161950400,"problems":[11140,11141,11142,11143,11144,11145,11146,11147]},"158":{"id":158,"name":"XX Colombian National Programming Contest","starttime":1160242200,"endtime":1160260200,"problems":[11110,11111,11112,11113,11114,11115,11116,11117]},"159":{"id":159,"name":"ACM-ICPC:: North Western European Regional Contest 2006","starttime":1163932200,"endtime":1163950200,"problems":[12095,12096,12097,12098,12099,12100,12101,12102,12103]},"160":{"id":160,"name":"Alberta Collegiate Programming Contest 2006 - Online Version","starttime":1161514800,"endtime":1161536400,"problems":[11129,11130,11131,11132,11133,11134,11135,11136,11137,11138,11139]},"161":{"id":161,"name":"A Hard Contest! Surprise!!","starttime":1166432400,"endtime":1166518800,"problems":[12104,12105,12106,12107,12108,12109,12110,12111,12112,12113]},"162":{"id":162,"name":"Contest of Newbies 2006","starttime":1167480000,"endtime":1167494400,"problems":[11148,11149,11150,11151,11152,11153]},"163":{"id":163,"name":"ACM ICPC World Finals Warmup 1","starttime":1171702800,"endtime":1171720800,"problems":[11165,11166,11167,11168,11169,11170,11171,11172,11173,11174]},"164":{"id":164,"name":"ACM ICPC World Finals Warmup 2","starttime":1172329200,"endtime":1172347200,"problems":[11175,11176,11177,11178,11179,11180,11181,11182,11183,11184,11185]},"165":{"id":165,"name":"ACM ICPC World Finals Warmup 3","starttime":1172912400,"endtime":1172930400,"problems":[11186,11187,11188,11189,11190,11191,11192,11193,11194]},"166":{"id":166,"name":"Next Generation Contest III","starttime":1169287200,"endtime":1169308800,"problems":[11154,11155,11156,11157,11158,11159,11160,11161,11162,11163,11164]},"167":{"id":167,"name":"Rujia Liu's present 1: A tiny contest of brute force","starttime":1175331600,"endtime":1175349600,"problems":[11195,11196,11197,11198,11199]},"168":{"id":168,"name":"A Big Contest of Brute Force","starttime":1180774800,"endtime":1180861200,"problems":[11208,11209,11210,11211,11212,11213,11214,11215,11216,11217,11218]},"169":{"id":169,"name":"V Olimpiadas Murcianas de Programación","starttime":1179559800,"endtime":1179574200,"problems":[11200,11201,11202,11203,11204,11205,11206,11207]},"170":{"id":170,"name":"A Bangladeshi Contest","starttime":1185638400,"endtime":1185652800,"problems":[11244,11245,11246,11247,11248,11249,11250,11251,11252]},"171":{"id":171,"name":"UW Spring 07","starttime":1184432400,"endtime":1184443200,"problems":[11239,11240,11241,11242,11243]},"172":{"id":172,"name":"ACM ICPC:: UFRN Qualification Contest (Federal University of Rio Grande do Norte, Brazil)","starttime":1181408400,"endtime":1181426400,"problems":[11219,11220,11221,11222,11223,11224,11225,11226,11227,11228,11229]},"173":{"id":173,"name":"Ulm Local Contest","starttime":1183798800,"endtime":1183816800,"problems":[11230,11231,11232,11233,11234,11235,11236,11237,11238]},"174":{"id":174,"name":"Tsinghua-HKUST 2007","starttime":1186207200,"endtime":1186225200,"problems":[11253,11254,11255,11256,11257,11258,11259]},"175":{"id":175,"name":"Sultan's Contest","starttime":1188637200,"endtime":1188655200,"problems":[11260,11261,11262,11263,11264,11265,11266,11267,11268,11269]},"176":{"id":176,"name":"Combinatorics 2007","starttime":1189317600,"endtime":1189360800,"problems":[11270,11271,11272,11273,11274,11275,11276,11277]},"177":{"id":177,"name":"Calgary U Collegiate Programming Contest 2006","starttime":1189846800,"endtime":1189864800,"problems":[11278,11279,11280,11281,11282,11283,11284]},"178":{"id":178,"name":"Waterloo Fall Contest 1","starttime":1190566800,"endtime":1190577600,"problems":[11285,11286,11287,11288,11289]},"179":{"id":179,"name":"Waterloo Fall Contest 2","starttime":1191085200,"endtime":1191096000,"problems":[11290,11291,11292,11293,11294]},"180":{"id":180,"name":"The Relaxation Contest","starttime":1191146400,"endtime":1191175200,"problems":[11295,11296,11297,11298,11299,11300,11301,11302,11303,11304,11305,11306]},"181":{"id":181,"name":"Calgary U Collegiate Programming Contest 2007","starttime":1191661200,"endtime":1191675600,"problems":[11307,11308,11309,11310,11311,11312,11313,11314]},"182":{"id":182,"name":"ICPC Warm-up 2007","starttime":1192878000,"endtime":1192899600,"problems":[11315,11316,11317,11318,11319,11320,11321,11322]},"183":{"id":183,"name":"2007 ACPC Alberta Collegiate Programming\r\nContest","starttime":1193475600,"endtime":1193493600,"problems":[11323,11324,11325,11326,11327,11328,11329,11330,11331,11332]},"184":{"id":184,"name":"ACM ICPC::Dhaka Regional","starttime":1197190800,"endtime":1197208800,"problems":[12114,12115,12116,12117,12118,12119,12120,12121,12122,12123]},"185":{"id":185,"name":"XXI Colombian Programming Contest","starttime":1194073200,"endtime":1194091200,"problems":[11333,11334,11335,11336,11337,11338,11339]},"186":{"id":186,"name":"Nordic Collegiate Programming\r\nContest NCPC 2007","starttime":1196470800,"endtime":1196488800,"problems":[11362,11363,11364,11365,11366,11367,11368,11369,11370]},"187":{"id":187,"name":"Huge Easy Contest","starttime":1194771600,"endtime":1194793200,"problems":[11340,11341,11342,11343,11344,11345,11346,11347,11348,11349,11350,11351,11352]},"188":{"id":188,"name":"ACM ICPC::NWERC Regional","starttime":1195381800,"endtime":1195399800,"problems":[12124,12125,12126,12127,12128,12129,12130,12131,12132,12133]},"189":{"id":189,"name":"Contest of Newbies 2007","starttime":1198929600,"endtime":1198944900,"problems":[11371,11372,11373,11374,11375,11376]},"190":{"id":190,"name":"Next Generation Contest - IV","starttime":1195894800,"endtime":1195912800,"problems":[11353,11354,11355,11356,11357,11358,11359,11360,11361]},"191":{"id":191,"name":"Welcome 2008","starttime":1199523600,"endtime":1199539800,"problems":[11377,11378,11379,11380,11381,11382,11383,11384]},"192":{"id":192,"name":"IIUC Online Contest","starttime":1200128400,"endtime":1200146400,"problems":[11385,11386,11387,11388,11389,11390,11391,11392,11393,11394]},"193":{"id":193,"name":"Hasty Contest","starttime":1200744000,"endtime":1200762000,"problems":[11395,11396,11397,11398,11399,11400,11401,11402,11403]},"194":{"id":194,"name":"World Finals Warmup I","starttime":1205571600,"endtime":1205591400,"problems":[11417,11418,11419,11420,11421,11422,11423,11424,11425,11426]},"195":{"id":195,"name":"World Finals Warmup II","starttime":1206183600,"endtime":1206270000,"problems":[11427,11428,11429,11430,11431,11432,11433,11434,11435,11436]},"196":{"id":196,"name":"World Finals Warmup III","starttime":1206799200,"endtime":1206885600,"problems":[11437,11438,11439,11440,11441,11442,11443,11444,11445,11446]},"198":{"id":198,"name":"Samhita Online Programming Contest 2008 - Public","starttime":1203679800,"endtime":1203694200,"problems":[11404,11405,11406,11407,11408,11409,11410]},"199":{"id":199,"name":"CarteBlanche '08 - Computer Society","starttime":1204115400,"endtime":1204126200,"problems":[11411,11412,11413,11414,11415,11416]},"200":{"id":200,"name":"VI Olimpiadas Murcianas de Programación 2008","starttime":1211009400,"endtime":1211025600,"problems":[11447,11448,11449,11450,11451,11452,11453,11454,11455]},"201":{"id":201,"name":"Waterloo Local Spring 2008","starttime":1214038800,"endtime":1214049600,"problems":[11456,11457,11458,11459,11460]},"202":{"id":202,"name":"Next Generation Contest - 5","starttime":1217761200,"endtime":1217779200,"problems":[11471,11472,11473,11474,11475,11476,11477,11478,11479,11480]},"203":{"id":203,"name":"A Malaysian Contest","starttime":1215871200,"endtime":1215889200,"problems":[11461,11462,11463,11464,11465,11466,11467,11468,11469,11470]},"204":{"id":204,"name":"Brazilian National Contest","starttime":1221937200,"endtime":1221955200,"problems":[11491,11492,11493,11494,11495,11496,11497,11498,11499,11500]},"205":{"id":205,"name":"ACM ICPC::Regional Warmup 1 (Easy version)","starttime":1221310800,"endtime":1221328800,"problems":[11481,11482,11483,11484,11485,11486,11487,11488,11489,11490]},"206":{"id":206,"name":"ACM ICPC::Dhaka Regional Contest (Live)","starttime":1226134800,"endtime":1226154600,"problems":[12134,12135,12136,12137,12138,12139,12140,12141,12142,12143]},"207":{"id":207,"name":"ACM ICPC::South America Regional Contest (Live)","starttime":1226772000,"endtime":1226790000,"problems":[12144,12145,12146,12147,12148,12149,12150,12151,12152,12153,12154]},"208":{"id":208,"name":"ACM ICPC::Kualalumpur Regional Contest (Semi Live)","starttime":1229763600,"endtime":1229788800,"problems":[12155,12156,12157,12158,12159,12160,12161,12162,12163,12164,12165]},"209":{"id":209,"name":"ULAB NCPC 2008","starttime":1224406800,"endtime":1224428400,"problems":[11529,11530,11531,11532,11533,11534,11535,11536,11537]},"210":{"id":210,"name":"U Calgary Local contest","starttime":1225537200,"endtime":1225551600,"problems":[11547,11548,11549,11550,11551,11552,11553,11554]},"211":{"id":211,"name":"XXII Colombian Programming Contest","starttime":1222848000,"endtime":1222866000,"problems":[11506,11507,11508,11509,11510,11511,11512,11513,11514]},"212":{"id":212,"name":"ACM ICPC::Regional Warmup 2","starttime":1223715600,"endtime":1223737200,"problems":[11520,11521,11522,11523,11524,11525,11526,11527,11528]},"213":{"id":213,"name":"Waterloo ACM Programming Contest Fall 1","starttime":1222534800,"endtime":1222545600,"problems":[11501,11502,11503,11504,11505]},"214":{"id":214,"name":"Waterloo ACM Programming Contest Fall 2","starttime":1223139600,"endtime":1223152200,"problems":[11515,11516,11517,11518,11519]},"215":{"id":215,"name":"BUET:: CSE Day Programming Contest 2008","starttime":1224932400,"endtime":1224950400,"problems":[11538,11539,11540,11541,11542,11543,11544,11545,11546]},"216":{"id":216,"name":"ACM ICPC::NWERC Regional Contest","starttime":1227438000,"endtime":1227456000,"problems":[12166,12167,12168,12169,12170,12171,12172,12173,12174,12175]},"217":{"id":217,"name":"One more high level contest","starttime":1229155200,"endtime":1229173200,"problems":[11555,11556,11557,11558,11559,11560,11561,11562,11563,11564]},"218":{"id":218,"name":"Another semi live regional","starttime":1227963600,"endtime":1227981600,"problems":[12176,12177,12178,12179,12180,12181,12182,12183,12184,12185]},"219":{"id":219,"name":"Contest of Newbies V","starttime":1230379200,"endtime":1230393600,"problems":[11565,11566,11567,11568,11569,11570,11571]},"220":{"id":220,"name":"World Finals Warmup I","starttime":1238335200,"endtime":1238421600,"problems":[11587,11588,11589,11590,11591,11592,11593,11594,11595]},"221":{"id":221,"name":"World Finals Warmup II","starttime":1238918400,"endtime":1239004800,"problems":[11596,11597,11598,11599,11600,11601,11602,11603,11604]},"222":{"id":222,"name":"Pre-warmup contest","starttime":1234602000,"endtime":1234612800,"problems":[11572,11573,11574,11575,11576]},"223":{"id":223,"name":"Another high quality contest","starttime":1235206800,"endtime":1235224800,"problems":[11577,11578,11579,11580,11581,11582,11583,11584,11585,11586]},"224":{"id":224,"name":"VII Programming Olympiads in Murcia","starttime":1243063800,"endtime":1243078200,"problems":[11614,11615,11616,11617,11618,11619,11620,11621,11622]},"225":{"id":225,"name":"The first contest of the new season","starttime":1241859600,"endtime":1241877600,"problems":[11605,11606,11607,11608,11609,11610,11611,11612,11613]},"226":{"id":226,"name":"Waterloo Local Spring 2009","starttime":1244916000,"endtime":1244930400,"problems":[11623,11624,11625,11626,11627]},"227":{"id":227,"name":"Brazilian National Contest 2009","starttime":1253390400,"endtime":1253408400,"problems":[11676,11677,11678,11679,11680,11681,11682,11683]},"228":{"id":228,"name":"CUPCAM 2009","starttime":1255766400,"endtime":1255784400,"problems":[11704,11705,11706,11707,11708,11709,11710,11711,11712]},"229":{"id":229,"name":"ACM ICPC South America Regional Contest","starttime":1256414400,"endtime":1256432400,"problems":[12186,12187,12188,12189,12190,12191,12192,12193,12194,12195,12196]},"230":{"id":230,"name":"One more ICPC Regional Contest","starttime":1257584400,"endtime":1257602400,"problems":[12197,12198,12199,12200,12201,12202,12203,12204,12205,12206]},"231":{"id":231,"name":"Yet another Bangladeshi Contest","starttime":1249117200,"endtime":1249135200,"problems":[11636,11637,11638,11639,11640,11641,11642,11643,11644,11645]},"232":{"id":232,"name":"XXIII Colombian Programming Contest","starttime":1252177200,"endtime":1252195200,"problems":[11656,11657,11658,11659,11660,11661,11662,11663,11664,11665]},"233":{"id":233,"name":"ULM Local Contest","starttime":1247907600,"endtime":1247925600,"problems":[11628,11629,11630,11631,11632,11633,11634,11635]},"234":{"id":234,"name":"Regional Warmup 1","starttime":1252846800,"endtime":1252864800,"problems":[11666,11667,11668,11669,11670,11671,11672,11673,11674,11675]},"235":{"id":235,"name":"Once Again! A Bangladeshi Contest","starttime":1250931600,"endtime":1250952300,"problems":[11646,11647,11648,11649,11650,11651,11652,11653,11654,11655]},"236":{"id":236,"name":"Dhaka regional Semi-live","starttime":1256382000,"endtime":1256400000,"problems":[12207,12208,12209,12210,12211,12212,12213,12214,12215,12216,12217]},"237":{"id":237,"name":"Waterloo ACM Programming Contest Fall 1","starttime":1254070800,"endtime":1254081600,"problems":[11684,11685,11686,11687,11688]},"238":{"id":238,"name":"Waterloo ACM Programming Contest Fall 2","starttime":1254675600,"endtime":1254686400,"problems":[11699,11700,11701,11702,11703]},"239":{"id":239,"name":"Nordic Collegiate Programming Contest NCPC 2009","starttime":1254560400,"endtime":1254578400,"problems":[11689,11690,11691,11692,11693,11694,11695,11696,11697,11698]},"240":{"id":240,"name":"Another Regional Contest","starttime":1258182000,"endtime":1258200000,"problems":[12218,12219,12220,12221,12222,12223,12224,12225,12226,12227]},"241":{"id":241,"name":"IIUPC 2009","starttime":1256115600,"endtime":1256133600,"problems":[11713,11714,11715,11716,11717,11718,11719,11720,11721,11722]},"242":{"id":242,"name":"Wuhan Regional Semilive","starttime":1257152400,"endtime":1257170400,"problems":[12228,12229,12230,12231,12232,12233,12234,12235,12236,12237]},"243":{"id":243,"name":"World Finals Warmup I","starttime":1263632400,"endtime":1263651300,"problems":[11752,11753,11754,11755,11756,11757,11758,11759,11760]},"244":{"id":244,"name":"World Finals Warmup II","starttime":1264255200,"endtime":1264273200,"problems":[11761,11762,11763,11764,11765,11766,11767,11768,11769,11770]},"245":{"id":245,"name":"Alkhawarizmi Programming Contest 2009","starttime":1260003600,"endtime":1260021600,"problems":[11723,11724,11725,11726,11727,11728,11729,11730,11731,11732]},"246":{"id":246,"name":"A Bangladeshi Contest","starttime":1261209600,"endtime":1261227600,"problems":[11733,11734,11735,11736,11737,11738,11739,11740,11741]},"247":{"id":247,"name":"National Programming Contest of Bangladesh at SUST","starttime":1271494800,"endtime":1271512800,"problems":[11771,11772,11773,11774,11775,11776,11777,11778,11779]},"248":{"id":248,"name":"A Canadian Contest","starttime":1263024000,"endtime":1263042000,"problems":[11742,11743,11744,11745,11746,11747,11748,11749,11750,11751]},"249":{"id":249,"name":"Smartmatic CONNECT IV","starttime":1272130200,"endtime":1272144600,"problems":[11780,11781,11782,11783,11784,11785]},"250":{"id":250,"name":"VIII Programming Olympiads in Murcia (http://dis.um.es/contest)","starttime":1273908600,"endtime":1273926600,"problems":[11786,11787,11788,11789,11790,11791,11792,11793]},"252":{"id":252,"name":"A Contest from Dinajpur, Bangladesh","starttime":1277539200,"endtime":1277560800,"problems":[11794,11795,11796,11797,11798,11799,11800,11801,11802,11803]},"253":{"id":253,"name":"A Contest from BUBT, Bangladesh","starttime":1277625600,"endtime":1277643600,"problems":[11804,11805,11806,11807,11808,11809,11810,11811,11812]},"254":{"id":254,"name":"Waterloo Local Summer 2010","starttime":1278784800,"endtime":1278795600,"problems":[11813,11814,11815,11816,11817]},"255":{"id":255,"name":"One more National Programming Contest 2010","starttime":1283590800,"endtime":1283617800,"problems":[11818,11819,11820,11821,11822,11823,11824,11825,11826,11827,11828,11829]},"256":{"id":256,"name":"Brazilian National Contest 2010","starttime":1284836400,"endtime":1284854400,"problems":[11830,11831,11832,11833,11834,11835,11836,11837,11838,11839,11840]},"257":{"id":257,"name":"ACM ICPC Latin America Regional Contest","starttime":1287860400,"endtime":1287878400,"problems":[12238,12239,12240,12241,12242,12243,12244,12245,12246,12247,12248]},"258":{"id":258,"name":"Regional Warmup Contest 2010","starttime":1286614800,"endtime":1286658000,"problems":[11859,11860,11861,11862,11863,11864,11865,11866,11867]},"259":{"id":259,"name":"Anupam Bhattacharjee Memorial Contest","starttime":1287928800,"endtime":1287946800,"problems":[11868,11869,11870,11871,11872,11873,11874,11875,11876]},"260":{"id":260,"name":"Dhaka Regional Semilive","starttime":1289052000,"endtime":1289070000,"problems":[12279,12280,12281,12282,12283,12284,12285,12286,12287,12288]},"261":{"id":261,"name":"Kualalumpur Regional Semilive","starttime":1292144400,"endtime":1292180400,"problems":[12249,12250,12251,12252,12253,12254,12255,12256,12257,12258]},"262":{"id":262,"name":"XXIV Colombian Programming Contest","starttime":1284886800,"endtime":1284904800,"problems":[11841,11842,11843,11844,11845,11846,11847,11848]},"263":{"id":263,"name":"Waterloo Local 2010, Fall 1","starttime":1286038800,"endtime":1286049600,"problems":[11849,11850,11851,11852,11853]},"264":{"id":264,"name":"Waterloo Local 2010, Fall 2","starttime":1286125200,"endtime":1286136000,"problems":[11854,11855,11856,11857,11858]},"265":{"id":265,"name":"2010 AUT ACM-ICPC Local Contest","starttime":1288429200,"endtime":1288447200,"problems":[11888,11889,11890,11891,11892,11893,11894,11895,11896,11897,11898]},"266":{"id":266,"name":"The Sixth Hunan Collegiate Programming Contest Semilive","starttime":1288515600,"endtime":1288533600,"problems":[11877,11878,11879,11880,11881,11882,11883,11884,11885,11886,11887]},"267":{"id":267,"name":"NWERC Regional Semilive","starttime":1290333600,"endtime":1290351600,"problems":[12259,12260,12261,12262,12263,12264,12265,12266,12267,12268]},"268":{"id":268,"name":"SWERC Contest","starttime":1290848400,"endtime":1290866400,"problems":[12269,12270,12271,12272,12273,12274,12275,12276,12277,12278]},"269":{"id":269,"name":"World Finals Warmup I","starttime":1296907200,"endtime":1296925200,"problems":[11915,11916,11917,11918,11919,11920,11921,11922,11923,11924]},"270":{"id":270,"name":"World Finals Warmup II","starttime":1304769600,"endtime":1304787600,"problems":[11999,12000,12001,12002,12003,12004,12005,12006,12007,12008]},"271":{"id":271,"name":"A National Bangladeshi Contest","starttime":1294488000,"endtime":1294506000,"problems":[11899,11900,11901,11902,11903,11904,11905,11906,11907,11908]},"272":{"id":272,"name":"Sixth Contest of Newbies","starttime":1296302400,"endtime":1296316800,"problems":[11909,11910,11911,11912,11913,11914]},"273":{"id":273,"name":"Celebration for the 106th Anniversary of Fudan University (1905-2011) & Warmup for ACM/ICPC 2011 World Finals","starttime":1305450000,"endtime":1305536400,"problems":[12009,12010,12011,12012,12013,12014,12015,12016,12017,12018]},"274":{"id":274,"name":"Alberta Collegiate Programming Contest","starttime":1298710800,"endtime":1298728800,"problems":[11925,11926,11927,11928,11929,11930,11931,11932,11933,11934,11935]},"275":{"id":275,"name":"IX Programming Olympiads in Murcia","starttime":1305964800,"endtime":1305979200,"problems":[12019,12020,12021,12022,12023,12024,12025,12026,12027]},"276":{"id":276,"name":"A local contest from México","starttime":1301745600,"endtime":1301760000,"problems":[11936,11937,11938,11939,11940,11941]},"277":{"id":277,"name":"A regional contest from México","starttime":1301817600,"endtime":1301835600,"problems":[11942,11943,11944,11945,11946,11947,11948,11949,11950]},"278":{"id":278,"name":"Rujia Liu's Present 3: A datastructure contest celebrating the 100th anniversary of Tsinghua University","starttime":1303549200,"endtime":1303635600,"problems":[11987,11988,11989,11990,11991,11992,11993,11994,11995,11996,11997,11998]},"279":{"id":279,"name":"Huge Easy Contest II","starttime":1302336000,"endtime":1302422400,"problems":[11951,11952,11953,11954,11955,11956,11957,11958,11959,11960,11961,11962,11963,11964,11965,11966,11967,11968,11969,11970,11971,11972,11973,11974,11975,11976]},"280":{"id":280,"name":"A Contest dedicated to Renat Mullakhanov (rem)","starttime":1302944400,"endtime":1302962400,"problems":[11977,11978,11979,11980,11981,11982,11983,11984,11985,11986]},"281":{"id":281,"name":"Next generation Contest 6","starttime":1308992400,"endtime":1309010400,"problems":[12040,12041,12042,12043,12044,12045,12046,12047,12048,12049]},"282":{"id":282,"name":"Modified National Programming Contest of Bangladesh","starttime":1308474000,"endtime":1308492000,"problems":[12028,12029,12030,12031,12032,12033,12034,12035,12036,12037,12038,12039]},"283":{"id":283,"name":"The Seventh Hunan Collegiate Programming Contest Semilive","starttime":1316250000,"endtime":1316268000,"problems":[12289,12290,12291,12292,12293,12294,12295,12296,12297,12298,12299]},"284":{"id":284,"name":"Rujia Liu's Present 4: A contest dedicated to Geometry and CG lovers","starttime":1317461400,"endtime":1317547800,"problems":[12300,12301,12302,12303,12304,12305,12306,12307,12308,12309,12310,12311,12312,12313,12314]},"285":{"id":285,"name":"XXV Colombian Programming Contest","starttime":1318100400,"endtime":1318118400,"problems":[12315,12316,12317,12318,12319,12320,12321,12322,12323,12324]},"286":{"id":286,"name":"Asia Shanghai Regional Semilive hosted by Fudan University","starttime":1319378400,"endtime":1319464800,"problems":[12325,12326,12327,12328,12329,12330,12331,12332,12333,12334]},"287":{"id":287,"name":"ACM-ICPC Asia Phuket Regional Semilive","starttime":1320580800,"endtime":1320598800,"problems":[12346,12347,12348,12349,12350,12351,12352,12353,12354,12355]},"288":{"id":288,"name":"ACM ICPC Regional Warmup 2011","starttime":1319889600,"endtime":1319907600,"problems":[12335,12336,12337,12338,12339,12340,12341,12342,12343,12344,12345]},"291":{"id":291,"name":"Another Regional Contest to be decided","starttime":1321099200,"endtime":1321117200,"problems":[12356,12357,12358,12359,12360,12361,12362,12363,12364,12365,12366]},"292":{"id":292,"name":"SWERC 2011","starttime":1322380800,"endtime":1322398800,"problems":[12387,12388,12389,12390,12391,12392,12393,12394,12395,12396]},"293":{"id":293,"name":"7th Contest of Newbies","starttime":1325332800,"endtime":1325347200,"problems":[12397,12398,12399,12400,12401,12402]},"294":{"id":294,"name":"Shiraz University Local Contest 2011","starttime":1322298000,"endtime":1322316000,"problems":[12377,12378,12379,12380,12381,12382,12383,12384,12385,12386]},"295":{"id":295,"name":"Rujia Liu's Present 5: Developing simplified softwares","starttime":1326621600,"endtime":1326794400,"problems":[12412,12413,12414,12415,12416,12417,12418,12419,12420,12421,12422,12423]},"296":{"id":296,"name":"World Finals Warmup I","starttime":1330178400,"endtime":1330264800,"problems":[12433,12434,12435,12436,12437,12438,12439,12440,12441,12442,12443]},"297":{"id":297,"name":"Alberta Collegiate Programming Contest 2011","starttime":1333789200,"endtime":1333807200,"problems":[12444,12445,12446,12447,12448,12449,12450,12451,12452,12453]},"298":{"id":298,"name":"An easy Bangladeshi Contest","starttime":1325937600,"endtime":1325955600,"problems":[12403,12404,12405,12406,12407,12408,12409,12410,12411]},"299":{"id":299,"name":"BUET Inter-University Programming Contest - 2011","starttime":1329555600,"endtime":1329573600,"problems":[12424,12425,12426,12427,12428,12429,12430,12431,12432]},"300":{"id":300,"name":"X Programming Olympiads in Murcia (Spain)","starttime":1336203000,"endtime":1336217400,"problems":[12454,12455,12456,12457,12458,12459,12460]}
    //,"301":{"id":301,"name":"Colombian Collegiate Programming League 2012","starttime":1338728400,"endtime":1338746400,"problems":[12461,12462,12463,12464,12465,12466,12467,12468,12469,12470]},"302":{"id":302,"name":"ACM ICPC:: Dhaka Regional Semilive","starttime":1354968000,"endtime":1354986000,"problems":[]},"304":{"id":304,"name":"First Bangladeshi Contest of 2012-2013 Season","starttime":1341651600,"endtime":1341669600,"problems":[12471,12472,12473,12474,12475,12476,12477,12478,12479,12480,12481]},"305":{"id":305,"name":"Latin America - Brazil Sub Regional","starttime":1347732000,"endtime":1347750000,"problems":[12482,12483,12484,12485,12486,12487,12488,12489,12490,12491,12492,12493]},"306":{"id":306,"name":"Latin America Regional","starttime":1352574000,"endtime":1352592000,"problems":[12524,12525,12526,12527,12528,12529,12530,12531,12532,12533]},"307":{"id":307,"name":"An European Regional contest to be decided","starttime":1353747600,"endtime":1353765600,"problems":[]},"308":{"id":308,"name":"The 8th Hunan Collegiate Programming Contest Semilive","starttime":1350205200,"endtime":1350223200,"problems":[12502,12503,12504,12505,12506,12507,12508,12509,12510,12511,12512,12513]},"309":{"id":309,"name":"An Asian Regional contest to be decided","starttime":1353240000,"endtime":1353258000,"problems":[12534,12535,12536,12537,12538,12539,12540,12541,12542,12543]},"310":{"id":310,"name":"Another Bangladeshi Contest","starttime":1349515800,"endtime":1349530200,"problems":[12494,12495,12496,12497,12498,12499,12500,12501]},"311":{"id":311,"name":"XXVI Colombian Programming Contest","starttime":1350761400,"endtime":1350779400,"problems":[12514,12515,12516,12517,12518,12519,12520,12521,12522,12523]},"312":{"id":312,"name":"Rujia Liu's Present 6: Happy 30th Birthday to Myself","starttime":1354438800,"endtime":1354525200,"problems":[]}
    };
      var arr = null;
      var sort_cmp = {
        "id" : function (a,b){ return a.id - b.id },
        "title" : function (a,b){ return a.name < b.name? -1 : (a.name > b.name? 1 : 0); },
        "solved" : function (a,b){ return a.solved - b.solved; },
        "dacu" : function (a,b){ return a.dacu - b.dacu; },
        "nprobs" : function (a,b){ return a.problems.length - b.problems.length; },
        "duration" : function (a,b){ return a.duration - b.duration; },
      };
      
      scope.select_past_contest = function ($event) {
        var el = $event.target;
        var contest_id = el.getAttribute('data-cid');
        select_pnums(contests[contest_id].problems, contest_id);
        scope.render_past_contests();
      };

      scope.render_past_contests = function (n) {
        if (!arr) {
          arr = [];
          for (var id in contests) if (contests.hasOwnProperty(id)){
            var c = contests[id];
            c.duration = Math.ceil((c.endtime - c.starttime)/60/60);
            c.dacu = c.solved = 0;
            for (var i=0; i<c.problems.length; i++){
              var p = uhunt_problems.num(c.problems[i]);
              var s = uhunt.user.stats(p.pid);
              if (s.ac) c.solved++;
              else c.dacu += p.dacu;
            }
            arr.push(c);
          }
          sort_it(vcontest_db.exists('sortby') ? vcontest_db.get('sortby') : 'id');
        }

        scope.vcshadow_view = vcontest_db.get('view');
        if (!n){
          n = vcontest_db.get('n') || 25;
        } else {
          vcontest_db.set('n', n);
        }

        var s = '', sort_desc = !(vcontest_db.get('sortasc'));
        var sort_column = vcontest_db.get('sortby');
        if (!sort_column) sort_column = 'dacu';
        var conf = get_conf(true);
        for (var i=0,cnt=0; i<arr.length && cnt<n; i++){
          var c = arr[i], color = (cnt%2)? (sort_desc? '#BBEEBB' : '#EEBBBB') : (sort_desc? '#CCFFCC' : '#FFCCCC');
          if (scope.vcshadow_view == 'unsolved' && c.solved == c.problems.length) continue;
          if (scope.vcshadow_view == 'solved' && c.solved != c.problems.length) continue;
          if (c.problems.length == 0) continue;
          cnt++;
          s += '<tr height=17 style="'+((c.id == conf.contest_id)?'font-weight:bold':'')+'">' +
              '<td bgcolor="'+(sort_column=='id'?color:'')+'"align=center>' + c.id +
              '<td bgcolor="'+(sort_column=='title'?color:'')+
                '"><a class="ellipsis" style="width:350px; text-decoration:none; cursor:pointer" data-cid="'+ c.id+'"> &nbsp;' + c.name + '</a>' +
              // '<td><a href="javascript:uhunt.vcontest.gen('+c.id+','+userid+',\''+ JSON.stringify(c.problems) +'\')">generate</a>' + 
              '<td bgcolor="'+(sort_column=='solved'?color:'')+'" align=center>' + c.solved +
              '<td bgcolor="'+(sort_column=='nprobs'?color:'')+'" align=center>' + c.problems.length + 
              '<td bgcolor="'+(sort_column=='dacu'?color:'')+'" align=center>' + c.dacu + 
              '<td bgcolor="'+(sort_column=='duration'?color:'')+'" align=center>' + c.duration;
        }
        scope.next_vcshadow = s;
      };

      scope.update_which = function (idx) {
        vcontest_db.set('view', idx);
        scope.render_past_contests();
      };

      function sort_it(by) {
        vcontest_db.set('sortby', by);
        var cmp = sort_cmp[by];
        if (vcontest_db.get('sortasc')){
          arr.sort(cmp);
        } else {
          arr.sort(function(a,b){ return -cmp(a,b); });
        }
      }

      scope.sort_by = function (by) {
        if (vcontest_db.get('sortby') == by){
          var desc = (vcontest_db.get('sortasc')) ? 0 : 1;
          vcontest_db.set('sortasc', desc);
        }
        sort_it(by);
        scope.render_past_contests();
      };

      console.timeEnd('VContestCtrl');
    }
  };
})

;



// .directive('zippy', function(){
//   return {
//     restrict: 'C',
//     replace: true,
//     scope: { title:'@zippyTitle' },
//     template: '<a class="title">{{title}}</a>',
//     link: function(scope, element, attrs) {
//       var title = angular.element(element.children()[0]), opened = true;
//       title.bind('click', toggle);
//       function toggle() {
//         opened = !opened;
//         element.removeClass(opened ? 'closed' : 'opened');
//         element.addClass(opened ? 'opened' : 'closed');
//       }
//       toggle();
//     }
//   }
// });

/*
uhunt.register_visibility_change = function() {
  // http://davidwalsh.name/page-visibility
  var hidden, state, visibilityChange; 
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
    state = "visibilityState";
  } else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
    state = "mozVisibilityState";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
    state = "msVisibilityState";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
    state = "webkitVisibilityState";
  }

  // Add a listener that constantly changes the title
  document.addEventListener(visibilityChange, function() {
    uhunt.observer.notify('visibilitychange', !document[hidden]);
  }, false);
};


function (arr) {
        var updated = false;
        for (var i = 0; i < arr.length; i++) {
          var s = arr[i];
          uhunt.observer.notify('submission', s);
          if (s.uid == userid){
            uhunt.subs.update(s);
            updated = true;
          }
          uhunt_util.adjust_delta_time(s.sbt);
          uhunt.livesubs[0].update(s, arr.length < 20);
        }
        if (arr.length >= 20) {
          uhunt.livesubs[0].update_display();
        }
        if (updated){
          render_all();
        }
      }

      on_out_of_sync: function(){
        uhunt_rpc.subs_since(userid, uhunt.subs.lastId(), 
          function (ret) { parse_subs(JSON.parse(ret.subs)); });
      },


var vcontest = (function(){
  var conf,           // {user_ids, problem_numbers, start_sbt, end_sbt}
    last_subs = [],       // last submissions
    show_n_subs = uhunt_util.parseInt(localStorage['uva-vcontest-show_n_subs']); // # of live submission
    
  function update_status(){
    var status = '';
    if (conf.end_sbt < 1e50){
      var c = uhunt_util.now();
      if (conf.start_sbt > c){
        var t = uhunt.tpl.format_time_v(conf.start_sbt - c, 1);
        if (t===false) status = 'Contest start date: ' + uhunt.tpl.format_date(conf.start_sbt);
        else status = 'Will start in: ' + t;
      }
      else if (conf.end_sbt < c) status = 'Contest has ended';
      else {
        var t = uhunt.tpl.format_time_v(conf.end_sbt - c, 1);
        if (t===false) status = 'Contest end date: ' + uhunt.tpl.format_date(conf.end_sbt);
        else status = 'Time remaining: <font color=yellow>' + t + '</font>';
      }
    }
    $('#contest_status').html(status);
    setTimeout(update_status, 1000);
  }
  
  function parse_subs(arr){
    var render = false;
    for (var i=0; i<arr.length; i++) if (arr[i].type == 'lastsubs'){
      var a = arr[i], s = a.msg, update = false;
      if (!vcontest.relevant_sub(s.uid, s.pid, s.sbt)) continue;
      s.problem = authors.pid2prob(s.pid);
      render = s.is_new = true;
      for (var j=last_subs.length-1; j>=0; j--)
        if (last_subs[j].sid == s.sid){ last_subs[j] = s; update = true; }

      if (s.ver){
        if (!author_ranklist[s.uid]) author_ranklist[s.uid] = { name : s.name, uname : s.uname, subs : [] };
        author_ranklist[s.uid].subs.push([s.sid, s.pid, s.ver, s.run, s.sbt, s.lan, s.rank]);
      }

      if (update) continue;
      last_subs.push(s);

//      while (last_subs.length > 100) last_subs.shift();
    }
    return render;
  }

  function parse_livesubs(arr, out_of_sync){
    if (out_of_sync) return refresh_last_subs(monitor);
    if (parse_subs(arr)){
      render_ranklist();
      render_livesubs();
    }
    monitor();  
  }

  var shadow_i = 0, shadow_sbt_offset = 0;
  function run_shadows(){
    if (!conf.contest) return;
    var subs = conf.contest.subs, arr = [], cur = now();
    while (shadow_i < subs.length){
      var s = subs[shadow_i];
      if (s.sbt > cur) break;
      arr.push({type:'lastsubs', msg:s});
      shadow_i++;
    }
    if (arr.length > 0 && parse_subs(arr)){
      render_ranklist();
      render_livesubs();
    }
    setTimeout(run_shadows, 1000);
  }
  
  function populate_last_subs(arr){
    last_subs = [];
    for (var uid in arr) if (arr.hasOwnProperty(uid)){
      var a = arr[uid];
      for (var i=0; i<a.subs.length; i++){
        var s = { uid:uid, name: a.name, uname: a.uname,
          sid:uhunt_util.parseInt(a.subs[i][0]),
          pid:uhunt_util.parseInt(a.subs[i][1]),
          ver:uhunt_util.parseInt(a.subs[i][2]),
          run:uhunt_util.parseInt(a.subs[i][3]),
          sbt:uhunt_util.parseInt(a.subs[i][4]),
          lan:uhunt_util.parseInt(a.subs[i][5]),
          rank:uhunt_util.parseInt(a.subs[i][6]),
        };
        //if (!vcontest.relevant_sub(s.uid, s.pid, s.sbt)) continue;
        s.problem = authors.pid2prob(s.pid);
        var update = false;
        for (var j=last_subs.length-1; j>=0; j--)
          if (last_subs[j].sid == s.sid){ last_subs[j] = s; update = true; }
        if (update) continue;
        last_subs.push(s);
      }
    }
    last_subs.sort(function(a,b){ return a.sbt - b.sbt; });
//    while (last_subs.length > 100) last_subs.shift();
  }

  var author_ranklist = {};

  function render_ranklist(){
    // $('#'+conf.ranklist_container).html(uhunt.tpl.render('ranklist_table',{
    //   problem_numbers: conf.problem_numbers,
    //   author_scores: authors.prepare(author_ranklist, conf.problem_numbers, conf.start_sbt),
    //   include_past_subs: conf.include_past_subs,
    //   include_shadows: conf.include_shadows,
    //   has_shadows: conf.contest_id,
    //   user_ids: conf.user_ids
    // }));
  }

  function monitor(){
    // uva.get_livesubs(parse_livesubs);
  }

  function refresh_last_subs(cb){
    console.log('Refresh Last Subs');
    // fetch all user submissions on particular problem
    uhunt.rpc.subs_nums(conf.user_ids, conf.problem_numbers, function(arr){
      if (conf.include_shadows && conf.contest){ // add from the contest subs
        var subs = conf.contest.subs, cur = now();
        for (var i=0; i<subs.length; i++){
          var s = subs[i];
          if (s.sbt > cur) break;
          if (!arr[s.uid]) arr[s.uid] = { name : s.name, uname : s.uname, subs : [] };
          arr[s.uid].subs.push([s.sid, s.pid, s.ver, s.run, s.sbt, s.lan, s.rank]);
        }
      }
      populate_last_subs(arr);
      author_ranklist = arr;
      render_ranklist();
      render_livesubs();
      cb();
    });
  }

  return {
    start: function(c){
      if (!c) alert('Virtual contest configuration needed!'); else conf = c;
      if (c.contest_id && !c.contest){
        uva.get_contest_detail(c.contest_id,function(cd){
          c.problem_numbers = cd.problems;
          c.contest = cd;
          $('#contest_title').html(cd.name);
          cd.subs.sort(function(a,b){ return a[4] - b[4]; }); // sort by submittime
          if (conf.start_sbt){
            conf.include_shadows = true;
            conf.end_sbt = conf.start_sbt + cd.endtime - cd.starttime;
          } else {
            alert('Please specify the start time of the shadow contest');
          }

          // adjust the submittime of the shadow
          var diff = c.start_sbt - cd.starttime;
          if (diff < 0) alert('Error start time of the shadow contest');
          for (var i=0; i<cd.subs.length; i++) cd.subs[i][4] += diff;

          vcontest.start(c);
        });
        return;
      }

      if (!conf.start_sbt) conf.start_sbt = 861120280;  // first UVa submission
      
      if (!conf.end_sbt || conf.end_sbt <= conf.start_sbt)
        conf.end_sbt = 1e100;             // infinite, never end

      for (var i=0; i<conf.user_ids.length; i++)
        authors.add_uid(conf.user_ids[i]);

      authors.resolve_pnums(conf.problem_numbers, function(){
        if (conf.contest){
          var subs = conf.contest.subs;
          for (var i=0; i<subs.length; i++){
            var s = subs[i];
            subs[i] = {
              sid : i+1,
              pid : authors.num2pid(s[0]),
              ver : s[1],
              run : s[2],
              mem : 0,
              uid : 's' + s[3],
              sbt : s[4],
              lan : s[5],
              name : s[6],
              uname : s[7],
              rank : -1,
            };
            authors.add_uid(subs[i].uid);
          }
        }
        $(function(){     // execute when DOM is ready
          run_shadows();
          render_ranklist();
          refresh_last_subs(monitor);
          update_status();
        });
      });
    },

    relevant_sub : function (uid,pid,sbt){
      if (!conf.include_past_subs && uhunt_util.parseInt(sbt) < conf.start_sbt) return false;
      if (uhunt_util.parseInt(sbt) > conf.end_sbt) return false;
      return authors.is_valid(uid,pid);
    },

    set_show_n_subs: function(n){
      show_n_subs = localStorage['uva-vcontest-show_n_subs'] = n;
      render_livesubs();
    },

    toggle_include_past_subs: function(){
      var a = $('#include_past_subs_chk');
      conf.include_past_subs = a.is(':checked');
      render_ranklist();
      render_livesubs();
    },
    
    toggle_shadows: function(){
      var a = $('#include_shadow_chk');
      conf.include_shadows = a.is(':checked');
      render_ranklist();
      render_livesubs();
    },
    
    toggle_livesubs: function(){
      $('#show_livesubs_a').toggle();
      var t = $('#'+conf.livesubs_container);
      if (t.is(":hidden")){
        localStorage['show_livesubs'] = '1';
        t.slideDown('fast');
      } else {
        localStorage['show_livesubs'] = 0;
        t.slideUp('fast');
      }
    },
  };
})();

var authors = (function(){
  var valid_uid = {}, num2prob = {}, pid_map = {};

  return {
    add_uid : function(uid){ valid_uid[uid] = true; },

    is_valid : function(uid,pid){
      if (!valid_uid[uid]) return false;
      if (!pid_map[pid]) return false;
      return true;
    },
    
    resolve_pnums : function(nums,cb){
      var cnt = nums.length;
      $.each(nums,function(i,num){
        uhunt.rpc.problem_by_num(num, function(p){    // fetch problem details
          num2prob[p.num] = pid_map[p.pid] = p;
          if (--cnt == 0) cb();
        });
      });
    },

    num2pid : function(num){ return num2prob[num].pid; },
    pid2prob : function(pid){ return pid_map[pid]; },

    prepare : function (arr, problem_numbers, start_sbt){
      var author_scores = [];
      for (var uid in arr) if (arr.hasOwnProperty(uid)){
        var a = arr[uid];
        a.uid = uid;
        a.subs.sort(function sid_cmp(a,b){ return a[0] - b[0]; });
        a.solved = a.penalty = 0;
        var p = {}; // [[0:sid, 1:pid, 2:ver, 3:run, 4:sbt, 5:lan, 6:rank]]
        for (var i=0; i<a.subs.length; i++){
          var s = a.subs[i], pid = intval(s[1]);
          if (!vcontest.relevant_sub(a.uid, pid, intval(s[4]))) continue;
          if (!p[pid]) p[pid] = { nos:0, ac:0 };
          if (p[pid].ac) continue;
          if (s[2]==90){
            p[pid].ac = 1;
            p[pid].sbt = intval(s[4]) - start_sbt;
            a.solved++;
            a.penalty += p[pid].sbt + p[pid].nos * 20 * 60;
          } else {
            p[pid].nos++;
          }
        }
        a.problems = [];
        for (var j=0; j<problem_numbers.length; j++){
          var pid = num2prob[problem_numbers[j]].pid;
          a.problems.push(p[pid]);
        }
        author_scores.push(a);
      }
      author_scores.sort(function solved_pen_cmp(a,b){
        return (a.solved != b.solved)? (b.solved - a.solved) : (a.penalty - b.penalty);
      });
      return author_scores;
    }
  };
})();


uhunt.init = function () {
  $('#uhunt_widget_chat').html(uhunt.chat.render({
    width: $('#uhunt_widget_chat').width(),
    height: $('#uhunt_widget_chat').height(),
    uname_width: 140,
    font_family: "verdana",
    font_size: 11,
    post_field_height: 18,
    background_color: "#eee",
    border_color: "#aaa"}));
};

// uhunt.tpl.format_time_v = function(w,back) {
//   if (back<=5 && w < 60) { return Math.ceil(w) + ' seconds'; }
//   if (back<=4 && w < 60*60) { return Math.floor(w/60) + ' minutes'; }
//   if (back<=3 && w < 24*60*60) { return Math.floor(w/60/60) + ' hours ' + (Math.floor(w/60)%60) + ' minutes'; }
//   if (back<=2 && w < 30*24*60*60) { return Math.floor(w/60/60/24) + ' days'; }
//   if (back<=1 && w < 365*24*60*60) { return Math.floor(w/60/60/24/30) + ' months'; }
//   return false;
// };


//     if (uhunt.algorithmist.exists(p.num)) pwidth -= 20;
// + (p?('<span style="float:right">'+uhunt.tpl.discuss_link(p.num)+'&nbsp;</span> &nbsp;' + 
//                 uhunt.tpl.problem_title(p.pid,p.tit,pwidth)):'- ? -') + 

*/
