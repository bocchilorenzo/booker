<script>
  import { Router, Route } from "svelte-navigator"
  import Home from "./pages/Home.svelte"
  import Search from "./pages/Search.svelte"
  import Footer from "./components/Footer.svelte"
  import { Modal } from "svelte-chota"
  import { onMount } from "svelte"

  let modal_open = false,
    connected = false,
    res,
    show = true

  function handleModal() {
    modal_open = !modal_open
  }
  onMount(async () => {
    res = await fetch("https://booker-libgen.herokuapp.com/wake").then((x) =>
      x.json()
    )
    if (res.status == 200) {
      connected = true
      setTimeout(() => {
        show = false
      }, 4000)
    }
  })
</script>

<Router>
  <main class="container mx-auto relative min-h-screen">
    <Route path="/">
      {#if show}
        <div
          class="mx-4 mt-2 absolute text-white flex content-center items-center gap-x-1 text-sm roboto"
        >
          <span
            class={connected
              ? "h-3 w-3 rounded-full cursor-pointer focus:outline-none bg-green-400"
              : "h-3 w-3 rounded-full cursor-pointer focus:outline-none bg-yellow-400 animate-pulse"}
          />
          <span>
            {connected ? "Connected" : "Connecting to the server"}
          </span>
        </div>
      {/if}
      <Home allow={connected} />
    </Route>
    <Route path="search" component={Search} />
    <Modal bind:open={modal_open}>
      <div class="p-2 bg-gray-700 text-white">
        <h1 class="text-lg font-bold text-blue-400">Disclaimer</h1>
        <hr />
        <p class="roboto">
          This web app (Booker) or it's authors do not host or directly link to
          any pirated content.
          <br /><br />
          Any of the links mentioned by this web app (Booker) or it's authors are
          purely for reference use.
          <br /><br />
          This web app (Booker) or it's authors do not support use of any form of
          piracy.
          <br /><br />
          This web app (Booker) is for educational purposes only and is not intended
          to support copyright infringement. I am not responsible for any misuse
          of this web app or its source code.
        </p>
      </div>
    </Modal>
    <Footer on:modal={handleModal} />
  </main>
</Router>

<style>
  .roboto {
    font-family: "Roboto", sans-serif;
  }
</style>
