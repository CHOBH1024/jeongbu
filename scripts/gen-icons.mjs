import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// Claude 로고 볼트 path (기존 favicon.svg 기반)
const boltPath = 'M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z';

// 512x512 아이콘용 SVG — 보라 그라디언트 배경 + 흰 볼트
const makeSvg = (size) => {
  const scale = size / 512;
  // 볼트 원래 viewBox: 48x46 → 512x512 정사각형에 패딩 포함 스케일
  const boltW = 48, boltH = 46;
  const pad = size * 0.14;
  const boltScale = (size - pad * 2) / Math.max(boltW, boltH);
  const tx = pad + (size - pad * 2 - boltW * boltScale) / 2;
  const ty = pad + (size - pad * 2 - boltH * boltScale) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="60%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <clipPath id="round">
      <rect width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#round)">
    <rect width="${size}" height="${size}" fill="url(#bg)"/>
    <rect width="${size}" height="${size}" fill="url(#shine)"/>
    <g transform="translate(${tx}, ${ty}) scale(${boltScale})">
      <path d="${boltPath}" fill="white"/>
    </g>
  </g>
</svg>`;
};

// 아이콘 사이즈 목록
const sizes = [16, 32, 180, 192, 512];

for (const s of sizes) {
  const svg = makeSvg(s);
  const svgPath = `/tmp/icon-${s}.svg`;
  writeFileSync(svgPath, svg);
  execSync(`npx --yes sharp-cli -i ${svgPath} -o /home/user/jeongbu/public/icon-${s}.png resize ${s} ${s}`, { stdio: 'inherit' });
  console.log(`✓ icon-${s}.png`);
}

// apple-touch-icon = 180px
execSync('cp /home/user/jeongbu/public/icon-180.png /home/user/jeongbu/public/apple-touch-icon.png');
console.log('✓ apple-touch-icon.png');
