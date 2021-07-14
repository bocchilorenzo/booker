<script>
  export let cardInfo = {
    /*
    id: "651300",
    title: "PROVA titolo lungo",
    author: "AUTORE",
    mirrors: ["https://libgen.is", "http://gen.lib.rus.ec"],
    link: "/book/index.php?md5=3728e3386289e22",
    extension: "pdf",
    size: "761731",
    language: "English",
    pages: "69",
    year: "1999",
    */
  }
</script>

<div
  class="cardCustom grid grid-cols-3 w-full overflow-hidden rounded-lg bg-gray-700"
>
  <div class="col-span-3">
    <h2 class="text-md text-gray-200 px-2 sm:p-2 pt-4">
      {cardInfo.author}
    </h2>
  </div>

  <div class="col-span-3">
    <div class="leading-tight px-2 sm:p-2">
      <h1 class="text-lg font-bold text-white">
        {cardInfo.title}
      </h1>
    </div>
  </div>

  <div class="col-span-3">
    <div class="leading-tight px-2 sm:p-2">
      <p class="text-gray-200 text-sm">
        {cardInfo.year}, {cardInfo.pages} pages, {cardInfo.extension}, {cardInfo.language},
        {Math.ceil(parseInt(cardInfo.size) * 0.0009765625) < 1000
          ? Math.ceil(parseInt(cardInfo.size) * 0.0009765625) + " kB"
          : Math.ceil(parseInt(cardInfo.size) * 0.00000095367432) + " MB"}
      </p>
    </div>
  </div>

  <div class="col-span-3">
    <div class="leading-tight p-2">
      <div class="flow-root">
        <a
          class="float-right block text-blue-400 font-bold p-2 rounded-md hover:bg-gray-600 transition-colors ease-out duration-100 w-max focus:bg-gray-600 focus:outline-none"
          href={cardInfo.mirrors[0] + cardInfo.link}
          target="_blank"
        >
          GO TO PAGE
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .cardCustom {
    font-family: "Roboto", sans-serif;
  }
</style>
