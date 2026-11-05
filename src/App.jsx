import React, { useMemo, useState } from 'react';
import { Search, Bookmark, BookmarkCheck, ExternalLink, Clock3, Wallet, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';

const jobs = [
  {id:1,title:'Разработать лендинг для SaaS-продукта',company:'Northstar Studio',category:'Разработка',budget:'$800–1 200',low:800,type:'Фиксированная цена',level:'Средний',posted:'2 часа назад',duration:'1–2 недели',skills:['React','Tailwind CSS','Figma'],description:'Адаптивный лендинг для B2B SaaS по готовому макету Figma.',url:'https://www.upwork.com/nx/search/jobs/?q=react%20landing%20page'},
  {id:2,title:'Дизайн интерфейса мобильного приложения',company:'Bright Labs',category:'Дизайн',budget:'$500–900',low:500,type:'Фиксированная цена',level:'Средний',posted:'4 часа назад',duration:'2–3 недели',skills:['Figma','UI/UX','Prototyping'],description:'UI/UX-дизайн финтех-приложения. Нужен опыт мобильных продуктов.',url:'https://www.upwork.com/nx/search/jobs/?q=mobile%20app%20design'},
  {id:3,title:'Написать SEO-статьи для блога',company:'Growth Market',category:'Тексты',budget:'$35–50 / час',low:35,type:'Почасовая оплата',level:'Начальный',posted:'5 часов назад',duration:'Долгосрочно',skills:['SEO','Copywriting','Research'],description:'Статьи на английском языке о маркетинге и технологиях.',url:'https://www.upwork.com/nx/search/jobs/?q=SEO%20writing'},
  {id:4,title:'Настроить рекламу Google Ads',company:'Urban Goods',category:'Маркетинг',budget:'$400–700',low:400,type:'Фиксированная цена',level:'Эксперт',posted:'Сегодня',duration:'1 месяц',skills:['Google Ads','Analytics','PPC'],description:'Настройка и оптимизация рекламных кампаний интернет-магазина.',url:'https://www.upwork.com/nx/search/jobs/?q=Google%20Ads'},
  {id:5,title:'Создать Telegram-бота для поддержки',company:'Orbit Systems',category:'Разработка',budget:'$600–1 000',low:600,type:'Фиксированная цена',level:'Средний',posted:'Вчера',duration:'2 недели',skills:['Python','Telegram API','PostgreSQL'],description:'Бот с FAQ, передачей диалога оператору и админ-панелью.',url:'https://www.upwork.com/nx/search/jobs/?q=telegram%20bot'},
  {id:6,title:'Монтаж коротких видео для соцсетей',company:'Social House',category:'Видео',budget:'$25–40 / час',low:25,type:'Почасовая оплата',level:'Начальный',posted:'Вчера',duration:'Долгосрочно',skills:['Premiere Pro','Reels','After Effects'],description:'Монтаж вертикальных роликов длительностью 30–60 секунд.',url:'https://www.upwork.com/nx/search/jobs/?q=short%20video%20editor'},
  {id:7,title:'Собрать дашборд продаж в Looker Studio',company:'DataPeak',category:'Аналитика',budget:'$300–500',low:300,type:'Фиксированная цена',level:'Средний',posted:'2 дня назад',duration:'1 неделя',skills:['Looker Studio','SQL','Google Sheets'],description:'Дашборд продаж с данными из нескольких источников.',url:'https://www.upwork.com/nx/search/jobs/?q=Looker%20Studio'},
  {id:8,title:'Верстка страниц интернет-магазина',company:'Mono Commerce',category:'Разработка',budget:'$30–45 / час',low:30,type:'Почасовая оплата',level:'Средний',posted:'2 дня назад',duration:'1 месяц',skills:['HTML','CSS','JavaScript'],description:'Адаптивная верстка каталога и карточки товара по макетам.',url:'https://www.upwork.com/nx/search/jobs/?q=frontend%20developer'}
];
const categories=['Все','Разработка','Дизайн','Тексты','Маркетинг','Видео','Аналитика'];

export default function App(){
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('Все');
  const [level,setLevel]=useState('Любой');
  const [type,setType]=useState('Любой');
  const [sort,setSort]=useState('Новые');
  const [saved,setSaved]=useState([]);
  const [onlySaved,setOnlySaved]=useState(false);
  const [view,setView]=useState('list');
  const [filtersOpen,setFiltersOpen]=useState(false);
  const filtered=useMemo(()=>{
    const result=jobs.filter(j=>(category==='Все'||j.category===category)&&(level==='Любой'||j.level===level)&&(type==='Любой'||j.type===type)&&(!onlySaved||saved.includes(j.id))&&(!query||[j.title,j.company,j.description,...j.skills].join(' ').toLowerCase().includes(query.toLowerCase())));
    if(sort==='Бюджет') result.sort((a,b)=>b.low-a.low);
    return result;
  },[query,category,level,type,sort,onlySaved,saved]);
  const reset=()=>{setQuery('');setCategory('Все');setLevel('Любой');setType('Любой');setOnlySaved(false)};
  const toggleSaved=id=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  return <div className="app">
    <aside className="sidebar">
      <a className="brand" href="#">WS</a>
      <nav>
        <button className={!onlySaved?'nav-item active':'nav-item'} onClick={()=>setOnlySaved(false)}>Все заказы</button>
        <button className={onlySaved?'nav-item active':'nav-item'} onClick={()=>setOnlySaved(true)}>Сохранённые <span>{saved.length}</span></button>
      </nav>
    </aside>
    <main className="main">
      <header className="topbar"><h1>{onlySaved?'Сохранённые':'Заказы'}</h1></header>
      <section className="content">
        <div className="search-row">
          <div className="searchbox"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск заказов и навыков"/>{query&&<button onClick={()=>setQuery('')} aria-label="Очистить"><X size={16}/></button>}</div>
          <button className={filtersOpen?'filter-btn active':'filter-btn'} onClick={()=>setFiltersOpen(v=>!v)}><SlidersHorizontal size={17}/> Фильтры</button>
        </div>
        {filtersOpen&&<div className="filters">
          <label>Уровень<select value={level} onChange={e=>setLevel(e.target.value)}><option value="Любой">Любой</option><option>Начальный</option><option>Средний</option><option>Эксперт</option></select></label>
          <label>Оплата<select value={type} onChange={e=>setType(e.target.value)}><option value="Любой">Любой формат</option><option>Фиксированная цена</option><option>Почасовая оплата</option></select></label>
        </div>}
        <div className="categories">{categories.map(c=><button key={c} className={category===c?'category active':'category'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="toolbar"><span>{filtered.length} заказов</span><div className="toolbar-actions"><select value={sort} onChange={e=>setSort(e.target.value)}><option value="Новые">Сначала новые</option><option value="Бюджет">По бюджету</option></select><div className="view-switch"><button className={view==='list'?'selected':''} onClick={()=>setView('list')} aria-label="Список"><List size={17}/></button><button className={view==='grid'?'selected':''} onClick={()=>setView('grid')} aria-label="Сетка"><LayoutGrid size={17}/></button></div><button className="reset" onClick={reset}>Сбросить</button></div></div>
        <div className={view==='grid'?'job-list grid':'job-list'}>
          {filtered.map(job=><article className="job-card" key={job.id}>
            <div className="job-top"><div className="company-mark">{job.company.slice(0,1)}</div><div className="job-info"><div className="meta">{job.company}<span>·</span>{job.posted}</div><h2>{job.title}</h2><p>{job.description}</p></div><button className={saved.includes(job.id)?'save saved':'save'} onClick={()=>toggleSaved(job.id)} aria-label="Сохранить">{saved.includes(job.id)?<BookmarkCheck size={18}/>:<Bookmark size={18}/>}</button></div>
            <div className="skills">{job.skills.map(skill=><span key={skill}>{skill}</span>)}</div>
            <div className="job-bottom"><div className="facts"><span><Wallet size={15}/><b>{job.budget}</b></span><span><Clock3 size={15}/>{job.duration}</span><span>{job.level}</span><span>{job.category}</span></div><a href={job.url} target="_blank" rel="noreferrer">Открыть <ExternalLink size={14}/></a></div>
          </article>)}
        </div>
        {filtered.length===0&&<div className="empty">Заказы не найдены</div>}
      </section>
    </main>
  </div>;
}
