import { useState, useEffect } from 'react'
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
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M6 2H12L16 6V18H4V2H6Z" stroke="#f9fafb" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M12 2V6H16" stroke="#f9fafb" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M7 10H13M7 13H11" stroke="#f9fafb" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const ExpandIcon = ({ expanded }: { expanded: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    {expanded ? (
      <>
        <path d="M5 1H2C1.45 1 1 1.45 1 2V5" stroke="#f9fafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 1H14C14.55 1 15 1.45 15 2V5" stroke="#f9fafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 15H2C1.45 15 1 14.55 1 14V11" stroke="#f9fafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 15H14C14.55 15 15 14.55 15 14V11" stroke="#f9fafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ) : (
      <>
        <path d="M1 5V2C1 1.45 1.45 1 2 1H5" stroke="#f9fafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 5V2C15 1.45 14.55 1 14 1H11" stroke="#f9fafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 11V14C1 14.55 1.45 15 2 15H5" stroke="#f9fafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 11V14C15 14.55 14.55 15 14 15H11" stroke="#f9fafb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </svg>
)

// ─── 조항 데이터 ───────────────────────────────────────────────────────
type ClauseInfo = {
  original: string
  suggested: string
  basis: string
}

const CLAUSE_DATA: Record<string, ClauseInfo> = {
  '제3조 (근로시간 및 휴게시간)': {
    original:
      '업무량에 따라 사전 통보 없이 근무시간이 조정될 수 있으며, 이 경우 추가 수당은 별도로 정산한다.',
    suggested:
      "근무시간 변경은 반드시 사전에 근로자('을')의 서면 동의를 받아야 하며, 연장·야간·휴일 근로에 대해서는 근로기준법에 따른 가산수당(통상임금의 50%)을 지급한다.",
    basis: '적용 근거: 근로기준법 제51조(근로시간), 제56조(연장·야간·휴일 근로), 제93조(취업규칙 변경 시 근로자 동의)',
  },
  '제8조 (연장근로)': {
    original:
      "업무상 필요에 따라 '갑'은 '을'에게 소정근로시간 외 추가 근무를 요청할 수 있다.\n추가 근무에 대한 수당은 해당 월 급여 정산 시 합산 지급하며, 정산 방식은 '갑'이 결정한다.",
    suggested:
      '연장근로 수당은 통상임금의 1.5배로 산정하며, 매월 급여 지급일에 근로 내역을 명시한 급여명세서와 함께 지급한다. 정산 방식은 법령을 기준으로 하며 일방적으로 변경할 수 없다.',
    basis: '적용 근거: 근로기준법 제56조(연장근로 가산임금), 제48조(임금명세서 교부 의무)',
  },
  '제9조 (주휴수당 지급 기준)': {
    original:
      "주휴수당은 해당 주 소정근로일을 '성실히' 근무한 경우에 한하여 지급하며, 지각·조퇴가 누적되는 경우 '갑'의 판단에 따라 지급 여부를 결할 수 있다.\n주휴수당 산정 기준 시간은 실 근로시간이 아닌 사업주가 인정한 근로시간으로 한다.",
    suggested:
      "주휴수당은 해당 주 소정근로일을 개근한 경우 법정 요건에 따라 반드시 지급한다. 지각·조퇴는 결근으로 볼 수 없으며, 사용자('갑')의 주관적 판단으로 주휴수당 지급을 거부할 수 없다. 주휴수당 산정 기준 시간은 근로기준법에 따른 소정근로시간으로 한다.",
    basis: '적용 근거: 근로기준법 제55조(휴일), 근로기준법 시행령 제30조(유급휴일 산정), 대법원 판례(2013다77551)',
  },
}

const DROP_OPTIONS = Object.keys(CLAUSE_DATA)

// ─── 계약서 본문 (CLAUSE_DATA.original 값과 정확히 일치하는 텍스트 포함) ──
const CONTRACT_BODY = `근로계약서
사용자(이하 '갑')와 근로자(이하 '을')는 다음과 같이 근로계약을 체결하고 이를 성실히 이행할
것을 약정한다.

제1조 (근로계약기간)
• 계약기간: 2026 년 8 월 1 일 ~ 2026 년 12 월 31 일
• 단, 계약 만료 7 일 전까지 별도 의사표시가 없으면 동일 조건으로 자동 연장된다.
• 수습기간: 입사일로부터 2 개월간은 수습기간으로 하며, 수습기간 중 시급은 최저시급의
90%인 9,027 원으로 한다.

제2조 (근무장소 및 업무내용)
• 근무장소: ○○카페 강남점 (서울특별시 강남구 역삼로 88, 1 층)
• 업무내용: 음료 제조, 홀 서빙, 매장 청소 및 정리 등 사용자가 지시하는 업무 일체

제3조 (근로시간 및 휴게시간)
• 근로시간: 주 3 일 근무, 1 일 6 시간 (총 주 18 시간)
• 근무요일 및 시간: 화·목·토 14:00 ~ 21:00
• 휴게시간: 근로시간 중 30 분 (무급)
• 업무량에 따라 사전 통보 없이 근무시간이 조정될 수 있으며, 이 경우 추가 수당은 별도로 정산한다.

제4조 (임금)
• 시급: 금 10,030 원 (2026 년 법정 최저시급 적용)
• 수습기간(2 개월) 중 시급: 금 9,027 원 (최저시급의 90%)
• 주휴수당: 소정근로일을 개근한 경우 관련 법령에 따라 지급한다.
• 지급일: 매월 말일 (해당일이 휴일인 경우 전일 지급)
• 지급방법: '을' 명의의 예금계좌로 이체한다.

제5조 (휴일 및 휴가)
• 주휴일: 주 소정근로일을 모두 근무한 경우 1 일의 유급 주휴일을 부여한다.
• 연차휴가: 근로기준법이 정하는 바에 따른다.
• 공휴일: 별도 협의 없이 공휴일에 근무할 수 있으며, 공휴일 근무 시 통상임금의 1.5 배를 지급한다.

[특약 사항]

제6조 (복무 규정)
'을'은 근무 중 사용자의 지시에 따르며, 무단결근·지각·조퇴 시 사전에 반드시 연락하여야 한다.
무단결근 1회 발생 시 해당 주 주휴수당을 지급하지 않으며, 3회 이상 시 계약 해지 사유가 된다.

제7조 (손해배상)
'을'의 고의 또는 중대한 과실로 사업장에 재산상 손해를 끼친 경우, '갑'은 실손해 범위 내에서 배상을 청구할 수 있다.
단, 정상적인 업무 수행 중 발생한 경미한 파손(컵·그릇 등)에 대해서는 배상 의무를 지지 않는다.

제8조 (연장근로)
업무상 필요에 따라 '갑'은 '을'에게 소정근로시간 외 추가 근무를 요청할 수 있다.
추가 근무에 대한 수당은 해당 월 급여 정산 시 합산 지급하며, 정산 방식은 '갑'이 결정한다.

제9조 (주휴수당 지급 기준)
주휴수당은 해당 주 소정근로일을 '성실히' 근무한 경우에 한하여 지급하며, 지각·조퇴가 누적되는 경우 '갑'의 판단에 따라 지급 여부를 결할 수 있다.
주휴수당 산정 기준 시간은 실 근로시간이 아닌 사업주가 인정한 근로시간으로 한다.

본 계약 내용을 충분히 확인하고 자유로운 의사에 따라 아래에 서명한다.

계약일: 2026년  월  일

사용자(갑): ○○카페 강남점 대표 홍길동 (인)
주소: 서울특별시 강남구 역삼로 88, 1층

근로자(을): (서명)
생년월일:
주소:`

// ─── 수정된 조항 반영 미리보기 컴포넌트 ─────────────────────────
const ContractPreview = ({
  contractText,
  original,
  suggested,
}: {
  contractText: string
  original: string
  suggested: string
}) => {
  if (!original || !suggested || !contractText.includes(original)) {
    return <>{contractText}</>
  }
  const idx = contractText.indexOf(original)
  const before = contractText.slice(0, idx)
  const after = contractText.slice(idx + original.length)
  return (
    <>
      {before}
      <mark className="preview-replaced">{suggested}</mark>
      {after}
    </>
  )
}

// ─── 페이지 ──────────────────────────────────────────────────────
export default function GuidePage() {
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [selected, setSelected] = useState('문제 조항 선택')
  const [expandDoc, setExpandDoc] = useState(false)
  const [currentContract, setCurrentContract] = useState(() => {
    return sessionStorage.getItem('contract_body') || CONTRACT_BODY
  })
  const [appliedClauses, setAppliedClauses] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('applied_clauses')
    return saved ? JSON.parse(saved) : []
  })

  // 상태 변경 시 sessionStorage에 자동 저장
  useEffect(() => {
    sessionStorage.setItem('contract_body', currentContract)
  }, [currentContract])

  useEffect(() => {
    sessionStorage.setItem('applied_clauses', JSON.stringify(appliedClauses))
  }, [appliedClauses])

  const clauseInfo = CLAUSE_DATA[selected]
  const isAlreadyApplied = appliedClauses.includes(selected)

  const handleApply = () => {
    if (!clauseInfo || isAlreadyApplied) return

    // 반영하기: 현재 계약서에서 원본 조항을 찾아 수정 가이드 내용으로 교체
    const updated = currentContract.replace(clauseInfo.original, clauseInfo.suggested)
    setCurrentContract(updated)
    setAppliedClauses([...appliedClauses, selected])
    setSelected('문제 조항 선택') // 초기화
    alert('수정 가이드가 성공적으로 반영되었습니다.')
  }

  return (
    <div id="guide-page">
      <header className="app-header">
        <button className="header-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ArrowLeftIcon />
        </button>
        <span className="header-title">수정 가이드 제안</span>
        <div style={{ width: 24 }} />
      </header>

      <main className="guide-content">
        {/* 문제 조항 선택 */}
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
                {DROP_OPTIONS.map(opt => {
                  const applied = appliedClauses.includes(opt)
                  return (
                    <li
                      key={opt}
                      className={`dropdown-item ${selected === opt ? 'selected' : ''} ${applied ? 'applied' : ''}`}
                      onClick={() => {
                        setSelected(opt)
                        setDropOpen(false)
                      }}
                    >
                      {opt} {applied && '(반영됨)'}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>

        {/* 원본 조항 + 수정 가이드 */}
        <div className="clause-container">
          <section className="guide-section">
            <h2 className="section-title">원본 조항</h2>
            <div className="guide-card original">
              <p className="guide-card__label">기존 조항 내용</p>
              {clauseInfo ? (
                <p className="guide-card__body">{isAlreadyApplied ? clauseInfo.suggested : clauseInfo.original}</p>
              ) : (
                <p className="guide-card__body guide-card__empty">조항을 선택하면 원본 내용이 표시됩니다.</p>
              )}
            </div>
          </section>

          <section className="guide-section">
            <h2 className="section-title">수정 가이드</h2>
            <div className="guide-card suggested">
              <p className="guide-card__label">권장 수정 방향</p>
              {clauseInfo ? (
                <>
                  <p className="guide-card__body">{isAlreadyApplied ? '이미 반영된 조항입니다.' : clauseInfo.suggested}</p>
                  <p className="guide-card__basis">{clauseInfo.basis}</p>
                </>
              ) : (
                <p className="guide-card__body guide-card__empty">조항을 선택하면 수정 가이드가 표시됩니다.</p>
              )}
            </div>
          </section>
        </div>

        {/* 수정 결과 미리보기 */}
        <section className="guide-section">
          <h2 className="section-title">수정 결과 미리보기</h2>
          {clauseInfo && !isAlreadyApplied && (
            <div className="preview-badge">
              <span className="preview-badge__dot" />
              <span>{selected} 수정 내용이 반영되었습니다</span>
            </div>
          )}
          <div className="doc-wrapper">
            <div className="doc-toolbar">
              <div className="doc-toolbar__left">
                <DocumentIcon />
                <span className="doc-filename">근로계약서.pdf</span>
              </div>
              <div className="doc-toolbar__divider" />
              <button
                className="doc-toolbar__expand"
                onClick={() => setExpandDoc(v => !v)}
                aria-label="문서 확대"
              >
                <ExpandIcon expanded={expandDoc} />
              </button>
            </div>
            <div className={`doc-preview ${expandDoc ? 'expanded' : ''}`}>
              <div className="doc-paper">
                <pre className="doc-paper__body">
                  <ContractPreview
                    contractText={currentContract}
                    original={isAlreadyApplied ? '' : (clauseInfo?.original ?? '')}
                    suggested={isAlreadyApplied ? '' : (clauseInfo?.suggested ?? '')}
                  />
                </pre>
              </div>
            </div>
          </div>
        </section>

        <div className="guide-cta">
          <button
            id="apply-guide-btn"
            className={`cta-btn ${(!clauseInfo || isAlreadyApplied) ? 'disabled' : ''}`}
            onClick={handleApply}
            disabled={!clauseInfo || isAlreadyApplied}
          >
            {isAlreadyApplied ? '반영 완료' : '수정 제안 보내기'}
          </button>
        </div>
      </main>
    </div>
  )
}
