<script setup>
import { useRouter } from 'vue-router'
import FooterActions from '../components/FooterActions.vue'

const router = useRouter()

const goToLanding = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToSignUp = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="not-found-page">
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

    <!-- 404 Content -->
    <section class="error-section">
      <div class="container">
        <div class="error-content">
          <div class="error-visual">
            <div class="error-logo-container">
              <img src="/img/icons/logo-circle-large.png" alt="Ma'aser Money" class="error-logo">
            </div>
          </div>
          <div class="error-text">
            <h1 class="error-number">404</h1>
            <h2>This page can't be tracked</h2>
            <p class="error-subtitle">
              But your ma'aser can. Let's get you back on track.
            </p>
            <div class="error-actions">
              <button @click="goToLanding" class="cta-primary">Go home</button>
              <button @click="goToLogin" class="cta-secondary">Log in</button>
            </div>
          </div>
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

<style scoped>
/* Navigation - Copied from Landing.vue */
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

/* Error Section */
.error-section {
  margin-top: 94px;
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8fffe 0%, #e8f5f3 100%);
  min-height: 75vh;
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.error-content {
  display: grid;
  grid-template-columns: 0.6fr 1.4fr;
  gap: 4rem;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.error-text {
  text-align: left;
}

.error-number {
  font-size: 8rem;
  line-height: 1;
  margin-bottom: 0.5rem;
  margin-top: 0;
  color: var(--primary);
  font-weight: 900;
}

.error-text h2 {
  font-size: 2.5rem;
  line-height: 1.1;
  margin-bottom: 1rem;
  margin-top: 0;
  color: var(--primary);
  font-weight: 700;
}

.error-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #5a6c7d;
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.cta-primary {
  background: var(--primary);
  color: white;
  border: 1px solid var(--primary);
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
  min-width: 140px;
}

.cta-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 137, 123, 0.3);
}

.cta-secondary {
  color: var(--primary);
  background: transparent;
  border: 2px solid var(--primary);
  padding: calc(1rem - 2px);
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  min-width: 140px;
  font-size: 1.1rem;
  cursor: pointer;
}

.cta-secondary:hover {
  background: var(--primary-focus);
  color: var(--primary);
}

/* Error Visual */
.error-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}

.error-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 137, 123, 0.08) 0%, rgba(0, 137, 123, 0.06) 25%, rgba(0, 137, 123, 0.04) 40%, rgba(0, 137, 123, 0.025) 50%, rgba(0, 137, 123, 0.015) 58%, rgba(0, 137, 123, 0.01) 64%, rgba(0, 137, 123, 0.007) 69%, rgba(0, 137, 123, 0.005) 73%, rgba(0, 137, 123, 0.003) 76%, rgba(0, 137, 123, 0.002) 79%, rgba(0, 137, 123, 0.0015) 82%, rgba(0, 137, 123, 0.001) 85%, rgba(0, 137, 123, 0.0007) 87%, rgba(0, 137, 123, 0.0005) 89%, rgba(0, 137, 123, 0.0003) 91%, rgba(0, 137, 123, 0.0002) 93%, rgba(0, 137, 123, 0.0001) 95%, rgba(0, 137, 123, 0.00005) 97%, transparent 100%);
  position: relative;
}

.error-logo-container::before {
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

.error-logo {
  width: 200px;
  height: 200px;
  z-index: 1;
  position: relative;
  filter: drop-shadow(0 0 15px rgba(0, 137, 123, 0.25));
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-section {
    margin-top: 60px;
    padding: 1rem 0;
    min-height: 85vh;
    align-items: flex-start;
    padding-top: 2rem;
  }
  
  .error-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
    padding: 0 1rem;
    align-items: flex-start;
  }

  .error-text {
    text-align: center;
  }
  
  .error-visual {
    order: -1;
  }
  
  .error-logo-container {
    width: 200px;
    height: 200px;
  }
  
  .error-logo-container::before {
    width: 180px;
    height: 180px;
  }
  
  .error-logo {
    width: 120px;
    height: 120px;
  }
  
  .error-number {
    font-size: 5rem;
  }
  
  .error-text h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .error-subtitle {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .error-actions button {
    width: 100%;
    max-width: 250px;
  }
  
  .brand-name {
    display: none;
  }
  
  .landing-nav {
    padding: 0.5rem 0;
  }
  
  .nav-content {
    min-height: 44px;
  }
  
  .nav-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
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
</style>