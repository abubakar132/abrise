import Head from 'next/head';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AuditForm from '../components/AuditForm';

// Dynamically import ChatWidget (client-only)
const ChatWidget = dynamic(() => import('../components/ChatWidget'), { ssr: false });

export default function Home() {
  // Scroll reveal
  const revealRef = useRef<NodeListOf<Element> | null>(null);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    revealRef.current = els;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el, i) => {
      const parent = el.parentElement;
      const siblings = parent?.querySelectorAll('.reveal');
      if (siblings) {
        const idx = Array.from(siblings).indexOf(el);
        (el as HTMLElement).style.transitionDelay = `${idx * 0.07}s`;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Chatbot demo animation
  useEffect(() => {
    let step = 0;
    const messages = [
      { role: 'ai', text: "Are you a coach or consultant looking for more clients?" },
      { role: 'user', text: "Yes, I'm a business coach" },
      { role: 'ai', text: "Do you have a website already, or need one built from scratch?" },
      { role: 'user', text: "I have one but it doesn't convert" },
      { role: 'ai', text: "Got it. I can upgrade your existing site with an AI system that books calls for you automatically 🎯" },
    ];

    const chatArea = document.getElementById('demo-chat');
    if (!chatArea) return;

    const addMsg = () => {
      if (step >= messages.length) return;
      const m = messages[step];
      const el = document.createElement('div');
      el.className = `cm ${m.role === 'ai' ? 'ai' : 'user'}`;
      el.innerHTML = `
        <div class="cm-av ${m.role === 'ai' ? 'ai' : 'u'}">${m.role === 'ai' ? 'A' : 'U'}</div>
        <div class="cm-bub" style="opacity:0;transform:translateY(6px);transition:all 0.3s">${m.text}</div>
      `;
      chatArea.appendChild(el);
      chatArea.scrollTop = chatArea.scrollHeight;
      const bub = el.querySelector('.cm-bub') as HTMLElement;
      setTimeout(() => { if (bub) { bub.style.opacity = '1'; bub.style.transform = 'translateY(0)'; } }, 50);
      step++;
      if (step < messages.length) setTimeout(addMsg, 2200);
    };

    const t = setTimeout(addMsg, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Head>
        <title>Abrise – AI-Powered Landing Pages for Coaches & Consultants</title>
      </Head>

      {/* ─── NAV ─── */}
      <nav className="nav">
        <div className="nav-logo">
          Abrise
          <span>by Abu Bakar</span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#proof">Results</a></li>
          <li><a href="#audit">Free Audit</a></li>
        </ul>
        <button className="nav-cta" onClick={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })}>
          Get Free AI Audit →
        </button>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow-1" />
        <div className="container">
          <div className="hero-inner">
            {/* Left */}
            <div>
              <div className="hero-eyebrow">
                <span className="pulse" />
                AI-Powered Client Acquisition · Built for Coaches
              </div>

              <h1 className="hero-h1">
                Stop Chasing Leads.<br />
                Start Waking Up to<br />
                <span className="accent">Booked Calls.</span>
              </h1>

              <p className="hero-p">
                I'm Abu Bakar. I build <strong>AI-powered landing pages and client systems</strong> for coaches and consultants — whether you need a brand-new website or want to finally make your existing one convert.
              </p>

              <div className="hero-actions">
                <button
                  className="btn-gold"
                  onClick={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get My Free AI Audit ✦
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See How It Works →
                </button>
              </div>

              <div className="hero-proof">
                <div className="proof-faces">
                  {['SL', 'MR', 'AK', 'JD'].map((i) => (
                    <div key={i} className="proof-face">{i}</div>
                  ))}
                </div>
                <div className="proof-text">
                  Trusted by <strong>30+ coaches</strong> to grow their practice
                </div>
              </div>
            </div>

            {/* Right — demo mockup */}
            <div className="hero-mockup">
              <div className="float-chip fc2">
                <span>📅</span>
                <div><strong>3 calls booked</strong> today</div>
              </div>

              <div className="mockup-frame">
                <div className="mockup-bar">
                  <div className="dot-r" /><div className="dot-y" /><div className="dot-g" />
                  <div className="url-bar">abrise.co — AI Demo</div>
                </div>
                <div className="chat-area" id="demo-chat">
                  <div className="cm ai">
                    <div className="cm-av ai">A</div>
                    <div className="cm-bub">Hey! I'm Aria 👋 Are you a coach looking to get more clients?</div>
                  </div>
                </div>
                <div className="mockup-stats">
                  <div className="ms"><div className="ms-n">3×</div><div className="ms-l">More Bookings</div></div>
                  <div className="ms"><div className="ms-n">24/7</div><div className="ms-l">AI Working</div></div>
                  <div className="ms"><div className="ms-n">92%</div><div className="ms-l">Lead Quality</div></div>
                </div>
              </div>

              <div className="float-chip fc1">
                <span>✅</span>
                <div><strong>Lead Qualified</strong> — ready to book</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AUDIENCE DIVIDER ─── */}
      <div className="divider-bar">
        <div className="divider-inner">
          <div className="div-label">Built for</div>
          <div className="div-tags">
            {['Life Coaches', 'Business Consultants', 'Fitness Coaches', 'Therapists', 'Course Creators', 'Marketing Consultants'].map((t) => (
              <span key={t} className="div-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PAIN ─── */}
      <section className="pain-section" id="pain">
        <div className="container">
          <div className="section-tag">The Problem</div>
          <h2 className="section-headline reveal" style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#FAFAF5', marginBottom: 8 }}>
            Coaches Lose Clients<br />Before the First Call
          </h2>

          <div className="pain-layout">
            <div className="pain-list">
              {[
                ['🚪', 'Visitors leave without doing anything', "They land on your page, scroll for 10 seconds, and disappear. No booking. No email. No trace."],
                ['⏰', 'Hours wasted chasing unqualified leads', "You reply to every enquiry only to find out they can't afford you, aren't serious, or just wanted free advice."],
                ['📉', 'Generic templates that look like everyone else', "Cookie-cutter sites don't build trust. When you look like every other coach, you compete on price — and lose."],
                ['🔕', 'No follow-up = dead leads', "Most prospects need 5–7 touchpoints before buying. Without automation, those leads go cold and find someone else."],
              ].map(([ico, title, desc]) => (
                <div key={String(title)} className="pain-card reveal">
                  <div className="pain-ico">{ico}</div>
                  <div>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal">
              <div className="funnel-vis">
                <div className="fv-label" style={{ color: 'var(--text-dim)' }}>❌ Without Abrise</div>
                <div className="fv-row bad">100 website visitors</div>
                <div className="fv-arrow" style={{ color: '#666' }}>↓ 97% leave immediately</div>
                <div className="fv-row bad">3 enquiries (most unqualified)</div>
                <div className="fv-arrow" style={{ color: '#666' }}>↓ hours of back-and-forth</div>
                <div className="fv-row bad">0–1 paying client / month</div>

                <div className="fv-sep" />

                <div className="fv-label" style={{ color: 'var(--gold)' }}>✦ With Abrise</div>
                <div className="fv-row good">100 website visitors</div>
                <div className="fv-arrow" style={{ color: 'var(--gold-dim)' }}>↓ AI engages & qualifies instantly</div>
                <div className="fv-row good">12–15 qualified leads captured</div>
                <div className="fv-arrow" style={{ color: 'var(--gold-dim)' }}>↓ Smart booking flow — no chasing</div>
                <div className="fv-row good">4–6 booked calls / month 🎯</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-tag">The Solution</div>
          <h2 className="reveal" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2rem, 3vw, 2.8rem)', color: '#FAFAF5', marginBottom: 14 }}>
            AI Systems That Work<br />
            <em style={{ color: 'var(--gold)' }}>While You Coach</em>
          </h2>
          <p className="reveal" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: 560, marginBottom: 0 }}>
            Whether you're starting fresh or upgrading an existing site — Abu Bakar builds the full stack: design, AI, automation.
          </p>

          <div className="features-grid">
            {[
              { ico: '🤖', title: 'AI Chatbot Qualification', desc: 'Aria — your AI assistant — engages every visitor the moment they land, asks the right questions, and filters tire-kickers automatically. Only serious, ready-to-buy prospects reach your calendar.' },
              { ico: '📅', title: 'Smart Booking Flow', desc: 'Once a lead is qualified, the system guides them straight to a booking — no emails back-and-forth, no "let me know what time works for you." Zero friction discovery calls, booked automatically.' },
              { ico: '🎯', title: 'Lead Capture & Segmentation', desc: 'Every visitor detail is captured and sorted by goal, budget, and urgency. Abu Bakar can see exactly who to follow up with first — without digging through a messy inbox.' },
              { ico: '⚡', title: 'High-Converting Design', desc: 'Designed with psychological conversion principles — not just aesthetics. Every section, CTA, and headline is intentional. Your website becomes your best salesperson.' },
            ].map((f) => (
              <div key={f.title} className="feat-card reveal">
                <div className="feat-ico">{f.ico}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal">
            <button
              className="btn-gold"
              onClick={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get My Free AI Audit ✦
            </button>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="how-section" id="how">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-tag" style={{ display: 'inline-flex' }}>The Process</div>
            <h2 className="reveal" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2rem, 3vw, 2.8rem)', color: '#FAFAF5', marginBottom: 12 }}>
              From "Who Are You?" to<br />
              <em style={{ color: 'var(--gold)' }}>"Let's Work Together"</em>
            </h2>
          </div>

          <div className="how-grid">
            {[
              { n: '01', title: 'Free Mini Audit', desc: 'Tell Abu Bakar about your coaching business and your situation — new site needed or existing one to upgrade. He personally reviews and identifies your biggest opportunity.' },
              { n: '02', title: 'Custom AI System Built', desc: 'Abu Bakar designs and builds your landing page or upgrade with an AI chatbot, booking flow, and lead capture — tailored to your coaching niche and offer.' },
              { n: '03', title: 'Your AI Goes Live', desc: 'Aria — your AI assistant — starts engaging visitors, qualifying leads, and routing serious prospects to your Calendly. It works 24/7, even while you sleep.' },
              { n: '04', title: 'You Focus on Coaching', desc: 'You wake up to booked discovery calls. No chasing, no cold DMs, no time wasted on tyre-kickers. Just warm, pre-qualified coaches on your calendar.' },
            ].map((s) => (
              <div key={s.n} className="how-step reveal">
                <div className="how-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROOF ─── */}
      <section className="proof-section" id="proof">
        <div className="container">
          <div className="section-tag">Results</div>
          <h2 className="reveal" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2rem, 3vw, 2.8rem)', color: '#FAFAF5', marginBottom: 8 }}>
            Coaches Who Made the Switch
          </h2>

          <div className="proof-grid">
            {[
              { init: 'SL', name: 'Sarah L.', role: 'Business Coach, Dubai', stars: 5, quote: 'I never knew a website could actually book clients for me. The AI chatbot filters every lead — I only talk to people who can pay. My close rate went from 20% to 65% in a month.' },
              { init: 'MR', name: 'Marcus R.', role: 'Fitness & Mindset Coach', stars: 5, quote: 'Abu Bakar built my site from scratch. Within 2 weeks I had 8 discovery calls booked — all pre-qualified. My old Wix site got maybe 1 call a month. Completely different world.' },
              { init: 'AK', name: 'Amira K.', role: 'Life & Relationship Coach', stars: 5, quote: "I already had a site but it wasn't converting. Abu Bakar upgraded it with the AI chatbot and booking flow. Now it actually works. I stopped chasing leads entirely." },
            ].map((t) => (
              <div key={t.name} className="testi reveal">
                <div className="testi-stars">
                  {Array.from({ length: t.stars }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <p>"{t.quote}"</p>
                <div className="testi-auth">
                  <div className="testi-av">{t.init}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AUDIT FORM ─── */}
      <section className="audit-section" id="audit">
        <div className="audit-glow" />
        <div className="container">
          <div className="audit-wrap">
            <div className="section-tag" style={{ display: 'inline-flex' }}>Free Audit</div>
            <h2 className="reveal" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(2rem, 3vw, 2.8rem)', color: '#FAFAF5', marginBottom: 12 }}>
              Get Abu Bakar's Personal<br />
              <em style={{ color: 'var(--gold)' }}>AI Idea — Free</em>
            </h2>
            <p className="reveal" style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.7, marginBottom: 0 }}>
              Whether you need a new website or want to upgrade your existing one — fill this in and Abu Bakar will personally review your setup and send you one specific AI idea that could get you more booked calls.
            </p>

            <div className="reveal">
              <AuditForm />
            </div>

            <div className="reveal" style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'Outfit, sans-serif' }}>Prefer to message directly?</span>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567'}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.82rem', color: 'var(--gold)', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}
              >
                WhatsApp Abu Bakar →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-logo">Abrise</div>
          <ul className="footer-links">
            <li><a href="#pain">Why Abrise</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how">Process</a></li>
            <li><a href="#audit">Free Audit</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
          <div className="footer-copy">© 2025 Abrise · Built by Abu Bakar</div>
        </div>
      </footer>

      {/* ─── CHAT WIDGET ─── */}
      <ChatWidget />
    </>
  );
}
