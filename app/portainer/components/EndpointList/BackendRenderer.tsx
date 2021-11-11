import { useState, useEffect, useCallback, ReactNode } from 'react';

import { Environment } from '@/portainer/environments/types';

import { GenericRenderer } from './GenericRenderer';

export interface RetrievePageResult {
  endpoints: Environment[];
  totalCount: number;
}

interface Props {
  footer(totalCount: number): ReactNode;
  children(environment: Environment): ReactNode;
  page: number;
  pageLimit: number;
  retrievePage(
    start: number,
    pageLimit: number,
    textFilter: string
  ): Promise<RetrievePageResult>;
  textFilter: string;
}

export function BackendRenderer({
  textFilter,
  children,
  footer,
  pageLimit,
  retrievePage,
  page,
}: Props) {
  const [endpoints, setEndpoints] = useState<Environment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadEndpoints = useCallback(async (textFilter, pageLimit, page) => {
    setIsLoading(true);
    setEndpoints([]);

    const start = (page - 1) * pageLimit + 1;
    const { endpoints, totalCount } = await retrievePage(
      start,
      pageLimit,
      textFilter
    );
    setEndpoints(endpoints);
    setTotalCount(totalCount);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadEndpoints(textFilter, pageLimit, page);
  }, [textFilter, pageLimit, page, loadEndpoints]);

  if (isLoading) {
    return (
      <GenericRenderer>
        <div className="text-center text-muted" data-cy="home-loadingEndpoints">
          Loading...
        </div>
      </GenericRenderer>
    );
  }

  if (!totalCount) {
    return (
      <GenericRenderer>
        <div className="text-center text-muted" data-cy="home-noEndpoints">
          No environments available.
        </div>
      </GenericRenderer>
    );
  }

  return (
    <GenericRenderer footer={footer(totalCount)}>
      {endpoints.map((endpoint) => children(endpoint))}
    </GenericRenderer>
  );
}
