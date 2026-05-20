import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          padding: '40px 24px', textAlign: 'center', borderRadius: 20,
          background: '#fef2f2', border: '1px solid #fecaca', margin: '20px 0',
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>⚠️</p>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#991b1b', marginBottom: 8 }}>
            계산기 로딩 중 오류가 발생했습니다
          </h3>
          <p style={{ fontSize: 13, color: '#b91c1c', lineHeight: 1.7, marginBottom: 16 }}>
            페이지를 새로고침하거나 다른 계산기를 이용해주세요.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); }}
            style={{
              padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700,
              background: '#dc2626', color: '#fff', cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
