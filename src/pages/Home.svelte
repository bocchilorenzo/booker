<script>
  import { navigate } from "svelte-navigator"
  import Quagga from "quagga"
  let error = "",
    devices = [],
    cameraOn = false,
    removeThumbnail = false,
    showMsg = false

  export let allow

  function showWarning() {
    showMsg = true
    setTimeout(() => {
      showMsg = false
    }, 4000)
  }

  async function _populateCameraDevices() {
    let videoDevices = await Quagga.CameraAccess.enumerateVideoDevices(),
      selectedDeviceLabel = Quagga.CameraAccess.getActiveStreamLabel()
    devices = videoDevices.map(({ id, deviceId, label }) => ({
      id: id || deviceId,
      label: label || id || deviceId,
    }))
    selectedDeviceLabel = devices.find(
      (dev) => dev.label === selectedDeviceLabel
    )
  }

  function startProcess() {
    if (allow) {
      cameraOn = true
      setTimeout(() => {
        initialize()
      }, 50)
    } else {
      showWarning()
    }
  }

  function initialize() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#showCamera"),
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
          },
          singleChannel: false,
        },
        decoder: {
          readers: ["ean_reader"],
          multiple: false,
        },
        numOfWorkers: 4,
        frequency: 10,
        debug: false,
      },
      function (err) {
        if (err) {
          console.log(err)
          error = err
          return
        }
        _populateCameraDevices()
        Quagga.start()
      }
    )

    Quagga.onDetected((result) => {
      let foundEan = result.codeResult.code
      Quagga.stop()
      removeThumbnail = true
      setTimeout(() => {
        navigate("/search?q=" + foundEan, { replace: false })
      }, 50)
    })

    Quagga.onProcessed(function (result) {
      if (!result) {
        return
      }
      let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width")),
          parseInt(drawingCanvas.getAttribute("height"))
        )
        result.boxes
          .filter(function (box) {
            return box !== result.box
          })
          .forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: "green",
              lineWidth: 2,
            })
          })
      }
      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
          color: "#00F",
          lineWidth: 2,
        })
      }
      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(
          result.line,
          { x: "x", y: "y" },
          drawingCtx,
          { color: "red", lineWidth: 3 }
        )
      }
    })
    return () => {
      Quagga.stop()
    }
  }

  function goHome() {
    Quagga.stop()
    cameraOn = false
  }
  /*
  function bypass() {
    //Quagga.stop()
    navigate("/search?q=9780899663685", { replace: false })
  }
  */
</script>

<main class="mx-4 flex items-center justify-center flex-col h-screen">
  {#if !cameraOn}
    <header class="mb-10">
      <div
        class="text-blue-400 flex content-center items-center justify-center"
      >
        <svg class="fill-current w-8 h-8 mr-2" viewBox="0 0 24 24">
          <path
            d="M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M3,19V6H11V19H3M21,19H13V6H21V19M14,9.5H20V11H14V9.5M14,12H20V13.5H14V12M14,14.5H20V16H14V14.5Z"
          />
        </svg>
        <h1 class="font-bold text-3xl text-center focus:outline-none">
          Booker
        </h1>
      </div>
      <h2 class="text-white text-lg text-center roboto">
        Find books on libgen by scanning their barcode
      </h2>
    </header>
    <button
      on:click={startProcess}
      class="rounded-full w-32 h-32 border-8 border-blue-400 text-blue-400 font-bold text-2xl glow-blue-300-md mx-auto focus:outline-none"
      id="scan"
      tabindex="0"
    >
      START
    </button>
    {#if showMsg}
      <p class="text-yellow-400 mt-4 roboto">Wait for the server to be connected</p>
    {/if}
  {:else}
    <button
      class="text-blue-400 p-2 rounded hover:bg-gray-700 focus:outline-none flex items-center content-center pr-4 mx-4 mt-2 z-10 absolute top-0 left-0"
      on:click={() => goHome()}
    >
      <svg
        style="width:24px;height:24px"
        class="fill-current"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z"
        />
      </svg>
      HOME
    </button>
    <h1 class="text-xl text-center text-white">Frame the barcode</h1>
    {#if !removeThumbnail}
      <div id="showCamera" class="w-max mx-auto max-w-full" />
    {/if}
  {/if}
  <!--
  <button on:click={bypass} class="text-white">Bypass</button>
  -->
</main>

<style>
  #showCamera {
    position: relative;
  }

  :global(#showCamera > *) {
    max-width: 100% !important;
  }

  :global(#showCamera canvas) {
    position: absolute;
    top: 0;
    left: 0;
  }

  .glow-blue-300-md {
    box-shadow: 0 0px 8px -1px #93c5fd, 0 0px 6px -1px #93c5fd;
  }

  .roboto {
    font-family: "Roboto", sans-serif;
  }
</style>
