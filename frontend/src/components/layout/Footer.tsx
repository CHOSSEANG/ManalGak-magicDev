// src/components/layout/Footer.tsx

"use client";

export default function Footer() {
  const handleFamilyLinkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = e.target.value;
    if (!url) return;
    window.open(url, "_blank");
    e.target.selectedIndex = 0; // 다시 placeholder로
  };

  return (
    <footer className="w-full border-t border-[var(--wf-border)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 text-xs">
        {/* 왼쪽: 최소 브랜드 */}
        <span className="text-[var(--wf-text-subtle)]">© Manalgak</span>

        {/* 오른쪽: 패밀리 링크 */}
        <select
          onChange={handleFamilyLinkChange}
          className="rounded border border-[var(--wf-border)] bg-transparent px-2 py-1 text-xs"
          defaultValue=""
        >
          <option value="" disabled>
            패밀리 링크
          </option>
          <option value="/about">
            만날각 소개 & 만든사람들
          </option>
          <option value="https://github.com/CHOSSEANG/ManalGak-magicDev.git">
            만날각 GitHub
          </option>
          <option value="https://www.notion.so/MagicDev-2d907cb40308808a871df339cb7b264c">
            만날각 Notion
          </option>
          <option value="https://www.figma.com/design/bLBe9NwstkTnikd5h2tAJg/magicDev-%EC%B9%B4%EC%B9%B4%EC%98%A4api?node-id=0-1&t=S3iyx2Gzy9eHAAOR-1">
            만날각 Figma 디자인회의
          </option>
          <option value="https://miro.com/welcomeonboard/WmNTMlNTUjc3ZHhNTDZOdUlmU1BSUllKU0NxY0tSTUNxT3pDdEFmdWRaWTlydURyUVVtMjk1L3pnL0swQnkrREMrcTNMdzhMei9hREpDUGtOTEFPSTl6Q0FLRkJacW9JT3UzZmlDN1J1NDZvV2k3Q3lKMEh2dnJ5K3BYMDhMQmJnbHpza3F6REdEcmNpNEFOMmJXWXBBPT0hdjE=?share_link_id=151136698">
            만날각 miro 기획회의
          </option>
          <option value="https://webicapp.com/">이전 프로젝트 보기</option>
        </select>
      </div>
      <br />
      <br />
      <br />
      <br />
    </footer>
  );
}
