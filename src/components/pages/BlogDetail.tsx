import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ARTICLES } from '../../data/articles';
import { Clock, Tag, ChevronLeft, ChevronRight, Calculator } from 'lucide-react';

export function BlogDetail({ isDark, articleId: propArticleId }: { isDark: boolean; articleId?: string }) {
  const { articleId: routeArticleId } = useParams();
  const articleId = propArticleId || routeArticleId;
  const navigate = useNavigate();
  const article = ARTICLES.find(a => a.id === articleId);

  const titleColor = isDark ? '#f5f5f7' : '#1d1d1f';
  const bodyColor = isDark ? 'rgba(235,235,245,0.85)' : '#3a3a3c';
  const mutedColor = isDark ? '#8e8e93' : '#6e6e73';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const surfaceBg = isDark ? '#1c1c1e' : '#ffffff';

  if (!article) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>📭</p>
        <p style={{ color: mutedColor, fontSize: 16 }}>존재하지 않는 가이드입니다.</p>
        <button onClick={() => navigate('/blog')} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 12, background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: 14 }}>
          가이드 목록으로
        </button>
      </div>
    );
  }

  // Find related articles (same category)
  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div style={{ minHeight: '80vh', padding: '40px 0 80px' }}>
      <Helmet>
        <title>{article.title} — 별의별 계산기</title>
        <meta name="description" content={article.summary} />
        <meta name="keywords" content={article.tags.join(', ')} />
        <link rel="canonical" href={`https://jeongbu.vercel.app/blog/${article.id}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.summary,
            "author": { "@type": "Organization", "name": "별의별 계산기" },
            "publisher": { "@type": "Organization", "name": "별의별 계산기" },
            "url": `https://jeongbu.vercel.app/blog/${article.id}`,
          })}
        </script>
      </Helmet>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: mutedColor, marginBottom: 32 }}>
          <button onClick={() => navigate('/')} style={{ fontWeight: 600, color: mutedColor }}>🏠 홈</button>
          <ChevronRight size={11} />
          <button onClick={() => navigate('/blog')} style={{ fontWeight: 600, color: mutedColor }}>📚 가이드</button>
          <ChevronRight size={11} />
          <span style={{ color: titleColor, fontWeight: 700 }}>{article.category}</span>
        </nav>

        {/* Article Header */}
        <header style={{ marginBottom: 36, paddingBottom: 28, borderBottom: `2px solid ${borderColor}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: '#eef2ff', color: '#6366f1' }}>{article.category}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: mutedColor }}>
              <Clock size={12} /> {article.readTime} 읽기
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: titleColor, lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: 14 }}>
            {article.title}
          </h1>
          <p style={{ fontSize: 16, color: mutedColor, lineHeight: 1.8 }}>
            {article.summary}
          </p>
        </header>

        {/* Article Body */}
        <article style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {article.content.map((block, i) => {
            if (block.startsWith('## ')) {
              return <h2 key={i} style={{ fontSize: 20, fontWeight: 800, color: titleColor, letterSpacing: '-0.02em', marginTop: 12, lineHeight: 1.4, paddingBottom: 12, borderBottom: `2px solid rgba(99,102,241,0.15)` }}>{block.slice(3)}</h2>;
            }
            if (block.startsWith('### ')) {
              return <h3 key={i} style={{ fontSize: 17, fontWeight: 800, color: titleColor, marginTop: 6 }}>{block.slice(4)}</h3>;
            }
            if (block.startsWith('💡')) {
              return <div key={i} style={{ padding: '16px 20px', borderRadius: 16, fontSize: 14, lineHeight: 1.85, background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1px solid rgba(99,102,241,0.2)', color: '#4338ca' }}>{block}</div>;
            }
            if (block.startsWith('📌')) {
              return <div key={i} style={{ padding: '16px 20px', borderRadius: 16, fontSize: 14, lineHeight: 1.85, background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontWeight: 600 }}>{block}</div>;
            }
            return <p key={i} style={{ fontSize: 15, color: bodyColor, lineHeight: 2.0 }}>{block}</p>;
          })}
        </article>

        {/* CTA: Go to calculator */}
        {article.calcId && article.catId && (
          <div style={{
            marginTop: 36, padding: '24px 28px', borderRadius: 20,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
          }}
            onClick={() => navigate(`/calc/${article.catId}/${article.calcId}`)}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.8, marginBottom: 6 }}>📐 직접 계산해보기</p>
              <p style={{ fontSize: 16, fontWeight: 800 }}>관련 계산기로 이동 →</p>
            </div>
            <Calculator size={28} style={{ opacity: 0.6 }} />
          </div>
        )}

        {/* Tags */}
        <div style={{ paddingTop: 24, marginTop: 28, borderTop: `1px solid ${borderColor}`, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {article.tags.map(tag => (
            <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '5px 13px', borderRadius: 99, background: isDark ? '#2c2c2e' : '#f2f2f7', color: mutedColor }}>
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 12, padding: '14px 18px', borderRadius: 16, lineHeight: 1.75, marginTop: 20, background: isDark ? 'rgba(255,149,0,0.08)' : '#fff8ee', color: isDark ? '#ff9500' : '#92400e', border: `1px solid ${isDark ? 'rgba(255,149,0,0.15)' : '#fde68a'}` }}>
          ⚠️ 본 가이드는 참고용이며, 중요한 재무·법률 결정 전에는 전문가 상담을 권장합니다.
        </p>

        {/* Related Articles */}
        {related.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: titleColor, marginBottom: 20 }}>📖 관련 가이드</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {related.map(r => (
                <button key={r.id} onClick={() => { navigate(`/blog/${r.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    padding: '18px 20px', borderRadius: 16, textAlign: 'left', width: '100%',
                    background: surfaceBg, border: `1px solid ${borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: titleColor, marginBottom: 4 }}>{r.title}</p>
                    <p style={{ fontSize: 12, color: mutedColor }}>{r.readTime} 읽기</p>
                  </div>
                  <ChevronRight size={16} color={mutedColor} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          <button onClick={() => navigate('/blog')}
            style={{ padding: '12px 28px', borderRadius: 14, fontSize: 14, fontWeight: 700, background: isDark ? '#2c2c2e' : '#f2f2f7', color: mutedColor, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ChevronLeft size={16} /> 가이드 목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
