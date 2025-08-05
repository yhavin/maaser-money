<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="landing-nav">
      <div class="container">
        <div class="nav-content">
          <div class="logo-section" @click="goToLanding">
            <img src="/img/icons/logo-circle.png" alt="Ma'aser Money Logo" class="nav-logo">
            <span class="brand-name">Ma'aser Money</span>
          </div>
          <div class="nav-buttons grid">
            <button @click="goToLogin" class="nav-btn secondary">Log in</button>
            <button @click="goToSignUp" class="nav-btn primary">Sign up</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1>Track your ma'aser with confidence</h1>
            <p class="hero-subtitle">
              No more messy spreadsheets. Start using the world's most intuitive ma'aser tracker.
            </p>
            <div class="hero-actions">
              <button @click="goToSignUp" class="cta-primary">Start tracking</button>
            </div>
          </div>
            <div class="hero-visual">
            <div class="hero-logo-container">
              <img src="/img/icons/logo-circle-large.png" alt="Ma'aser Money" class="hero-logo-glow">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <!-- <div class="section-header">
          <h2>Everything You Need</h2>
        </div> -->
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/img/icons/income.svg" alt="Income Tracking">
            </div>
            <h3>Income tracking</h3>
            <p>Log all income items with automatic currency conversion and recurring schedules.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/img/icons/deduction.svg" alt="Tax Deductions">
            </div>
            <h3>Smart deductions</h3>
            <p>Adjust your ma'aser obligation if you have business expenses or deductible items.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/img/icons/donation.svg" alt="Donation Tracking">
            </div>
            <h3>Donation management</h3>
            <p>Record donations with automatic currency conversion and recurring schedules.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/img/icons/dollar-sign.svg" alt="Real-time Balance">
            </div>
            <h3>Real-time balance</h3>
            <p>Always know exactly how much you owe with live balance calculation.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/img/icons/mobile.svg" alt="Mobile Device">
            </div>
            <h3>Works anywhere</h3>
            <p>Progressive Web App that works seamlessly on desktop, tablet, and mobile devices.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <img src="/img/icons/security.svg" alt="Security">
            </div>
            <h3>Secure and private</h3>
            <p>Your financial data is encrypted and stored securely with Firebase.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2>How it works</h2>
        </div>
        <div class="steps-grid">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Track your income</h3>
            <p>Add your salary, freelance work, and any other income sources. Set up automatic schedules for recurring income.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Record deductions</h3>
            <p>If you need, log business expenses and deductible items to ensure you're calculating ma'aser on your true net income.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Make donations</h3>
            <p>Record your donations and watch your balance update in real-time. Set up automatic schedules for recurring donations.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq">
      <div class="container">
        <div class="section-header">
          <h2>Frequently asked questions</h2>
        </div>
        <div class="faq-grid">
          <div class="faq-item">
            <h3>What is ma'aser?</h3>
            <p>Ma'aser is the Jewish mitzvah (biblical commandment) of giving 10% of one's income to charity.</p>
          </div>
          <div class="faq-item">
            <h3>Can I give more than 10%?</h3>
            <p>Yes. For every income item, you can choose what percentage you want to give, such as 15%, 20%, or whatever you want.</p>
          </div>
          <div class="faq-item">
            <h3>Do I have to enter everything manually?</h3>
            <p>No. If you earn a regular salary or make recurring donations, you can set up schedules and the income and ma'aser items will be created automatically.</p>
          </div>
          <div class="faq-item">
            <h3>Does it work on mobile devices?</h3>
            <p>Yes! Ma'aser Money works seamlessly on all devices and can be installed as an icon on your home screen by pressing "Add to Home Screen" or similar depending on your device.</p>
          </div>
          <div class="faq-item">
            <h3>Can you connect to my bank account?</h3>
            <p>At the momennt, Ma'aser Money does not connect to your bank. All transactions are put into the app directly, either as one-off entries or on automatic schedules.</p>
          </div>
          <div class="faq-item">
            <h3>Can I export my data?</h3>
            <p>Yes, you can export all your transaction data to CSV format for record-keeping or tax preparation purposes.</p>
          </div>
          <div class="faq-item">
            <h3>What does it cost?</h3>
            <p>Ma'aser Money is completely free to use. We believe everyone should have access to tools that help them fulfil this beautiful mitzvah.</p>
          </div>
          <div class="faq-item">
            <h3>Is my financial data secure?</h3>
            <p>Yes, absolutely. We use Firebase's enterprise-grade security with encrypted data storage and secure authentication. Your financial information is never shared or sold.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta">
      <div class="container">
        <div class="cta-content">
          <h2>Ready?</h2>
          <p>Start tracking your ma'aser with confidence and precision.</p>
          <button @click="goToSignUp" class="cta-primary large">Get started</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="container">
        <div class="footer-content">
          <FooterActions />
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import FooterActions from '../components/FooterActions.vue'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToSignUp = () => {
  router.push('/signup')
}

const goToLanding = () => {
  window.scrollTo(0, 0)
}
</script>

<style scoped>
/* Landing Page Specific Styles */

/* General section spacing */
section {
  margin-bottom: 2rem;
}

/* Navigation */
.landing-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 137, 123, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0.75rem 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  min-height: 50px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.nav-logo {
  width: 40px;
  height: 40px;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 200;
  color: var(--primary);
}

.nav-buttons {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.5rem;
  align-items: center;
  height: 70%;
}

.nav-btn {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  height: auto;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.nav-btn.secondary {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.nav-btn.secondary:hover {
  background: var(--primary-focus);
}

.nav-btn.primary {
  background: var(--primary);
  color: white;
  border: 1px solid var(--primary);
}

.nav-btn.primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

/* Hero Section */
.hero {
  margin-top: 94px;
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8fffe 0%, #e8f5f3 100%);
  min-height: 75vh;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.hero-text h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  /* color: #2c3e50; */
  color: var(--primary);
  font-weight: 900;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #5a6c7d;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 0;
  align-items: flex-start;
  justify-content: flex-start;
}

.hero-actions .cta-primary {
  width: auto;
  min-width: 250px;
}

.cta-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-width: 180px;
}

.cta-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 137, 123, 0.3);
}

.cta-primary.large {
  padding: 1rem;
  font-size: 1.1rem;
  height: auto;
  width: auto;
  margin: 0 auto;
}

.cta-secondary {
  color: var(--primary);
  text-decoration: none;
  padding: calc(1rem - 2px);
  border: 2px solid var(--primary);
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-width: 180px;
  font-size: 1.1rem;
}

.cta-secondary:hover {
  background: var(--primary-focus);
  color: var(--primary);
}

.hero-note {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

/* Hero Visual */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}

.hero-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 137, 123, 0.08) 0%, rgba(0, 137, 123, 0.06) 25%, rgba(0, 137, 123, 0.04) 40%, rgba(0, 137, 123, 0.025) 50%, rgba(0, 137, 123, 0.015) 58%, rgba(0, 137, 123, 0.01) 64%, rgba(0, 137, 123, 0.007) 69%, rgba(0, 137, 123, 0.005) 73%, rgba(0, 137, 123, 0.003) 76%, rgba(0, 137, 123, 0.002) 79%, rgba(0, 137, 123, 0.0015) 82%, rgba(0, 137, 123, 0.001) 85%, rgba(0, 137, 123, 0.0007) 87%, rgba(0, 137, 123, 0.0005) 89%, rgba(0, 137, 123, 0.0003) 91%, rgba(0, 137, 123, 0.0002) 93%, rgba(0, 137, 123, 0.0001) 95%, rgba(0, 137, 123, 0.00005) 97%, transparent 100%);
  position: relative;
}

.hero-logo-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 137, 123, 0.12) 0%, rgba(0, 137, 123, 0.09) 20%, rgba(0, 137, 123, 0.06) 35%, rgba(0, 137, 123, 0.04) 45%, rgba(0, 137, 123, 0.025) 52%, rgba(0, 137, 123, 0.018) 58%, rgba(0, 137, 123, 0.012) 63%, rgba(0, 137, 123, 0.008) 67%, rgba(0, 137, 123, 0.005) 71%, rgba(0, 137, 123, 0.003) 74%, rgba(0, 137, 123, 0.002) 77%, rgba(0, 137, 123, 0.0015) 80%, rgba(0, 137, 123, 0.001) 83%, rgba(0, 137, 123, 0.0007) 85%, rgba(0, 137, 123, 0.0005) 87%, rgba(0, 137, 123, 0.0003) 89%, rgba(0, 137, 123, 0.0002) 91%, rgba(0, 137, 123, 0.0001) 93%, rgba(0, 137, 123, 0.00005) 95%, transparent 100%);
}

.hero-logo-glow {
  width: 200px;
  height: 200px;
  z-index: 1;
  position: relative;
  filter: drop-shadow(0 0 15px rgba(0, 137, 123, 0.25));
}


/* Features Section */
.features {
  padding: 3rem 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.section-header p {
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #f3f4f6;
  text-align: center;
  transition: all 0.2s ease;
}

.feature-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 137, 123, 0.1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: var(--primary-focus);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
}

.feature-icon img {
  width: 30px;
  height: 30px;
  filter: brightness(0) saturate(100%) invert(44%) sepia(54%) saturate(500%) hue-rotate(142deg) brightness(95%) contrast(89%);
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* How It Works */
.how-it-works {
  padding: 3rem 0;
  background: #f8fffe;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.step {
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
}

.step h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.step p {
  color: #6b7280;
  line-height: 1.6;
  max-width: 300px;
  margin: 0 auto;
}

/* FAQ */
.faq {
  padding: 3rem 0;
  background: white;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.faq-item {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 0.75rem;
}

.faq-item h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.faq-item p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Final CTA */
.final-cta {
  padding: 3rem 0;
  background: var(--primary);
  color: white;
  text-align: center;
  margin-bottom: 0;
}

.final-cta .cta-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.final-cta .cta-content p {
  color: rgba(255, 255, 255, 0.9);
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
}

.cta-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.final-cta .cta-primary {
  background: white;
  color: var(--primary);
}

.final-cta .cta-primary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Footer */
.landing-footer {
  background: #f8f9fa;
  padding: 2rem 0;
  border-top: 1px solid #e9ecef;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-logo {
  display: block;
  width: 60px;
  height: 60px;
  margin: 1rem auto;
}

.footer-copyright {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    margin-top: 60px;
    padding: 2rem 0 1.5rem;
    min-height: 85vh;
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
    padding: 0 1rem;
  }
  
  .hero-visual {
    order: -1;
  }
  
  .hero-logo-container {
    width: 200px;
    height: 200px;
  }
  
  .hero-logo-container::before {
    width: 180px;
    height: 180px;
  }
  
  .hero-logo-glow {
    width: 120px;
    height: 120px;
  }
  
  .hero-text h1 {
    font-size: 2.2rem;
    margin-bottom: 0.75rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .hero-actions .cta-primary {
    width: auto;
    text-align: center;
    min-width: 200px;
  }
  
  .brand-name {
    font-size: 1.1rem;
    margin-top: 4px;
  }
  
  .landing-nav {
    padding: 0.5rem 0;
  }
  
  .nav-content {
    min-height: 44px;
  }
  
  .nav-buttons {
    gap: 0.5rem;
  }
  
  .nav-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .footer-logo {
    width: 50px;
    height: 50px;
  }
  
  .features {
    padding: 2rem 0;
  }
  
  .how-it-works {
    padding: 2rem 0;
  }
  
  .faq {
    padding: 2rem 0;
  }
  
  .final-cta {
    padding: 2rem 0;
  }
  
  .features-grid,
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style>