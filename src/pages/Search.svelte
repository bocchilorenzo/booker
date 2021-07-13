<script>
  import { onMount } from "svelte"
  import queryString from "query-string"

  import Card from "../components/Card.svelte"

  export let location
  let queryParams
  $: queryParams = queryString.parse(location.search)

  let wait = true
  let books = []
  onMount(async () => {
    books = await fetch("/api/search?q=" + queryParams.q).then((x) => x.json())
    wait = false
  })
</script>

<main class="">
  {#if wait}
    <div class="min-h-screen flex items-center justify-center">
      <div
        class="flex content-center items-center justify-center text-white text-2xl mx-auto w-max mx-4 text center flex-wrap"
      >
        <svg
          class="animate-spin mr-3 h-10 w-10 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        SEARCHING...
      </div>
    </div>
  {:else}
    <div class="flex justify-between flex-wrap content-center items-center">
      {#each books.results as book (book.id)}
        <Card cardInfo={book} />
      {/each}
    </div>
  {/if}
</main>
