import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './GuidePage.css'

// ─── 아이콘 ───────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M6 2H12L16 6V18H4V2H6Z" stroke="#333" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12 2V6H16" stroke="#333" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M7 10H13M7 13H11" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const ExpandIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M2 2H7V7" stroke="#333" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 15H10V10" stroke="#333" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 2L8 8M15 15L9 9" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

// ─── 드롭다운 선택지 (피그마 추출) ────────────────────────────────
const DROP_OPTIONS = [
  '동작도서관',
  '까망돌도서관',
  '김영삼도서관',
  '사당솥밭도서관',
  '신대방누리도서관',
  '동작영어마루도서관',
  '대방어린이도서관',
  '약수도서관',
  '동작샘터도서관',
  '다울작은도서관',
  '국사봉숲속작은도서관',
]

// ─── 근로계약서 미리보기 텍스트 ───────────────────────────────────
const CONTRACT_TITLE = '근로계약서(정규직/기간제)'
const CONTRACT_BODY = `사용자(이하 '갑')와 근로자(이하 '을')는 아래와 같이 근로계약을 체결하고 이를 성실히 이행할 것을 약정한다.

1. 근로계약기간
기간: 2026년 [ ]월 [ ]일부터 기간의 정함이 없는 것으로 한다.
수습기간: 입사일로부터 [3]개월간은 수습기간으로 한다.

2. 근무장소 및 업무내용
근무장소: [회사 주소 또는 지정된 장소]
업무내용: [직무명/예: 백엔드 개발 및 시스템 운영]

3. 소정근로시간 및 휴게시간
근로시간: ~ (일 8시간, 주 40시간)
휴게시간: ~ (1시간)

4. 임금 (연봉제 기준)
월 급여: 금 [ ]원 (세전 금액)
지급일: 매월 [ ]일
지급방법: '을' 명의의 예금계좌로 입금한다.

5. 휴일 및 연차유급휴가
주휴일: 매주 [일요일]을 유급주휴일로 한다.
연차휴가: 근로기준법에서 정하는 바에 따라 부여한다.

[추가 특약 조항]

제6조 (비밀유지 의무) '을'은 재직 중은 물론 퇴직 후에도 업무상 알게 된 회사의 영업비밀을 누설하지 않는다.

제7조 (지식재산권의 귀속) '을'이 직무와 관련하여 개발한 모든 저작물은 '갑'의 소유로 한다.

제8조 (교육 및 수료 의무) '갑'이 제공하는 교육에 성실히 참여한다.

제9조 (준거법 및 관할) 분쟁 발생 시 '갑'의 소재지 관할 법원으로 한다.`

// ─── 수정 가이드 제안 페이지 ─────────────────────────────────────
export default function GuidePage() {
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [selected, setSelected] = useState('문제 조항 선택')
  const [expandDoc, setExpandDoc] = useState(false)

  const guideContent = selected !== '문제 조항 선택'
    ? {
        direction: '주 52시간 이내로 근로시간을 제한하고, 연장근로는 근로자 동의 하에 주 12시간을 초과하지 않도록 명시합니다.',
        basis: '적용 근거: 근로기준법 제50조, 제 53조',
      }
    : null

  return (
    <div id="guide-page">
      {/* 헤더 */}
      <header className="app-header">
        <button className="header-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ArrowLeftIcon />
        </button>
        <span className="header-title">수정 가이드 제안</span>
        <div style={{ width: 24 }} />
      </header>

      <main className="guide-content">
        {/* 문제 조항 선택 섹션 */}
        <section className="guide-section">
          <h2 className="section-title">문제 조항 선택</h2>
          <div className="dropdown-wrapper">
            <button
              id="dropdown-trigger"
              className="dropdown-trigger"
              onClick={() => setDropOpen(v => !v)}
              aria-expanded={dropOpen}
            >
              <span className={selected === '문제 조항 선택' ? 'dropdown-placeholder' : 'dropdown-value'}>
                {selected}
              </span>
              <span className={`dropdown-chevron ${dropOpen ? 'open' : ''}`}>
                <ChevronDownIcon />
              </span>
            </button>

            {dropOpen && (
              <ul className="dropdown-list" role="listbox">
                {DROP_OPTIONS.map(opt => (
                  <li
                    key={opt}
                    className={`dropdown-item ${selected === opt ? 'selected' : ''}`}
                    role="option"
                    aria-selected={selected === opt}
                    onClick={() => {
                      setSelected(opt)
                      setDropOpen(false)
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 수정 가이드 섹션 */}
        <section className="guide-section">
          <h2 className="section-title">수정 가이드</h2>
          <div className="guide-card">
            <p className="guide-card__label">권장 수정 방향</p>
            {guideContent ? (
              <>
                <p className="guide-card__body">{guideContent.direction}</p>
                <p className="guide-card__basis">{guideContent.basis}</p>
              </>
            ) : (
              <p className="guide-card__body guide-card__empty">
                위에서 문제 조항을 선택하면 수정 가이드가 표시됩니다.
              </p>
            )}
          </div>
        </section>

        {/* 수정 템플릿 미리보기 섹션 */}
        <section className="guide-section">
          <h2 className="section-title">수정 템플릿 미리보기</h2>
          <div className="doc-wrapper">
            {/* 툴바 */}
            <div className="doc-toolbar">
              <div className="doc-toolbar__left">
                <DocumentIcon />
              </div>
              <div className="doc-toolbar__divider" />
              <button
                className="doc-toolbar__expand"
                onClick={() => setExpandDoc(v => !v)}
                aria-label="문서 확대"
              >
                <ExpandIcon />
              </button>
            </div>
            {/* 문서 미리보기 */}
            <div className={`doc-preview ${expandDoc ? 'expanded' : ''}`}>
              <div className="doc-paper">
                <h3 className="doc-paper__title">{CONTRACT_TITLE}</h3>
                <pre className="doc-paper__body">{CONTRACT_BODY}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 */}
        <div className="guide-cta">
          <button id="apply-guide-btn" className="cta-btn">
            수정 가이드 입력/적용?
          </button>
        </div>
      </main>
    </div>
  )
}
