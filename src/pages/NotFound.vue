<script setup>

</script>

<template>
  <main class="container not-found">
    <article>
      <hgroup>
        <h1>Ma'aser Money</h1>
        <h3>Earn responsibly</h3>
      </hgroup>
      <br />
    <div class="stack">
      <h1 class="huge">404</h1>
      <h3>This page can't be tracked</h3>
      <p>But your ma'aser can</p>
      <a role="button" href="/auth">Log in</a>
    </div>
  </article>
  </main>
</template>

<style scoped>

  .not-found {
    height: 100vh;
    display: flex;
    justify-content: center;
  }

  .stack {
    display: block;
    text-align: center;
  }

  .huge {
    font-size: 10rem;
    margin-bottom: 0px;
    line-height: 10rem;
  }

  h1, h3 {
    display: flex;
    justify-content: center;
  }

  @media (min-width: 768px) {
    article {
      width: 80%
  }
  }
</style>