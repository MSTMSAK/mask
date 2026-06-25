import type { Stock, IndexData, MarketOverview, Strategy, NewsItem } from '@/types';

export const indicesData: IndexData[] = [
  { name: '上证指数', code: '000001.SH', value: 3412.35, change: +18.56, changePercent: +0.55, volume: '3852亿' },
  { name: '深证成指', code: '399001.SZ', value: 11256.78, change: +45.23, changePercent: +0.40, volume: '4821亿' },
  { name: '创业板指', code: '399006.SZ', value: 2289.45, change: +12.34, changePercent: +0.54, volume: '2156亿' },
  { name: '科创50', code: '000688.SH', value: 1023.67, change: -3.21, changePercent: -0.31, volume: '678亿' },
];

export const marketOverview: MarketOverview = {
  indices: indicesData,
  aiSummary: '沪深两市缩量震荡，半导体板块受政策利好驱动领涨，北向资金净流入32亿元，市场情绪偏谨慎乐观。短期关注量能能否持续放大，结构性行情或将延续。',
  confidence: 88,
  upCount: 2847,
  downCount: 2156,
  flatCount: 197,
  sentimentScore: 62,
};

export const topStocks: Stock[] = [
  {
    code: '688981',
    name: '中芯国际',
    price: 58.32,
    change: +3.56,
    changePercent: +6.51,
    aiScore: 94,
    aiGrade: 'S',
    logic: '基本面优异+技术面突破+资金持续流入',
    volume: 1258000000,
    marketCap: 462500000000,
    fiveD: { fundamental: 88, technical: 92, capital: 95, news: 85, sentiment: 90 },
  },
  {
    code: '002230',
    name: '科大讯飞',
    price: 52.18,
    change: +2.87,
    changePercent: +5.82,
    aiScore: 89,
    aiGrade: 'S',
    logic: 'AI大模型概念催化+业绩超预期+主力资金净流入',
    volume: 856000000,
    marketCap: 121300000000,
    fiveD: { fundamental: 82, technical: 88, capital: 90, news: 92, sentiment: 85 },
  },
  {
    code: '600519',
    name: '贵州茅台',
    price: 1688.00,
    change: +15.20,
    changePercent: +0.91,
    aiScore: 86,
    aiGrade: 'A',
    logic: '消费复苏预期+基本面稳健+北向资金加仓',
    volume: 24500000,
    marketCap: 2121000000000,
    fiveD: { fundamental: 95, technical: 72, capital: 78, news: 80, sentiment: 75 },
  },
  {
    code: '300750',
    name: '宁德时代',
    price: 198.50,
    change: +5.30,
    changePercent: +2.74,
    aiScore: 84,
    aiGrade: 'A',
    logic: '新能源产业链回暖+技术面金叉+机构调研密集',
    volume: 321000000,
    marketCap: 873000000000,
    fiveD: { fundamental: 85, technical: 80, capital: 82, news: 78, sentiment: 80 },
  },
  {
    code: '000858',
    name: '五粮液',
    price: 156.80,
    change: +2.10,
    changePercent: +1.36,
    aiScore: 82,
    aiGrade: 'A',
    logic: '白酒板块估值修复+股息率提升+资金持续流入',
    volume: 189000000,
    marketCap: 608000000000,
    fiveD: { fundamental: 88, technical: 75, capital: 80, news: 72, sentiment: 78 },
  },
  {
    code: '601318',
    name: '中国平安',
    price: 45.60,
    change: +0.85,
    changePercent: +1.90,
    aiScore: 80,
    aiGrade: 'A',
    logic: '保险负债端改善+估值处于历史低位+高股息策略',
    volume: 456000000,
    marketCap: 834000000000,
    fiveD: { fundamental: 82, technical: 76, capital: 75, news: 70, sentiment: 78 },
  },
  {
    code: '002594',
    name: '比亚迪',
    price: 258.30,
    change: +7.80,
    changePercent: +3.11,
    aiScore: 88,
    aiGrade: 'S',
    logic: '销量数据超预期+海外市场拓展+技术面突破前高',
    volume: 678000000,
    marketCap: 751000000000,
    fiveD: { fundamental: 86, technical: 88, capital: 85, news: 82, sentiment: 88 },
  },
  {
    code: '603259',
    name: '药明康德',
    price: 48.25,
    change: -0.35,
    changePercent: -0.72,
    aiScore: 68,
    aiGrade: 'B',
    logic: 'CXO行业订单回暖+估值处于底部区间+机构增持',
    volume: 234000000,
    marketCap: 143000000000,
    fiveD: { fundamental: 72, technical: 60, capital: 65, news: 70, sentiment: 68 },
  },
  {
    code: '600036',
    name: '招商银行',
    price: 34.50,
    change: +0.45,
    changePercent: +1.32,
    aiScore: 78,
    aiGrade: 'A',
    logic: '净息差企稳+资产质量优良+高分红吸引力',
    volume: 312000000,
    marketCap: 870000000000,
    fiveD: { fundamental: 82, technical: 72, capital: 70, news: 68, sentiment: 75 },
  },
  {
    code: '300059',
    name: '东方财富',
    price: 16.85,
    change: +0.42,
    changePercent: +2.56,
    aiScore: 76,
    aiGrade: 'A',
    logic: '市场活跃度提升+互联网券商龙头+技术面金叉',
    volume: 523000000,
    marketCap: 267000000000,
    fiveD: { fundamental: 70, technical: 78, capital: 82, news: 75, sentiment: 72 },
  },
];

export const chartData5Days = [
  { day: '周一', sh: 3380, sz: 11150, cy: 2265, kc: 1015 },
  { day: '周二', sh: 3395, sz: 11200, cy: 2275, kc: 1020 },
  { day: '周三', sh: 3405, sz: 11230, cy: 2280, kc: 1018 },
  { day: '周四', sh: 3398, sz: 11210, cy: 2277, kc: 1026 },
  { day: '周五', sh: 3412, sz: 11257, cy: 2289, kc: 1024 },
];

export const sectorData = [
  { name: '半导体', change: 4.82, leader: '中芯国际', leaderChange: 6.51 },
  { name: '人工智能', change: 3.56, leader: '科大讯飞', leaderChange: 5.82 },
  { name: '新能源', change: 2.91, leader: '宁德时代', leaderChange: 2.74 },
  { name: '白酒', change: 1.45, leader: '贵州茅台', leaderChange: 0.91 },
  { name: '保险', change: 1.32, leader: '中国平安', leaderChange: 1.90 },
];

export const moneyFlowData = [
  { time: '09:30', inflow: 12.5, outflow: -8.3 },
  { time: '10:00', inflow: 28.6, outflow: -15.2 },
  { time: '10:30', inflow: 35.1, outflow: -22.8 },
  { time: '11:00', inflow: 42.3, outflow: -28.5 },
  { time: '11:30', inflow: 38.7, outflow: -31.2 },
  { time: '13:00', inflow: 45.2, outflow: -26.8 },
  { time: '13:30', inflow: 52.1, outflow: -33.5 },
  { time: '14:00', inflow: 48.6, outflow: -29.7 },
  { time: '14:30', inflow: 55.3, outflow: -35.1 },
  { time: '15:00', inflow: 51.8, outflow: -32.4 },
];

export const upDownDistribution = [
  { range: '>+7%', count: 86 },
  { range: '+5~7%', count: 142 },
  { range: '+3~5%', count: 356 },
  { range: '+1~3%', count: 892 },
  { range: '0~1%', count: 1371 },
  { range: '-1~0%', count: 1245 },
  { range: '-3~-1%', count: 678 },
  { range: '-5~-3%', count: 189 },
  { range: '-7~-5%', count: 44 },
  { range: '<-7%', count: 21 },
];

export const strategies: Strategy[] = [
  {
    id: 'trend-break',
    name: '趋势突破策略',
    type: 'trend',
    description: '捕捉股价突破关键阻力位的动量机会',
    annualReturn: 22.3,
    maxDrawdown: -18.5,
    suitability: 85,
  },
  {
    id: 'value-growth',
    name: '价值成长策略',
    type: 'value',
    description: '以合理价格买入成长性公司',
    annualReturn: 18.5,
    maxDrawdown: -15.2,
    suitability: 78,
  },
  {
    id: 'fund-driven',
    name: '资金驱动策略',
    type: 'trend',
    description: '跟随主力资金流入方向',
    annualReturn: 16.8,
    maxDrawdown: -20.1,
    suitability: 72,
  },
  {
    id: 'low-value',
    name: '低估值策略',
    type: 'value',
    description: '挖掘被市场低估的价值标的',
    annualReturn: 12.6,
    maxDrawdown: -12.3,
    suitability: 68,
  },
  {
    id: 'high-dividend',
    name: '高股息策略',
    type: 'value',
    description: '筛选稳定分红收益的防御型标的',
    annualReturn: 9.4,
    maxDrawdown: -8.6,
    suitability: 65,
  },
  {
    id: 'oversold',
    name: '超跌反弹策略',
    type: 'tech',
    description: '捕捉过度下跌后的修复机会',
    annualReturn: 14.7,
    maxDrawdown: -22.4,
    suitability: 58,
  },
  {
    id: 'earnings',
    name: '业绩超预期策略',
    type: 'event',
    description: '基于财报超预期的alpha机会',
    annualReturn: 25.1,
    maxDrawdown: -19.8,
    suitability: 82,
  },
  {
    id: 'tech-pattern',
    name: '技术形态策略',
    type: 'tech',
    description: '经典技术形态确认后的买入机会',
    annualReturn: 19.2,
    maxDrawdown: -16.7,
    suitability: 75,
  },
];

export const newsData: NewsItem[] = [
  { id: '1', title: '半导体行业协会发布最新产业数据，Q3同比增长23%', time: '10分钟前', sentiment: 'positive', source: '财联社' },
  { id: '2', title: '北向资金今日净流入32亿元，连续5日加仓A股', time: '25分钟前', sentiment: 'positive', source: '东方财富' },
  { id: '3', title: '央行开展1000亿元逆回购操作，维护银行体系流动性', time: '1小时前', sentiment: 'neutral', source: '证券时报' },
  { id: '4', title: '美国10月CPI数据低于预期，美联储降息概率上升', time: '2小时前', sentiment: 'positive', source: '华尔街见闻' },
  { id: '5', title: '某上市公司因信息披露违规被证监会立案调查', time: '3小时前', sentiment: 'negative', source: '中国证券报' },
];

export const aiAnalysisReport = `## AI深度研报：中芯国际 (688981)

### 一、公司概况
中芯国际集成电路制造有限公司是中国大陆技术最先进、配套最完善、规模最大、跨国经营的集成电路制造企业集团。公司总部位于上海，拥有全球化的制造和服务基地。

### 二、五维综合评分：94分 (S级)

**1. 基本面分析 (88分)**
- 财务健康度良好，资产负债率控制在45%以下
- Q3营收同比增长35.8%，超出市场预期
- 毛利率持续改善，由上年同期的22.1%提升至26.3%
- 经营现金流充裕，现金流/净利润比率>1.2

**2. 技术面分析 (92分)**
- 股价突破前期平台，站稳60日均线
- MACD金叉形成，柱状图持续扩大
- 成交量温和放大，量价配合良好
- RSI(14)处于58，仍有上行空间

**3. 资金面分析 (95分)**
- 近5日主力资金净流入12.8亿元
- 北向资金持股比例提升至3.2%
- 融资余额持续增加，杠杆资金积极入场
- 机构席位净买入，知名游资参与

**4. 消息面分析 (85分)**
- 国产替代政策持续加码
- 大基金三期注资落地
- 行业景气度回升，订单饱满

**5. 舆情面分析 (90分)**
- 社交媒体情绪积极，讨论热度提升
- 分析师评级以上调为主
- 搜索指数显著上升

### 三、风险提示
1. 地缘政治风险：先进制程设备进口受限
2. 行业周期波动：半导体行业具有较强周期性
3. 技术迭代风险：制程追赶存在不确定性

### 四、AI观点
综合五维分析，中芯国际当前处于多维度共振状态。基本面改善、技术面突破、资金面流入形成三重共振，消息面和舆情面也提供有力支撑。短期关注突破后的回踩确认，中期看好国产替代逻辑的持续演绎。

**投资建议：积极关注**
**目标价位区间：65-72元**
**建议持仓周期：1-3个月**`;
