<script>
  import { onMount } from "svelte"
  import queryString from "query-string"
  import { useNavigate } from "svelte-navigator"

  const navigate = useNavigate()

  import Card from "../components/Card.svelte"

  export let location
  let queryParams
  $: queryParams = queryString.parse(location.search)

  let wait = true
  let books = {}
  let bookTitle = ""
  onMount(async () => {
    books = await fetch("/api/search?q=" + queryParams.q).then((x) => x.json())
    wait = false
  })

  function manualSearch(event) {
    setTimeout(() => {
      if (event.key == "Enter" && bookTitle != "" && bookTitle.length >= 3) {
        navigate("/search?q=" + bookTitle, { replace: true })
      }
    }, 50)
  }
</script>

<main class="relative pt-14">
  {#if wait}
    <div class="absolute top-0 w-full min-h-screen flex items-center justify-center">
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
    <button
      class="text-blue-400 p-2 rounded hover:bg-gray-800 flex items-center content-center pr-5 mx-4 mt-2 z-10 absolute top-0 left-0"
      on:click={() => navigate(-1)}
    >
      <svg
        style="width:24px;height:24px"
        class="fill-current"
        viewBox="0 0 24 24"
      >
        <path
          d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
        />
      </svg>
      HOME
    </button>
    {#if books.results.length > 0}
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-2 mx-4"
      >
        {#each books.results as book (book.id)}
          <Card cardInfo={book} />
        {/each}
      </div>
    {:else}
      <div
        class="absolute top-0 w-full min-h-screen flex items-center justify-center flex-col"
      >
        <div
          class="flex content-center items-center justify-center text-white text-2xl mx-auto w-max mx-4 text center flex-wrap"
        >
          <svg
            class="mr-3 h-10 w-10 text-white fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"
            />
          </svg>
          BOOK NOT FOUND
        </div>
        <div class="mt-10">
          <h3 class="text-lg text-white text-center">
            Try searching manually:
          </h3>
          <div class="relative h-10 input-component empty mt-6">
            <input
              id="bookTitle"
              type="text"
              name="bookTitle"
              bind:value={bookTitle}
              on:keydown={manualSearch}
              class="h-full w-full border-2 px-2 transition-all border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-md focus:outline-none ring-offset-2"
            />
            <label
              for="bookTitle"
              class="absolute left-2 transition-all bg-transparent px-1"
            >
              Title
            </label>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</main>

<style>
  label {
    top: 0%;
    transform: translateY(-110%);
    font-size: 11px;
    color: rgba(37, 99, 235, 1);
    font-weight: bold;
  }
  .empty input:not(:focus) + label {
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
  }
  input:not(:focus) + label {
    color: rgba(70, 70, 70, 1);
  }
  input {
    border-width: 1px;
  }
  input:focus {
    outline: none;
    border-color: rgba(37, 99, 235, 1);
  }
</style>
