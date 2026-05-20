import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
  calc: {
    id: string;
    name: string;
    desc: string;
    emoji?: string;
    tags?: string[];
  };
  categoryName?: string;
  categoryId?: string;
  article?: {
    title: string;
    summary: string;
    content: string[];
  } | null;
}

export function JsonLd({ calc, categoryName, categoryId, article }: JsonLdProps) {
  const baseUrl = 'https://jeongbu.vercel.app';
  const calcUrl = categoryId ? `${baseUrl}/calc/${categoryId}/${calc.id}` : baseUrl;

  // 1. SoftwareApplication schema
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": calc.name,
    "description": calc.desc,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": calcUrl,
    "inLanguage": "ko",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
    "author": {
      "@type": "Organization",
      "name": "별의별 계산기",
      "url": baseUrl
    }
  };

  // 2. BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": baseUrl
      },
      ...(categoryName && categoryId ? [{
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${baseUrl}/calc/${categoryId}`
      }] : []),
      {
        "@type": "ListItem",
        "position": categoryName ? 3 : 2,
        "name": calc.name,
        "item": calcUrl
      }
    ]
  };

  // 3. FAQPage schema — generate FAQ from article content
  const faqItems: { question: string; answer: string }[] = [];
  if (article) {
    let currentHeading = '';
    let currentContent: string[] = [];
    article.content.forEach((block) => {
      if (block.startsWith('## ')) {
        if (currentHeading && currentContent.length > 0) {
          faqItems.push({
            question: currentHeading + '은 무엇인가요?',
            answer: currentContent.join(' ').slice(0, 300)
          });
        }
        currentHeading = block.slice(3);
        currentContent = [];
      } else if (!block.startsWith('### ')) {
        currentContent.push(block.replace(/^[💡📌⚠️]\s*/, ''));
      }
    });
    if (currentHeading && currentContent.length > 0) {
      faqItems.push({
        question: currentHeading + '은 무엇인가요?',
        answer: currentContent.join(' ').slice(0, 300)
      });
    }
  }
  // Add default FAQ
  faqItems.push(
    { question: `${calc.name} 결과는 정확한가요?`, answer: `${calc.name}의 계산 결과는 최신 법률 및 요율을 기반으로 제공되지만, 참고용입니다. 정확한 금액은 개인 상황에 따라 다를 수 있으므로 전문가 상담을 권장합니다.` },
    { question: `${calc.name}는 무료인가요?`, answer: `네, 별의별 계산기의 모든 계산기는 완전 무료이며, 회원가입이나 개인정보 입력 없이 바로 사용할 수 있습니다.` }
  );

  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.slice(0, 6).map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(appSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
}
