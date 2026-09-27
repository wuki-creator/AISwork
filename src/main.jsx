import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Beaker,
  Bell,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Database,
  Download,
  FileCheck2,
  FlaskConical,
  GitBranch,
  Layers3,
  LayoutDashboard,
  LineChart,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  TestTube2,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import './styles.css'

const navItems = [
  { label: '概览', icon: LayoutDashboard },
  { label: '数据资源', icon: Database, badge: '12' },
  { label: '数据治理', icon: FileCheck2, badge: '3' },
  { label: '模型训练', icon: BrainCircuit },
  { label: '预测工作台', icon: FlaskConical, accent: true },
  { label: '版本追溯', icon: GitBranch },
]

const datasets = [
  { name: 'GSE331114 · 人类 AIS 单细胞', type: 'scRNA-seq', source: 'GEO', cells: '2.8M', coverage: '98.2%', state: '已标准化', color: 'teal', updated: '2 小时前' },
  { name: 'Tahoe-100M · 药物扰动集', type: 'Perturb-seq', source: 'TahoeBio', cells: '41.6M', coverage: '96.8%', state: '训练中', color: 'amber', updated: '18 分钟前' },
  { name: 'GSE225948 · 小鼠 MCAO', type: 'snRNA-seq', source: 'GEO', cells: '1.4M', coverage: '94.1%', state: '待复核', color: 'coral', updated: '昨天' },
  { name: 'scPerturb RNA · sciplex2/3/4', type: '药物扰动', source: 'Zenodo', cells: '8.9M', coverage: '99.4%', state: '已标准化', color: 'teal', updated: '3 天前' },
]

const activities = [
  { time: '09:42', title: 'AIS 适配集完成增量校验', detail: 'GSE331114 · 42,816 个细胞通过元数据检查', tone: 'teal', icon: Check },
  { time: '09:18', title: 'Chen-PerturbVAE 进入域适配', detail: 'epoch 18 / 24 · val loss 0.184', tone: 'blue', icon: BrainCircuit },
  { time: '08:55', title: '3 个样本需要人工复核', detail: '缺失组织与采样时间字段', tone: 'coral', icon: AlertTriangle },
]

const pipeline = [
  { index: '01', title: '通用预训练', detail: 'Tahoe · scPerturb · sci-Plex', state: '完成', progress: 100, tone: 'done' },
  { index: '02', title: '神经系统域适配', detail: '胶质细胞 · 脑组织', state: '完成', progress: 100, tone: 'done' },
  { index: '03', title: 'AIS 疾病适配', detail: 'GSE331114 · GSE225948', state: '进行中', progress: 72, tone: 'active' },
  { index: '04', title: '扰动微调与验证', detail: 'QO-83 · PF-429242', state: '排队中', progress: 8, tone: 'queued' },
]

function App() {
  const [activeNav, setActiveNav] = useState('概览')
  const [mobileNav, setMobileNav] = useState(false)
  const [activeTab, setActiveTab] = useState('运行状态')
  const [showPrediction, setShowPrediction] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState(null)
  const [notice, setNotice] = useState('')

  const focusText = useMemo(() => {
    if (activeNav === '预测工作台') return '预测工作台'
    if (activeNav === '数据资源') return '数据资源总览'
    if (activeNav === '数据治理') return '治理任务队列'
    if (activeNav === '模型训练') return '模型训练轨迹'
    if (activeNav === '版本追溯') return '版本与证据链'
    return '研究工作台'
  }, [activeNav])

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Activity size={19} strokeWidth={2.4} /></div>
          <div>
            <div className="brand-name">AIS / LAB</div>
            <div className="brand-subtitle">研究工作台</div>
          </div>
          <button className="icon-button sidebar-close" aria-label="关闭导航" onClick={() => setMobileNav(false)}><PanelLeftClose size={18} /></button>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">A</div>
          <div className="workspace-copy"><span>卒中多组学项目</span><small>研究环境 · v1.8.0</small></div>
          <ChevronDown size={16} className="muted-icon" />
        </div>

        <div className="nav-section-label">工作区</div>
        <nav className="main-nav" aria-label="主导航">
          {navItems.map(({ label, icon: Icon, badge, accent }) => (
            <button key={label} className={`nav-item ${activeNav === label ? 'nav-item-active' : ''} ${accent ? 'nav-item-accent' : ''}`} onClick={() => { setActiveNav(label); setMobileNav(false) }}>
              <Icon size={17} strokeWidth={1.9} />
              <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
              {activeNav === label && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="compute-card">
          <div className="compute-topline"><span className="status-dot pulse" /> <span>GPU 计算节点</span><span className="compute-value">72%</span></div>
          <div className="compute-bar"><span style={{ width: '72%' }} /></div>
          <div className="compute-meta"><span>4 × A100 80GB</span><span>运行中</span></div>
        </div>
        <div className="sidebar-footer">
          <button className="nav-item"><Settings2 size={17} /><span>工作区设置</span></button>
          <button className="nav-item"><CircleHelp size={17} /><span>帮助与文档</span></button>
          <div className="profile-row"><div className="profile-avatar">W</div><div><strong>Wuzizhuo</strong><small>数据科学家</small></div><MoreHorizontal size={17} className="muted-icon" /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" aria-label="打开导航" onClick={() => setMobileNav(true)}><Menu size={19} /></button><div className="breadcrumbs"><span>AIS 专病项目</span><ChevronRight size={14} /><strong>{focusText}</strong></div></div>
          <div className="topbar-actions"><div className="sync-status"><span className="status-dot" /> 数据同步正常</div><button className="icon-button" aria-label="搜索" onClick={() => showNotice('搜索面板将在下一版本开放')}><Search size={18} /></button><button className="icon-button has-notice" aria-label="通知" onClick={() => showNotice('当前有 3 条治理任务待处理')}><Bell size={18} /><span className="notice-dot" /></button><div className="topbar-avatar">W</div></div>
        </header>

        <div className="content-wrap">
          <section className="page-intro">
            <div><div className="eyebrow"><span className="eyebrow-line" /> 2026.09.27 · 周日</div><h1>把 AIS 数据，<em>变成可验证的推断。</em></h1><p>从公共数据治理到跨细胞扰动预测，追踪每一个样本、参数与模型版本。</p></div>
            <div className="intro-actions"><button className="button button-quiet" onClick={() => showNotice('导出当前工作台摘要')}><Download size={16} /> 导出摘要</button><button className="button button-primary" onClick={() => setShowPrediction(true)}><Plus size={17} /> 新建预测</button></div>
          </section>

          <section className="metric-grid" aria-label="项目关键指标">
            <MetricCard label="已接入数据集" value="12" suffix="个" detail="本月 +2" tone="teal" icon={Database} trend="up" />
            <MetricCard label="统一细胞数量" value="48.6" suffix="M" detail="覆盖 6 类组织" tone="blue" icon={Layers3} trend="up" />
            <MetricCard label="可训练扰动" value="1,284" suffix="条" detail="药物 71% · 遗传 29%" tone="amber" icon={Zap} trend="up" />
            <MetricCard label="元数据完整率" value="94.7" suffix="%" detail="目标 ≥ 95%" tone="coral" icon={ShieldCheck} trend="down" />
          </section>

          <section className="hero-grid">
            <div className="model-hero panel">
              <div className="panel-topline"><div className="panel-kicker"><BrainCircuit size={16} /> 当前主模型</div><span className="model-status"><span className="status-dot pulse" /> 正在训练</span></div>
              <div className="model-head"><div><h2>Chen-PerturbVAE</h2><p>跨细胞扰动模型 · AIS 专病适配</p></div><button className="icon-button light" aria-label="模型更多操作" onClick={() => showNotice('模型操作菜单已准备')}><MoreHorizontal size={18} /></button></div>
              <div className="model-stat-row"><div className="model-stat"><span>当前阶段</span><strong>03 / 04</strong><small>疾病状态适配</small></div><div className="model-stat"><span>验证集 Pearson</span><strong>0.847</strong><small className="positive">↑ 0.061 vs baseline</small></div><div className="model-stat"><span>最新 checkpoint</span><strong>epoch 18</strong><small>18 分钟前保存</small></div></div>
              <div className="model-progress"><div className="progress-label"><span>本轮训练进度</span><strong>72%</strong></div><div className="progress-track"><span style={{ width: '72%' }} /></div><div className="progress-foot"><span>预计还需 46 分钟</span><button className="text-button" onClick={() => setActiveNav('模型训练')}>查看训练轨迹 <ArrowUpRight size={14} /></button></div></div>
              <div className="model-footer"><div className="chip-row"><span className="chip">AIS v1.2</span><span className="chip">seed 20260918</span><span className="chip">A100 × 4</span></div><button className="button button-outline" onClick={() => showNotice('已打开模型详情')}>查看详情 <ChevronRight size={15} /></button></div>
            </div>

            <div className="activity-panel panel"><div className="panel-heading"><div><span className="section-eyebrow">LIVE FEED</span><h3>最近动态</h3></div><button className="text-button" onClick={() => setActiveNav('版本追溯')}>全部记录 <ArrowUpRight size={14} /></button></div><div className="activity-list">{activities.map(({ time, title, detail, tone, icon: Icon }) => <div className="activity-item" key={time}><div className={`activity-icon ${tone}`}><Icon size={15} /></div><div className="activity-copy"><div className="activity-title">{title}</div><div className="activity-detail">{detail}</div></div><time>{time}</time></div>)}</div><div className="activity-footer"><span className="status-dot" /> 自动刷新 · 30 秒</div></div>
          </section>

          <section className="lower-grid">
            <div className="data-panel panel"><div className="panel-heading data-heading"><div><span className="section-eyebrow">DATA FOUNDATION</span><h3>数据资产</h3></div><div className="heading-actions"><button className="icon-button subtle" aria-label="筛选数据" onClick={() => showNotice('筛选条件已打开')}><SlidersHorizontal size={16} /></button><button className="button button-small" onClick={() => { setActiveNav('数据资源'); showNotice('数据资源页面已切换') }}><Plus size={15} /> 接入数据</button></div></div><div className="dataset-table-wrap"><table><thead><tr><th>数据集</th><th>类型</th><th>细胞数</th><th>完整率</th><th>状态</th><th>更新</th><th /></tr></thead><tbody>{datasets.map((dataset) => <tr key={dataset.name} onClick={() => setSelectedDataset(dataset)} className="clickable-row"><td><div className="dataset-name"><span className={`dataset-mark ${dataset.color}`} />{dataset.name}</div><small>{dataset.source}</small></td><td><span className="type-text">{dataset.type}</span></td><td className="mono-cell">{dataset.cells}</td><td><div className="coverage"><span>{dataset.coverage}</span><div className="mini-track"><span style={{ width: dataset.coverage }} /></div></div></td><td><span className={`state-pill ${dataset.color}`}>{dataset.state}</span></td><td className="muted-cell">{dataset.updated}</td><td><ChevronRight size={16} className="row-chevron" /></td></tr>)}</tbody></table></div><button className="table-footer" onClick={() => setActiveNav('数据资源')}>查看全部 12 个数据集 <ArrowUpRight size={14} /></button></div>

            <div className="pipeline-panel panel"><div className="panel-heading"><div><span className="section-eyebrow">MODEL PIPELINE</span><h3>训练路线</h3></div><button className="icon-button subtle" aria-label="训练路线更多操作" onClick={() => showNotice('训练路线操作已打开')}><MoreHorizontal size={17} /></button></div><div className="pipeline-list">{pipeline.map(({ index, title, detail, state, progress, tone }) => <div className={`pipeline-step ${tone}`} key={index}><div className="step-index">{tone === 'done' ? <Check size={15} /> : index}</div><div className="step-copy"><div className="step-title"><strong>{title}</strong><span>{state}</span></div><small>{detail}</small><div className="step-progress"><span style={{ width: `${progress}%` }} /></div></div></div>)}</div><div className="pipeline-callout"><Sparkles size={16} /><span><strong>下一里程碑</strong> · AIS 外部验证集接入后自动开始</span><ChevronRight size={15} /></div></div>
          </section>

          <section className="insight-panel panel"><div className="insight-copy"><span className="section-eyebrow">RESEARCH NOTE</span><h3>让结果带着证据一起交付</h3><p>每次预测都绑定数据来源、样本版本、训练参数和适用域。模型给出的是可追溯的候选机制，不替代实验验证或临床结论。</p><div className="insight-actions"><button className="button button-outline" onClick={() => setActiveTab('评价指标')}>查看评价指标 <ArrowUpRight size={14} /></button><button className="text-button" onClick={() => showNotice('已复制数据字典链接')}>复制数据字典链接 <Tag size={14} /></button></div></div><div className="insight-diagram"><div className="diagram-node node-source"><Database size={17} /><span>数据来源</span></div><div className="diagram-line line-one" /><div className="diagram-node node-model"><BrainCircuit size={18} /><span>Chen-PerturbVAE</span></div><div className="diagram-line line-two" /><div className="diagram-node node-output"><LineChart size={17} /><span>预测结果</span></div></div></section>

          <section className="tabs-section"><div className="tabs-bar"><div className="tabs">{['运行状态', '评价指标', '审计日志'].map((tab) => <button key={tab} className={`tab ${activeTab === tab ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><div className="tabs-meta"><span className="status-dot" /> 最后同步 10:42:08</div></div><div className="tab-content"><div className="tab-summary"><span className="summary-icon"><Activity size={17} /></span><div><strong>{activeTab === '运行状态' ? '系统运行在预期范围内' : activeTab === '评价指标' ? '当前模型在 5 个独立测试场景中通过 4 项' : '审计链完整，最近 7 天无异常变更'}</strong><span>{activeTab === '运行状态' ? 'GPU 节点、数据同步与模型服务均正常' : activeTab === '评价指标' ? '跨细胞与跨组合测试仍在补充验证' : '所有参数快照均可回溯到对应数据版本'}</span></div></div><button className="text-button" onClick={() => showNotice(`${activeTab}详情已打开`)}>打开详情 <ChevronRight size={15} /></button></div></section>

          <footer className="page-footer"><span>AIS / LAB · Chen-PerturbVAE Research Workbench</span><span>数据仅用于研究 · 版本 v1.8.0</span></footer>
        </div>
      </main>

      {selectedDataset && <div className="overlay" onClick={() => setSelectedDataset(null)}><aside className="detail-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><span className="section-eyebrow">DATASET DETAIL</span><h2>{selectedDataset.name}</h2></div><button className="icon-button" aria-label="关闭数据详情" onClick={() => setSelectedDataset(null)}><X size={18} /></button></div><div className="drawer-state"><span className={`state-pill ${selectedDataset.color}`}>{selectedDataset.state}</span><span>最后更新 {selectedDataset.updated}</span></div><div className="drawer-metrics"><div><span>细胞数</span><strong>{selectedDataset.cells}</strong></div><div><span>元数据完整率</span><strong>{selectedDataset.coverage}</strong></div><div><span>数据类型</span><strong>{selectedDataset.type}</strong></div></div><div className="drawer-section"><h3>标准化字段</h3><div className="field-list"><div><span>study_id</span><Check size={15} /></div><div><span>sample_context</span><Check size={15} /></div><div><span>cell_annotation</span><Check size={15} /></div><div><span>perturbation_context</span><Check size={15} /></div><div className="field-warning"><span>collection_time</span><AlertTriangle size={15} /></div></div></div><div className="drawer-section"><h3>来源与追溯</h3><p className="drawer-note">该数据集将在进入训练集前，经过研究、供体、样本、细胞和质控五层校验。</p><button className="button button-outline full-width" onClick={() => showNotice('数据字典已打开')}><FileCheck2 size={16} /> 查看数据字典</button></div></aside></div>}

      {showPrediction && <div className="overlay" onClick={() => setShowPrediction(false)}><aside className="prediction-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><span className="section-eyebrow">NEW PREDICTION</span><h2>创建扰动预测</h2></div><button className="icon-button" aria-label="关闭预测" onClick={() => setShowPrediction(false)}><X size={18} /></button></div><p className="drawer-intro">选择一个已治理的基础状态与扰动条件，生成带可信度和适用域提示的候选响应。</p><div className="form-stack"><label>基础细胞状态<select defaultValue="GSE331114 · 小胶质细胞"><option>GSE331114 · 小胶质细胞</option><option>GSE225948 · 星形胶质细胞</option><option>自定义表达矩阵</option></select></label><label>扰动类型<div className="segmented"><button className="segment active">化合物</button><button className="segment">遗传靶点</button></div></label><label>化合物 / 靶点<select defaultValue="PF-429242 · ChEMBL 4861"><option>PF-429242 · ChEMBL 4861</option><option>QO-83 · PubChem 138564</option><option>自定义靶点集合</option></select></label><div className="form-grid"><label>剂量<input defaultValue="2.5" /><small>μM</small></label><label>处理时长<input defaultValue="24" /><small>小时</small></label></div><label>输出范围<div className="check-list"><label className="check-row"><input type="checkbox" defaultChecked /><span>差异基因与方向</span><Check size={14} /></label><label className="check-row"><input type="checkbox" defaultChecked /><span>AIS 细胞状态评分</span><Check size={14} /></label><label className="check-row"><input type="checkbox" defaultChecked /><span>通路变化与证据</span><Check size={14} /></label></div></label></div><div className="drawer-footer"><div><span className="status-dot" /> 预计 2–4 分钟</div><button className="button button-primary" onClick={() => { setShowPrediction(false); showNotice('预测任务已创建，正在排队') }}><Play size={16} /> 开始预测</button></div></aside></div>}

      {notice && <div className="toast"><Check size={15} /> {notice}</div>}
    </div>
  )
}

function MetricCard({ label, value, suffix, detail, tone, icon: Icon, trend }) {
  return <div className={`metric-card ${tone}`}><div className="metric-top"><div className="metric-icon"><Icon size={17} /></div><span className="metric-trend">{trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}</span></div><div className="metric-label">{label}</div><div className="metric-value">{value}<small>{suffix}</small></div><div className="metric-detail">{detail}</div></div>
}

createRoot(document.getElementById('root')).render(<App />)
