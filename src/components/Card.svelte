<script>
  export let cardInfo = {
      /*
    id: "651300",
    title: "PROVA",
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
  class="cardCustom grid grid-cols-3 grid-rows-7 grid-flow-row max-w-xs mx-auto overflow-hidden rounded-lg bg-gray-700 m-4"
>
  <div class="col-span-3 row-span-1">
    <div class="flex align-bottom flex-col leading-none p-2 pt-4">
      <div class="flex flex-row items-center">
        <h2 class="text-md flex items-center text-gray-200">
          {cardInfo.author}
        </h2>
      </div>
    </div>
  </div>

  <div class="col-span-3 row-span-1">
    <div class="leading-tight p-2">
      <h1 class="text-lg font-bold text-white">
        {cardInfo.title}
      </h1>
    </div>
  </div>

  <div class="col-span-3 row-span-1">
    <div class="leading-tight p-2">
      <p class="text-gray-200 text-sm">Year: {cardInfo.year}</p>
      <p class="text-gray-200 text-sm">Pages: {cardInfo.pages}</p>
      <p class="text-gray-200 text-sm">Type: {cardInfo.extension}</p>
      <p class="text-gray-200 text-sm">Language: {cardInfo.language}</p>
      <p class="text-gray-200 text-sm">
        Size: {Math.ceil(parseInt(cardInfo.size) * 0.0009765625) < 1000
          ? Math.ceil(parseInt(cardInfo.size) * 0.0009765625) + " kB"
          : Math.ceil(parseInt(cardInfo.size) * 0.00000095367432) + " MB"}
      </p>
    </div>
  </div>

  <div class="col-span-3 row-span-1">
    <div class="leading-tight p-2">
      <a
        class="block text-blue-400 font-bold p-2 rounded-md hover:bg-gray-600 transition-colors ease-out duration-100 w-max"
        href={cardInfo.mirrors[0] + cardInfo.link}
        target="_blank"
      >
        GO TO PAGE
      </a>
    </div>
  </div>
</div>

<style>
  .cardCustom {
    font-family: "Roboto", sans-serif;
  }
</style>
