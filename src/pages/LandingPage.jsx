import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-nav__logo">TaxVoice</div>
        <div className="landing-nav__links">
          <a href="#features">Features</a>
          <a href="#impact">Impact</a>
          <a href="#community">Community</a>
        </div>
        <div className="landing-nav__actions">
          <Link to="/login" className="landing-nav__login">Sign In</Link>
          <Link to="/register" className="landing-nav__cta">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">Civic-Fiscal Engagement Platform</span>
          <h1 className="hero__title">
            Empowering Taxpayers,<br />
            <span className="hero__title--accent">Building the Future</span>
          </h1>
          <p className="hero__desc">
            Participate, learn, and see your taxes at work — building a more
            transparent and accountable Indonesia.
          </p>
          <div className="hero__cta">
            <Link to="/register" className="btn-primary-dark">Create Account</Link>
            <Link to="/impact" className="btn-outline-dark">See Impact Data</Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">10.4%</span>
              <span className="hero__stat-label">Tax-to-GDP Ratio</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">Rp3,106T</span>
              <span className="hero__stat-label">State Budget 2024</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">4 Tools</span>
              <span className="hero__stat-label">To engage &amp; learn</span>
            </div>
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
            <span className="hero__card-label">New Taxpayers 2025</span>
          </div>
        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <section className="problem">
        <div className="problem__inner">
          <span className="section-eyebrow">Why it matters</span>
          <h2 className="section-title">Indonesia's Tax Gap Is Real</h2>
          <p className="section-sub">
            Low tax morale costs the country billions every year. TaxVoice bridges
            the gap between citizens and their government through education,
            participation, and transparency.
          </p>
          <div className="problem__cards">
            <div className="problem__card">
              <span className="problem__card-num">10.4%</span>
              <span className="problem__card-title">Tax-to-GDP Ratio</span>
              <span className="problem__card-sub">Below the 15% minimum recommended by IMF for development</span>
            </div>
            <div className="problem__card">
              <span className="problem__card-num">Rp340T</span>
              <span className="problem__card-title">Estimated Tax Gap</span>
              <span className="problem__card-sub">Annual revenue lost due to low compliance and awareness</span>
            </div>
            <div className="problem__card">
              <span className="problem__card-num">67%</span>
              <span className="problem__card-title">Uninformed Citizens</span>
              <span className="problem__card-sub">Of taxpayers are unsure where their tax money actually goes</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <span className="section-eyebrow">Platform features</span>
        <h2 className="section-title">Everything you need to engage</h2>
        <p className="section-sub">Four tools designed to educate, simulate, and connect citizens with public finance.</p>
        <div className="features__grid">
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span className="feature-card__tag">Learn</span>
            <h3>Knowledge Hub</h3>
            <p>Articles on tax policy, budget transparency, and civic rights — in plain, accessible language.</p>
            <Link to="/register" className="feature-card__link">Explore articles →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span className="feature-card__tag">Simulate</span>
            <h3>Budget Simulator</h3>
            <p>Allocate the national budget yourself and see how your choices score against real economic data.</p>
            <Link to="/register" className="feature-card__link">Try simulator →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="feature-card__tag">Participate</span>
            <h3>Budget Preference</h3>
            <p>Tell the government how you'd like your taxes spent — sector by sector, with real data behind it.</p>
            <Link to="/register" className="feature-card__link">Share preference →</Link>
          </div>
          <div className="feature-card" id="community">
            <div className="feature-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span className="feature-card__tag">Engage</span>
            <h3>Community Forum</h3>
            <p>Discuss public policy, share ideas, and connect with fellow citizens — transparently and openly.</p>
            <Link to="/register" className="feature-card__link">Join discussion →</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <span className="section-eyebrow">How it works</span>
        <h2 className="section-title">Three steps to civic engagement</h2>
        <div className="how__grid">
          <div className="how-step">
            <div className="how-step__num">1</div>
            <h3>Learn</h3>
            <p>Read articles and explore real budget and tax data from verified sources.</p>
          </div>
          <div className="how-step__arrow">→</div>
          <div className="how-step">
            <div className="how-step__num">2</div>
            <h3>Simulate</h3>
            <p>Try your own budget allocation and get scored against optimal economic models.</p>
          </div>
          <div className="how-step__arrow">→</div>
          <div className="how-step">
            <div className="how-step__num">3</div>
            <h3>Engage</h3>
            <p>Share your preferences and join community discussions on public policy.</p>
          </div>
        </div>
      </section>

      {/* IMPACT DATA */}
      <section className="impact" id="impact">
        <span className="section-eyebrow">Real impact data</span>
        <h2 className="section-title">Where your taxes go</h2>
        <p className="section-sub">Indonesia's 2024 State Budget — verified public data from Kemenkeu &amp; BPS.</p>
        <div className="impact__grid">
          <div className="impact__card">
            <span className="impact__card-num">20%</span>
            <span className="impact__card-title">Education</span>
            <span className="impact__card-sub">Mandatory allocation per UUD 1945</span>
            <span className="impact__card-source">Kemenkeu 2024</span>
          </div>
          <div className="impact__card">
            <span className="impact__card-num">Rp187T</span>
            <span className="impact__card-title">Infrastructure</span>
            <span className="impact__card-sub">Roads, ports, and connectivity</span>
            <span className="impact__card-source">APBN 2024</span>
          </div>
          <div className="impact__card">
            <span className="impact__card-num">Rp186T</span>
            <span className="impact__card-title">Social Protection</span>
            <span className="impact__card-sub">PKH, BPNT, and social programs</span>
            <span className="impact__card-source">APBN 2024</span>
          </div>
          <div className="impact__card">
            <span className="impact__card-num">Rp144T</span>
            <span className="impact__card-title">Healthcare</span>
            <span className="impact__card-sub">JKN, hospitals, and public health</span>
            <span className="impact__card-source">APBN 2024</span>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <span className="section-eyebrow">Community voices</span>
        <h2 className="section-title">What users are saying</h2>
        <div className="testimonials__grid">
          <div className="testimonial__card">
            <p className="testimonial__quote">
              "TaxVoice makes me feel connected to where my money goes.
              I can finally see the real benefits of paying taxes."
            </p>
            <div className="testimonial__author">
              <div className="testimonial__avatar">A</div>
              <div>
                <p className="testimonial__name">Andi</p>
                <p className="testimonial__role">Small Business Owner</p>
              </div>
            </div>
          </div>
          <div className="testimonial__card">
            <p className="testimonial__quote">
              "The simulator helped me understand why budget allocation is so
              complex — and my score improved every time I tried!"
            </p>
            <div className="testimonial__author">
              <div className="testimonial__avatar">S</div>
              <div>
                <p className="testimonial__name">Siti</p>
                <p className="testimonial__role">University Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Make an Impact?</h2>
        <p>Join Indonesians in building a more transparent, accountable country.</p>
        <Link to="/register" className="btn-primary-dark btn-primary-dark--lg">Sign Up — It's Free</Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__brand">TaxVoice</div>
        <nav className="footer__nav">
          <a href="#">About</a>
          <a href="#">FAQ</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </nav>
        <p className="footer__copy">© 2025 TaxVoice. Universitas Bengkulu.</p>
      </footer>

    </div>
  )
}