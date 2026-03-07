import { useState, useEffect, useRef } from "react";

const PETALS = ["🌸","🌷","🌼","🌺","💮","🏵️","🌸","🌷","🌸"];

function FloatingPetals() {
  const items = Array.from({length: 22}, (_, i) => ({
    id: i,
    emoji: PETALS[i % PETALS.length],
    left: `${Math.random()*100}%`,
    dur: `${8 + Math.random()*10}s`,
    delay: `${Math.random()*12}s`,
    size: `${1.1 + Math.random()*1.4}rem`,
    opacity: 0.35 + Math.random()*0.35,
  }));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
      {items.map(p => (
        <div key={p.id} style={{
          position:"absolute", top:"-5%", left:p.left,
          fontSize:p.size, opacity:p.opacity,
          animation:`petalFall ${p.dur} ${p.delay} linear infinite`,
        }}>{p.emoji}</div>
      ))}
    </div>
  );
}

function HeartBurst({x, y, onDone}) {
  const icons = ["❤️","💕","🌸","💖","🌷","💗"];
  const particles = Array.from({length:10},(_,i)=>({
    id:i, icon:icons[i%icons.length],
    ox:(Math.random()-0.5)*130,
    delay:Math.random()*0.3,
  }));
  useEffect(()=>{ const t=setTimeout(onDone,2000); return()=>clearTimeout(t); },[]);
  return (
    <>
      {particles.map(p=>(
        <div key={p.id} style={{
          position:"fixed", left:x+p.ox, top:y,
          fontSize:"1.5rem", pointerEvents:"none", zIndex:9998,
          animation:`heartUp 1.5s ${p.delay}s ease-out forwards`,
        }}>{p.icon}</div>
      ))}
    </>
  );
}

export default function March8Card() {
  const [count, setCount]       = useState(5);
  const [phase, setPhase]       = useState("countdown"); // countdown | appear | show
  const [appeared, setAppeared] = useState(false);
  const [open, setOpen]         = useState(false);
  const [hearts, setHearts]     = useState(null);
  const btnRef = useRef(null);

  const cdLabels = {5:"Готовим сюрприз…",4:"Уже скоро…",3:"Почти готово…",2:"Осталось чуть-чуть…",1:"Открываем! 🌸"};

  useEffect(()=>{
    if(phase!=="countdown") return;
    if(count<=0){
      setPhase("appear");
      setTimeout(()=>setAppeared(true),200);
      setTimeout(()=>setPhase("show"),1000);
      return;
    }
    const t=setTimeout(()=>setCount(c=>c-1),1000);
    return()=>clearTimeout(t);
  },[count,phase]);

  function handleSurprise(){
    if(!open && btnRef.current){
      const r=btnRef.current.getBoundingClientRect();
      setHearts({x:r.left+r.width/2, y:r.top});
    }
    setOpen(o=>!o);
  }

  const dots = [5,4,3,2,1];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{overflow-x:hidden;}
        @keyframes petalFall{
          0%  {transform:translateY(-5vh) rotate(0deg) translateX(0);}
          33% {transform:translateY(33vh) rotate(120deg) translateX(18px);}
          66% {transform:translateY(66vh) rotate(240deg) translateX(-12px);}
          100%{transform:translateY(108vh) rotate(360deg) translateX(0);}
        }
        @keyframes numPop{
          from{transform:scale(0.2) rotate(-15deg);opacity:0;}
          to  {transform:scale(1) rotate(0deg);opacity:1;}
        }
        @keyframes heartUp{
          0%  {transform:translateY(0) scale(0.5);opacity:1;}
          100%{transform:translateY(-170px) scale(1.4);opacity:0;}
        }
        @keyframes bgShift{
          0%,100%{background-position:0% 50%;}
          50%    {background-position:100% 50%;}
        }
        @keyframes bob{
          0%,100%{transform:translateY(0) rotate(-2deg);}
          50%    {transform:translateY(-9px) rotate(2deg);}
        }
        @keyframes shimmer{
          from{text-shadow:2px 2px 0 #ffd5e7;}
          to  {text-shadow:2px 2px 0 #ffd5e7,0 0 28px rgba(230,96,122,0.55);}
        }
        @keyframes sparkle{
          0%,100%{opacity:0;transform:scale(0);}
          50%    {opacity:1;transform:scale(1);}
        }
        @keyframes fadeUp{
          from{opacity:0;transform:translateY(24px);}
          to  {opacity:1;transform:translateY(0);}
        }
        @keyframes cpFall{
          from{transform:translateY(-8%) rotate(0deg);opacity:.6;}
          to  {transform:translateY(110%) rotate(720deg);opacity:0;}
        }
      `}</style>

      {/* ── COUNTDOWN OVERLAY ── */}
      {phase==="countdown" && (
        <div style={{
          position:"fixed",inset:0,zIndex:9999,
          background:"radial-gradient(ellipse at center,#1a0a14 0%,#080005 100%)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        }}>
          {/* falling petals on overlay */}
          <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
            {PETALS.map((e,i)=>(
              <div key={i} style={{
                position:"absolute",left:`${(i/PETALS.length)*100+5}%`,top:"-8%",
                fontSize:`${1.2+Math.random()}rem`,opacity:0.5,
                animation:`cpFall ${6+i*0.7}s ${i*0.4}s linear infinite`,
              }}>{e}</div>
            ))}
          </div>

          {/* number */}
          <div key={count} style={{
            fontFamily:"'Playfair Display',Georgia,serif",
            fontSize:"clamp(6rem,22vw,13rem)",fontWeight:700,
            background:"linear-gradient(135deg,#f9aabb 0%,#e8607a 40%,#f4c842 100%)",
            WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",
            lineHeight:1,filter:"drop-shadow(0 0 40px rgba(232,96,122,.7))",
            animation:"numPop 0.4s cubic-bezier(0.34,1.6,0.64,1) forwards",
          }}>{count}</div>

          <div style={{
            fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(.9rem,3.5vw,1.5rem)",
            color:"rgba(255,210,225,.75)",letterSpacing:".4em",textTransform:"uppercase",
            marginTop:14,
          }}>{cdLabels[count]||""}</div>

          {/* dots */}
          <div style={{position:"absolute",bottom:"12%",display:"flex",gap:10}}>
            {dots.map(d=>(
              <div key={d} style={{
                width:10,height:10,borderRadius:"50%",
                background: d===count ? "#e8607a":"rgba(255,255,255,.2)",
                transform: d===count?"scale(1.5)":"scale(1)",
                boxShadow: d===count?"0 0 12px #e8607a":"none",
                transition:"all .3s",
              }}/>
            ))}
          </div>
        </div>
      )}

      {/* ── BACKGROUND ── */}
      <div style={{
        position:"fixed",inset:0,zIndex:0,
        background:"linear-gradient(160deg,#fce4ec 0%,#fdf6e3 25%,#f8e8f5 50%,#fff0f5 75%,#fce4ec 100%)",
        backgroundSize:"400% 400%",animation:"bgShift 16s ease infinite",
      }}/>

      <FloatingPetals/>

      {/* ── PAGE ── */}
      <div style={{
        position:"relative",zIndex:2,minHeight:"100vh",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"clamp(16px,4vw,40px)",
        fontFamily:"'Cormorant Garamond',Georgia,serif",
        opacity: appeared?1:0, transition:"opacity .8s",
      }}>
        <div style={{
          width:"100%",maxWidth:560,
          background:"rgba(255,255,255,.75)",
          backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",
          borderRadius:40,
          border:"1.5px solid rgba(255,200,210,.55)",
          boxShadow:"0 4px 30px rgba(220,80,120,.15),0 20px 60px rgba(200,60,100,.1),inset 0 1px 0 rgba(255,255,255,.9)",
          padding:"clamp(28px,6vw,52px) clamp(22px,5vw,44px)",
          textAlign:"center",position:"relative",overflow:"hidden",
        }}>

          {/* sparkle dots */}
          {[{t:"8%",l:"6%"},{t:"8%",r:"6%"},{t:"50%",l:"2%"},{t:"50%",r:"2%"},{b:"10%",l:"6%"},{b:"10%",r:"6%"}].map((pos,i)=>(
            <div key={i} style={{
              position:"absolute",
              top:pos.t,left:pos.l,right:pos.r,bottom:pos.b,
              width:7,height:7,borderRadius:"50%",
              background:"#f4c842",boxShadow:"0 0 8px #f4c842",
              animation:`sparkle ${1.5+i*0.3}s ${i*0.5}s ease-in-out infinite`,
            }}/>
          ))}

          {/* flower SVG */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:"clamp(12px,3vw,22px)",
            opacity:appeared?1:0,transform:appeared?"translateY(0)":"translateY(30px)",
            transition:"opacity .7s .1s,transform .7s .1s"}}>
            <svg style={{
              width:"clamp(100px,26vw,150px)",height:"clamp(100px,26vw,150px)",
              filter:"drop-shadow(0 8px 18px rgba(200,80,120,.4))",
              animation:"bob 4s ease-in-out infinite",
            }} viewBox="0 0 160 160" fill="none">
              <defs>
                <radialGradient id="g1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD6E0"/>
                  <stop offset="100%" stopColor="#E8607A"/>
                </radialGradient>
                <radialGradient id="g2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFE0EE"/>
                  <stop offset="100%" stopColor="#C84070"/>
                </radialGradient>
                <radialGradient id="g3" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF0D0"/>
                  <stop offset="100%" stopColor="#F4C842"/>
                </radialGradient>
              </defs>
              {/* stems */}
              <path d="M80 110 Q72 125 68 145" stroke="#6AB249" strokeWidth="4" strokeLinecap="round" fill="none"/>
              <path d="M80 110 Q80 128 80 148" stroke="#6AB249" strokeWidth="5" strokeLinecap="round" fill="none"/>
              <path d="M80 110 Q88 125 92 145" stroke="#6AB249" strokeWidth="4" strokeLinecap="round" fill="none"/>
              {/* leaves */}
              <ellipse cx="68" cy="132" rx="12" ry="6" fill="#7BC45A" transform="rotate(-30 68 132)" opacity="0.9"/>
              <ellipse cx="92" cy="132" rx="12" ry="6" fill="#6AB249" transform="rotate(30 92 132)" opacity="0.9"/>
              {/* left flower */}
              <g transform="translate(44,35)">
                {[0,90,180,270].map(r=>(
                  <ellipse key={r} cx={r===90?16:r===270?-16:0} cy={r===0?0:r===180?0:r===90?0:-0}
                    rx="10" ry="16" fill={r%180?"url(#g2)":"url(#g1)"}
                    transform={`rotate(${r})`} opacity="0.9"/>
                ))}
                {[45,135,225,315].map(r=>(
                  <ellipse key={r} rx="9" ry="14" fill={r<180?"url(#g1)":"url(#g2)"}
                    transform={`rotate(${r})`} opacity="0.85"/>
                ))}
                <circle r="10" fill="url(#g3)"/>
                <circle r="5" fill="#F9E07A" opacity="0.9"/>
              </g>
              {/* right flower */}
              <g transform="translate(116,40)">
                {[0,90,180,270].map(r=>(
                  <ellipse key={r} rx="9" ry="14" fill={r%180===0?"url(#g2)":"url(#g1)"}
                    transform={`rotate(${r})`} opacity="0.9"/>
                ))}
                {[45,135,225,315].map(r=>(
                  <ellipse key={r} rx="8" ry="12" fill={r>180?"url(#g1)":"url(#g2)"}
                    transform={`rotate(${r})`} opacity="0.85"/>
                ))}
                <circle r="9" fill="url(#g3)"/>
                <circle r="4" fill="#F9E07A" opacity="0.9"/>
              </g>
              {/* center big flower */}
              <g transform="translate(80,28)">
                {[0,90,180,270].map(r=>(
                  <ellipse key={r} rx="13" ry="20" fill={r<180?"url(#g1)":"url(#g2)"}
                    transform={`rotate(${r})`} opacity="0.95"/>
                ))}
                {[45,135,225,315].map(r=>(
                  <ellipse key={r} rx="11" ry="18" fill={r%270===0?"url(#g2)":"url(#g1)"}
                    transform={`rotate(${r})`} opacity="0.88"/>
                ))}
                <circle r="14" fill="url(#g3)"/>
                <circle r="7" fill="#F4C842"/>
                <circle cx="-2" cy="-2" r="3" fill="#FFF0A0" opacity="0.8"/>
              </g>
            </svg>
          </div>

          {/* date badge */}
          <div style={{
            display:"inline-block",
            background:"linear-gradient(135deg,#e8607a,#c04060)",
            color:"white",fontSize:"clamp(.72rem,2.3vw,.92rem)",
            fontWeight:300,letterSpacing:".35em",textTransform:"uppercase",
            padding:"5px 18px",borderRadius:40,marginBottom:"clamp(8px,2vw,14px)",
            boxShadow:"0 4px 14px rgba(200,60,100,.35)",
            opacity:appeared?1:0,transform:appeared?"scale(1)":"scale(.8)",
            transition:"opacity .6s .3s,transform .6s .3s",
          }}>8 марта · 2026</div>

          {/* title */}
          <h1 style={{
            fontFamily:"'Dancing Script',cursive",
            fontSize:"clamp(3rem,11vw,5.2rem)",fontWeight:700,
            color:"#c04060",lineHeight:1.05,
            marginBottom:"clamp(6px,2vw,12px)",
            animation:"shimmer 4s ease infinite alternate",
            opacity:appeared?1:0,transform:appeared?"translateY(0)":"translateY(20px)",
            transition:"opacity .7s .5s,transform .7s .5s",
          }}>С 8 Марта!</h1>

          {/* divider */}
          <div style={{
            display:"flex",alignItems:"center",gap:10,
            margin:"clamp(10px,2.5vw,18px) 0",
            opacity:appeared?1:0,transition:"opacity .6s .7s",
          }}>
            <div style={{flex:1,height:1,background:"linear-gradient(to right,transparent,rgba(220,80,120,.35),transparent)"}}/>
            <span style={{color:"#e8607a",fontSize:"clamp(.9rem,2.5vw,1.1rem)"}}>🌸</span>
            <div style={{flex:1,height:1,background:"linear-gradient(to right,transparent,rgba(220,80,120,.35),transparent)"}}/>
          </div>

          {/* main poem */}
          <p style={{
            fontSize:"clamp(1.05rem,3.6vw,1.4rem)",fontWeight:400,lineHeight:1.7,
            color:"#3a1828",fontStyle:"italic",
            padding:"clamp(14px,3vw,20px) clamp(14px,3.5vw,22px)",
            background:"linear-gradient(135deg,rgba(252,228,236,.5),rgba(255,240,245,.6))",
            borderRadius:20,borderLeft:"3px solid #f9aabb",
            marginBottom:"clamp(12px,3vw,18px)",
            opacity:appeared?1:0,transform:appeared?"translateY(0)":"translateY(20px)",
            transition:"opacity .7s .85s,transform .7s .85s",
          }}>
            🌷 Пусть весна подарит нежность,<br/>
            счастье, радость и надежду!<br/>
            Пусть улыбка не сходит с лица<br/>
            и сбываются мечты без конца!
          </p>

          {/* second poem */}
          <div style={{
            fontSize:"clamp(.9rem,3vw,1.1rem)",color:"#7a3050",
            lineHeight:1.9,fontStyle:"italic",
            padding:"clamp(12px,3vw,18px)",
            background:"rgba(240,220,248,.3)",
            borderRadius:18,border:"1px dashed rgba(220,160,200,.45)",
            marginBottom:"clamp(14px,3vw,22px)",
            opacity:appeared?1:0,transition:"opacity .7s 1.05s",
          }}>
            Желаем солнца, тепла и любви,<br/>
            Пусть жизнь расцветёт, как весенние цветы.<br/>
            Будь счастлива всегда, будь здорова,<br/>
            Ведь ты — самая прекрасная снова! 💐
          </div>

          {/* surprise button */}
          <div style={{
            opacity:appeared?1:0,transform:appeared?"translateY(0)":"translateY(15px)",
            transition:"opacity .7s 1.2s,transform .7s 1.2s",
          }}>
            <button ref={btnRef} onClick={handleSurprise} style={{
              display:"inline-flex",alignItems:"center",gap:8,
              padding:"clamp(11px,3vw,15px) clamp(22px,6vw,38px)",
              background:"linear-gradient(135deg,#e8607a,#c04060)",
              color:"white",
              fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(1rem,3.5vw,1.25rem)",fontWeight:400,letterSpacing:".1em",
              border:"none",borderRadius:60,cursor:"pointer",
              boxShadow:"0 6px 0 #94284a,0 10px 30px rgba(200,60,100,.35)",
              transition:"transform .15s,box-shadow .15s",
              position:"relative",overflow:"hidden",
            }}>
              <span style={{fontSize:"1.2em"}}>{open?"💖":"🌺"}</span>
              <span>{open?"Закрыть ✓":"Открыть сюрприз"}</span>
            </button>

            {/* extra message */}
            <div style={{
              maxHeight: open?"200px":0,
              opacity: open?1:0,
              overflow:"hidden",
              transition:"max-height .7s ease,opacity .5s .15s,padding .4s,margin .4s",
              fontSize:"clamp(.95rem,3vw,1.15rem)",color:"#7a3050",fontStyle:"italic",lineHeight:1.8,
              padding: open?"clamp(12px,3vw,18px) clamp(10px,3vw,20px)":0,
              margin: open?"clamp(12px,3vw,18px) 0":0,
              background: open?"linear-gradient(135deg,rgba(255,240,245,.85),rgba(240,220,255,.6))":"transparent",
              borderRadius:16,border: open?"1px solid rgba(220,160,200,.3)":"none",
              textAlign:"center",
            }}>
              💖 С восхищением и любовью! Пусть каждый твой день<br/>
              наполнен теплом, заботой и вниманием близких.<br/>
              Ты — особенная! Всегда и навсегда ✨
            </div>
          </div>

          {/* footer */}
          <div style={{
            marginTop:"clamp(16px,4vw,24px)",display:"flex",alignItems:"center",
            justifyContent:"center",gap:8,
            opacity:appeared?1:0,transition:"opacity .6s 1.4s",
          }}>
            <div style={{width:4,height:4,borderRadius:"50%",background:"#f9aabb"}}/>
            <span style={{
              fontSize:"clamp(.75rem,2.2vw,.88rem)",color:"#7a3050",
              letterSpacing:".25em",opacity:.7,textTransform:"uppercase",
            }}>С праздником весны</span>
            <div style={{width:4,height:4,borderRadius:"50%",background:"#f9aabb"}}/>
          </div>
        </div>
      </div>

      {/* hearts burst */}
      {hearts && <HeartBurst x={hearts.x} y={hearts.y} onDone={()=>setHearts(null)}/>}
    </>
  );
}