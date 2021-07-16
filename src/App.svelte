<script>
  import { Router, Route } from "svelte-navigator"
  import Home from "./pages/Home.svelte"
  import Search from "./pages/Search.svelte"
  import Footer from "./components/Footer.svelte"
  import { Modal } from "svelte-chota"
  let modal_open = false
  function handleModal() {
    modal_open = !modal_open
  }
</script>

<Router>
  <main class="container mx-auto relative min-h-screen">
    <Route path="/" component={Home} />
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
