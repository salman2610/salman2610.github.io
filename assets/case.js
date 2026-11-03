(function(){document.documentElement.className+=" js";
function go(){var els=document.querySelectorAll(".rv");
if(!("IntersectionObserver" in window)){for(var i=0;i<els.length;i++)els[i].classList.add("in");return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px",threshold:.08});
for(var j=0;j<els.length;j++)io.observe(els[j]);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();
