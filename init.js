// Roda antes da página aparecer, para evitar "piscadas"
(function () {
  var d = document.documentElement;
  d.classList.add("js");
  // a abertura aparece uma vez por visita (e nunca com "reduzir movimento")
  try {
    if (sessionStorage.getItem("intro-vista") || matchMedia("(prefers-reduced-motion: reduce)").matches) d.classList.add("no-loader");
  } catch (e) { d.classList.add("no-loader"); }
})();
