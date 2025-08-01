export const convertHtmlToAstrologyJson = (htmlString) => {
  if (!htmlString || typeof htmlString !== 'string') {
    return null;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // Extract all tables from the document
    const tables = Array.from(doc.querySelectorAll('table'));
    
    let personalInfo = {};
    let planetaryPositions = [];
    let chartImages = [];
    let dashas = {};
    let birthDetails = {};
    let ashtakvargas = {};
    let gemstones = {};
    let doshas = {};
    let ascendantInfo = {};
    let moonSignInfo = {};
    let yogas = [];

    tables.forEach((table, index) => {
      const rows = Array.from(table.querySelectorAll('tr'));
      
      // Extract birth details (first table)
      if (index === 0 && rows.length > 1) {
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          if (cells.length >= 2) {
            const key = cells[0].textContent.trim();
            const value = cells[1].textContent.trim();
            if (key && value && !key.includes('Kundli')) {
              birthDetails[key] = value;
              
              // Also capture additional info from same row
              if (cells.length >= 4) {
                const key2 = cells[2].textContent.trim();
                const value2 = cells[3].textContent.trim();
                if (key2 && value2) {
                  birthDetails[key2] = value2;
                }
              }
            }
          }
        });
      }
      
      // Extract planetary positions table
      if (table.querySelector('th') && 
          table.querySelector('th').textContent.includes('Planet')) {
        rows.slice(1).forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length >= 5) {
            planetaryPositions.push({
              planet: cells[0].textContent.trim(),
              degreeSign: cells[1].textContent.trim(),
              house: cells[2].textContent.trim(),
              nakshatra: cells[3].textContent.trim(),
              motion: cells[4].textContent.trim()
            });
          }
        });
      }

      // Extract Vimshottari Dasha information
      if (table.querySelector('th') && 
          table.querySelector('th').textContent.includes('Vimshottari Dasha')) {
        const dashaCells = Array.from(table.querySelectorAll('td table'));
        dashaCells.forEach(dashTable => {
          const dashRows = Array.from(dashTable.querySelectorAll('tr'));
          if (dashRows.length > 0) {
            const planetHeader = dashRows[0].querySelector('td');
            if (planetHeader) {
              const planetName = planetHeader.textContent.trim().split(' ')[0];
              dashas[planetName] = [];
              
              dashRows.slice(1).forEach(dashRow => {
                const dashCells = Array.from(dashRow.querySelectorAll('td'));
                if (dashCells.length >= 2) {
                  dashas[planetName].push({
                    subPeriod: dashCells[0].textContent.trim(),
                    date: dashCells[1].textContent.trim()
                  });
                }
              });
            }
          }
        });
      }

      // Extract Ashtakvarga data
      if (table.querySelector('th') && 
          table.querySelector('th').textContent.includes('Ashtakvarga')) {
        const headerText = table.querySelector('th').textContent.trim();
        const planetName = headerText.split(' ')[0];
        
        ashtakvargas[planetName] = {};
        rows.slice(1).forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length > 1) {
            const sign = cells[0].textContent.trim();
            const values = cells.slice(1).map(cell => cell.textContent.trim());
            ashtakvargas[planetName][sign] = values;
          }
        });
      }

      // Extract gemstone information
      if (table.querySelector('th') && 
          table.querySelector('th').textContent.includes('Gemstones')) {
        rows.slice(1).forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length >= 2) {
            const type = cells[0].textContent.trim();
            const stone = cells[1].textContent.trim();
            gemstones[type] = stone;
          }
        });
      }
    });

    // Extract chart images
    const images = Array.from(doc.querySelectorAll('img'));
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.includes('Chart-')) {
        const alt = img.getAttribute('alt') || '';
        const parent = img.closest('td');
        const chartName = parent ? parent.previousElementSibling?.textContent?.trim() || 'Unknown Chart' : 'Unknown Chart';
        
        chartImages.push({
          name: chartName,
          url: src,
          alt: alt
        });
      }
    });

    // Extract ascendant information
    const ascendantSection = doc.querySelector('h2');
    if (ascendantSection && ascendantSection.textContent.includes('Ascendent')) {
      const ascendantText = ascendantSection.parentElement.parentElement.querySelector('div[align="justify"]');
      if (ascendantText) {
        ascendantInfo = {
          sign: ascendantSection.textContent.replace('Your Ascendent - ', '').trim(),
          description: ascendantText.textContent.trim()
        };
      }
    }

    // Extract moon sign information
    const moonSignSection = Array.from(doc.querySelectorAll('h2')).find(h2 => 
      h2.textContent.includes('Moon Sign'));
    if (moonSignSection) {
      const moonSignText = moonSignSection.parentElement.parentElement.querySelector('div[align="justify"]');
      if (moonSignText) {
        moonSignInfo = {
          description: moonSignText.textContent.trim()
        };
      }
    }

    // Extract dosha information
    const doshaTexts = Array.from(doc.querySelectorAll('tfoot td'));
    doshaTexts.forEach(dosha => {
      const text = dosha.textContent.trim();
      if (text.includes('Sade Sati')) {
        doshas.sadeSati = text;
      } else if (text.includes('Manglik')) {
        doshas.manglik = text;
      } else if (text.includes('kaal sarp')) {
        doshas.kaalSarp = text;
      }
    });

    // Extract yoga information
    const yogaElements = Array.from(doc.querySelectorAll('td')).filter(td => 
      td.textContent.includes('Yog:') || td.textContent.includes('Yoga'));
    yogaElements.forEach(yoga => {
      const text = yoga.textContent.trim();
      if (text.includes('Budh Aditya Yog')) {
        yogas.push({
          name: 'Budh Aditya Yog',
          description: text
        });
      }
    });

    return {
      personalInfo: {
        name: birthDetails['Kundli'] ? birthDetails['Kundli'].replace('Kundli : ', '') : '',
        birthDetails: birthDetails,
        ascendant: ascendantInfo,
        moonSign: moonSignInfo
      },
      planetaryPositions: planetaryPositions,
      charts: chartImages,
      dashas: {
        vimshottari: dashas
      },
      ashtakvarga: ashtakvargas,
      gemstones: gemstones,
      doshas: doshas,
      yogas: yogas,
      date: new Date().toISOString(),
      rawHtml: htmlString,
      parsed: true,
      totalSections: Object.keys({
        personalInfo: 1,
        planetaryPositions: planetaryPositions.length,
        charts: chartImages.length,
        dashas: Object.keys(dashas).length,
        ashtakvarga: Object.keys(ashtakvargas).length,
        gemstones: Object.keys(gemstones).length,
        doshas: Object.keys(doshas).length,
        yogas: yogas.length
      }).length
    };
  } catch (error) {
    console.error('Error converting HTML to JSON:', error);
    return { 
      error: 'Parsing failed', 
      rawHtml: htmlString,
      date: new Date().toISOString()
    };
  }
};