document.body.classList.add("loading");

const MIN_LOADER_TIME = 7000;
const startTime = Date.now();

window.addEventListener("load", function () {
  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsedTime);

  setTimeout(function () {
    const loader = document.getElementById("loader-container");
    loader.classList.add("hidden");

    setTimeout(function () {
      loader.style.display = "none";

      document.body.classList.remove("loading");

      console.log("Loader completado - Página principal lista");
    }, 800);
  }, remainingTime);
});
