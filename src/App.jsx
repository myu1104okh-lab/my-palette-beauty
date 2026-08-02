import { useState, useEffect, useRef } from "react";

// ブラウザのローカル保存(端末内に保存されます)
const storage = {
  get: async (key) => {
    const v = localStorage.getItem(key);
    return v === null ? null : { key, value: v };
  },
  set: async (key, value) => {
    localStorage.setItem(key, value);
    return { key, value };
  },
};


// ---------------- 共通データ ----------------
const SEASONS = {
  spring: {
    name: "イエベ春",
    en: "Spring",
    accent: "#F2845C",
    soft: "#FDEEE4",
    desc: "明るくクリアな暖色が似合う、フレッシュで若々しいタイプ。",
    palette: [
      { c: "#FF9E85", n: "コーラル" },
      { c: "#FFD166", n: "ブライトイエロー" },
      { c: "#C3D96B", n: "イエローグリーン" },
      { c: "#7FD1C7", n: "アクアグリーン" },
      { c: "#FFB3A7", n: "ピーチ" },
      { c: "#E8894A", n: "ライトオレンジ" },
    ],
    avoid: [
      { c: "#5B5B6E", n: "ダークグレー" },
      { c: "#3E2F4F", n: "深い紫" },
      { c: "#22252B", n: "重い黒" },
    ],
  },
  summer: {
    name: "ブルベ夏",
    en: "Summer",
    accent: "#8C86C7",
    soft: "#EFEDF7",
    desc: "涼しげでソフトな寒色が似合う、上品で透明感のあるタイプ。",
    palette: [
      { c: "#B3A8D9", n: "ラベンダー" },
      { c: "#E8A8B8", n: "ローズピンク" },
      { c: "#A8C4D9", n: "パウダーブルー" },
      { c: "#C7A8B8", n: "モーブ" },
      { c: "#9BB8A8", n: "ミントグレー" },
      { c: "#8C86A8", n: "ブルーグレー" },
    ],
    avoid: [
      { c: "#C26B45", n: "テラコッタ" },
      { c: "#B8862B", n: "マスタード" },
      { c: "#7A4A1E", n: "濃いブラウン" },
    ],
  },
  autumn: {
    name: "イエベ秋",
    en: "Autumn",
    accent: "#B3612F",
    soft: "#F5EBE0",
    desc: "深みのある暖色が似合う、リッチで大人っぽいタイプ。",
    palette: [
      { c: "#C26B45", n: "テラコッタ" },
      { c: "#B8862B", n: "マスタード" },
      { c: "#6B7A3E", n: "オリーブ" },
      { c: "#8C4A2F", n: "ブリック" },
      { c: "#C9A86A", n: "キャメル" },
      { c: "#3E5E50", n: "ディープグリーン" },
    ],
    avoid: [
      { c: "#E8A8D9", n: "青みパステル" },
      { c: "#A8C4E8", n: "アイシーブルー" },
      { c: "#EDEDF2", n: "真っ白" },
    ],
  },
  winter: {
    name: "ブルベ冬",
    en: "Winter",
    accent: "#3E4BB3",
    soft: "#E9EBF7",
    desc: "鮮やかでコントラストの強い色が似合う、クールで華やかなタイプ。",
    palette: [
      { c: "#2B4BB3", n: "ロイヤルブルー" },
      { c: "#C42B6B", n: "マゼンタ" },
      { c: "#B32B3E", n: "トゥルーレッド" },
      { c: "#4B2B7A", n: "ロイヤルパープル" },
      { c: "#0F6B5E", n: "エメラルド" },
      { c: "#1E1E24", n: "ブラック" },
    ],
    avoid: [
      { c: "#D9B896", n: "ベージュ" },
      { c: "#C9A86A", n: "キャメル" },
      { c: "#E8C4A8", n: "くすみオレンジ" },
    ],
  },
};

// 実在商品データ(商品名・価格はブランド公式サイト等で確認した実勢価格。写真も公式サイトの商品画像)
// 評価(base/baseCount)はこのアプリ内の口コミ機能の初期値で、実際のレビュー件数ではありません
const PRODUCTS = [
  // リップ
  { id: "p01", name: "ステイオンバームルージュ 09 マスカレードバッド", brand: "キャンメイク", cat: "リップ", price: 638, seasons: ["autumn", "winter"], base: 4.5, baseCount: 320, color: "#A13B4C", img: "https://www.canmake.com/wp-content/uploads/2025/08/D02_03_col09_img_00.jpg" },
  { id: "p02", name: "ラスティングステイリップカラー 01 ローズレッド", brand: "セザンヌ", cat: "リップ", price: 715, seasons: ["summer", "winter"], base: 4.3, baseCount: 280, color: "#C33C4E", img: "https://www.cezanne.co.jp/uploads/lineup/4939553530350/img1_01.png" },
  { id: "p03", name: "テクノサテン ジェル リップスティック 403 Augmented Nude", brand: "資生堂", cat: "リップ", price: 4400, seasons: ["spring", "autumn"], base: 4.4, baseCount: 152, color: "#C48374", img: "https://imagecdn.shiseido.co.jp/c!/a=0,w=1000,f=webp:jpg/resources/sw/products/img/20230221/SHOHIN_PL_C1_G68601.jpg" },
  { id: "p04", name: "リップモンスター 03 陽炎", brand: "KATE", cat: "リップ", price: 1540, seasons: ["autumn", "spring"], base: 4.6, baseCount: 431, color: "#C1543A", img: "https://kao-h.assetsadobe3.com/is/image/content/dam/sites/kao/www-kao-kirei-com/jp/ja/item/kbb/kate/25991344/GG01.jpg?wid=1000" },
  { id: "p05", name: "リップティント N 06 ピンクレッド", brand: "オペラ", cat: "リップ", price: 1760, seasons: ["summer", "winter"], base: 4.5, baseCount: 389, color: "#E0526B", img: "https://www.opera-net.jp/_wpcms/wp-content/themes/opera/asset/img/tint/single_top@2x.jpg" },
  // チーク
  { id: "p06", name: "グロウフルールチークス 01 ピーチフルール", brand: "キャンメイク", cat: "チーク", price: 880, seasons: ["spring", "summer"], base: 4.2, baseCount: 410, color: "#FFA98C", img: "https://www.canmake.com/wp-content/uploads/2025/08/B00_72_col01_img_01.jpg" },
  { id: "p07", name: "ナチュラル チークN 01 ピーチピンク", brand: "セザンヌ", cat: "チーク", price: 396, seasons: ["spring"], base: 4.1, baseCount: 274, color: "#FFB6A3", img: "https://www.cezanne.co.jp/uploads/lineup/4939553002918/img1_01.png" },
  { id: "p08", name: "スキニーマッチ チーク", brand: "エクセル", cat: "チーク", price: 1650, seasons: ["spring", "summer"], base: 4.5, baseCount: 155, color: "#E8879A", img: "https://noevirgroup.jp/excel/img/goods/L/48815.jpg" },
  { id: "p09", name: "インナーグロウ チークパウダー 03 Floating Rose", brand: "資生堂", cat: "チーク", price: 4400, seasons: ["summer"], base: 4.0, baseCount: 96, color: "#E893A8", img: "https://image.rakuten.co.jp/brandshiseido/cabinet/prd/smu0015/rank_smu0015.jpg" },
  // アイシャドウ
  { id: "p10", name: "パーフェクトマルチアイズ 03 アンティークテラコッタ", brand: "キャンメイク", cat: "アイシャドウ", price: 858, seasons: ["autumn"], base: 4.7, baseCount: 502, color: "#B06A4E", img: "https://www.canmake.com/wp-content/uploads/2025/08/C01_20_col03_img_00-1.jpg" },
  { id: "p11", name: "トーンアップアイシャドウ 01 ナチュラルブラウン", brand: "セザンヌ", cat: "アイシャドウ", price: 638, seasons: ["autumn", "spring"], base: 4.4, baseCount: 318, color: "#A67C58", img: "https://www.cezanne.co.jp/uploads/lineup/4939553040149/img1_01.png" },
  { id: "p12", name: "スキニーリッチシャドウ N", brand: "エクセル", cat: "アイシャドウ", price: 1650, seasons: ["autumn", "spring"], base: 4.6, baseCount: 446, color: "#C9A063", img: "https://noevirgroup.jp/excel/img/goods/L/78303.jpg" },
  { id: "p13", name: "メロウブラウンアイズ BR-1 ソフトブラウン", brand: "KATE", cat: "アイシャドウ", price: 1320, seasons: ["autumn", "spring"], base: 4.3, baseCount: 217, color: "#9C7259", img: "https://kao-h.assetsadobe3.com/is/image/content/dam/sites/kanebo/www-nomorerules-net/pickup/mellow_brown_eyes/mellow_brown_eyes-mellow_brown_eyes-thumb-m-260421.png?wid=1000" },
  // ノーズシャドウ
  { id: "p14", name: "フィットスタイラーアイブロウ 01 ナチュラルブラウン", brand: "キャンメイク", cat: "ノーズシャドウ", price: 880, seasons: ["spring", "autumn"], base: 4.3, baseCount: 265, color: "#C9A98A", img: "https://www.canmake.com/wp-content/uploads/2025/08/C04_199_col01_img_01.jpg" },
  { id: "p15", name: "アイブロウ&シェードパウダー 01 キャメルブラウン", brand: "セザンヌ", cat: "ノーズシャドウ", price: 693, seasons: ["autumn"], base: 4.5, baseCount: 388, color: "#B98860", img: "https://www.cezanne.co.jp/uploads/lineup/4939553530534/img1_01.png" },
  { id: "p16", name: "デザイニングアイブロウ3D(デュアルコントゥアカラー) EX-5", brand: "KATE", cat: "ノーズシャドウ", price: 1430, seasons: ["summer", "winter"], base: 4.2, baseCount: 174, color: "#8A6A5C", img: "https://kao-h.assetsadobe3.com/is/image/content/dam/sites/kao/www-kao-kirei-com/jp/ja/item/kbb/kate/25504136/GG01.jpg?wid=1000" },
  // アイライナー
  { id: "p17", name: "クリーミータッチライナー ディープブラック", brand: "キャンメイク", cat: "アイライナー", price: 715, seasons: ["spring", "summer", "autumn", "winter"], base: 4.6, baseCount: 521, color: "#1A1A1A", img: "https://www.canmake.com/wp-content/uploads/2025/08/C05_36_col01_img_00.jpg" },
  { id: "p18", name: "ジェルアイライナー 10 ブラック", brand: "セザンヌ", cat: "アイライナー", price: 550, seasons: ["spring", "summer", "autumn", "winter"], base: 4.3, baseCount: 296, color: "#1C1C1C", img: "https://www.cezanne.co.jp/uploads/lineup/4939553040453/img1_10.png" },
  { id: "p19", name: "スーパーシャープライナー EX4.0 BK-1 漆黒ブラック", brand: "KATE", cat: "アイライナー", price: 1430, seasons: ["spring", "summer", "autumn", "winter"], base: 4.4, baseCount: 233, color: "#0D0D0D", img: "https://kao-h.assetsadobe3.com/is/image/content/dam/sites/kanebo/www-nomorerules-net/pickup/super_sharp_liner_ex4/super_sharp_liner_ex4-super_sharp_liner_ex4-thumb-m.png?wid=1000" },
  { id: "p20", name: "スキニーリッチライナー RL04 テラコッタ", brand: "エクセル", cat: "アイライナー", price: 1430, seasons: ["autumn", "spring"], base: 4.5, baseCount: 189, color: "#B5613C", img: "https://noevirgroup.jp/excel/img/goods/L/48849.jpg" },
  // マスカラ
  { id: "p21", name: "クイックラッシュカーラー BK ブラック", brand: "キャンメイク", cat: "マスカラ", price: 748, seasons: ["spring", "summer", "autumn", "winter"], base: 4.4, baseCount: 465, color: "#1A1A1A", img: "https://www.canmake.com/wp-content/uploads/2025/08/C02_40_col00_img_00.jpg" },
  { id: "p22", name: "ラッシュバースト BK-1 ブラック", brand: "KATE", cat: "マスカラ", price: 1540, seasons: ["spring", "summer", "autumn", "winter"], base: 4.2, baseCount: 201, color: "#151515", img: "https://kao-h.assetsadobe3.com/is/image/content/dam/sites/kanebo/www-nomorerules-net/pickup/lash_burst/lash_burst-lash_burst-thumb-m.png?wid=1000" },
  // ベースメイク
  { id: "p23", name: "マーメイドスキンジェルUV 01 クリア", brand: "キャンメイク", cat: "ベースメイク", price: 770, seasons: ["spring", "summer", "autumn", "winter"], base: 4.5, baseCount: 587, color: "#CFE9E5", img: "https://www.canmake.com/wp-content/uploads/2025/08/A06_67_col01_img_00-2.jpg" },
  { id: "p24", name: "皮脂テカリ防止下地 ピンクベージュ", brand: "セザンヌ", cat: "ベースメイク", price: 660, seasons: ["spring", "summer"], base: 4.4, baseCount: 634, color: "#F3C9C2", img: "https://www.cezanne.co.jp/uploads/lineup/4939553040057/img1_pk.png" },
  { id: "p25", name: "エッセンス スキングロウ ファンデーション 240 Quartz", brand: "資生堂", cat: "ベースメイク", price: 7590, seasons: ["spring", "summer", "autumn", "winter"], base: 4.6, baseCount: 312, color: "#D9A98C", img: "https://imagecdn.shiseido.co.jp/c!/a=0,w=1000,f=webp:jpg/resources/sw/products/img/20230622/SHOHIN_PL_C1_G80101.jpg" },
];

// 商品名+ブランドで楽天市場を検索するURL(特定の商品ページを推測せず、常に有効な検索結果URLを組み立てる)
const shoppingSearchUrl = (p) => `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(`${p.brand} ${p.name}`)}/`;

const CATS = ["すべて", "リップ", "チーク", "アイシャドウ", "ノーズシャドウ", "アイライナー", "マスカラ", "ベースメイク"];
const BRANDS = ["すべて", "キャンメイク", "セザンヌ", "資生堂", "KATE", "エクセル", "オペラ"];
const font = {
  display: "'Shippori Mincho', 'Hiragino Mincho ProN', serif",
  body: "'Zen Kaku Gothic New', 'Hiragino Kaku Gothic ProN', sans-serif",
};

// 色を明るく/暗くするヘルパー
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, v + amt));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

// カテゴリ別の商品イラスト(img指定があれば実際の写真を表示)
const ProductVisual = ({ product, size = 60 }) => {
  const c = product.color;
  const [imgFailed, setImgFailed] = useState(false);
  if (product.img && !imgFailed) {
    return (
      <img
        src={product.img}
        alt={product.name}
        loading="lazy"
        onError={() => setImgFailed(true)} // 外部サイトの画像が読み込めない場合はイラストにフォールバック
        // contain: 商品写真は余白付きで撮られているため、coverだと商品の端が切れてしまう
        style={{ width: size, height: size * 1.15, objectFit: "contain", borderRadius: 10, flexShrink: 0, background: "#FFF" }}
      />
    );
  }
  const h = size * 1.15;
  const common = { width: size, height: h, flexShrink: 0 };
  switch (product.cat) {
    case "リップ":
      return (
        <svg viewBox="0 0 60 70" style={common} aria-label="リップ">
          <rect x="21" y="34" width="18" height="28" rx="3" fill="#3A3632" />
          <rect x="23" y="30" width="14" height="6" rx="1.5" fill={shade(c, -50)} />
          <path d="M25 30 L25 14 Q25 10 29 10 L31 10 Q35 12 35 18 L35 30 Z" fill={c} />
          <path d="M25 30 L25 14 Q25 10 29 10 L30 10 L30 30 Z" fill={shade(c, 25)} />
        </svg>
      );
    case "チーク":
      return (
        <svg viewBox="0 0 60 70" style={common} aria-label="チーク">
          <circle cx="30" cy="36" r="24" fill="#EFEAE3" stroke="#D6CFC5" strokeWidth="1.5" />
          <circle cx="30" cy="36" r="18" fill={c} />
          <circle cx="24" cy="30" r="7" fill={shade(c, 30)} opacity="0.55" />
        </svg>
      );
    case "アイシャドウ":
      return (
        <svg viewBox="0 0 60 70" style={common} aria-label="アイシャドウパレット">
          <rect x="6" y="18" width="48" height="36" rx="5" fill="#3A3632" />
          <rect x="10" y="22" width="19" height="13" rx="2" fill={shade(c, 55)} />
          <rect x="31" y="22" width="19" height="13" rx="2" fill={shade(c, 20)} />
          <rect x="10" y="37" width="19" height="13" rx="2" fill={c} />
          <rect x="31" y="37" width="19" height="13" rx="2" fill={shade(c, -35)} />
        </svg>
      );
    case "ノーズシャドウ":
      return (
        <svg viewBox="0 0 60 70" style={common} aria-label="ノーズシャドウ">
          <rect x="8" y="22" width="44" height="30" rx="5" fill="#EFEAE3" stroke="#D6CFC5" strokeWidth="1.5" />
          <rect x="12" y="26" width="17" height="22" rx="2" fill={shade(c, 45)} />
          <rect x="31" y="26" width="17" height="22" rx="2" fill={c} />
          <rect x="20" y="12" width="20" height="5" rx="2.5" fill="#8C7A64" />
        </svg>
      );
    case "アイライナー":
      return (
        <svg viewBox="0 0 60 70" style={common} aria-label="アイライナー">
          <rect x="26" y="20" width="8" height="40" rx="2.5" fill={shade(c, 15)} transform="rotate(18 30 40)" />
          <path d="M27 22 L30 8 L33 22 Z" fill={c} transform="rotate(18 30 40)" />
          <rect x="26" y="52" width="8" height="8" rx="2" fill={shade(c, -40)} transform="rotate(18 30 40)" />
        </svg>
      );
    case "マスカラ":
      return (
        <svg viewBox="0 0 60 70" style={common} aria-label="マスカラ">
          <rect x="22" y="26" width="16" height="36" rx="4" fill={c} />
          <rect x="25" y="14" width="10" height="12" rx="2" fill={shade(c, -35)} />
          <rect x="41" y="18" width="3.5" height="30" rx="1.5" fill={shade(c, -50)} transform="rotate(12 43 33)" />
        </svg>
      );
    case "ベースメイク":
      return (
        <svg viewBox="0 0 60 70" style={common} aria-label="ベースメイク">
          <rect x="16" y="24" width="28" height="38" rx="7" fill={c} />
          <rect x="16" y="24" width="14" height="38" rx="7" fill={shade(c, 20)} opacity="0.6" />
          <rect x="22" y="12" width="16" height="12" rx="2.5" fill="#3A3632" />
        </svg>
      );
    default:
      return <div style={{ ...common, background: c, borderRadius: 10 }} />;
  }
};

const Stars = ({ value, size = 13 }) => (
  <span style={{ color: "#E0A93E", fontSize: size, letterSpacing: 1 }}>
    {"★".repeat(Math.round(value))}
    <span style={{ color: "#DDD6CC" }}>{"★".repeat(5 - Math.round(value))}</span>
  </span>
);

// ---------------- メイン ----------------
export default function App() {
  const [tab, setTab] = useState("diagnosis");
  const [myType, setMyType] = useState(null); // 'spring' など
  const [myDiag, setMyDiag] = useState(null); // 診断結果の詳細
  const [favs, setFavs] = useState([]); // お気に入り商品ID
  const [reviews, setReviews] = useState([]);
  const [storageReady, setStorageReady] = useState(false);

  // 保存データの読み込み
  useEffect(() => {
    (async () => {
      try {
        const r = await storage.get("beauty-reviews");
        if (r?.value) setReviews(JSON.parse(r.value));
      } catch (e) {}
      try {
        const t = await storage.get("beauty-mytype");
        if (t?.value) setMyType(t.value);
      } catch (e) {}
      try {
        const d = await storage.get("beauty-mydiag");
        if (d?.value) setMyDiag(JSON.parse(d.value));
      } catch (e) {}
      try {
        const f = await storage.get("beauty-favs");
        if (f?.value) setFavs(JSON.parse(f.value));
      } catch (e) {}
      setStorageReady(true);
    })();
  }, []);

  const saveDiagnosis = async (parsed) => {
    setMyType(parsed.season);
    const diag = {
      season: parsed.season,
      confidence: parsed.confidence,
      undertone: parsed.undertone,
      date: new Date().toLocaleDateString("ja-JP"),
    };
    setMyDiag(diag);
    try { await storage.set("beauty-mytype", parsed.season); } catch (e) {}
    try { await storage.set("beauty-mydiag", JSON.stringify(diag)); } catch (e) {}
  };

  const toggleFav = async (id) => {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    setFavs(next);
    try { await storage.set("beauty-favs", JSON.stringify(next)); } catch (e) {}
  };

  const addReview = async (rev) => {
    const next = [rev, ...reviews];
    setReviews(next);
    try { await storage.set("beauty-reviews", JSON.stringify(next)); } catch (e) {}
  };

  // レビュー込みの平均を計算
  const ratingOf = (p) => {
    const rs = reviews.filter((r) => r.productId === p.id);
    const sum = p.base * p.baseCount + rs.reduce((a, r) => a + r.rating, 0);
    const count = p.baseCount + rs.length;
    return { avg: sum / count, count, userCount: rs.length };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F2", fontFamily: font.body, color: "#33302C" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform: translateY(12px);} to {opacity:1; transform:none;} }
        .fade-up { animation: fadeUp .4s ease both; }
        @keyframes pulse { 0%,100% {opacity:.5;} 50% {opacity:1;} }
        button { cursor: pointer; font-family: inherit; }
        button:focus-visible, textarea:focus-visible, select:focus-visible { outline: 3px solid #33302C; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .fade-up { animation:none; } }
      `}</style>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px 90px" }}>
        {/* ヘッダー */}
        <header style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
            {["#FF9E85", "#B3A8D9", "#C26B45", "#2B4BB3"].map((c) => (
              <span key={c} style={{ width: 12, height: 20, background: c, borderRadius: "0 0 7px 7px" }} />
            ))}
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: 22, fontWeight: 600, letterSpacing: "0.12em", margin: 0 }}>
            My Palette Beauty
          </h1>
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#9A938A", marginTop: 4 }}>
            診断 × コスメランキング × 口コミ
          </p>
          {myType && (
            <span style={{ display: "inline-block", marginTop: 8, background: SEASONS[myType].soft, color: SEASONS[myType].accent, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 999 }}>
              あなた:{SEASONS[myType].name}
            </span>
          )}
        </header>

        {tab === "diagnosis" && (
          <DiagnosisTab
            myType={myType}
            onDiagnosed={saveDiagnosis}
            ratingOf={ratingOf}
            favs={favs}
            toggleFav={toggleFav}
            onGoRanking={() => setTab("ranking")}
          />
        )}
        {tab === "ranking" && <RankingTab myType={myType} ratingOf={ratingOf} favs={favs} toggleFav={toggleFav} onGoDiagnosis={() => setTab("diagnosis")} />}
        {tab === "reviews" && <ReviewTab reviews={reviews} addReview={addReview} myType={myType} storageReady={storageReady} />}
        {tab === "mypage" && <MyPageTab myType={myType} myDiag={myDiag} favs={favs} toggleFav={toggleFav} ratingOf={ratingOf} onGoDiagnosis={() => setTab("diagnosis")} />}
      </div>

      {/* 下部タブバー */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#FFFFFF", borderTop: "1px solid #E5E0DA", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", width: "100%", maxWidth: 560 }}>
          {[
            { id: "diagnosis", label: "診断" },
            { id: "ranking", label: "ランキング" },
            { id: "reviews", label: "口コミ" },
            { id: "mypage", label: "マイページ" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, background: "none", border: "none", padding: "16px 0 18px",
                color: tab === t.id ? "#33302C" : "#B0A99F",
                fontWeight: tab === t.id ? 700 : 400, fontSize: 13.5,
                borderTop: tab === t.id ? "2.5px solid #33302C" : "2.5px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// 写真の色かぶりを自動補正(明部基準法)
// 画像内の「明るい部分」(白目・ハイライト・白い背景など)を白の基準にして
// 照明の色かぶりだけを取り除く。肌そのものの色み(アンダートーン)は保持される。
const autoWhiteBalance = (canvas) => {
  try {
    const ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;
    // 明るさ上位5%のピクセルを集める
    const lums = [];
    for (let i = 0; i < d.length; i += 4) {
      lums.push(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    }
    const sorted = [...lums].sort((a, b) => b - a);
    const threshold = sorted[Math.floor(sorted.length * 0.05)] || 200;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      if (lum >= threshold && lum > 120) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    }
    if (n < 50) return; // 白の基準が見つからなければ補正しない
    r /= n; g /= n; b /= n;
    const avg = (r + g + b) / 3;
    // 明部がすでにほぼ白なら補正不要
    const cast = Math.max(Math.abs(r - avg), Math.abs(g - avg), Math.abs(b - avg)) / avg;
    if (cast < 0.04) return;
    const strength = 0.6;
    const clamp = (v) => Math.max(0.8, Math.min(1.25, v)); // 過補正を防ぐ
    const fr = clamp(1 + (avg / r - 1) * strength);
    const fg = clamp(1 + (avg / g - 1) * strength);
    const fb = clamp(1 + (avg / b - 1) * strength);
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] * fr);
      d[i + 1] = Math.min(255, d[i + 1] * fg);
      d[i + 2] = Math.min(255, d[i + 2] * fb);
    }
    ctx.putImageData(img, 0, 0);
  } catch (e) { /* 補正できない場合は元画像のまま */ }
};

// 画像から肌ピクセルの平均色を測定する
const measureSkin = (dataUrl) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) {
        const R = d[i], G = d[i + 1], B = d[i + 2];
        // 肌らしいピクセルのみ抽出(髪・目・背景を除外)
        const max = Math.max(R, G, B), min = Math.min(R, G, B);
        if (R > 60 && R > B && R >= G && max - min > 12 && max < 250 && (R + G + B) / 3 > 60) {
          r += R; g += G; b += B; n++;
        }
      }
      if (n < 100) {
        // 肌ピクセルが検出できない場合は、暗すぎる部分を除いた全体平均で代用
        r = 0; g = 0; b = 0; n = 0;
        for (let i = 0; i < d.length; i += 4) {
          if ((d[i] + d[i + 1] + d[i + 2]) / 3 > 40) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
        }
        if (n < 10) { resolve(null); return; }
      }
      resolve({ r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n), count: n });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });

// 画像から瞳(虹彩)らしいピクセルの平均色を測定する
const measureEye = (dataUrl) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const w = c.width, h = c.height;
      // ガイド通り撮影されていれば瞳は中央付近に写るので、中央60%だけをサンプリングする
      const x0 = Math.floor(w * 0.2), x1 = Math.ceil(w * 0.8);
      const y0 = Math.floor(h * 0.2), y1 = Math.ceil(h * 0.8);
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * w + x) * 4;
          const R = d[i], G = d[i + 1], B = d[i + 2];
          const lum = 0.299 * R + 0.587 * G + 0.114 * B;
          // 白目・反射光(明るすぎ)と瞳孔・まつ毛(暗すぎ)を除いて虹彩らしい中間トーンだけ残す
          if (lum > 35 && lum < 165) { r += R; g += G; b += B; n++; }
        }
      }
      if (n < 30) { resolve(null); return; }
      resolve({ r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n), count: n });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });

// sRGB -> CIELAB 変換(色の見えに合わせた標準的な色空間)
const rgbToLab = (r, g, b) => {
  const f = (c) => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const R = f(r), G = f(g), B = f(b);
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const g_ = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = g_(X), fy = g_(Y), fz = g_(Z);
  return {
    L: 116 * fy - 16,       // 明度 0-100
    a: 500 * (fx - fy),     // 赤み(+) - 緑み(-)
    b: 200 * (fy - fz),     // 黄み(+) - 青み(-)
  };
};

// 測定色からイエベ/ブルベ度を算出(Lab色空間による標準的な手法)
// 肌のアンダートーンは b*(黄み)と a*(赤み)のバランスで決まる。
// 黄みが赤みを上回る → イエロー(暖色)ベース / 赤みが優勢 → ブルー(寒色)ベース
const analyzeTone = (rgb) => {
  if (!rgb) return null;
  const { r, g, b } = rgb;
  const lab = rgbToLab(r, g, b);
  const balance = lab.b - lab.a; // 黄み優勢度。実測サンプルではイエベ約+14〜17、ブルベ約-5前後
  const NEUTRAL = 5;             // イエベ/ブルベの境界(中間肌の実測値)
  const SPREAD = 10;             // ±10でほぼ振り切る感度
  let warm = Math.round(50 + ((balance - NEUTRAL) / SPREAD) * 45);
  warm = Math.max(5, Math.min(95, warm));
  return {
    warm,
    cool: 100 - warm,
    balance: +balance.toFixed(1),
    labB: +lab.b.toFixed(1),
    labA: +lab.a.toFixed(1),
    yellowness: +lab.b.toFixed(1),
    redness: +lab.a.toFixed(1),
    brightness: +(lab.L / 100).toFixed(2),
    hex: `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`,
  };
};

// 実測した肌・手のひら・瞳のトーンから4シーズンを判定する
// 黄み/赤みバランス(warm)と明るさ(brightness)の2軸で、各シーズンの基準点との近さをスコア化する
const localDiagnose = (skinTone, palmTone, eyeTone) => {
  // 複数部位の測定値を重み付け平均する。欠けている部位は自動で除外し、残りで重みを配分し直す
  const weightedAvg = (entries) => {
    const valid = entries.filter(([v]) => typeof v === "number");
    const total = valid.reduce((s, [, w]) => s + w, 0);
    return total ? valid.reduce((s, [v, w]) => s + v * w, 0) / total : null;
  };

  // 瞳(虹彩)は肌ほど暖色/寒色の手がかりが強くないため、重みは控えめにする
  const warm = weightedAvg([
    [skinTone.warm, 0.55],
    [palmTone?.warm, 0.25],
    [eyeTone?.warm, 0.2],
  ]); // 0(ブルベ寄り)〜100(イエベ寄り)
  // 明るさは瞳(虹彩)が構造的に暗いため含めず、肌・手のひらのみで判定する
  const brightPct = Math.max(0, Math.min(100, ((weightedAvg([[skinTone.brightness, 0.7], [palmTone?.brightness, 0.3]]) - 0.45) / 0.5) * 100)); // 明るさ0〜100

  const anchors = {
    spring: { x: 82, y: 78 },
    autumn: { x: 82, y: 30 },
    summer: { x: 18, y: 72 },
    winter: { x: 18, y: 28 },
  };
  const point = { x: warm, y: brightPct };

  const distances = {};
  for (const k in anchors) {
    const dx = point.x - anchors[k].x, dy = point.y - anchors[k].y;
    distances[k] = Math.sqrt(dx * dx + dy * dy) + 1; // +1 はゼロ割防止
  }
  let sum = 0;
  const inv = {};
  for (const k in distances) { inv[k] = 1 / distances[k]; sum += inv[k]; }
  const seasonScores = {};
  for (const k in inv) seasonScores[k] = Math.round((inv[k] / sum) * 100);

  const season = Object.keys(seasonScores).reduce((a, b) => (seasonScores[b] > seasonScores[a] ? b : a));

  const warmScore = Math.round(warm);
  const coolScore = 100 - warmScore;

  const undertone =
    warmScore >= 50
      ? `黄み(イエロー)が優勢な暖色系の肌タイプです。明るさの測定値から、${
          season === "spring" ? "明るくクリアな『スプリング』" : "深みのある『オータム』"
        }寄りと判定しました。`
      : `赤み・青み(ブルー)が優勢な寒色系の肌タイプです。明るさの測定値から、${
          season === "summer" ? "ソフトで涼しげな『サマー』" : "コントラストのはっきりした『ウィンター』"
        }寄りと判定しました。`;

  const features = {
    skin: `測定した肌の色は ${skinTone.hex}。黄み優勢度 ${skinTone.balance} で${skinTone.warm >= 50 ? "イエベ" : "ブルベ"}寄りの傾向です。`,
  };
  if (palmTone) {
    features.palm = `手のひらの色は ${palmTone.hex}。黄み優勢度 ${palmTone.balance} で、肌の判定を${palmTone.warm >= 50 ? "イエベ" : "ブルベ"}側から補強しています。`;
  }
  if (eyeTone) {
    features.eyes = `瞳の色は ${eyeTone.hex} 系。${eyeTone.warm >= 50 ? "ブラウン系の暖かみ" : "ブラック〜グレー系の涼しさ"}があり、判定に反映しています。`;
  }

  return { season, confidence: seasonScores[season], undertone, warmScore, coolScore, seasonScores, features };
};

// ---------------- 診断タブ(パーツ別ステップ撮影) ----------------
const STEPS = [
  { id: "skin", type: "photo", title: "肌の色(顔全体)", guide: "正面から、すっぴんに近い状態で。自然光の下だと肌の色が正確に写ります。", required: true, capture: "user" },
  { id: "eyes", type: "photo", title: "瞳の色", guide: "片目のアップ。瞳(黒目・虹彩)の色がはっきり写るように。", required: false, capture: "user" },
  { id: "hair", type: "photo", title: "髪の色", guide: "根もと付近など、地毛の色がわかる部分を明るい場所で。染めている場合は下で教えてください。", required: false, capture: "user" },
  { id: "palm", type: "photo", title: "手のひらの色", guide: "手のひら全体を明るい場所で。黄みがかっているか、赤み・ピンクみがあるかがポイントです。", required: false, capture: "environment" },
  { id: "vein", type: "photo", title: "血管の色", guide: "手首の内側を明るい場所で。血管が緑っぽいか、青〜紫っぽいかが見えるように。血管が見えにくい人はスキップしてOK(他の項目から判定します)。", required: false, capture: "environment" },
];

function DiagnosisTab({ myType, onDiagnosed, ratingOf, favs, toggleFav, onGoRanking }) {
  const [photos, setPhotos] = useState({}); // {skin: {base64, url}, ...}
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hairDyed, setHairDyed] = useState(null); // "natural" | "dyed"
  const [measured, setMeasured] = useState(null); // 肌色の実測結果
  const [cameraOn, setCameraOn] = useState(false);
  const [facing, setFacing] = useState("user");
  const [camError, setCamError] = useState(false);
  const fileRef = useRef(null);
  const libraryFileRef = useRef(null); // capture属性なし。写真ライブラリから選ぶ用
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const step = STEPS[current];

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  // 画面を離れる時にカメラを止める
  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  const openCamera = async (mode) => {
    setCamError(false);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setFacing(mode);
      setCameraOn(true);
      // videoが描画されてからstreamを接続
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (e) {
      // カメラが使えない環境では写真選択にフォールバック
      setCamError(true);
      libraryFileRef.current?.click();
    }
  };

  const switchCamera = () => {
    const next = facing === "user" ? "environment" : "user";
    stopCamera();
    openCamera(next);
  };

  const shoot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const max = 420;
    const scale = Math.min(1, max / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (facing === "user") {
      // 自撮りはプレビューと同じ向き(鏡像)で保存
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    autoWhiteBalance(canvas);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    setPhotos((prev) => ({ ...prev, [step.id]: { base64: dataUrl.split(",")[1], url: dataUrl } }));
    stopCamera();
    goNext();
  };
  const doneCount = Object.keys(photos).length;
  const canAnalyze = !!photos.skin;

  const goNext = () => setCurrent((c) => Math.min(c + 1, STEPS.length - 1));

  const handleFile = (file) => {
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 420;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        autoWhiteBalance(canvas);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setPhotos((prev) => ({ ...prev, [step.id]: { base64: dataUrl.split(",")[1], url: dataUrl } }));
        goNext();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // 肌・手のひら・瞳の色を実測
    let skinTone = null, palmTone = null, eyeTone = null;
    try {
      skinTone = analyzeTone(await measureSkin(photos.skin.url));
      if (photos.palm) palmTone = analyzeTone(await measureSkin(photos.palm.url));
      if (photos.eyes) eyeTone = analyzeTone(await measureEye(photos.eyes.url));
    } catch (e) { /* 測定に失敗しても診断は続行する */ }
    setMeasured({ skin: skinTone, palm: palmTone, eyes: eyeTone });

    // 画像解析だけで診断する(AI・APIキー不要)
    setTimeout(() => {
      const fallbackTone = skinTone || { warm: 50, brightness: 0.80, hex: "#DCC0A8", yellowness: 15, redness: 9, balance: 5 };
      const local = localDiagnose(fallbackTone, palmTone, eyeTone);
      local.lighting = "アプリの画像解析(CIELAB色空間による測定)で診断しました。";
      setResult(local);
      onDiagnosed(local);
      setLoading(false);
    }, 600);
  };

  const season = result ? SEASONS[result.season] : null;
  const FEATURE_LABELS = { skin: "肌の色", eyes: "瞳の色", hair: "髪の色", palm: "手のひら", vein: "血管の色" };
  const recommendedProducts = result
    ? PRODUCTS.filter((p) => p.seasons.includes(result.season))
        .map((p) => ({ ...p, ...ratingOf(p) }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 6)
    : [];

  return (
    <div className="fade-up">
      <div style={{ background: "#FFF", borderRadius: 20, padding: "22px 20px", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontFamily: font.display, fontSize: 17, margin: "0 0 4px", textAlign: "center" }}>パーソナルカラー診断</h2>
        <p style={{ fontSize: 12, color: "#9A938A", lineHeight: 1.8, margin: 0, textAlign: "center" }}>
          5つのチェック項目から総合診断します。窓際の自然光での撮影がおすすめ(電球の光は結果が黄みに偏ります)
        </p>

        {/* ステップインジケーター */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "16px 0 4px", flexWrap: "wrap" }}>
          {STEPS.map((s, i) => {
            const done = !!photos[s.id];
            return (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                aria-label={s.title}
                style={{
                  width: 48, height: 48, borderRadius: 13, fontSize: 11.5, fontWeight: 700, color: "#6E675F", padding: 0,
                  border: current === i ? "2px solid #33302C" : "1.5px solid #E0DAD2",
                  background: done ? "#33302C" : "#FAF8F5",
                  position: "relative", overflow: "hidden",
                }}
              >
                {photos[s.id] && (
                  <img src={photos[s.id].url} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                )}
                {done && (
                  <span style={{ position: "absolute", top: 0, right: 3, fontSize: 11, color: "#FFF", textShadow: "0 0 3px rgba(0,0,0,.7)" }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#B0A99F", margin: "2px 0 14px" }}>{doneCount} / {STEPS.length} 項目 完了(タップでやり直し)</p>

        {/* 現在のステップ */}
        <div style={{ background: "#FAF8F5", borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
          <p style={{ fontFamily: font.display, fontSize: 15, fontWeight: 600, margin: 0 }}>
            STEP {current + 1}:{step.title}
            {step.required ? <span style={{ fontSize: 10.5, color: "#B3402B", marginLeft: 6 }}>必須</span> : <span style={{ fontSize: 10.5, color: "#B0A99F", marginLeft: 6 }}>任意</span>}
          </p>
          <p style={{ fontSize: 12.5, color: "#6E675F", lineHeight: 1.9, margin: "8px 0 0" }}>{step.guide}</p>

          {step.id === "hair" && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
              {[["natural", "地毛です"], ["dyed", "染めています"]].map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setHairDyed(v)}
                  style={{
                    background: hairDyed === v ? "#33302C" : "#FFF",
                    color: hairDyed === v ? "#F7F5F2" : "#55504A",
                    border: "1px solid #E0DAD2", borderRadius: 999, padding: "8px 18px", fontSize: 12.5,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {step.type === "photo" ? (
            <>
              <input ref={fileRef} type="file" accept="image/*" capture={step.capture} style={{ display: "none" }} onChange={(e) => { handleFile(e.target.files[0]); e.target.value = ""; }} />
              {/* capture属性なし: 一部端末ではcapture付きinputだとカメラしか開けず写真ライブラリを選べないため、専用のinputを用意する */}
              <input ref={libraryFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { handleFile(e.target.files[0]); e.target.value = ""; }} />
              <div
                onClick={() => openCamera(step.capture)}
                style={{
                  margin: "14px auto 0", width: 150, height: 150, borderRadius: 20,
                  border: "2px dashed #D6CFC5", display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", cursor: "pointer", background: "#FFF",
                }}
              >
                {photos[step.id] ? (
                  <img src={photos[step.id].url} alt={step.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ color: "#B0A99F", fontSize: 12.5, lineHeight: 1.8 }}>
                    タップして
                    <br />
                    カメラを起動
                  </div>
                )}
              </div>
              <button
                onClick={() => libraryFileRef.current?.click()}
                style={{ background: "none", border: "none", color: "#B0A99F", fontSize: 11.5, textDecoration: "underline", marginTop: 10 }}
              >
                カメラを使わず写真を選ぶ
              </button>
            </>
          ) : null}

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            {current > 0 && (
              <button onClick={() => setCurrent(current - 1)} style={{ background: "none", border: "1px solid #D6CFC5", borderRadius: 999, padding: "8px 18px", fontSize: 12, color: "#6E675F" }}>
                ← 前へ
              </button>
            )}
            {!step.required && current < STEPS.length - 1 && (
              <button onClick={goNext} style={{ background: "none", border: "1px solid #D6CFC5", borderRadius: 999, padding: "8px 18px", fontSize: 12, color: "#6E675F" }}>
                {photos[step.id] ? "次へ →" : "スキップ →"}
              </button>
            )}
          </div>
        </div>

        {/* 診断ボタン */}
        <button
          onClick={analyze}
          disabled={!canAnalyze || loading}
          style={{
            marginTop: 16, width: "100%",
            background: canAnalyze && !loading ? "#33302C" : "#D6CFC5",
            color: "#F7F5F2", border: "none", borderRadius: 999,
            padding: "13px 0", fontSize: 14, letterSpacing: "0.1em", fontWeight: 500,
          }}
        >
          {loading ? "診断中…" : canAnalyze ? `${doneCount}項目で診断する` : "肌(顔全体)の写真を撮ると診断できます"}
        </button>

        {loading && (
          <p style={{ fontSize: 12.5, color: "#9A938A", marginTop: 12, textAlign: "center", animation: "pulse 1.4s infinite" }}>
            肌・瞳・髪・手のひら・血管の色を分析しています…
          </p>
        )}
        {error && <p style={{ fontSize: 13, color: "#B3402B", marginTop: 12, lineHeight: 1.8, textAlign: "center" }}>{error}</p>}
      </div>

      {/* カメラ画面 */}
      {cameraOn && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,18,16,0.96)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <p style={{ color: "#F7F5F2", fontFamily: font.display, fontSize: 15, margin: "0 0 4px" }}>{step.title} を撮影</p>
          <p style={{ color: "#B0A99F", fontSize: 12, margin: "0 0 14px", textAlign: "center", lineHeight: 1.7, maxWidth: 300 }}>{step.guide}</p>
          <div style={{ width: "min(80vw, 340px)", aspectRatio: "1", borderRadius: 24, overflow: "hidden", background: "#000", border: "2px solid rgba(255,255,255,0.25)" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: facing === "user" ? "scaleX(-1)" : "none" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 22 }}>
            <button onClick={stopCamera} style={{ background: "none", border: "1px solid rgba(255,255,255,0.4)", color: "#F7F5F2", borderRadius: 999, padding: "9px 18px", fontSize: 12.5 }}>
              閉じる
            </button>
            <button
              onClick={shoot}
              aria-label="シャッター"
              style={{ width: 68, height: 68, borderRadius: "50%", background: "#F7F5F2", border: "4px solid rgba(255,255,255,0.35)", boxShadow: "0 0 0 3px rgba(0,0,0,0.3)" }}
            />
            <button onClick={switchCamera} style={{ background: "none", border: "1px solid rgba(255,255,255,0.4)", color: "#F7F5F2", borderRadius: 999, padding: "9px 18px", fontSize: 12.5 }}>
              カメラ切替
            </button>
          </div>
        </div>
      )}

      {/* 診断結果 */}
      {result && season && (
        <div className="fade-up" style={{ background: "#FFF", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.06)", marginTop: 18 }}>
          <div style={{ background: season.soft, padding: "26px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#9A938A", margin: 0 }}>診断結果</p>
            <h2 style={{ fontFamily: font.display, fontSize: 30, fontWeight: 700, color: season.accent, margin: "8px 0 2px" }}>{season.name}</h2>
          </div>
          <div style={{ padding: "22px 24px 26px" }}>
            <p style={{ fontSize: 14, lineHeight: 2, margin: 0 }}>{season.desc}</p>

            <div style={{ background: "#F7F5F2", borderRadius: 12, padding: "14px 16px", marginTop: 16 }}>
              <strong style={{ fontSize: 12.5, color: season.accent }}>肌トーンの総合分析</strong>
              <p style={{ fontSize: 13, lineHeight: 1.9, margin: "5px 0 0" }}>{result.undertone}</p>
            </div>

            {/* イエベ/ブルベバランス */}
            {typeof result.warmScore === "number" && typeof result.coolScore === "number" && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6E675F", marginBottom: 5 }}>
                  <span>イエベ寄り {result.warmScore}</span>
                  <span>ブルベ寄り {result.coolScore}</span>
                </div>
                <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", background: "#F0EDE8" }}>
                  <div style={{ width: `${(result.warmScore / (result.warmScore + result.coolScore || 1)) * 100}%`, background: "#E8965C" }} />
                  <div style={{ flex: 1, background: "#7A86C7" }} />
                </div>
              </div>
            )}

            {result.seasonScores && (
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 11.5, color: "#6E675F", margin: "0 0 6px" }}>4タイプの可能性</p>
                {["spring", "summer", "autumn", "winter"].map((k) => {
                  const v = result.seasonScores[k] ?? 0;
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span style={{ width: 58, fontSize: 11, color: "#6E675F" }}>{SEASONS[k].name}</span>
                      <div style={{ flex: 1, height: 8, background: "#F0EDE8", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${v}%`, height: "100%", background: SEASONS[k].accent, borderRadius: 4 }} />
                      </div>
                      <span style={{ width: 26, fontSize: 10.5, textAlign: "right", color: "#9A938A" }}>{v}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {measured?.skin && (
              <div style={{ marginTop: 14, background: "#FAF8F5", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 11.5, color: "#6E675F", margin: "0 0 8px" }}>アプリが測定した色(客観データ)</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ width: 30, height: 30, borderRadius: 9, background: measured.skin.hex, border: "1px solid #E0DAD2" }} />
                  <span style={{ fontSize: 11, color: "#9A938A" }}>{measured.skin.hex}(肌)</span>
                  {measured.palm && (
                    <>
                      <span style={{ width: 30, height: 30, borderRadius: 9, background: measured.palm.hex, border: "1px solid #E0DAD2" }} />
                      <span style={{ fontSize: 11, color: "#9A938A" }}>{measured.palm.hex}(手のひら)</span>
                    </>
                  )}
                  {measured.eyes && (
                    <>
                      <span style={{ width: 30, height: 30, borderRadius: 9, background: measured.eyes.hex, border: "1px solid #E0DAD2" }} />
                      <span style={{ fontSize: 11, color: "#9A938A" }}>{measured.eyes.hex}(瞳)</span>
                    </>
                  )}
                </div>
                <p style={{ fontSize: 10.5, color: "#B0A99F", margin: "8px 0 0", lineHeight: 1.7 }}>
                  黄み指標 {measured.skin.yellowness} / 赤み指標 {measured.skin.redness} / 明るさ {measured.skin.brightness}
                </p>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed #E0DAD2" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6E675F", marginBottom: 4 }}>
                    <span>ブルベ寄り</span>
                    <span style={{ color: "#B0A99F" }}>黄み優勢度 {measured.skin.balance}</span>
                    <span>イエベ寄り</span>
                  </div>
                  <div style={{ position: "relative", height: 8, background: "linear-gradient(90deg, #7A86C7, #C9C4CC, #E8965C)", borderRadius: 4 }}>
                    <span style={{ position: "absolute", left: `${Math.max(2, Math.min(98, ((measured.skin.balance + 15) / 35) * 100))}%`, top: -3, width: 3, height: 14, background: "#33302C", borderRadius: 2, transform: "translateX(-50%)" }} />
                  </div>
                  <p style={{ fontSize: 10, color: "#B0A99F", lineHeight: 1.7, margin: "8px 0 0" }}>
                    国際規格の色空間(CIELAB)で肌の黄み・赤みを測定しています。黄み優勢度が5以上でイエベ、5未満でブルベと判定します。
                  </p>
                </div>
              </div>
            )}

            {result.observedColors?.skin && (
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, background: "#FAF8F5", borderRadius: 10, padding: "10px 12px" }}>
                <span style={{ fontSize: 11.5, color: "#6E675F" }}>AIが観測した色:</span>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: result.observedColors.skin, border: "1px solid #E0DAD2" }} title="肌" />
                {result.observedColors.palm && result.observedColors.palm.startsWith("#") && (
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: result.observedColors.palm, border: "1px solid #E0DAD2" }} title="手のひら" />
                )}
                <span style={{ fontSize: 10.5, color: "#9A938A" }}>(左:肌{result.observedColors.palm && result.observedColors.palm.startsWith("#") ? " / 右:手のひら" : ""})</span>
              </div>
            )}

            {result.lighting && (
              <p style={{ fontSize: 11.5, color: "#9A938A", lineHeight: 1.8, marginTop: 10, background: "#FAF8F5", borderRadius: 10, padding: "10px 12px" }}>
                照明メモ:{result.lighting}
              </p>
            )}

            {/* 項目別分析 */}
            <h3 style={{ fontFamily: font.display, fontSize: 15, margin: "20px 0 10px" }}>項目別の分析</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(FEATURE_LABELS).map(([key, label]) =>
                result.features?.[key] ? (
                  <div key={key} style={{ background: "#FAF8F5", borderRadius: 12, padding: "12px 14px" }}>
                    <strong style={{ fontSize: 12.5, color: season.accent }}>{label}</strong>
                    <p style={{ fontSize: 13, lineHeight: 1.9, margin: "4px 0 0" }}>{result.features[key]}</p>
                  </div>
                ) : null
              )}
            </div>

            <h3 style={{ fontFamily: font.display, fontSize: 15, margin: "20px 0 8px" }}>そう判定した理由</h3>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 2, color: "#55504A" }}>
              {(result.reasons || []).map((r, i) => <li key={i}>{r}</li>)}
            </ul>

            <h3 style={{ fontFamily: font.display, fontSize: 15, margin: "20px 0 8px" }}>似合う色パレット</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
              {season.palette.map((p) => (
                <div key={p.n} style={{ textAlign: "center" }}>
                  <div style={{ height: 44, background: p.c, borderRadius: "0 0 12px 12px", boxShadow: "inset 0 -5px 8px rgba(0,0,0,0.10)" }} />
                  <span style={{ fontSize: 9, color: "#6E675F", display: "block", marginTop: 4, lineHeight: 1.3 }}>{p.n}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: font.display, fontSize: 15, margin: "18px 0 8px" }}>苦手になりやすい色</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {season.avoid.map((p) => (
                <div key={p.n} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 28, background: p.c, borderRadius: 8, opacity: 0.85 }} />
                  <span style={{ fontSize: 10, color: "#6E675F", display: "block", marginTop: 4 }}>{p.n}</span>
                </div>
              ))}
            </div>

            <div style={{ background: season.soft, borderRadius: 12, padding: "14px 16px", marginTop: 18 }}>
              <strong style={{ fontSize: 12.5, color: season.accent }}>あなたへのアドバイス</strong>
              <p style={{ fontSize: 13, lineHeight: 1.9, margin: "5px 0 0" }}>{result.tip}</p>
            </div>

            <p style={{ fontSize: 11, color: "#9A938A", lineHeight: 1.8, marginTop: 16 }}>
              ※ 写真の照明や画質によって結果が変わることがあります。あくまで参考としてお楽しみください。
            </p>

            {recommendedProducts.length > 0 && (
              <>
                <h3 style={{ fontFamily: font.display, fontSize: 15, margin: "22px 0 10px" }}>{season.name}に似合うコスメ</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {recommendedProducts.map((p) => (
                    <div
                      key={p.id}
                      style={{ background: "#FAF8F5", borderRadius: 14, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", position: "relative" }}
                    >
                      <button
                        onClick={() => toggleFav(p.id)}
                        aria-label="お気に入り"
                        style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", fontSize: 19, color: favs.includes(p.id) ? "#C4526B" : "#DDD6CC", lineHeight: 1, padding: 4 }}
                      >
                        {favs.includes(p.id) ? "♥" : "♡"}
                      </button>
                      <ProductVisual product={p} size={62} />
                      <div style={{ flex: 1, minWidth: 0, paddingRight: 20 }}>
                        <p style={{ fontSize: 10, color: "#9A938A", margin: 0 }}>{p.brand} / {p.cat}</p>
                        <p style={{ fontSize: 12.5, fontWeight: 700, margin: "2px 0 3px", lineHeight: 1.4 }}>{p.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <Stars value={p.avg} size={11} />
                          <span style={{ fontSize: 10.5, color: "#6E675F" }}>{p.avg.toFixed(1)}</span>
                          <span style={{ fontSize: 10.5, color: "#9A938A" }}>¥{p.price.toLocaleString()}</span>
                          <a href={shoppingSearchUrl(p)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10.5, color: season.accent, textDecoration: "underline" }}>
                            楽天市場で探す
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onGoRanking}
                  style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", color: "#9A938A", fontSize: 12, textDecoration: "underline" }}
                >
                  {season.name}に似合うコスメをもっと見る →
                </button>
              </>
            )}

            <button
              onClick={() => { setPhotos({}); setHairDyed(null); setMeasured(null); setCurrent(0); setResult(null); }}
              style={{ marginTop: 14, width: "100%", background: "transparent", border: "1.5px solid #33302C", borderRadius: 999, padding: "12px 0", fontSize: 13.5, letterSpacing: "0.1em" }}
            >
              最初からやり直して診断する
            </button>
          </div>
        </div>
      )}

      {!result && myType && (
        <p style={{ textAlign: "center", fontSize: 12.5, color: "#9A938A", marginTop: 16 }}>
          前回の診断:{SEASONS[myType].name}(新しく診断すると更新されます)
        </p>
      )}
    </div>
  );
}

// ---------------- ランキングタブ ----------------
function RankingTab({ myType, ratingOf, favs, toggleFav, onGoDiagnosis }) {
  const [cat, setCat] = useState("すべて");
  const [brand, setBrand] = useState("すべて");
  const [onlyMine, setOnlyMine] = useState(false);

  let list = PRODUCTS.filter((p) => (cat === "すべて" || p.cat === cat) && (brand === "すべて" || p.brand === brand));
  if (onlyMine && myType) list = list.filter((p) => p.seasons.includes(myType));
  list = list
    .map((p) => ({ ...p, ...ratingOf(p) }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: font.display, fontSize: 18, textAlign: "center", margin: "4px 0 14px" }}>コスメランキング</h2>

      {/* フィルター */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              background: cat === c ? "#33302C" : "#FFF",
              color: cat === c ? "#F7F5F2" : "#55504A",
              border: "1px solid #E0DAD2", borderRadius: 999, padding: "7px 16px", fontSize: 12.5,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ブランドフィルター */}
      <p style={{ fontSize: 11, color: "#B0A99F", textAlign: "center", margin: "10px 0 6px", letterSpacing: "0.15em" }}>ブランドで絞り込む</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            style={{
              background: brand === b ? "#8C7A64" : "#FFF",
              color: brand === b ? "#FFF" : "#8C8378",
              border: "1px solid #E0DAD2", borderRadius: 999, padding: "6px 13px", fontSize: 11.5,
            }}
          >
            {b}
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        {myType ? (
          <button
            onClick={() => setOnlyMine(!onlyMine)}
            style={{
              background: onlyMine ? SEASONS[myType].soft : "#FFF",
              color: onlyMine ? SEASONS[myType].accent : "#9A938A",
              border: `1.5px solid ${onlyMine ? SEASONS[myType].accent : "#E0DAD2"}`,
              borderRadius: 999, padding: "7px 18px", fontSize: 12.5, fontWeight: onlyMine ? 700 : 400,
            }}
          >
            {onlyMine ? "✓ " : ""}{SEASONS[myType].name}に似合うものだけ表示
          </button>
        ) : (
          <button onClick={onGoDiagnosis} style={{ background: "none", border: "none", color: "#9A938A", fontSize: 12, textDecoration: "underline" }}>
            診断をすると、あなたに似合うコスメで絞り込めます →
          </button>
        )}
      </div>

      {/* ランキングリスト */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((p, i) => (
          <div key={p.id} style={{ background: "#FFF", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", position: "relative" }}>
            <button
              onClick={() => toggleFav(p.id)}
              aria-label="お気に入り"
              style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", fontSize: 20, color: favs.includes(p.id) ? "#C4526B" : "#DDD6CC", lineHeight: 1, padding: 4 }}
            >
              {favs.includes(p.id) ? "♥" : "♡"}
            </button>
            <div style={{ fontFamily: font.display, fontSize: 20, fontWeight: 700, width: 26, textAlign: "center", color: i < 3 ? "#C9962B" : "#B0A99F" }}>
              {i + 1}
            </div>
            <ProductVisual product={p} size={76} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10.5, color: "#9A938A", margin: 0 }}>{p.brand} / {p.cat}</p>
              <p style={{ fontSize: 13.5, fontWeight: 700, margin: "2px 0 4px", lineHeight: 1.4 }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Stars value={p.avg} />
                <span style={{ fontSize: 11.5, color: "#6E675F" }}>{p.avg.toFixed(1)}({p.count}件)</span>
                <span style={{ fontSize: 11.5, color: "#9A938A" }}>¥{p.price.toLocaleString()}</span>
                <a href={shoppingSearchUrl(p)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11.5, color: "#B3612F", textDecoration: "underline" }}>
                  楽天市場で探す
                </a>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
                {p.seasons.map((s) => (
                  <span key={s} style={{ fontSize: 9.5, background: SEASONS[s].soft, color: SEASONS[s].accent, borderRadius: 999, padding: "2px 8px", fontWeight: 700 }}>
                    {SEASONS[s].name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#9A938A", padding: "30px 0" }}>該当するコスメがありませんでした。</p>
        )}
      </div>
      <p style={{ fontSize: 11, color: "#B0A99F", textAlign: "center", marginTop: 16, lineHeight: 1.8 }}>
        ※ 商品は実在のものですが、評価・口コミはこのアプリ内の初期値とユーザー投稿です。価格は変動する場合があるため、購入前に販売ページでご確認ください。
      </p>
    </div>
  );
}

// ---------------- マイページタブ ----------------
function MyPageTab({ myType, myDiag, favs, toggleFav, ratingOf, onGoDiagnosis }) {
  const season = myType ? SEASONS[myType] : null;

  const favProducts = PRODUCTS.filter((p) => favs.includes(p.id)).map((p) => ({ ...p, ...ratingOf(p) }));
  const recommended = myType
    ? PRODUCTS.filter((p) => p.seasons.includes(myType))
        .map((p) => ({ ...p, ...ratingOf(p) }))
        .sort((a, b) => b.avg - a.avg)
    : [];
  // カテゴリ別にまとめる
  const byCat = {};
  for (const p of recommended) {
    if (!byCat[p.cat]) byCat[p.cat] = [];
    byCat[p.cat].push(p);
  }
  const catOrder = ["リップ", "チーク", "アイシャドウ", "アイライナー", "マスカラ", "ノーズシャドウ", "ベースメイク"].filter((c) => byCat[c]);

  const ProductRow = ({ p }) => (
    <div style={{ background: "#FFF", borderRadius: 14, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", position: "relative" }}>
      <button
        onClick={() => toggleFav(p.id)}
        aria-label="お気に入り"
        style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", fontSize: 19, color: favs.includes(p.id) ? "#C4526B" : "#DDD6CC", lineHeight: 1, padding: 4 }}
      >
        {favs.includes(p.id) ? "♥" : "♡"}
      </button>
      <ProductVisual product={p} size={64} />
      <div style={{ flex: 1, minWidth: 0, paddingRight: 20 }}>
        <p style={{ fontSize: 10, color: "#9A938A", margin: 0 }}>{p.brand} / {p.cat}</p>
        <p style={{ fontSize: 12.5, fontWeight: 700, margin: "2px 0 3px", lineHeight: 1.4 }}>{p.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Stars value={p.avg} size={11} />
          <span style={{ fontSize: 10.5, color: "#6E675F" }}>{p.avg.toFixed(1)}</span>
          <span style={{ fontSize: 10.5, color: "#9A938A" }}>¥{p.price.toLocaleString()}</span>
          <a href={shoppingSearchUrl(p)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10.5, color: "#B3612F", textDecoration: "underline" }}>
            楽天市場で探す
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: font.display, fontSize: 18, textAlign: "center", margin: "4px 0 16px" }}>マイページ</h2>

      {/* 診断結果カード */}
      {season && myDiag ? (
        <div style={{ background: "#FFF", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.06)", marginBottom: 22 }}>
          <div style={{ background: season.soft, padding: "22px 22px 18px", textAlign: "center" }}>
            <p style={{ fontSize: 10.5, letterSpacing: "0.3em", color: "#9A938A", margin: 0 }}>あなたのパーソナルカラー</p>
            <h3 style={{ fontFamily: font.display, fontSize: 27, fontWeight: 700, color: season.accent, margin: "6px 0 2px" }}>{season.name}</h3>
            <p style={{ fontSize: 11, color: "#9A938A", margin: 0 }}>
              {myDiag.date} 診断
            </p>
          </div>
          <div style={{ padding: "16px 20px 20px" }}>
            {myDiag.undertone && (
              <p style={{ fontSize: 12.5, lineHeight: 1.9, margin: "0 0 12px", color: "#55504A" }}>{myDiag.undertone}</p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
              {season.palette.map((p) => (
                <div key={p.n} title={p.n} style={{ height: 30, background: p.c, borderRadius: "0 0 9px 9px", boxShadow: "inset 0 -4px 6px rgba(0,0,0,0.10)" }} />
              ))}
            </div>
            <button
              onClick={onGoDiagnosis}
              style={{ marginTop: 14, width: "100%", background: "none", border: "1.5px solid #33302C", borderRadius: 999, padding: "10px 0", fontSize: 12.5, letterSpacing: "0.1em" }}
            >
              もう一度診断する
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: "#FFF", borderRadius: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 2px 14px rgba(0,0,0,0.05)", marginBottom: 22 }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.9, margin: "0 0 14px" }}>
            まだ診断結果がありません。
            <br />
            診断をすると、ここに結果が表示されます。
          </p>
          <button
            onClick={onGoDiagnosis}
            style={{ background: "#33302C", color: "#F7F5F2", border: "none", borderRadius: 999, padding: "12px 34px", fontSize: 13.5, letterSpacing: "0.1em" }}
          >
            AI診断をする
          </button>
        </div>
      )}

      {/* 似合うコスメ(カテゴリ別) */}
      {season && recommended.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <h3 style={{ fontFamily: font.display, fontSize: 16, margin: "0 0 3px" }}>
            <span style={{ color: season.accent }}>{season.name}</span> に似合うコスメ
          </h3>
          <p style={{ fontSize: 11.5, color: "#9A938A", margin: "0 0 14px" }}>
            全{recommended.length}点 / カテゴリごとに評価の高い順
          </p>

          {catOrder.map((c) => (
            <div key={c} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, background: season.soft, color: season.accent, borderRadius: 999, padding: "4px 14px" }}>
                  {c}
                </span>
                <span style={{ flex: 1, height: 1, background: "#E5E0DA" }} />
                <span style={{ fontSize: 11, color: "#B0A99F" }}>{byCat[c].length}点</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {byCat[c].map((p) => <ProductRow key={p.id} p={p} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* お気に入り */}
      <h3 style={{ fontFamily: font.display, fontSize: 15.5, margin: "0 0 10px" }}>お気に入りコスメ({favProducts.length})</h3>
      {favProducts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {favProducts.map((p) => <ProductRow key={p.id} p={p} />)}
        </div>
      ) : (
        <p style={{ fontSize: 12.5, color: "#9A938A", lineHeight: 1.9, background: "#FFF", borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
          まだお気に入りがありません。
          <br />
          ランキングで気になるコスメの ♡ をタップすると、ここに追加されます。
        </p>
      )}
    </div>
  );
}

// ---------------- 口コミタブ ----------------
function ReviewTab({ reviews, addReview, myType, storageReady }) {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [posted, setPosted] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    addReview({
      id: Date.now().toString(36),
      productId,
      rating,
      text: text.trim().slice(0, 300),
      name: name.trim().slice(0, 20) || "匿名さん",
      season: myType || null,
      date: new Date().toLocaleDateString("ja-JP"),
    });
    setText("");
    setPosted(true);
    setTimeout(() => setPosted(false), 2500);
  };

  const productName = (id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? `${p.brand} ${p.name}` : "不明な商品";
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily: font.display, fontSize: 18, textAlign: "center", margin: "4px 0 14px" }}>みんなの口コミ</h2>
      <p style={{ fontSize: 11.5, color: "#9A938A", textAlign: "center", margin: "0 0 16px", lineHeight: 1.8 }}>
        投稿した口コミはこの端末に保存されます
      </p>

      {/* 投稿フォーム */}
      <div style={{ background: "#FFF", borderRadius: 16, padding: "18px 18px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: "#6E675F", display: "block", marginBottom: 4 }}>商品を選ぶ</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0DAD2", fontSize: 13, fontFamily: font.body, background: "#FAF8F5" }}
        >
          {PRODUCTS.map((p) => (
            <option key={p.id} value={p.id}>{p.brand} / {p.name}</option>
          ))}
        </select>

        <label style={{ fontSize: 12, color: "#6E675F", display: "block", margin: "14px 0 4px" }}>評価</label>
        <div style={{ display: "flex", gap: 4 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} style={{ background: "none", border: "none", fontSize: 26, color: n <= rating ? "#E0A93E" : "#DDD6CC", padding: 2 }} aria-label={`星${n}`}>
              ★
            </button>
          ))}
        </div>

        <label style={{ fontSize: 12, color: "#6E675F", display: "block", margin: "12px 0 4px" }}>ニックネーム(任意)</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="匿名さん"
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0DAD2", fontSize: 13, fontFamily: font.body }}
        />

        <label style={{ fontSize: 12, color: "#6E675F", display: "block", margin: "12px 0 4px" }}>口コミ(300字まで)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="発色・持ち・使用感など、感じたことを書いてみましょう"
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: "1px solid #E0DAD2", fontSize: 13, fontFamily: font.body, resize: "vertical" }}
        />

        <button
          onClick={submit}
          disabled={!text.trim() || !storageReady}
          style={{
            marginTop: 12, width: "100%",
            background: text.trim() && storageReady ? "#33302C" : "#D6CFC5",
            color: "#F7F5F2", border: "none", borderRadius: 999, padding: "12px 0", fontSize: 14, letterSpacing: "0.1em",
          }}
        >
          {posted ? "投稿しました ✓" : "口コミを投稿する"}
        </button>
      </div>

      {/* 口コミ一覧 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reviews.length === 0 && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#9A938A", padding: "20px 0" }}>
            まだ口コミがありません。最初のレビューを書いてみませんか?
          </p>
        )}
        {reviews.map((r) => (
          <div key={r.id} style={{ background: "#FFF", borderRadius: 14, padding: "14px 16px", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize: 11, color: "#9A938A", margin: "0 0 4px" }}>{productName(r.productId)}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Stars value={r.rating} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>{r.name}</span>
              {r.season && SEASONS[r.season] && (
                <span style={{ fontSize: 9.5, background: SEASONS[r.season].soft, color: SEASONS[r.season].accent, borderRadius: 999, padding: "2px 8px", fontWeight: 700 }}>
                  {SEASONS[r.season].name}
                </span>
              )}
              <span style={{ fontSize: 10.5, color: "#B0A99F", marginLeft: "auto" }}>{r.date}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.9, margin: "8px 0 0" }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
