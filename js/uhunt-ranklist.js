angular.module('uHunt.ranklist', ['uHunt.base'])

.factory('ranklist_db', function (create_uhunt_db) {
  return create_uhunt_db('ranklist', {
    'nabove': 'int',
    'nbelow': 'int',
  });
})

.directive('uhuntRanklist', function (uhunt_rpc, ranklist_db, uhunt) {
  return {
    replace: true,
    // scope: { number:'=uhuntProblemSearch', show:'=', hide:'=', search:'=', },
    templateUrl: 'partials/ranklist.html',
    link: function (scope, element, attrs) {
      console.time('RanklistCtrl');
      function rank_cmp(a,b) { return a.rank - b.rank; }
      scope.show = function (key, val) { ranklist_db.set(key, val); render(); }
      function render() {
        var nabove = ranklist_db.get('nabove') || 10;
        var nbelow = ranklist_db.get('nbelow') || 10;
        uhunt_rpc.ranklist(uhunt.user.uid, nabove, nbelow, function (arr) {
          arr.sort(rank_cmp);
          scope.ranklist = arr;
          for (var i = 0; i < arr.length; i++)
            if (arr[i].userid == uhunt.user.uid)
              arr[i].font_weight = 'bold';
        });
      }
      render();
      /*
      var ac = submissions.ac_pids.length;
      var canvas = $('#percentile_canvas').html(;
      var width = 200, height = 475;
      if (!canvas.getContext) return;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,width+10,height+10);

      var x1 = 20.5, y1 = 20.5, x2 = width-50.5, y2 = height-50.5;

      // Filled triangle
      ctx.beginPath();
      ctx.moveTo(x2,y2);
      var mx = Math.log(solved_percentile[1]);
      var sum = 0, mine = 0, mxh = Math.log(solved_percentile.length);
      for (var i=1; i<solved_percentile.length; i++){
        var w = solved_percentile[i];
        if (i >= 16) sum += w;
        if (i <= ac) mine = sum;
        if (w) w = Math.log(w) / mx * (x2-x1);
        h = Math.log(i) / mxh * (y2-y1);
        ctx.lineTo(x2-w, y2 - h);

      }
      ctx.fillStyle = '#ADF';
      ctx.fill();


      ctx.fillStyle = '#000';
      ctx.strokeStyle = "#000";

      ctx.beginPath(); ctx.moveTo(x2,y1); ctx.lineTo(x2,y2); ctx.stroke(); // Y axis
      ctx.beginPath(); ctx.moveTo(x1,y2); ctx.lineTo(x2,y2); ctx.stroke(); // X axis

      for (var i=1; i<=solved_percentile.length; i*=2){
        var h = Math.floor(Math.log(i) / mxh * (y2-y1));
        ctx.beginPath();
        ctx.moveTo(x2,y2-h);
        ctx.lineTo(x2+5,y2-h);
        ctx.fillText(i, x2+10, y2-h+3);
        ctx.stroke();
      }

      var mxw = Math.log(10000);
      for (var i=1; i<=10000; i*=2){
        var w = Math.floor(Math.log(i) / mxw * (x2-x1));
        ctx.beginPath();
        if (i==16 || i== 256 || i==4096){
          ctx.moveTo(x2-w,y2);
          ctx.lineTo(x2-w,y2+8);
          ctx.fillText(i, x2-w-Math.log(i)*1.5, y2+20);
        } else {
          ctx.moveTo(x2-w,y2);
          ctx.lineTo(x2-w,y2+4);
        }
        ctx.stroke();
      }

      var p = Math.floor(mine/sum * 1000000) / 10000,
        h = ac==0? 0 : Math.floor(Math.log(ac) / mxh * (y2-y1));
      ctx.beginPath();
      ctx.moveTo(x1,y2-h); ctx.lineTo(x2,y2-h);
      ctx.font = "12px sans-serif";
      ctx.fillText('You are here', x1, y2-h-3);
      ctx.fillText('Percentile: ' + p, x1, y2-h+15);
      ctx.fillText('Frequency', x1, y2+35);
      ctx.fillText('Solved', x2+5, y1-5);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      */
      console.timeEnd('RanklistCtrl');
    }
  };
})

;