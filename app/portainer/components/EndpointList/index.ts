import { react2angular } from '@/react-tools/react2angular';

import { EndpointList } from './EndpointList';

export { EndpointList };

export const EndpointListAngular = react2angular(EndpointList, [
  'titleText',
  'titleIcon',
  'endpoints',
  'tags',
  'onClickItem',
  'onRefresh',
  'isRefreshVisible',
  'onEdit',
  'isAdmin',
  'totalCount',
  'retrievePage',
  'endpointInitTime',
]);
