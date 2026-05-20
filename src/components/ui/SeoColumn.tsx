
interface Props {
  title: string;
  content: string;
  isDark: boolean;
}

export function SeoColumn({ title, content, isDark }: Props) {
  const bg = isDark ? '#1c1c1e' : '#f9f9fb';
  const color = isDark ? '#a1a1aa' : '#6e6e73';
  const borderColor = isDark ? 'rgba(255,255,255,0.05)' : '#e5e5ea';

  return (
    <article style={{
      marginTop: 40,
      padding: '24px 28px',
      background: bg,
      borderRadius: 16,
      border: `1px solid ${borderColor}`,
    }}>
      <h3 style={{
        fontSize: 15,
        fontWeight: 800,
        marginBottom: 12,
        color: isDark ? '#f4f4f5' : '#1d1d1f'
      }}>{title}</h3>
      <div style={{
        fontSize: 13,
        lineHeight: 1.8,
        color: color,
        whiteSpace: 'pre-wrap'
      }}>
        {content}
      </div>
    </article>
  );
}
