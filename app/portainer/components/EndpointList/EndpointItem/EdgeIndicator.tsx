import clsx from 'clsx';

import { isoDateFromTimestamp } from '@/portainer/filters/filters';

interface Props {
  checkInInterval?: number;
  edgeId?: string;
  endpointInitTime: number;
  lastCheckInDate?: number;
}

export function EdgeIndicator({
  edgeId,
  lastCheckInDate,
  checkInInterval,
  endpointInitTime,
}: Props) {
  if (!edgeId || !lastCheckInDate || !checkInInterval) {
    return (
      <span className="label label-default">
        <s>associated</s>
      </span>
    );
  }

  // give checkIn some wiggle room
  const isCheckInValid =
    endpointInitTime - lastCheckInDate <= checkInInterval * 2 + 20;

  return (
    <span>
      <span
        className={clsx('label', {
          'label-danger': !isCheckInValid,
          'label-success': isCheckInValid,
        })}
      >
        heartbeat
      </span>

      {!!lastCheckInDate && (
        <span className="space-left small text-muted">
          {isoDateFromTimestamp(lastCheckInDate)}
        </span>
      )}
    </span>
  );
}
