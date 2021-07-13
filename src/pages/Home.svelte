<script>
  import { navigate } from "svelte-navigator"
  import Quagga from "quagga"
  let error = ""
  let devices = []

  let cameraOn = false,
    waitQuagga = true

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
    cameraOn = true
    setTimeout(() => {
      initialize()
    }, 100)
  }

  function initialize() {
    waitQuagga = false
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
      navigate("/search?q=" + foundEan, { replace: false })
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

  function bypass() {
    //Quagga.stop()
    navigate("/search?q=9780451527103", { replace: false })
  }
</script>

<main class="mx-2 flex items-center justify-center flex-col h-screen">
  {#if !cameraOn}
    <header class="mb-10">
      <h1 class="text-blue-400 font-bold text-3xl text-center">Booker</h1>
      <h2 class="text-white text-lg text-center">
        Find books on libgen by scanning their barcode
      </h2>
    </header>
    <button
      on:click={startProcess}
      class="rounded-full w-40 h-40 border-8 border-blue-400 text-blue-400 font-bold text-3xl glow-blue-300-md mx-auto"
      id="scan"
    >
      START
    </button>
  {:else}
    {#if waitQuagga}
      <h1 class="text-xl text-center text-white">PLEASE WAIT...</h1>
    {/if}
    <h1 class="text-xl text-center text-white">Frame the barcode</h1>
    <div id="showCamera" class="w-max mx-auto max-w-full" />
  {/if}
  <button on:click={bypass} class="text-white">Bypass</button>
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
    /* For each color (blue-100 here), for each sizes (styles) from `md`, `lg`, `xl` and `2xl`. */
    box-shadow: 0 0px 8px -1px #93c5fd, 0 0px 6px -1px #93c5fd;
  }
</style>