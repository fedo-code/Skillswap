import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';

const STICKERS = [
  ['Guitar', 'lime', -4],
  ['Python', 'sky', 3],
  ['Spanish', 'pink', -2],
  ['Photo editing', 'lime', 4],
  ['Sourdough', 'sky', -3],
  ['UI design', 'pink', 2],
  ['Chess', 'lime', -5],
];

const FLOW = [
  ['01', 'Say what you know', 'Add the things you could teach a friend over coffee. Rusty is fine.'],
  ['02', 'Say what you want', 'Add what you are itching to learn. Be specific, it makes matches better.'],
  ['03', 'We find the other half', 'You only see people who want your skill and have the one you want. Both sides win, by design.'],
  ['04', 'Talk and trade', 'Open their profile, send a message, and set up your first session together.'],
];

const EXAMPLES = [
  { a: 'Guitar', b: 'Python', text: 'A weekend coder who wants to play and a guitarist who wants to automate their gig spreadsheet.' },
  { a: 'Spanish', b: 'Photo editing', text: 'Trade conversation practice for a crash course in Lightroom.' },
  { a: 'Sourdough', b: 'Budgeting', text: 'One person bakes, the other finally makes sense of their money.' },
];

const RULES = [
  ['No money changes hands', 'Your time for their time. That is the whole price.'],
  ['Matches go both ways', 'We never suggest someone who has nothing you want.'],
  ['You choose who to talk to', 'Browse your matches, read their profile, and message only the people you like.'],
  ['Beginners welcome', 'You only need to be one step ahead of someone to teach them.'],
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="h-hero">
        <div className="wrap h-hero-grid">
          <div>
            <span className="h-kicker">A skill-trading club</span>
            <h1>
              You teach one thing. They teach <em>another.</em>
            </h1>
            <p className="sub">
              SkillSwap pairs people who each know something the other wants to learn. Trade
              lessons instead of paying for them.
            </p>
            <div className="h-cta">
              {user ? (
                <>
                  <Link to="/dashboard" className="hbtn tomato">See my matches →</Link>
                  <Link to="/edit-profile" className="hbtn alt">Update my skills</Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="hbtn tomato">Join and add your skills →</Link>
                  <Link to="/login" className="hbtn alt">I have an account</Link>
                </>
              )}
            </div>
            <div className="h-note">Free to join. Takes about a minute.</div>
          </div>

          <div className="swap-stage" aria-hidden="true">
            <div className="ticket t1">
              <div className="who"><span className="dot">M</span> Maya</div>
              <div className="row">Teaches</div>
              <div className="val">Guitar</div>
              <div className="row">Wants to learn</div>
              <div className="val">Python</div>
            </div>
            <div className="stamp"><div>It&apos;s a<span>swap!</span></div></div>
            <div className="ticket t2">
              <div className="who"><span className="dot">D</span> Dev</div>
              <div className="row">Teaches</div>
              <div className="val">Python</div>
              <div className="row">Wants to learn</div>
              <div className="val">Guitar</div>
            </div>
          </div>
        </div>

        <div className="wrap stickers" aria-hidden="true">
          <span className="stickers-label">Ideas to trade:</span>
          {STICKERS.map(([t, c, r]) => (
            <span key={t} className={`sticker ${c}`} style={{ transform: `rotate(${r}deg)` }}>{t}</span>
          ))}
        </div>
      </section>

      <section className="h-section">
        <div className="wrap">
          <div className="h-eyebrow">How it works</div>
          <h2>From sign-up to first lesson in <em>four moves.</em></h2>
          <div className="flow">
            {FLOW.map(([n, t, d]) => (
              <div className="flow-item" key={n}>
                <div className="n">{n}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="h-section">
        <div className="wrap">
          <div className="h-eyebrow">What a swap looks like</div>
          <h2>Strange pairs make the <em>best</em> teachers.</h2>
          <div className="notes">
            {EXAMPLES.map((e) => (
              <div className="note" key={e.a}>
                <div className="pair">{e.a} <b>⇄</b> {e.b}</div>
                <p>{e.text}</p>
                <small>Example swap</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="h-section">
        <div className="wrap">
          <div className="h-eyebrow">House rules</div>
          <h2>Simple on purpose.</h2>
          <div className="rules">
            {RULES.map(([t, d]) => (
              <div className="rule" key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="h-final">
        <div className="wrap">
          <h2>What could you <em>teach</em> this week?</h2>
          <Link to={user ? '/edit-profile' : '/register'} className="hbtn">
            {user ? 'Add a skill' : 'Start swapping'} →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
