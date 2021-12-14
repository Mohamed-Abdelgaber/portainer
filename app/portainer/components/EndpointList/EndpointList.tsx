import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { Widget, WidgetBody } from '@/portainer/components/widget';
import { PaginationControls } from '@/portainer/components/pagination-controls';
import { usePaginationLimitState } from '@/common/hooks/usePaginationLimitState';
import { useTextFilterState } from '@/common/hooks/useTextFilterState';
import {
  Environment,
  EnvironmentId,
  Tag,
} from '@/portainer/environments/types';

import { EndpointItem } from './EndpointItem';
import { BackendRenderer, RetrievePageResult } from './BackendRenderer';
import { FrontendRenderer } from './FrontendRenderer';
import { KubeconfigButton } from './KubeconfigButton';

interface EndpointListProps {
  endpointInitTime: number;
  endpoints?: Environment[];
  isAdmin: boolean;
  isRefreshVisible: boolean;
  onClickItem(environment: Environment): void;
  onEdit(id: EnvironmentId): void;
  onRefresh(): void;
  retrievePage(
    start: number,
    pageLimit: number,
    textFilter: string
  ): Promise<RetrievePageResult>;
  tags?: Tag[];
  titleIcon: string;
  titleText: string;
  totalCount: number;
}

export function EndpointList({
  titleText,
  titleIcon,
  endpoints,
  tags,
  onClickItem,
  onRefresh,
  isRefreshVisible,
  onEdit,
  isAdmin,
  totalCount,
  retrievePage,
  endpointInitTime,
}: EndpointListProps) {
  const storageKey = 'home_endpoints';

  const [textFilter, setTextFilter] = useTextFilterState(storageKey);
  const [pageLimit, setPageLimit] = usePaginationLimitState(storageKey);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [textFilter]);

  const hasBackendPagination = totalCount > 100;

  const ListRenderer = hasBackendPagination
    ? BackendRenderer
    : FrontendRenderer;

  return (
    <div className="datatable">
      <Widget>
        <WidgetBody className="no-padding">
          <div className="toolBar">
            <div className="toolBarTitle">
              <i
                className={clsx('fa', titleIcon, 'space-right')}
                aria-hidden="true"
              />
              {titleText}
            </div>
          </div>

          <div className="actionBar">
            <div style={{ marginBottom: '10px' }}>
              <i className="fa fa-exclamation-circle blue-icon space-right" />
              Click on an environment to manage
            </div>

            {isRefreshVisible && (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={onRefresh}
                data-cy="home-refreshEndpointsButton"
              >
                <i className="fa fa-sync space-right" aria-hidden="true" />
                Refresh
              </button>
            )}

            <KubeconfigButton endpoints={endpoints} />
          </div>

          <div className="searchBar">
            <i className="fa fa-search searchIcon" aria-hidden="true" />
            <input
              type="text"
              className="searchInput"
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
              placeholder="Search by name, group, tag, status, URL..."
              autoFocus
              data-cy="home-endpointsSearchInput"
            />
          </div>

          <ListRenderer
            endpoints={endpoints}
            textFilter={textFilter}
            tags={tags}
            pageLimit={pageLimit}
            retrievePage={retrievePage}
            page={page}
            footer={(totalCount) => (
              <div className="footer">
                <PaginationControls
                  showAll={!hasBackendPagination}
                  pageLimit={pageLimit}
                  page={page}
                  onPageChange={setPage}
                  totalCount={totalCount}
                  onPageLimitChange={setPageLimit}
                />
              </div>
            )}
          >
            {(endpoint) => (
              <EndpointItem
                key={endpoint.Id}
                model={endpoint}
                onClick={onClickItem}
                onEdit={onEdit}
                isAdmin={isAdmin}
                tags={tags}
                endpointInitTime={endpointInitTime}
              />
            )}
          </ListRenderer>
        </WidgetBody>
      </Widget>
    </div>
  );
}
