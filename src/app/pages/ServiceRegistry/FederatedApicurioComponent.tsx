import React, { VoidFunctionComponent } from 'react';
import { ConfigType, createApicurioConfig } from '@app/pages/ServiceRegistry/utils';
import { FederatedModule, usePrincipal } from '@app/components';
import { useHistory, useParams } from 'react-router-dom';
import { Registry } from '@rhoas/registry-management-sdk';
import { useAuth, useBasename, useConfig } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';

export type FederatedApicurioComponentProps = {
  module: string;
  registry: Registry | undefined;
  topicName?: string;
  groupId?: string | null | undefined;
  version?: string;
  registryId?: string;
  basename?: string;
  fileName?: string;
  downloadLinkLabel?: string;
};

type ServiceRegistryParams = {
  groupId: string;
  artifactId: string;
  version: string;
};

export const FederatedApicurioComponent: React.FC<FederatedApicurioComponentProps> = ({ module, ...rest }) => {
  return (
    <FederatedModule
      scope="apicurio_registry"
      module={module}
      fallback={<AppServicesLoading />}
      render={(component) => <ServiceAccountsPageConnected Component={component} {...rest} />}
    />
  );
};

const ServiceAccountsPageConnected: VoidFunctionComponent<
  { Component: React.LazyExoticComponent<any> } & Omit<FederatedApicurioComponentProps, 'module'>
> = ({ Component, registry, ...rest }) => {
  let federateConfig: ConfigType;
  const auth = useAuth();
  const config = useConfig();
  const history = useHistory();
  const basename = useBasename();
  const getToken = auth?.apicurio_registry.getToken;
  const currentlyLoggedInuser = auth?.getUsername() || '';

  const { groupId, artifactId, version } = useParams<ServiceRegistryParams>();
  const { getAllPrincipals } = usePrincipal();

  if (config === undefined || registry === undefined) {
    return <AppServicesLoading />;
  }

  const principals = getAllPrincipals()?.filter((p) => p.id !== currentlyLoggedInuser && p.id !== registry?.owner);

  if (getToken && basename) {
    federateConfig = createApicurioConfig(
      config,
      registry.registryUrl as string,
      `${basename.getBasename()}/t/${registry?.id}`,
      getToken,
      principals
    );
    return (
      <Component
        config={federateConfig}
        tenantId={registry.id}
        groupId={groupId}
        artifactId={artifactId}
        version={version}
        history={history}
        {...rest}
      />
    );
  }
  return null;
};
