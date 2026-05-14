import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

// ─── 아이콘 컴포넌트 (SVG 인라인) ───────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  { id: 'all', label: '전체', count: 1 },
  { id: 'wait', label: '승인대기', count: 4 },
  { id: 'give', label: '면접포기', count: 4 },
  { id: 'pass', label: '합격', count: 1 },
  { id: 'fail', label: '불합격', count: 1 },
]

// ─── 지원내역 카드 데이터 ─────────────────────────────────────────
const applications = [
  {
    id: 1,
    date: '2026.03.24',
    method: '온라인지원',
    status: 'read',         // 'read' | 'unread'
    tag: '열람 03.25',
    tagColor: '#000000',
    tagBg: '#ffffff',
    deadline: '마감 03.24',
    company: '멋쟁이사자처럼 흑석동관',
    jobTitle: '멋쟁이사자처럼 흑석동관 / 기획 멘토',
    riskScore: '안심점수 92점',
    buttonLabel: '수정가이드 제안',
    buttonDisabled: false,
    jobTags: null,
    cardBg: '#ffffff',
  },
  {
    id: 2,
    date: '2026.03.24',
    method: '온라인지원',
    status: 'unread',
    tag: '지원취소',
    tagColor: '#ababab',
    tagBg: '#f0f0f0',
    deadline: '마감 03.24',
    company: '멋쟁이사자처럼 흑석동관',
    jobTitle: '멋쟁이사자처럼 흑석동관 / 기획 멘토',
    riskScore: '안심점수 92점',
    buttonLabel: '수정가이드 제안',
    buttonDisabled: true,
    jobTags: ['사무보조', '고객상담'],
    cardBg: '#f0f0f0',
  },
]

// ─── 지원내역 카드 컴포넌트 ───────────────────────────────────────
interface Application {
  id: number
  date: string
  method: string
  status: string
  tag: string
  tagColor: string
  tagBg: string
  deadline: string
  company: string
  jobTitle: string
  riskScore: string
  buttonLabel: string
  buttonDisabled: boolean
  jobTags: string[] | null
  cardBg: string
}

const ApplicationCard = ({ app, onGuide }: { app: Application; onGuide: () => void }) => (
  <div className="app-card" style={{ backgroundColor: app.cardBg }}>
    {/* 날짜 / 지원방법 */}
    <div className="app-card__meta">
      <span className="meta-date">{app.date}</span>
      <div className="meta-divider" />
      <span className="meta-method">{app.method}</span>
    </div>

    {/* 태그 + 마감 */}
    <div className="app-card__tags">
      <span className="tag" style={{ color: app.tagColor, backgroundColor: app.tagBg, borderColor: app.tagBg === '#ffffff' ? '#e0e0e0' : app.tagBg }}>
        {app.tag}
      </span>
      <span className="deadline">{app.deadline}</span>
    </div>

    {/* 회사 정보 */}
    <div className="app-card__company">
      <div className="company-left">
        <CompanyPlaceholder />
        <span className="company-name">{app.company}</span>
      </div>
    </div>
    <div className="app-card__jobtitle">{app.jobTitle}</div>

    {/* 직종 태그 (열람전에만) */}
    {app.jobTags && (
      <div className="app-card__jobtags">
        {app.jobTags.map((t: string) => (
          <span key={t} className="tag" style={{ color: '#ababab', backgroundColor: '#f0f0f0', borderColor: '#f0f0f0' }}>{t}</span>
        ))}
      </div>
    )}

    {/* 하단: 위험도 + 버튼 */}
    <div className="app-card__bottom">
      <span className="risk-score">{app.riskScore}</span>
      <button
        className="guide-btn"
        disabled={app.buttonDisabled}
        onClick={app.buttonDisabled ? undefined : onGuide}
        style={{
          backgroundColor: app.buttonDisabled ? '#f0f0f0' : '#ffffff',
          color: '#72767b',
          borderColor: '#e0e0e0',
        }}
      >
        {app.buttonLabel}
      </button>
    </div>
  </div>
)

// ─── 메인 앱 ─────────────────────────────────────────────────────
function App() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
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
          const isAllTab = tab.id === 'all';
          return (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => isAllTab && setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              {i > 0 && <div className="tab-divider" />}
              <span className="tab-count">{tab.count}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 지원내역 리스트 */}
      <main className="app-content">
        {applications.map(app => (
          <ApplicationCard
            key={app.id}
            app={app}
            onGuide={() => navigate('/guide')}
          />
        ))}
      </main>
    </>
  )
}

export default App
