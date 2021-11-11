import { PropsWithChildren, ReactNode } from 'react';

interface Props {
  footer?: ReactNode;
}

export function GenericRenderer({
  children,
  footer,
}: PropsWithChildren<Props>) {
  return (
    <>
      <div className="blocklist">{children}</div>
      <div className="footer">{footer}</div>
    </>
  );
}
