'use client';
import {useState} from 'react';
import {Sparkles, RotateCcw, ArrowRight} from 'lucide-react';

type Story={title:string;text:string;choices:string[];image:string;character:string;setting:string;history:string[]};
const starters=[
 ['Milo the fox','a moonlit library hidden inside an old oak'],
 ['A tiny astronaut','a floating garden above the clouds'],
 ['Nia the inventor','a seaside town where clocks grow like flowers'],
 ['A shy dragon','a bakery that only opens at midnight']
];
export default function Home(){
 const [character,setCharacter]=useState(''); const [setting,setSetting]=useState(''); const [idea,setIdea]=useState('');
 const [story,setStory]=useState<Story|null>(null); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
 async function create(nextIdea?:string){
   const c=character.trim(), s=setting.trim(); if(!c||!s)return;
   setLoading(true);setError('');
   try{const r=await fetch('/api/story',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({character:c,setting:s,idea:nextIdea||idea,previous:story})}); const d=await r.json(); if(!r.ok)throw new Error(d.error||'Something went wrong.'); setStory(d); setIdea('');}
   catch(e){setError(e instanceof Error?e.message:'Something went wrong.')} finally{setLoading(false)}
 }
 function restart(){setStory(null);setError('');setIdea('')}
 return <main className="app-shell"><section className="book">
  <header className="topbar"><div className="brand"><div className="seal">✦</div><div><div className="eyebrow">Interactive storybook</div><h1>Tiny Worlds</h1></div></div>{story&&<button className="restart" onClick={restart}><RotateCcw size={14}/> Restart</button>}</header>
  <div className="content">
   {!story&&!loading&&<div className="hero-grid"><div><div className="kicker">Make a world. Make a choice.</div><h2 className="headline">A little story, made just for you.</h2><p className="lede">Name a character. Pick a place. Tiny Worlds will write an opening scene, illustrate it, and give you three paths forward.</p>
    <div className="form-card"><div className="field"><label>Character</label><input value={character} onChange={e=>setCharacter(e.target.value)} placeholder="e.g. a curious fox named Milo"/></div><div className="field"><label>Setting</label><textarea value={setting} onChange={e=>setSetting(e.target.value)} placeholder="e.g. a moonlit library hidden inside an old oak"/></div><button className="button" disabled={!character.trim()||!setting.trim()} onClick={()=>create()}><Sparkles size={16}/> Open my tiny world <ArrowRight size={16}/></button>{error&&<div className="error">{error}</div>}<div className="hint">Starter ideas</div><div className="ideas">{starters.map(([c,s])=><button className="chip" key={c} onClick={()=>{setCharacter(c);setSetting(s)}}>{c} · {s}</button>)}</div></div>
   </div><div className="visual"><div className="fake-art"><div className="sun"/><div className="mountain"/><div className="caption">Every choice opens a different little door.</div></div></div></div>}
   {loading&&<div className="loading"><div><div className="spinner"/><h2>Painting your tiny world…</h2><p className="lede">Writing the scene, then illustrating the moment.</p></div></div>}
   {story&&!loading&&<div className="story-layout"><div><img className="scene-image" src={story.image} alt={story.title}/><article className="story-copy"><div className="kicker">Chapter {story.history.length}</div><h2 className="scene-title">{story.title}</h2><p className="scene-text">{story.text}</p></article></div><aside className="choice-panel"><div className="eyebrow">What happens next?</div>{story.choices.map((c,i)=><button className="choice" key={c} onClick={()=>create(c)}><small>PATH {String.fromCharCode(65+i)}</small>{c}</button>)}<div className="own-idea"><label>Your own idea</label><textarea value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Or tell the story what you want to happen…"/><button className="button" style={{marginTop:9,width:'100%',justifyContent:'center'}} disabled={!idea.trim()} onClick={()=>create(idea)}>Continue with my idea <ArrowRight size={15}/></button></div>{error&&<div className="error">{error}</div>}</aside></div>}
  </div></section></main>
}
