import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import './GuidePage.css'

// ─── 아이콘 컴포넌트 (SVG 인라인) ───────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* Figma: Stroke 1 (가로) + Stroke 3 (꺾임) */}
    <polyline points="15,6 9,12 15,18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="6" stroke="#000000" strokeWidth="1.5" />
    <path d="M14 14L18 18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CompanyPlaceholder = () => (
  <div style={{
    width: 36, height: 36, borderRadius: '50%',
    backgroundColor: '#efeff0',
    border: '0.72px solid #aeb0b6',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#aaaaaa" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="#aaaaaa" strokeWidth="1.5" />
      <path d="M3 16L8 11L11 14L15 10L21 16" stroke="#aaaaaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

// ─── 탭 데이터 ───────────────────────────────────────────────────
const tabs = [
  { id: 'all',  label: '전체',   count: 1 },
  { id: 'wait', label: '승인대기', count: 4 },
  { id: 'give', label: '면접포기', count: 4 },
  { id: 'pass', label: '합격',   count: 1 },
  { id: 'fail', label: '불합격', count: 1 },
]

// ─── 지원내역 카드 데이터 ─────────────────────────────────────────
const applications = [
  {
    id: 1,
    date: '2026.03.24',
    method: '온라인지원',
    tagLabel: '열람 03.25',
    tagVariant: 'read' as const,   // 'read' | 'cancel'
    deadline: '마감 03.24',
    company: '멋쟁이사자처럼 흑석동관',
    jobTitle: '멋쟁이사자처럼 흑석동관 / 기획 멘토',
    riskScore: '안심점수 92점',
    buttonLabel: '수정가이드 제안',
    buttonDisabled: false,
    jobTags: null as string[] | null,
    cardVariant: 'normal' as const,
  },
  {
    id: 2,
    date: '2026.03.24',
    method: '온라인지원',
    tagLabel: '지원취소',
    tagVariant: 'cancel' as const,
    deadline: '마감 03.24',
    company: '멋쟁이사자처럼 흑석동관',
    jobTitle: '멋쟁이사자처럼 흑석동관 / 기획 멘토',
    riskScore: '안심점수 92점',
    buttonLabel: '수정가이드 제안',
    buttonDisabled: true,
    jobTags: ['사무보조', '고객상담'] as string[],
    cardVariant: 'canceled' as const,
  },
]

// ─── 지원내역 카드 컴포넌트 ───────────────────────────────────────
interface Application {
  id: number
  date: string
  method: string
  tagLabel: string
  tagVariant: 'read' | 'cancel'
  deadline: string
  company: string
  jobTitle: string
  riskScore: string
  buttonLabel: string
  buttonDisabled: boolean
  jobTags: string[] | null
  cardVariant: 'normal' | 'canceled'
}

const ApplicationCard = ({ app, onGuide }: { app: Application; onGuide: () => void }) => (
  <div className={`app-card${app.cardVariant === 'canceled' ? ' app-card--canceled' : ''}`}>

    {/* 날짜 / 지원방법 */}
    <div className="app-card__meta">
      <span className="meta-date">{app.date}</span>
      <div className="meta-divider" />
      <span className="meta-method">{app.method}</span>
    </div>

    {/* 태그 + 마감 */}
    <div className="app-card__tags">
      <span className={`tag tag--${app.tagVariant}`}>
        {app.tagLabel}
      </span>
      <span className="deadline">{app.deadline}</span>
    </div>

    {/* 회사 정보 + 직무명 */}
    <div className="app-card__company-row">
      <div className="app-card__company">
        <CompanyPlaceholder />
        <span className="company-name">{app.company}</span>
      </div>
      <div className="app-card__jobtitle">{app.jobTitle}</div>

      {/* 직종 태그 (지원취소 카드에만) */}
      {app.jobTags && (
        <div className="app-card__jobtags">
          {app.jobTags.map((t: string) => (
            <span key={t} className="tag tag--job">{t}</span>
          ))}
        </div>
      )}
    </div>

    {/* 하단: 안심점수 + 버튼 */}
    <div className="app-card__bottom">
      <span className="risk-score">{app.riskScore}</span>
      <button
        className={`guide-btn${app.buttonDisabled ? ' guide-btn--disabled' : ''}`}
        disabled={app.buttonDisabled}
        onClick={app.buttonDisabled ? undefined : onGuide}
      >
        {app.buttonLabel}
      </button>
    </div>
  </div>
)

// ─── AI 로딩 오버레이 (GuidePage.css 공용) ─────────────────────
const AILoadingOverlay = ({ visible, showSub = false }: { visible: boolean; showSub?: boolean }) => {
  if (!visible) return null
  return (
    <div className="ai-loading-overlay">
      <div className="ai-loading-box">
        <div className="ai-loading-gauge">
          <div className="ai-loading-gauge__bar" />
        </div>
        <div className="ai-loading-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="#1c5cff" strokeWidth="2" strokeDasharray="80 20" className="ai-loading-circle" />
            <path d="M12 18L16 22L24 14" stroke="#1c5cff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          </svg>
        </div>
        <p className="ai-loading-text">AI 엔진 구동중입니다</p>
        {showSub && <p className="ai-loading-sub">계약서를 분석하고 있습니다...</p>}
      </div>
    </div>
  )
}

// ─── 메인 앱 ─────────────────────────────────────────────────────
function App() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingWithSub, setLoadingWithSub] = useState(false)

  const withLoading = useCallback((action: () => void, showSub = false) => {
    setLoading(true)
    setLoadingWithSub(showSub)
    setTimeout(() => { setLoading(false); setLoadingWithSub(false); action() }, 1000)
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <AILoadingOverlay visible={loading} showSub={loadingWithSub} />

      {/* 헤더 */}
      <header className="app-header">
        <button className="header-back" aria-label="뒤로가기">
          <ArrowLeftIcon />
        </button>
        <span className="header-title">지원현황</span>
        <div style={{ width: 24 }} />
      </header>

      {/* 검색창 */}
      <div className="search-bar-wrapper">
        <div className="search-bar">
          <input
            id="search-input"
            className="search-input"
            placeholder="기업명, 채용제목, 연락처로 검색하세요."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <button className="search-btn" aria-label="검색">
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <nav className="tab-menu">
        {tabs.map((tab, i) => {
          const isAllTab = tab.id === 'all'
          return (
            <button
              key={tab.id}
              className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => isAllTab && setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              {i > 0 && <div className="tab-divider" />}
              <span className="tab-count">{tab.count}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* 지원내역 리스트 */}
      <main className="app-content">
        {applications.map(app => (
          <ApplicationCard
            key={app.id}
            app={app}
            onGuide={() => withLoading(() => navigate('/guide'), true)}
          />
        ))}
      </main>
    </div>
  )
}

export default App
