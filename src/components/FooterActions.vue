<script setup>
  import { ref, onMounted } from "vue"
  import { timeZonesToCountries } from "../utils/timeZones.js"


  onMounted(() => {
    getPaymentLink()
  })
  
  const paymentLink = ref()

  const getPaymentLink = () => {
    let userCountry

    if (Intl) {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      userCountry = timeZonesToCountries[userTimeZone]
    }

    const paymentLinks = {
      "United States": "https://donate.stripe.com/00g3g17T3ge58lG4gh",
      "Australia": "https://donate.stripe.com/dR69Ep1uFfa18lG144",
      "Britain (UK)": "https://donate.stripe.com/dR62bX4GRaTL1Xi3ce",
      "Israel": "https://donate.stripe.com/8wMcQB1uF1jb31m5kn"
    }

    const country = paymentLinks.hasOwnProperty(userCountry) ? userCountry : "United States"
    paymentLink.value = paymentLinks[country]
  }
</script>

<template>
  <div class="footer-actions">
    <span class="gutter-text">Feedback and bug reports welcome by&nbsp;<a href="mailto:y.havin@gmail.com?subject=Ma%27aser%20Money%20feedback">email</a></span>
    <span class="gutter-text"><a :href="paymentLink" target="_blank">Donate to support this app <span>❤️</span></a></span>
    <img src="/img/icons/logo-circle.png" alt="Ma'aser Money" class="footer-logo">
    <p class="footer-copyright">&copy; 2025 Ma'aser Money</p>
  </div>
</template>

<style scoped>
  .footer-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  a {
    cursor: pointer;
  }

  .gutter-text {
    font-size: 13px;
    display: flex;
    justify-content: center;
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
    font-size: 13px;
    text-align: center;
  }

  @media (max-width: 767px) {
    .footer-logo {
      width: 50px;
      height: 50px;
    }
  }
</style>