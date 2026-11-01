(() => {
  "use strict";
  const measurementId = window.LMK_CONFIG?.gaMeasurementId?.trim() || "";
  window.lmkTrack = () => {};
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  const safePageLocation = () => {
    try {
      const url = new URL(location.href);
      const rawHash = url.hash.slice(1);
      const separator = rawHash.indexOf("~");
      if (separator > 0) url.hash = "#" + rawHash.slice(0,separator);
      return url.toString();
    } catch (_) { return location.origin + location.pathname; }
  };
  window.gtag("config", measurementId, {anonymize_ip: true, page_location: safePageLocation()});
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.lmkTrack = (eventName, parameters = {}) => {
    window.gtag("event", eventName, {...parameters, page_location: safePageLocation()});
  };
})();
