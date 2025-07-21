import { Badge } from '@mantine/core';

interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <Badge
      size="xs"
      variant="filled"
      color="red"
      style={{
        position: 'absolute',
        top: -8,
        right: -8,
        minWidth: '18px',
        height: '18px',
        padding: '0 4px',
        fontSize: '10px',
        fontWeight: 600,
        borderRadius: '9px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        border: '2px solid white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
      }}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
}