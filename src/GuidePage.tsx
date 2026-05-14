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

// ─── 조항 데이터 ──────────────────────────────────────────────────
interface ClauseInfo {
  original: string
  suggested: string
  basis: string
  highlight: string
}

const CLAUSE_DATA: Record<string, ClauseInfo> = {
  '제3조 근로시간 및 휴게시간': {
    original: '근로시간: ~ (일 8시간, 주 40시간)\n휴게시간: ~ (1시간)',
    suggested: '근로시간: 1일 8시간, 1주 40시간을 원칙으로 하며, 연장근로는 당사자 합의 하에 1주 12시간을 초과할 수 없습니다.',
    basis: '적용 근거: 근로기준법 제50조(근로시간), 제53조(연장 근로의 제한)',
    highlight: '근로시간: ~ (일 8시간, 주 40시간)\n휴게시간: ~ (1시간)',
  },
  '제6조 비밀유지 의무': {
    original: "제6조 (비밀유지 의무) '을'은 재직 중은 물론 퇴직 후에도 업무상 알게 된 회사의 영업비밀을 누설하지 않는다.",
    suggested: "제6조 (비밀유지 의무) '을'은 업무상 취득한 영업비밀의 범위를 구체적으로 명시하며, 위반 시 손해배상 책임을 질 수 있음을 명확히 합니다.",
    basis: '적용 근거: 부정경쟁방지 및 영업비밀보호에 관한 법률',
    highlight: "제6조 (비밀유지 의무) '을'은 재직 중은 물론 퇴직 후에도 업무상 알게 된 회사의 영업비밀을 누설하지 않는다.",
  },
  '제7조 지식재산권의 귀속': {
    original: "제7조 (지식재산권의 귀속) '을'이 직무와 관련하여 개발한 모든 저작물은 '갑'의 소유로 한다.",
    suggested: "제7조 (지식재산권의 귀속) '을'이 직무상 창작한 저작물에 대한 보상 규정을 추가하고, 소유권 이전 절차를 법령에 맞게 보완합니다.",
    basis: '적용 근거: 저작권법 및 발명진흥법',
    highlight: "제7조 (지식재산권의 귀속) '을'이 직무와 관련하여 개발한 모든 저작물은 '갑'의 소유로 한다.",
  }
}

const DROP_OPTIONS = Object.keys(CLAUSE_DATA)

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

// ─── 하이라이트 적용 컴포넌트 ──────────────────────────────────
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight || !text.includes(highlight)) {
    return <>{text}</>
  }

  const parts = text.split(highlight)
  return (
    <>
      {parts[0]}
      <mark className="preview-highlight">{highlight}</mark>
      {parts[1]}
    </>
  )
}

// ─── 수정 가이드 제안 페이지 ─────────────────────────────────────
export default function GuidePage() {
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [selected, setSelected] = useState('문제 조항 선택')
  const [expandDoc, setExpandDoc] = useState(false)

  const clauseInfo = CLAUSE_DATA[selected]

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

        {/* 원본 및 수정 가이드 섹션 */}
        <div className="clause-container">
          {/* 원본 조항 */}
          <section className="guide-section">
            <h2 className="section-title">원본 조항</h2>
            <div className="guide-card original">
              <p className="guide-card__label">기존 조항 내용</p>
              {clauseInfo ? (
                <p className="guide-card__body">{clauseInfo.original}</p>
              ) : (
                <p className="guide-card__body guide-card__empty">
                  조항을 선택하면 원본 내용이 표시됩니다.
                </p>
              )}
            </div>
          </section>

          {/* 수정 가이드 */}
          <section className="guide-section">
            <h2 className="section-title">수정 가이드</h2>
            <div className="guide-card suggested">
              <p className="guide-card__label">권장 수정 방향</p>
              {clauseInfo ? (
                <>
                  <p className="guide-card__body">{clauseInfo.suggested}</p>
                  <p className="guide-card__basis">{clauseInfo.basis}</p>
                </>
              ) : (
                <p className="guide-card__body guide-card__empty">
                  조항을 선택하면 수정 가이드가 표시됩니다.
                </p>
              )}
            </div>
          </section>
        </div>

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
                <pre className="doc-paper__body">
                  <HighlightedText text={CONTRACT_BODY} highlight={clauseInfo?.highlight || ''} />
                </pre>
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
