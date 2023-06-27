<script setup>
  import { ref, onMounted } from "vue"
  import { timeZonesToCountries } from "../assets/timeZones.js"


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
    // window.open(paymentLink, "_blank")
  }
</script>

<template>
  <span class="gutter-text">Feedback and suggestions welcome by&nbsp;<a href="mailto:y.havin@gmail.com?subject=Ma%27aser%20app%20feedback">email</a></span>
  <span class="gutter-text"><a :href="paymentLink" target="_blank">Donate to support this app <span>❤️</span></a></span>
</template>

<style scoped>
  a {
    cursor: pointer;
  }

  .gutter-text {
    font-size: 13px;
    display: flex;
    justify-content: center;
  }
</style>