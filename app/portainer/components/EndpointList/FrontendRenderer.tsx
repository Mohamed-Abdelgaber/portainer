import { ReactNode } from 'react';
import _ from 'lodash-es';

import {
  Environment,
  EnvironmentStatus,
  Tag,
} from '@/portainer/environments/types';

import { GenericRenderer } from './GenericRenderer';

interface Props {
  footer(totalCount: number): ReactNode;
  children(environment: Environment): ReactNode;
  page: number;
  pageLimit: number;
  textFilter: string;
  endpoints?: Environment[];
  tags?: Tag[];
}

export function FrontendRenderer({
  textFilter,
  endpoints,
  tags,
  pageLimit,
  page,
  children,
  footer,
}: Props) {
  const filteredEndpoints = filterEndpoints(endpoints, tags, textFilter);
  const totalCount = filteredEndpoints.length;

  if (!totalCount) {
    return (
      <GenericRenderer>
        <div className="text-center text-muted" data-cy="home-noEndpoints">
          No environments available.
        </div>
      </GenericRenderer>
    );
  }

  const currentPageEndpoints = paginate(filteredEndpoints, page, pageLimit);

  return (
    <GenericRenderer footer={footer(totalCount)}>
      {currentPageEndpoints.map((endpoint) => children(endpoint))}
    </GenericRenderer>
  );
}

function filterEndpoints(
  endpoints: Environment[] = [],
  tags: Tag[] = [],
  textFilter = ''
) {
  if (!endpoints.length || !textFilter) {
    return endpoints;
  }

  const keywords = textFilter.split(' ');

  return endpoints.filter((endpoint) => {
    const statusString = convertStatusToString(endpoint.Status);
    const endpointTags = _.compact(
      endpoint.TagIds.map((id) => tags.find((t) => t.Id === id))
    );

    return keywords
      .map((k) => k.toLowerCase())
      .every(
        (keyword) =>
          endpoint.Name.toLowerCase().includes(keyword) ||
          endpoint.GroupName.toLowerCase().includes(keyword) ||
          endpoint.URL.toLowerCase().includes(keyword) ||
          endpointTags.some((tag) =>
            tag.Name.toLowerCase().includes(keyword)
          ) ||
          statusString.includes(keyword)
      );
  });
}

function paginate<T>(array: T[] = [], page = 1, pageLimit = 10) {
  if (pageLimit === 0) {
    return array;
  }

  const start = (page - 1) * pageLimit;
  const end = start + pageLimit;

  return array.slice(start, end);
}

function convertStatusToString(status: EnvironmentStatus): string {
  return EnvironmentStatus[status].toLowerCase();
}
