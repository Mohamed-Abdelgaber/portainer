package main

import (
	"github.com/pkg/errors"
	portainer "github.com/portainer/portainer/api"
	"github.com/portainer/portainer/api/dataservices"
)

func initDemoData(
	store dataservices.DataStore,
	cryptoService portainer.CryptoService,
) error {
	err := initDemoUser(store, cryptoService)
	if err != nil {
		return errors.WithMessage(err, "failed creating demo user")
	}

	err = initDemoEndpoint(store)
	if err != nil {
		return errors.WithMessage(err, "failed creating demo endpoint")
	}

	err = initDemoSettings(store)
	if err != nil {
		return errors.WithMessage(err, "failed updating demo settings")
	}

	return nil
}

func initDemoUser(
	store dataservices.DataStore,
	cryptoService portainer.CryptoService,
) error {

	password, err := cryptoService.Hash("tryportainer")
	if err != nil {
		return errors.WithMessage(err, "failed creating password hash")
	}

	admin := &portainer.User{
		Username: "admin",
		Password: password,
		Role:     portainer.AdministratorRole,
	}

	err = store.User().Create(admin)
	return errors.WithMessage(err, "failed creating user")

}

func initDemoEndpoint(
	store dataservices.DataStore,
) error {

	localEndpoint := &portainer.Endpoint{
		ID:        portainer.EndpointID(1),
		Name:      "local",
		URL:       "unix:///var/run/docker.sock",
		PublicURL: "demo.portainer.io",
		Type:      portainer.DockerEnvironment,
		GroupID:   portainer.EndpointGroupID(1),
		TLSConfig: portainer.TLSConfiguration{
			TLS: false,
		},
		AuthorizedUsers:    []portainer.UserID{},
		AuthorizedTeams:    []portainer.TeamID{},
		UserAccessPolicies: portainer.UserAccessPolicies{},
		TeamAccessPolicies: portainer.TeamAccessPolicies{},
		Extensions:         []portainer.EndpointExtension{},
		TagIDs:             []portainer.TagID{},
		Status:             portainer.EndpointStatusUp,
		Snapshots:          []portainer.DockerSnapshot{},
		Kubernetes:         portainer.KubernetesDefault(),
	}

	err := store.Endpoint().Create(localEndpoint)
	return errors.WithMessage(err, "failed creating endpoint")
}

func initDemoSettings(
	store dataservices.DataStore,
) error {
	settings, err := store.Settings().Settings()
	if err != nil {
		return errors.WithMessage(err, "failed fetching settings")
	}

	settings.EnableTelemetry = false

	err = store.Settings().UpdateSettings(settings)
	return errors.WithMessage(err, "failed updating settings")
}
