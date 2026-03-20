import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">Platform Pajak Digital Indonesia</span>
          <h1 className="hero__title">
            Empowering Taxpayers,<br />
            <span className="hero__title--accent">Building the Future</span>
          </h1>
          <p className="hero__desc">
            Participate, Learn, and See Your Taxes at Work for a Better Indonesia.
          </p>
          <div className="hero__cta">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-outline">Login</Link>
          </div>
        </div>

        <div className="hero__illustration">
          <div className="hero__ill-bg" />
          <svg className="hero__city" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="200" y="60" width="50" height="160" rx="4" fill="#c7d7f5"/>
            <rect x="210" y="70" width="10" height="14" rx="2" fill="#93b4e8"/>
            <rect x="228" y="70" width="10" height="14" rx="2" fill="#93b4e8"/>
            <rect x="210" y="92" width="10" height="14" rx="2" fill="#93b4e8"/>
            <rect x="228" y="92" width="10" height="14" rx="2" fill="#93b4e8"/>
            <rect x="210" y="114" width="10" height="14" rx="2" fill="#93b4e8"/>
            <rect x="228" y="114" width="10" height="14" rx="2" fill="#93b4e8"/>
            <rect x="255" y="30" width="40" height="190" rx="4" fill="#a8c0f0"/>
            <rect x="263" y="44" width="8" height="12" rx="1" fill="#6699dd"/>
            <rect x="278" y="44" width="8" height="12" rx="1" fill="#6699dd"/>
            <rect x="263" y="64" width="8" height="12" rx="1" fill="#6699dd"/>
            <rect x="278" y="64" width="8" height="12" rx="1" fill="#6699dd"/>
            <rect x="263" y="84" width="8" height="12" rx="1" fill="#6699dd"/>
            <rect x="278" y="84" width="8" height="12" rx="1" fill="#6699dd"/>
            <rect x="263" y="104" width="8" height="12" rx="1" fill="#6699dd"/>
            <rect x="278" y="104" width="8" height="12" rx="1" fill="#6699dd"/>
            <rect x="150" y="90" width="55" height="130" rx="4" fill="#dce8fb"/>
            <rect x="159" y="100" width="10" height="14" rx="2" fill="#a8c4f0"/>
            <rect x="177" y="100" width="10" height="14" rx="2" fill="#a8c4f0"/>
            <rect x="159" y="122" width="10" height="14" rx="2" fill="#a8c4f0"/>
            <rect x="177" y="122" width="10" height="14" rx="2" fill="#a8c4f0"/>
            <line x1="300" y1="10" x2="300" y2="55" stroke="#b0c8f0" strokeWidth="2"/>
            <ellipse cx="300" cy="10" rx="12" ry="4" fill="#93b4e8" transform="rotate(-30 300 10)"/>
            <ellipse cx="300" cy="10" rx="12" ry="4" fill="#93b4e8" transform="rotate(90 300 10)"/>
            <ellipse cx="300" cy="10" rx="12" ry="4" fill="#93b4e8" transform="rotate(210 300 10)"/>
            <rect x="140" y="218" width="180" height="4" rx="2" fill="#c7d7f5"/>
          </svg>
          <div className="hero__card hero__card--top">
            <span className="hero__card-num">10.4%</span>
            <span className="hero__card-label">Tax-to-GDP Ratio</span>
          </div>
          <div className="hero__card hero__card--bottom">
            <span className="hero__card-num">+2.3M</span>
            <span className="hero__card-label">Wajib Pajak Baru 2025</span>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section className="features">
        <div className="features__grid">
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3>Simulate the Budget</h3>
            <p>Explore and allocate the national budget in our interactive simulator.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3>Track Your Impact</h3>
            <p>See how your taxes contribute to education, healthcare, and infrastructure.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3>Join the Community</h3>
            <p>Share your ideas and discuss public policies with fellow citizens.</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <p className="stats__label">See the Difference Your Taxes Make</p>
        <div className="stats__grid">
          <div className="stat-item">
            <span className="stat-item__num">1,200</span>
            <span className="stat-item__title">New Classrooms Built</span>
            <span className="stat-item__sub">Improving education access.</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-item__num">2 Million</span>
            <span className="stat-item__title">Patients Served</span>
            <span className="stat-item__sub">Expanding healthcare coverage.</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-item__num">350 KM</span>
            <span className="stat-item__title">Rural Roads Upgraded</span>
            <span className="stat-item__sub">Connecting remote communities.</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <h2 className="section-title">How TaxVoice Works</h2>
        <div className="how__grid">
          <div className="how-step">
            <div className="how-step__num">1</div>
            <h3>Pay & Contribute</h3>
            <p>Easily fulfil your tax obligations and make symbolic preferences.</p>
          </div>
          <div className="how-step">
            <div className="how-step__num">2</div>
            <h3>Learn & Simulate</h3>
            <p>Understand budget allocations and try your own scenarios.</p>
          </div>
          <div className="how-step">
            <div className="how-step__num">3</div>
            <h3>Track & Engage</h3>
            <p>See real-time impact and join in meaningful discussions.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="testimonial">
        <div className="testimonial__card">
          <div className="testimonial__avatar">A</div>
          <div className="testimonial__body">
            <p className="testimonial__quote">
              "TaxVoice makes me feel connected to where my money goes.
              I can see the real benefits of paying taxes."
            </p>
            <p className="testimonial__author">— <strong>Andi</strong>, Small Business Owner</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Make an Impact?</h2>
        <p>Join thousands of Indonesians in creating a better future today.</p>
        <Link to="/register" className="btn-primary btn-primary--lg">Sign Up Now</Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <nav className="footer__nav">
          <a href="#">About</a>
          <a href="#">FAQ</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </nav>
      </footer>

    </div>
  )
}