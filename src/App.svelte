<script>
  import { onMount, createEventDispatcher } from "svelte"
  import Quagga from "quagga"
  let dispatch = createEventDispatcher()
  let status = ""
  let error = ""
  let devices = []

  var resultCollector = Quagga.ResultCollector.create({
    capture: true, // keep track of the image producing this result
    capacity: 20, // maximum number of results to store
    filter: function (codeResult) {
      // only store results which match this constraint
      // returns true/false
      // e.g.: return codeResult.format === "ean_13";
      return true
    },
  })

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

  onMount(() => {
    status = "Preparing scan..."

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
    Quagga.registerResultCollector(resultCollector)

    Quagga.onDetected((result) => {
      let foundEan = result.codeResult.code
      Quagga.stop()
      status = "Found EAN" + foundEan
      setTimeout(() =>
        dispatch("ean", {
          ean: foundEan,
          imageSrc: Quagga.canvas.dom.image.toDataURL(),
        })
      )
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
  })

  function stopScan() {
    Quagga.stop()
    console.log(resultCollector.getResults())
  }
</script>

<main>
  <p>{status}</p>
  <div id="showCamera" />
  <button type="button" on:click={stopScan}>Stop scanning</button>
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
</style>
