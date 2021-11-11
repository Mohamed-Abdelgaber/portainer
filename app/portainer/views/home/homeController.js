import EndpointHelper from 'Portainer/helpers/endpointHelper';

angular
  .module('portainer.app')
  .controller('HomeController', function (
    $scope,
    $state,
    TagService,
    Authentication,
    EndpointService,
    GroupService,
    Notifications,
    EndpointProvider,
    StateManager,
    ModalService,
    MotdService
  ) {
    $scope.state = {
      connectingToEdgeEndpoint: false,
      homepageLoadTime: '',
    };

    $scope.goToEdit = function (id) {
      $state.go('portainer.endpoints.endpoint', { id: id });
    };

    $scope.goToDashboard = function (endpoint) {
      if (endpoint.Type === 3) {
        $state.go('azure.dashboard', { endpointId: endpoint.Id });
        return;
      }
      if (endpoint.Type === 4 || endpoint.Type === 7) {
        if (!endpoint.EdgeID) {
          $state.go('portainer.endpoints.endpoint', { id: endpoint.Id });
          return;
        }
        $scope.state.connectingToEdgeEndpoint = true;
      }
      if (endpoint.Type === 5 || endpoint.Type === 6 || endpoint.Type === 7) {
        $state.go('kubernetes.dashboard', { endpointId: endpoint.Id });
        return;
      }
      $state.go('docker.dashboard', { endpointId: endpoint.Id });
    };

    $scope.dismissImportantInformation = function (hash) {
      StateManager.dismissImportantInformation(hash);
    };

    $scope.dismissInformationPanel = function (id) {
      StateManager.dismissInformationPanel(id);
    };

    $scope.triggerSnapshot = function () {
      ModalService.confirmEndpointSnapshot(function (result) {
        if (!result) {
          return;
        }
        triggerSnapshot();
      });
    };

    function triggerSnapshot() {
      EndpointService.snapshotEndpoints()
        .then(function success() {
          Notifications.success('Success', 'Environments updated');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'An error occurred during environment snapshot');
        });
    }

    $scope.getPaginatedEndpoints = getPaginatedEndpoints;
    function getPaginatedEndpoints(lastId, limit, search) {
      return Promise.all([EndpointService.endpoints(lastId, limit, { search }), GroupService.groups()])
        .then(function success([endpoints, groups]) {
          EndpointHelper.mapGroupNameToEndpoint(endpoints.value, groups);
          EndpointProvider.setEndpoints(endpoints.value);
          return { endpoints: endpoints.value, totalCount: +endpoints.totalCount };
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to retrieve environment information');
        });
    }

    async function initView() {
      return $scope.$evalAsync(async () => {
        $scope.state.homepageLoadTime = Math.floor(Date.now() / 1000);
        $scope.isAdmin = Authentication.isAdmin();

        MotdService.motd().then(function success(data) {
          $scope.motd = data;
        });

        try {
          const tags = await TagService.tags();
          $scope.tags = tags;
        } catch (err) {
          Notifications.error('Failed loading page data', err);
        }
      });
    }

    initView();
  });
