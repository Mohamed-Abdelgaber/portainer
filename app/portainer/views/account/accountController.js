angular.module('portainer.app').controller('AccountController', [
  '$scope',
  '$state',
  'Authentication',
  'UserService',
  'Notifications',
  'SettingsService',
  'StateManager',
  'ThemeManager',
  'ModalService',
  function ($scope, $state, Authentication, UserService, Notifications, SettingsService, StateManager, ThemeManager, ModalService) {
    $scope.formValues = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      userTheme: '',
    };

    $scope.updatePassword = function () {
      UserService.updateUserPassword($scope.userID, $scope.formValues.currentPassword, $scope.formValues.newPassword)
        .then(function success() {
          Notifications.success('Success', 'Password successfully updated');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, err.msg);
        });
    };

    $scope.removeAction = (selectedTokens) => {
      const msg = 'Do you want to remove the selected access token(s)? Any script or application using these tokens will no longer be able to invoke the Portainer API.';

      ModalService.confirmDeletion(msg, function (confirmed) {
        if (!confirmed) {
          return;
        }
        let actionCount = selectedTokens.length;
        selectedTokens.forEach((token) => {
          UserService.deleteAccessToken($scope.userID, token.id)
            .then(() => {
              Notifications.success('Token successfully removed');
              var index = $scope.tokens.indexOf(token);
              $scope.tokens.splice(index, 1);
            })
            .catch((err) => {
              Notifications.error('Failure', err, 'Unable to remove token');
            })
            .finally(() => {
              --actionCount;
              if (actionCount === 0) {
                $state.reload();
              }
            });
        });
      });
    };

    // Update DOM for theme attribute & LocalStorage
    $scope.setTheme = function (theme) {
      ThemeManager.setTheme(theme);
      StateManager.updateTheme(theme);
    };

    // Rest API Call to update theme with userID in DB
    $scope.updateTheme = function () {
      UserService.updateUserTheme($scope.userID, $scope.formValues.userTheme)
        .then(function success() {
          Notifications.success('Success', 'User theme successfully updated');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, err.msg);
        });
    };

    async function initView() {
      const state = StateManager.getState();
      $scope.isDemo = state.application.isDemo;
      const user = Authentication.getUserDetails();
      $scope.userID = user.ID;
      $scope.isInitialUser = user.initialUser;

      const data = await UserService.user($scope.userID);

      $scope.formValues.userTheme = data.UserTheme;

      SettingsService.publicSettings()
        .then(function success(data) {
          $scope.AuthenticationMethod = data.AuthenticationMethod;
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve application settings');
        });

      UserService.getAccessTokens($scope.userID)
        .then(function success(data) {
          $scope.tokens = data;
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve user tokens');
        });
    }

    initView();
  },
]);
