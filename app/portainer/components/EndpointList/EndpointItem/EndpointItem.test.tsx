import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { EndpointItem } from './EndpointItem';

test('loads component', async () => {
  const endpoint = {
    TagIds: [],
    GroupName: 'unassigned',
    Type: 1,
    Name: 'endpoint',
    Status: 1,
    URL: 'url',
    Snapshots: [],
    Kubernetes: { Snapshots: [] },
    Id: 3,
  };
  const { getByText } = render(
    <EndpointItem
      onEdit={() => {}}
      onClick={() => {}}
      tags={[]}
      model={endpoint}
      isAdmin
      endpointInitTime={0}
    />
  );

  expect(getByText(endpoint.Name)).toBeInTheDocument();
});
