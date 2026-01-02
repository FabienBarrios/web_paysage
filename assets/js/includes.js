/**
 * Script pour charger dynamiquement le header et le footer
 * Permet de ne pas dupliquer le code HTML sur chaque page
 */

(function() {
  'use strict';

  /**
   * Charge un fichier HTML et l'insère dans un élément du DOM
   * @param {string} url - L'URL du fichier à charger (doit être de confiance)
   * @param {string} elementId - L'ID de l'élément où insérer le contenu
   *
   * SÉCURITÉ: Cette fonction charge uniquement des fichiers locaux de confiance.
   * Elle vérifie que l'URL ne contient pas de protocoles externes.
   */
  function loadHTML(url, elementId) {
    const element = document.getElementById(elementId);

    if (!element) {
      console.warn('Element with id "' + elementId + '" not found');
      return;
    }

    // Vérification basique de sécurité : s'assurer que l'URL est locale
    if (url.indexOf('://') !== -1 || url.indexOf('..') !== -1) {
      console.error('Security: Only local files are allowed');
      return;
    }

    fetch(url)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status);
        }
        return response.text();
      })
      .then(function(html) {
        // Utilisation de innerHTML pour les fichiers de confiance locaux uniquement
        // Ces fichiers (header.html, footer.html) font partie du site
        element.innerHTML = html;

        // Déclencher un événement personnalisé pour indiquer que le contenu est chargé
        const event = new CustomEvent('includeLoaded', {
          detail: { elementId: elementId, url: url }
        });
        document.dispatchEvent(event);
      })
      .catch(function(error) {
        console.error('Error loading ' + url + ':', error);
      });
  }

  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Charger le header
    loadHTML('header.html', 'header-placeholder');

    // Charger le footer
    loadHTML('footer.html', 'footer-placeholder');
  }
})();
