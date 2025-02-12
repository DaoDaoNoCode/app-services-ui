import React, { VoidFunctionComponent } from 'react';
import { Redirect, Route, RouteComponentProps, Switch, useHistory } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import { ErrorBoundary } from 'react-error-boundary';
import getBaseName from './utils/getBaseName';
import {
  DevelopmentPreview,
  AppServicesPageNotFound,
  AppServicesEmptyState,
  AppServicesEmptyStateVariant,
} from '@rhoas/app-services-ui-components';
import { AppRouteConfig, flattenedRoutes, IAppRoute, PageNotFoundRoute, useA11yRouteChange } from '@app/utils/Routing';
import { useDocumentTitle } from '@app/utils';
import { KafkaMainView } from '@app/pages/Kafka';
import { BasenameContext } from '@rhoas/app-services-ui-shared';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@patternfly/react-core';

const QuickStartLoaderFederated = React.lazy(() => import('@app/pages/Resources/QuickStartLoaderFederated'));

const APIManagementPage = React.lazy(() => import('@app/pages/APIManagement/APIManagementPage'));
const ArtifactRedirect = React.lazy(() => import('@app/pages/ServiceRegistry/ArtifactsRedirect'));
const Artifacts = React.lazy(() => import('@app/pages/ServiceRegistry/Artifacts'));
const ArtifactVersionDetails = React.lazy(() => import('@app/pages/ServiceRegistry/ArtifactVersion'));
const DataSciencePage = React.lazy(() => import('@app/pages/DataScience/DataSciencePage'));

const KasPage = React.lazy(() => import('@app/pages/Kas/KasPage'));
const OverviewPage = React.lazy(() => import('@app/pages/Overview/OverviewPage'));
const ResourcesPage = React.lazy(() => import('@app/pages/Resources/ResourcesPage'));
const RulesPage = React.lazy(() => import('@app/pages/ServiceRegistry/RulesPage'));
const RolesPage = React.lazy(() => import('@app/pages/ServiceRegistry/RolesPage'));
const ServiceAccountsPage = React.lazy(() => import('@app/pages/ServiceAccounts/ServiceAccountsPage'));
const CosPage = React.lazy(() => import('@app/pages/CosPage/CosPage'));
const ServiceRegistryPage = React.lazy(() => import('@app/pages/ServiceRegistry/ServiceRegistryPage'));

const RedirectToOverview: React.FunctionComponent = () => <Redirect to="/overview" />;
const RedirectToStreamsKafkas: React.FunctionComponent = () => <Redirect to="/streams/kafkas" />;
const RedirectToServiceAccounts: React.FunctionComponent = () => <Redirect to="/service-accounts" />;
const RedirectToResources: React.FunctionComponent = () => <Redirect to="/learning-resources" />;

const appRoutes: AppRouteConfig<any>[] = [
  {
    component: KafkaMainView,
    label: 'Streams for Apache Kafka',
    path: '/streams/kafkas/:id',
    title: 'Streams for Apache Kafka | Red Hat OpenShift Application Services',
    basename: '/streams/kafkas/:id',
    devPreview: false,
  },
  {
    // Handle the redirect from application-services/streams to application-services/streams/kafkas
    component: RedirectToStreamsKafkas,
    exact: true,
    label: 'Streams for Apache Kafka',
    path: '/streams',
    title: 'Streams for Apache Kafka | Red Hat OpenShift Application Services',
  },
  {
    component: RedirectToStreamsKafkas,
    // Handle the redirect for the old url application-services/openshift-streams to application-services/streams/kafkas
    exact: true,
    label: 'Streams for Apache Kafka',
    path: '/openshift-streams',
    title: 'Streams for Apache Kafka | Red Hat OpenShift Application Services',
  },
  {
    component: KasPage,
    exact: true,
    label: 'Streams for Apache Kafka',
    path: '/streams/kafkas',
    title: 'Streams for Apache Kafka | Red Hat OpenShift Application Services',
    basename: '/streams/kafkas',
    devPreview: false,
  },
  {
    component: ServiceRegistryPage,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: Artifacts,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: Artifacts,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/artifacts',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: RulesPage,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/rules',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: RolesPage,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/roles',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: ArtifactRedirect,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/artifacts/:groupId/:artifactId',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: ArtifactVersionDetails,
    exact: true,
    label: 'Service Registry',
    path: '/service-registry/t/:tenantId/artifacts/:groupId/:artifactId/versions/:version',
    title: 'Service Registry | Red Hat OpenShift Application Services',
    basename: '/service-registry',
  },
  {
    component: CosPage,
    exact: false,
    label: 'COS',
    path: '/cos',
    title: 'COS',
    basename: `${getBaseName(window.location.pathname)}/cos`,
    devPreview: true,
  },
  {
    component: ServiceAccountsPage,
    exact: true,
    label: 'Service Accounts',
    path: '/service-accounts',
    title: 'Service Accounts | Red Hat OpenShift Application Services',
    devPreview: false,
  },
  {
    component: RedirectToServiceAccounts,
    exact: true,
    label: 'Service Accounts',
    path: '/streams/service-accounts',
    title: 'Service Accounts | Red Hat OpenShift Application Services',
    devPreview: false,
  },
  {
    component: OverviewPage,
    exact: true,
    label: 'Overview',
    path: '/overview',
    title: 'Overview | Red Hat OpenShift Application Services',
  },
  {
    component: RedirectToOverview,
    exact: true,
    label: 'Overview',
    path: '/',
    title: 'Overview | Red Hat OpenShift Application Services',
  },
  {
    component: APIManagementPage,
    exact: true,
    label: 'API Management',
    path: '/api-management',
    title: 'API Management | Red Hat OpenShift Application Services',
  },
  {
    component: DataSciencePage,
    exact: true,
    label: 'Data Science',
    path: '/data-science',
    title: 'Data Science | Red Hat OpenShift Application Services',
  },
  {
    // Handle the redirect for the old url application-services/streams/resources to application-services/learning-resources
    component: RedirectToResources,
    label: 'QuickStarts for Red Hat OpenShift Application Services',
    path: '/streams/resources',
    title: 'QuickStarts for Red Hat OpenShift Application Services',
    devPreview: true,
  },
  {
    component: ResourcesPage,
    exact: true,
    label: 'Learning Resources | Red Hat OpenShift Application Services',
    path: '/learning-resources',
    title: 'Learning Resources | Red Hat OpenShift Application Services',
    devPreview: false,
  },
];

const WrappedRoute: React.FunctionComponent<IAppRoute<any>> = ({
  component: Component,
  isAsync = false,
  title,
  basename,
  devPreview,
  ...rest
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);
  const getBasename = () => {
    return basename || '';
  };
  const onClickButton = () => history.push('/');

  function wrapRoute(routeProps: RouteComponentProps) {
    return (
      <ErrorBoundary
        fallbackRender={({ error }) =>
          error.message === '404' ? (
            <AppServicesPageNotFound />
          ) : (
            <AppServicesEmptyState
              emptyStateProps={{
                variant: AppServicesEmptyStateVariant.UnexpectedError,
              }}
              emptyStateIconProps={{
                className: 'icon-color',
              }}
              titleProps={{
                title: t('common:something_went_wrong'),
              }}
              emptyStateBodyProps={{
                body: t('common:unexpected_error'),
              }}
            >
              <Button onClick={onClickButton}>{t('common:return_to_home_page')}</Button>
            </AppServicesEmptyState>
          )
        }
      >
        <DevelopmentPreview show={devPreview}>
          <BasenameContext.Provider value={{ getBasename }}>
            <Component {...rest} {...routeProps} />
          </BasenameContext.Provider>
        </DevelopmentPreview>
      </ErrorBoundary>
    );
  }

  return <Route render={wrapRoute} {...rest} />;
};

const AppRoutes: VoidFunctionComponent = () => {
  return (
    <>
      <LastLocationProvider>
        <React.Suspense fallback={<AppServicesLoading />}>
          <Switch>
            {flattenedRoutes(appRoutes).map(({ path, exact, component, title, isAsync, ...rest }, idx) => (
              <WrappedRoute
                path={path}
                exact={exact}
                component={component}
                key={idx}
                title={title}
                isAsync={isAsync}
                {...rest}
              />
            ))}
            <PageNotFoundRoute title="404 Page Not Found" />
          </Switch>
        </React.Suspense>
      </LastLocationProvider>
      <QuickStartLoaderFederated />
    </>
  );
};

export { AppRoutes, appRoutes };
