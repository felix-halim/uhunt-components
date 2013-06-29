'use strict';

angular.module('uHunt.livesubs', ['uHunt.base'])

.factory('livesubs_db', function (create_uhunt_db) {
  return create_uhunt_db('livesubs', {
    'show': 'bool',
    'limit': 'int',
  });
})

.directive('uhuntLivesubs', function (livesubs_db, uhunt_poll, uhunt) {
  return {
    replace: true,
    templateUrl: 'partials/livesubs.html',
    link: function (scope, element, attrs) {
      scope.limit = livesubs_db.get('limit') || 5;
      scope.show = livesubs_db.exists('show') ? livesubs_db.get('show') : true;
      livesubs_db.scope_setter(scope, ['limit', 'show']);
      scope.live_submissions = uhunt_poll.live_submissions;
      scope.livesub_url = uhunt.livesub_url;
    }
  }
})

;
