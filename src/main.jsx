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

const degResults = [
  { gene: 'SLC1A3', symbol: '星形胶质细胞反应', logfc: '+1.84', fdr: '2.1e-08', direction: 'up', evidence: 'GSE331114' },
  { gene: 'AIF1', symbol: '小胶质细胞激活', logfc: '+1.42', fdr: '7.8e-07', direction: 'up', evidence: 'Tahoe-100M' },
  { gene: 'CLDN5', symbol: '血脑屏障完整性', logfc: '-1.18', fdr: '3.4e-05', direction: 'down', evidence: 'GSE225948' },
  { gene: 'MBP', symbol: '髓鞘修复', logfc: '+0.96', fdr: '1.2e-04', direction: 'up', evidence: 'scPerturb' },
]

const pathwayResults = [
  { name: '炎症反应 / NF-κB', score: '+0.72', support: '高', count: '38 genes' },
  { name: '血脑屏障 / tight junction', score: '-0.44', support: '中', count: '21 genes' },
  { name: '神经保护 / PI3K-AKT', score: '+0.31', support: '中', count: '27 genes' },
]

const stateScores = [
  { label: '炎症负荷', value: 72, tone: 'coral', delta: '+8.4%' },
  { label: '血脑屏障损伤', value: 44, tone: 'amber', delta: '-5.1%' },
  { label: '修复潜力', value: 68, tone: 'teal', delta: '+12.7%' },
  { label: '细胞存活度', value: 86, tone: 'blue', delta: '+3.2%' },
]

const initialPrimitiveTasks = [
  { id: 'PT-20260929-004', name: 'AIS 疾病域适配', context: 'Chen-PerturbVAE · epoch 18 / 24', status: 'running', progress: 72, updated: '09:18' },
  { id: 'PT-20260929-003', name: '扰动响应推断', context: 'PF-429242 · 小胶质细胞', status: 'queued', progress: 0, updated: '09:04' },
  { id: 'PT-20260929-002', name: '样本元数据复核', context: 'GSE225948 · 3 个待复核样本', status: 'needsReview', progress: 64, updated: '08:55' },
  { id: 'PT-20260929-001', name: 'AIS 适配集增量校验', context: 'GSE331114 · 42,816 个细胞', status: 'completed', progress: 100, updated: '09:42' },
]

const primitiveStatus = {
  running: { label: '运行中', tone: 'running' },
  queued: { label: '排队中', tone: 'queued' },
  needsReview: { label: '待复核', tone: 'review' },
  completed: { label: '已完成', tone: 'completed' },
}

const taskFilters = [
  { key: 'all', label: '全部' },
  { key: 'running', label: '运行中' },
  { key: 'queued', label: '排队中' },
  { key: 'needsReview', label: '待复核' },
  { key: 'completed', label: '已完成' },
]

function App() {
  const [activeNav, setActiveNav] = useState('概览')
  const [mobileNav, setMobileNav] = useState(false)
  const [activeTab, setActiveTab] = useState('运行状态')
  const [showPrediction, setShowPrediction] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState(null)
  const [notice, setNotice] = useState('')
  const [primitiveTasks, setPrimitiveTasks] = useState(initialPrimitiveTasks)
  const [taskBarOpen, setTaskBarOpen] = useState(false)
  const [taskFilter, setTaskFilter] = useState('all')
  const [analysisFilters, setAnalysisFilters] = useState({
    dataset: 'GSE331114 · 人类 AIS 单细胞',
    cell: '小胶质细胞',
    stage: '急性期（24 h）',
    perturbation: 'PF-429242 · 2.5 μM / 24 h',
    range: '最近 30 天',
  })

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

  const taskCounts = useMemo(() => primitiveTasks.reduce((counts, task) => {
    counts[task.status] = (counts[task.status] || 0) + 1
    return counts
  }, {}), [primitiveTasks])
  const visibleTasks = primitiveTasks.filter((task) => taskFilter === 'all' || task.status === taskFilter)
  const currentTask = primitiveTasks.find((task) => task.status === 'running') || primitiveTasks.find((task) => task.status === 'queued') || primitiveTasks[0]

  const createPrimitiveTask = () => {
    const nextNumber = primitiveTasks.reduce((max, task) => Math.max(max, Number(task.id.split('-').at(-1)) || 0), 0) + 1
    const id = `PT-20260929-${String(nextNumber).padStart(3, '0')}`
    setPrimitiveTasks((tasks) => [{ id, name: '扰动响应推断', context: '新建预测 · 待调度', status: 'queued', progress: 0, updated: '刚刚' }, ...tasks])
    setTaskFilter('all')
    setTaskBarOpen(true)
    setShowPrediction(false)
    showNotice(`演示任务 ${id} 已加入队列`)
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
            <div><div className="eyebrow"><span className="eyebrow-line" /> ANALYSIS / AIS-0427 · 已保存分析</div><h1>AIS 扰动响应 <em>分析结果</em></h1><p>面向小胶质细胞的跨数据集预测，结果已绑定模型、数据版本与证据来源。</p></div>
            <div className="intro-actions"><button className="button button-quiet" onClick={() => showNotice('分析结果摘要已导出')}><Download size={16} /> 导出结果</button><button className="button button-primary" onClick={() => setShowPrediction(true)}><Plus size={17} /> 新建分析</button></div>
          </section>

          <section className="analysis-toolbar panel" aria-label="分析上下文">
            <div className="toolbar-heading"><div><span className="section-eyebrow">ANALYSIS CONTEXT</span><h3>分析上下文</h3></div><span className="saved-state"><span className="status-dot" /> 已保存 · 10:42:08</span></div>
            <div className="filter-grid">
              {[
                ['dataset', '数据集', ['GSE331114 · 人类 AIS 单细胞', 'GSE225948 · 小鼠 MCAO', 'scPerturb RNA · sciplex2/3/4']],
                ['cell', '细胞类型', ['小胶质细胞', '星形胶质细胞', '脑微血管内皮细胞']],
                ['stage', '疾病阶段', ['急性期（24 h）', '亚急性期（7 d）', '恢复期（28 d）']],
                ['perturbation', '扰动条件', ['PF-429242 · 2.5 μM / 24 h', 'QO-83 · 1.0 μM / 24 h', '未处理对照']],
                ['range', '结果范围', ['最近 30 天', '最近 90 天', '全部版本']],
              ].map(([key, label, options]) => <label className="filter-field" key={key}><span>{label}</span><select value={analysisFilters[key]} onChange={(event) => { setAnalysisFilters({ ...analysisFilters, [key]: event.target.value }); showNotice(`${label}已更新`) }}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>)}
              <button className="button button-outline filter-action" onClick={() => { setAnalysisFilters({ dataset: 'GSE331114 · 人类 AIS 单细胞', cell: '小胶质细胞', stage: '急性期（24 h）', perturbation: 'PF-429242 · 2.5 μM / 24 h', range: '最近 30 天' }); showNotice('已恢复默认分析上下文') }}><SlidersHorizontal size={15} /> 重置</button>
            </div>
          </section>

          <section className="metric-grid analysis-metrics" aria-label="分析结果指标">
            <MetricCard label="预测可信度" value="0.82" suffix="score" detail="适用域内 · 置信区间 ±0.07" tone="teal" icon={ShieldCheck} trend="up" />
            <MetricCard label="AIS 损伤评分" value="−0.31" suffix="Δ" detail="较未处理对照下降 18.6%" tone="blue" icon={Activity} trend="up" />
            <MetricCard label="显著响应基因" value="486" suffix="个" detail="FDR < 0.05 · |logFC| > 0.5" tone="amber" icon={Zap} trend="up" />
            <MetricCard label="模型适用域" value="87" suffix="%" detail="跨细胞验证 · 4 / 5 通过" tone="coral" icon={BrainCircuit} trend="up" />
          </section>

          <section className="analysis-grid">
            <div className="result-panel panel">
              <div className="panel-heading"><div><span className="section-eyebrow">PERTURBATION RESPONSE</span><h3>表达变化 · 预测 vs 对照</h3></div><div className="legend"><span><i className="legend-dot observed" />观测</span><span><i className="legend-dot predicted" />预测</span></div></div>
              <div className="chart-meta"><span>标准化表达量（z-score）</span><span>24 h · n = 42,816 cells</span></div>
              <div className="expression-chart"><div className="chart-axis"><span>2.0</span><span>1.0</span><span>0</span><span>−1.0</span><span>−2.0</span></div><div className="chart-body"><div className="chart-grid-lines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 560 190" role="img" aria-label="表达变化趋势图" preserveAspectRatio="none"><polyline className="chart-line observed-line" points="0,136 80,118 160,125 240,82 320,94 400,55 480,66 560,38" /><polyline className="chart-line predicted-line" points="0,142 80,125 160,118 240,91 320,83 400,63 480,54 560,43" /><circle className="chart-point" cx="400" cy="63" r="4" /><circle className="chart-point" cx="560" cy="43" r="4" /></svg><div className="chart-labels"><span>对照</span><span>炎症</span><span>屏障</span><span>修复</span><span>存活</span><span>综合</span></div></div></div>
              <div className="result-note"><Check size={14} /><span>预测曲线与独立验证集方向一致，关键峰值位于炎症与修复通路。</span><button className="text-button" onClick={() => setActiveTab('评价指标')}>查看评估 <ChevronRight size={14} /></button></div>
            </div>

            <div className="state-panel panel"><div className="panel-heading"><div><span className="section-eyebrow">CELL STATE SCORE</span><h3>AIS 细胞状态</h3></div><button className="icon-button subtle" aria-label="细胞状态更多操作" onClick={() => showNotice('细胞状态评分详情已打开')}><MoreHorizontal size={17} /></button></div><div className="state-score-list">{stateScores.map((item) => <div className="state-score" key={item.label}><div className="score-label"><span>{item.label}</span><strong>{item.value}<small>/100</small></strong></div><div className="score-track"><span className={item.tone} style={{ width: `${item.value}%` }} /></div><div className="score-foot"><span>{item.value >= 65 ? '高于基线' : '低于基线'}</span><em className={item.value >= 65 ? 'positive' : 'negative'}>{item.delta}</em></div></div>)}</div><div className="state-foot"><span className="status-dot" /> 评分基于 4 个 AIS 标志基因集</div></div>
          </section>

          <section className="evidence-grid">
            <div className="evidence-panel panel"><div className="panel-heading"><div><span className="section-eyebrow">TOP SIGNALS</span><h3>关键差异基因</h3></div><button className="text-button" onClick={() => showNotice('已打开完整差异基因表')}>完整结果 <ArrowUpRight size={14} /></button></div><div className="evidence-table-wrap"><table className="evidence-table"><thead><tr><th>基因</th><th>功能注释</th><th>logFC</th><th>FDR</th><th>证据</th></tr></thead><tbody>{degResults.map((item) => <tr key={item.gene}><td><strong className="gene-name">{item.gene}</strong></td><td>{item.symbol}</td><td><span className={`fold-change ${item.direction}`}>{item.logfc}</span></td><td className="mono-cell">{item.fdr}</td><td><span className="evidence-source">{item.evidence}</span></td></tr>)}</tbody></table></div></div>
            <div className="pathway-panel panel"><div className="panel-heading"><div><span className="section-eyebrow">PATHWAY SHIFT</span><h3>通路变化</h3></div><button className="icon-button subtle" aria-label="通路筛选" onClick={() => showNotice('通路筛选已打开')}><SlidersHorizontal size={16} /></button></div><div className="pathway-list">{pathwayResults.map((item) => <div className="pathway-row" key={item.name}><div className="pathway-main"><strong>{item.name}</strong><span>{item.count} · 证据{item.support}</span></div><span className={`pathway-score ${item.score.startsWith('+') ? 'positive' : 'negative'}`}>{item.score}</span></div>)}</div><div className="pathway-footer"><span>GSEA · Reactome + MSigDB</span><button className="text-button" onClick={() => showNotice('通路证据已复制')}><Tag size={13} /> 复制证据</button></div></div>
          </section>

          <section className="trace-strip panel"><div className="trace-title"><span className="section-eyebrow">PROVENANCE</span><h3>结果追溯</h3><span className="trace-status"><Check size={13} /> 可复现</span></div><div className="trace-items"><div><span>模型版本</span><strong>Chen-PerturbVAE <small>v1.8.0</small></strong></div><div><span>数据版本</span><strong>ais-curated <small>2026.09.26</small></strong></div><div><span>参数快照</span><strong>cfg_0427 <small>seed 20260918</small></strong></div><div><span>证据来源</span><strong>4 datasets <small>3 independent</small></strong></div><button className="button button-outline" onClick={() => setActiveNav('版本追溯')}>查看追溯链 <GitBranch size={15} /></button></div></section>

          <section className="lower-grid">
            <div className="data-panel panel"><div className="panel-heading data-heading"><div><span className="section-eyebrow">DATA FOUNDATION</span><h3>数据资产</h3></div><div className="heading-actions"><button className="icon-button subtle" aria-label="筛选数据" onClick={() => showNotice('筛选条件已打开')}><SlidersHorizontal size={16} /></button><button className="button button-small" onClick={() => { setActiveNav('数据资源'); showNotice('数据资源页面已切换') }}><Plus size={15} /> 接入数据</button></div></div><div className="dataset-table-wrap"><table><thead><tr><th>数据集</th><th>类型</th><th>细胞数</th><th>完整率</th><th>状态</th><th>更新</th><th /></tr></thead><tbody>{datasets.map((dataset) => <tr key={dataset.name} onClick={() => setSelectedDataset(dataset)} className="clickable-row"><td><div className="dataset-name"><span className={`dataset-mark ${dataset.color}`} />{dataset.name}</div><small>{dataset.source}</small></td><td><span className="type-text">{dataset.type}</span></td><td className="mono-cell">{dataset.cells}</td><td><div className="coverage"><span>{dataset.coverage}</span><div className="mini-track"><span style={{ width: dataset.coverage }} /></div></div></td><td><span className={`state-pill ${dataset.color}`}>{dataset.state}</span></td><td className="muted-cell">{dataset.updated}</td><td><ChevronRight size={16} className="row-chevron" /></td></tr>)}</tbody></table></div><button className="table-footer" onClick={() => setActiveNav('数据资源')}>查看全部 12 个数据集 <ArrowUpRight size={14} /></button></div>

            <div className="pipeline-panel panel"><div className="panel-heading"><div><span className="section-eyebrow">MODEL PIPELINE</span><h3>训练路线</h3></div><button className="icon-button subtle" aria-label="训练路线更多操作" onClick={() => showNotice('训练路线操作已打开')}><MoreHorizontal size={17} /></button></div><div className="pipeline-list">{pipeline.map(({ index, title, detail, state, progress, tone }) => <div className={`pipeline-step ${tone}`} key={index}><div className="step-index">{tone === 'done' ? <Check size={15} /> : index}</div><div className="step-copy"><div className="step-title"><strong>{title}</strong><span>{state}</span></div><small>{detail}</small><div className="step-progress"><span style={{ width: `${progress}%` }} /></div></div></div>)}</div><div className="pipeline-callout"><Sparkles size={16} /><span><strong>下一里程碑</strong> · AIS 外部验证集接入后自动开始</span><ChevronRight size={15} /></div></div>
          </section>

          <section className="insight-panel panel"><div className="insight-copy"><span className="section-eyebrow">RESEARCH NOTE</span><h3>让结果带着证据一起交付</h3><p>每次预测都绑定数据来源、样本版本、训练参数和适用域。模型给出的是可追溯的候选机制，不替代实验验证或临床结论。</p><div className="insight-actions"><button className="button button-outline" onClick={() => setActiveTab('评价指标')}>查看评价指标 <ArrowUpRight size={14} /></button><button className="text-button" onClick={() => showNotice('已复制数据字典链接')}>复制数据字典链接 <Tag size={14} /></button></div></div><div className="insight-diagram"><div className="diagram-node node-source"><Database size={17} /><span>数据来源</span></div><div className="diagram-line line-one" /><div className="diagram-node node-model"><BrainCircuit size={18} /><span>Chen-PerturbVAE</span></div><div className="diagram-line line-two" /><div className="diagram-node node-output"><LineChart size={17} /><span>预测结果</span></div></div></section>

          <section className="tabs-section"><div className="tabs-bar"><div className="tabs">{['运行状态', '评价指标', '审计日志'].map((tab) => <button key={tab} className={`tab ${activeTab === tab ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><div className="tabs-meta"><span className="status-dot" /> 最后同步 10:42:08</div></div><div className="tab-content"><div className="tab-summary"><span className="summary-icon"><Activity size={17} /></span><div><strong>{activeTab === '运行状态' ? '系统运行在预期范围内' : activeTab === '评价指标' ? '当前模型在 5 个独立测试场景中通过 4 项' : '审计链完整，最近 7 天无异常变更'}</strong><span>{activeTab === '运行状态' ? 'GPU 节点、数据同步与模型服务均正常' : activeTab === '评价指标' ? '跨细胞与跨组合测试仍在补充验证' : '所有参数快照均可回溯到对应数据版本'}</span></div></div><button className="text-button" onClick={() => showNotice(`${activeTab}详情已打开`)}>打开详情 <ChevronRight size={15} /></button></div></section>

          <footer className="page-footer"><span>AIS / LAB · Chen-PerturbVAE Research Workbench</span><span>数据仅用于研究 · 版本 v1.8.0</span></footer>
        </div>
      </main>

      <section className={`primitive-task-dock ${taskBarOpen ? 'is-open' : ''}`} aria-label="原语任务状态栏">
        {taskBarOpen && <div className="primitive-task-panel" id="primitive-task-panel">
          <div className="primitive-task-heading">
            <div><h2>原语任务</h2><p>查看任务编号、当前状态和完成度</p></div>
            <span className="task-demo-label">演示数据 · 未连接任务服务</span>
          </div>
          <div className="primitive-task-filters" aria-label="筛选任务状态">
            {taskFilters.map(({ key, label }) => <button key={key} type="button" className={`task-filter ${taskFilter === key ? 'is-active' : ''}`} aria-pressed={taskFilter === key} onClick={() => setTaskFilter(key)}>{label}<span>{key === 'all' ? primitiveTasks.length : taskCounts[key] || 0}</span></button>)}
          </div>
          <div className="primitive-task-list" aria-live="polite">
            {visibleTasks.length ? visibleTasks.map((task) => <div className="primitive-task-row" key={task.id}>
              <div className="primitive-task-identity"><span className="task-id">{task.id}</span><strong>{task.name}</strong><small>{task.context}</small></div>
              <span className={`task-status ${primitiveStatus[task.status].tone}`}><span className="task-status-dot" />{primitiveStatus[task.status].label}</span>
              <div className="task-completion"><div><span>完成度</span><strong>{task.progress}%</strong></div><div className="task-progress" role="progressbar" aria-label={`${task.id} 完成度`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={task.progress}><span className={primitiveStatus[task.status].tone} style={{ width: `${task.progress}%` }} /></div></div>
              <time className="task-time">{task.updated}</time>
            </div>) : <div className="task-empty">暂无该状态的任务。切换筛选条件查看其他任务。</div>}
          </div>
        </div>}
        <div className="primitive-task-summary">
          <button type="button" className="task-dock-toggle" aria-expanded={taskBarOpen} aria-controls="primitive-task-panel" onClick={() => setTaskBarOpen((open) => !open)}><Layers3 size={17} /><strong>任务状态</strong><span className="task-total">{primitiveTasks.length}</span><ChevronDown size={16} className="task-chevron" /></button>
          <div className="task-summary-current"><span className="task-id">{currentTask.id}</span><span className="task-summary-name">{currentTask.name}</span><span className={`task-status ${primitiveStatus[currentTask.status].tone}`}><span className="task-status-dot" />{primitiveStatus[currentTask.status].label}</span></div>
          <div className="task-summary-progress"><div className="task-progress" role="progressbar" aria-label={`${currentTask.id} 完成度`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={currentTask.progress}><span className={primitiveStatus[currentTask.status].tone} style={{ width: `${currentTask.progress}%` }} /></div><strong>{currentTask.progress}%</strong></div>
          <span className="task-summary-counts">运行中 {taskCounts.running || 0} · 排队 {taskCounts.queued || 0} · 待复核 {taskCounts.needsReview || 0}</span>
        </div>
      </section>

      {selectedDataset && <div className="overlay" onClick={() => setSelectedDataset(null)}><aside className="detail-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><span className="section-eyebrow">DATASET DETAIL</span><h2>{selectedDataset.name}</h2></div><button className="icon-button" aria-label="关闭数据详情" onClick={() => setSelectedDataset(null)}><X size={18} /></button></div><div className="drawer-state"><span className={`state-pill ${selectedDataset.color}`}>{selectedDataset.state}</span><span>最后更新 {selectedDataset.updated}</span></div><div className="drawer-metrics"><div><span>细胞数</span><strong>{selectedDataset.cells}</strong></div><div><span>元数据完整率</span><strong>{selectedDataset.coverage}</strong></div><div><span>数据类型</span><strong>{selectedDataset.type}</strong></div></div><div className="drawer-section"><h3>标准化字段</h3><div className="field-list"><div><span>study_id</span><Check size={15} /></div><div><span>sample_context</span><Check size={15} /></div><div><span>cell_annotation</span><Check size={15} /></div><div><span>perturbation_context</span><Check size={15} /></div><div className="field-warning"><span>collection_time</span><AlertTriangle size={15} /></div></div></div><div className="drawer-section"><h3>来源与追溯</h3><p className="drawer-note">该数据集将在进入训练集前，经过研究、供体、样本、细胞和质控五层校验。</p><button className="button button-outline full-width" onClick={() => showNotice('数据字典已打开')}><FileCheck2 size={16} /> 查看数据字典</button></div></aside></div>}

      {showPrediction && <div className="overlay" onClick={() => setShowPrediction(false)}><aside className="prediction-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><span className="section-eyebrow">NEW PREDICTION</span><h2>创建扰动预测</h2></div><button className="icon-button" aria-label="关闭预测" onClick={() => setShowPrediction(false)}><X size={18} /></button></div><p className="drawer-intro">选择一个已治理的基础状态与扰动条件，生成带可信度和适用域提示的候选响应。</p><div className="form-stack"><label>基础细胞状态<select defaultValue="GSE331114 · 小胶质细胞"><option>GSE331114 · 小胶质细胞</option><option>GSE225948 · 星形胶质细胞</option><option>自定义表达矩阵</option></select></label><label>扰动类型<div className="segmented"><button className="segment active">化合物</button><button className="segment">遗传靶点</button></div></label><label>化合物 / 靶点<select defaultValue="PF-429242 · ChEMBL 4861"><option>PF-429242 · ChEMBL 4861</option><option>QO-83 · PubChem 138564</option><option>自定义靶点集合</option></select></label><div className="form-grid"><label>剂量<input defaultValue="2.5" /><small>μM</small></label><label>处理时长<input defaultValue="24" /><small>小时</small></label></div><label>输出范围<div className="check-list"><label className="check-row"><input type="checkbox" defaultChecked /><span>差异基因与方向</span><Check size={14} /></label><label className="check-row"><input type="checkbox" defaultChecked /><span>AIS 细胞状态评分</span><Check size={14} /></label><label className="check-row"><input type="checkbox" defaultChecked /><span>通路变化与证据</span><Check size={14} /></label></div></label></div><div className="drawer-footer"><div><span className="status-dot" /> 预计 2–4 分钟</div><button className="button button-primary" onClick={createPrimitiveTask}><Play size={16} /> 开始预测</button></div></aside></div>}

      {notice && <div className="toast"><Check size={15} /> {notice}</div>}
    </div>
  )
}

function MetricCard({ label, value, suffix, detail, tone, icon: Icon, trend }) {
  return <div className={`metric-card ${tone}`}><div className="metric-top"><div className="metric-icon"><Icon size={17} /></div><span className="metric-trend">{trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}</span></div><div className="metric-label">{label}</div><div className="metric-value">{value}<small>{suffix}</small></div><div className="metric-detail">{detail}</div></div>
}

createRoot(document.getElementById('root')).render(<App />)
