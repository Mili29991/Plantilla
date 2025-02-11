document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("download-pdf").addEventListener("click", function () {
      const { jsPDF } = window.jspdf;
      let pdf = new jsPDF("p", "mm", "a4");

      let content = document.querySelector(".max-w-4xl.mx-auto.bg-white.p-6.shadow-md");

      let inputs = content.querySelectorAll("input, textarea");
      let inputValues = [];
      inputs.forEach(input => {
          inputValues.push({ element: input, value: input.value });
          let span = document.createElement("span");
          span.textContent = input.value;
          span.style.cssText = "display: inline-block; width: " + input.offsetWidth + "px; min-height: " + input.offsetHeight + "px;";
          input.replaceWith(span);
      });

      html2canvas(content, {
          scale: 2,
          useCORS: true
      }).then(canvas => {
          let imgWidth = 210;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;
          let pageHeight = 298;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft > 0) {
              position -= pageHeight;
              pdf.addPage();
              pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
          }

          pdf.save("evaluacion_desempeno.pdf");

          // Reiniciar la página después de guardar el PDF
          setTimeout(() => { // Esperar un poco para asegurar la descarga
              window.location.reload();
          }, 500); // 500 milisegundos (medio segundo) de espera

      }).catch(error => {
          console.error("Error al generar el PDF:", error);
      }).finally(() => {
          // Restablecer los inputs/textareas (independientemente del éxito o fallo)
          inputs.forEach(item => {
              let span = item.nextSibling;
              item.style.display = "block"; // o el display original del elemento
              span.remove();
          });
      });
  });
});