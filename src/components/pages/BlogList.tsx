import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ARTICLES } from '../../data/articles';
import { Clock, ChevronRight, Search } from 'lucide-react';

export function BlogList({ isDark }: { isDark: boolean }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const titleColor = isDark ? '#f5f5f7' : '#1d1d1f';
  const mutedColor = isDark ? '#8e8e93' : '#6e6e73';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const surfaceBg = isDark ? '#1c1c1e' : '#ffffff';

  const categories = ['all', ...new Set(ARTICLES.map(a => a.category))];
  
  const filtered = ARTICLES.filter(a => {
    const matchCat = filter === 'all' || a.category === filter;
    const matchSearch = !searchQuery.trim() || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '80vh', padding: '40px 0 80px' }}>
      <Helmet>
        <title>재테크 가이드 — 별의별 계산기 블로그</title>
        <meta name="description" content="대출, 세금, 투자, 부동산, 노무 등 실생활 재테크 지식을 쉽게 풀어드립니다. 계산기와 함께 활용하세요." />
        <link rel="canonical" href="https://jeongbu.vercel.app/blog" />
      </Helmet>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>📚</span>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: titleColor, letterSpacing: '-0.03em' }}>재테크 가이드</h1>
          </div>
          <p style={{ fontSize: 15, color: mutedColor, lineHeight: 1.7 }}>
            대출·세금·투자·부동산·노무 — 복잡한 재테크 지식을 쉽게 풀어드립니다
          </p>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
          background: surfaceBg, borderRadius: 14, border: `1px solid ${borderColor}`,
          marginBottom: 20,
        }}>
          <Search size={16} color={mutedColor} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="가이드 검색..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14,
              background: 'transparent', color: titleColor, fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{
                padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                background: filter === cat ? '#6366f1' : (isDark ? '#2c2c2e' : '#f2f2f7'),
                color: filter === cat ? '#fff' : mutedColor,
                border: filter === cat ? '1px solid #6366f1' : `1px solid ${borderColor}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {cat === 'all' ? '전체' : cat}
            </button>
          ))}
        </div>

        {/* Article count */}
        <p style={{ fontSize: 12, fontWeight: 700, color: mutedColor, marginBottom: 16, letterSpacing: '0.05em' }}>
          {filtered.length}개의 가이드
        </p>

        {/* Article Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((article) => (
            <button key={article.id} onClick={() => navigate(`/blog/${article.id}`)}
              style={{
                padding: 24, borderRadius: 20, textAlign: 'left', width: '100%',
                background: surfaceBg, border: `1px solid ${borderColor}`,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                  background: '#eef2ff', color: '#6366f1',
                }}>{article.category}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: mutedColor }}>
                  <Clock size={10} /> {article.readTime}
                </span>
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: titleColor, lineHeight: 1.45 }}>
                {article.title}
              </h2>
              <p style={{ fontSize: 13, color: mutedColor, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {article.summary}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 6,
                    background: isDark ? '#2c2c2e' : '#f5f5f7', color: mutedColor,
                  }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#6366f1', marginTop: 4 }}>
                자세히 읽기 <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', color: mutedColor }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>🔍</p>
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
