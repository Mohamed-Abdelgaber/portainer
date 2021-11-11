import clsx from 'clsx';
import type { MouseEvent } from 'react';

import {
  isoDateFromTimestamp,
  endpointStatusBadge,
  humanize,
  stripProtocol,
} from '@/portainer/filters/filters';
import { idsToTagNames } from '@/portainer/helpers/tagHelper';
import {
  Environment,
  EnvironmentId,
  EnvironmentType,
  Tag,
  TagId,
} from '@/portainer/environments/types';

import { EndpointIcon } from './EndpointIcon';
import { EdgeIndicator } from './EdgeIndicator';
import { EndpointStats } from './EndpointStats';

interface EndpointItemProps {
  endpointInitTime: number;
  isAdmin: boolean;
  model: Environment;
  onClick(environment: Environment): void;
  onEdit(id: EnvironmentId): void;
  tags?: Tag[];
}

export function EndpointItem({
  model,
  onClick,
  onEdit,
  isAdmin,
  tags,
  endpointInitTime,
}: EndpointItemProps) {
  const endpointTags = joinTags(tags, model.TagIds);
  const isEdgeEndpoint = model.Type === 4 || model.Type === 7;

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events
    <div
      role="button"
      className="blocklist-item"
      onClick={() => onClick(model)}
    >
      <div className="blocklist-item-box">
        <span
          className={clsx('blocklist-item-logo', 'endpoint-item', {
            azure: model.Type === 3,
          })}
        >
          <EndpointIcon type={model.Type} />
        </span>

        <span className="col-sm-12">
          <div className="blocklist-item-line endpoint-item">
            <span>
              <span className="blocklist-item-title endpoint-item">
                {model.Name}
              </span>
              <span className="space-left blocklist-item-subtitle">
                {isEdgeEndpoint ? (
                  <EdgeIndicator
                    edgeId={model.EdgeID}
                    checkInInterval={model.EdgeCheckinInterval}
                    lastCheckInDate={model.LastCheckInDate}
                    endpointInitTime={endpointInitTime}
                  />
                ) : (
                  <span>
                    <span
                      className={clsx(
                        `label`,
                        `label-${endpointStatusBadge(model.Status)}`
                      )}
                    >
                      {model.Status === 1 ? 'up' : 'down'}
                    </span>
                    {model.Snapshots.length > 0 && (
                      <span className="space-left small text-muted">
                        {isoDateFromTimestamp(model.Snapshots[0].Time)}
                      </span>
                    )}
                    {model.Kubernetes.Snapshots.length > 0 && (
                      <span className="space-left small text-muted">
                        {isoDateFromTimestamp(
                          model.Kubernetes.Snapshots[0].Time
                        )}
                      </span>
                    )}
                  </span>
                )}
              </span>
            </span>
            <span>
              {!!model.GroupName && (
                <span className="small">Group: {model.GroupName}</span>
              )}
              {isAdmin && (
                <button
                  className="btn btn-link btn-xs"
                  type="button"
                  onClick={handleEditClick}
                >
                  <i className="fa fa-pencil-alt" />
                </button>
              )}
            </span>
          </div>

          <EndpointStats model={model} />

          <div className="blocklist-item-line endpoint-item">
            <span className="small text-muted">
              {[
                EnvironmentType.Docker,
                EnvironmentType.AgentOnDocker,
                EnvironmentType.EdgeAgentOnDocker,
              ].includes(model.Type) && (
                <span>
                  {model.Snapshots.length > 0 && (
                    <span className="small text-muted">
                      <i className="fa fa-microchip space-right" />
                      {model.Snapshots[0].TotalCPU}
                      <i className="fa fa-memory space-left space-right" />
                      {humanize(model.Snapshots[0].TotalMemory)}
                    </span>
                  )}
                  <span className="space-left space-right">-</span>
                </span>
              )}

              <span>
                <i className="fa fa-tags space-right" aria-hidden="true" />
                {endpointTags.length > 0 ? endpointTags : 'No tags'}
              </span>
            </span>

            {!isEdgeEndpoint && (
              <span className="small text-muted">
                {stripProtocol(model.URL)}
              </span>
            )}
          </div>
        </span>
      </div>
    </div>
  );

  function handleEditClick(event: MouseEvent) {
    event.stopPropagation();
    onEdit(model.Id);
  }
}

function joinTags(tags: Tag[] = [], tagIds: TagId[]) {
  if (!tags) {
    return 'Loading tags...';
  }

  if (!tagIds || !tagIds.length) {
    return '';
  }

  const tagNames = idsToTagNames(tags, tagIds);
  return tagNames.join(',');
}
