<template>
  <div id="window-warning">
    <h1>This website is optimized for desktops</h1>
    <p>
      Please visit this website using a computer/laptop or increase your window
      size.
    </p>
  </div>
</template>

<script>
export default {
  name: "WindowWarning"
};
</script>

<style>
#window-warning {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 50;
  background-color: var(--black);
  padding: var(--page-padding);
}

#window-warning p {
  color: var(--light-grey);
  margin-top: var(--padding-top);
}
</style>
