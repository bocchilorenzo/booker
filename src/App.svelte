<script>
  import { Router, Route } from "svelte-navigator"
  import Home from "./pages/Home.svelte"
  import Search from "./pages/Search.svelte"
</script>

<Router>
  <main class="container mx-auto">
    <Route path="/" component={Home} />
    <Route path="search" component={Search} />
  </main>
</Router>

<style>
</style>
