/**
 * Convierte el SVG del mapa a imagen PNG con información del usuario
 * @param {string} userName - Nombre del usuario
 * @param {number} totalScore - Puntaje total
 * @param {number} visitedCount - Departamentos visitados
 * @param {number} totalProvinces - Total de departamentos
 * @returns {Promise<void>}
 */
export async function downloadMapImage(userName: string, totalScore: number, visitedCount: number, totalProvinces: number): Promise<void> {
  try {
    // Obtener el SVG del mapa
    const mapSvg = document.querySelector('#svg574') as SVGSVGElement;
    if (!mapSvg) {
      throw new Error('No se encontró el mapa');
    }

    // Clonar el SVG para no afectar el original
    const clonedSvg = mapSvg.cloneNode(true) as SVGSVGElement;
    
    // Asegurar que todos los paths tengan contorno negro
    const paths = clonedSvg.querySelectorAll('path[id]:not([id="rect11351"])');
    paths.forEach((path: Element) => {
      (path as SVGPathElement).setAttribute('stroke', '#000000');
      (path as SVGPathElement).setAttribute('stroke-width', '1.5');
      (path as SVGPathElement).setAttribute('stroke-opacity', '1');
    });
    
    // Configurar dimensiones ampliadas para el SVG (más espacio arriba y a la derecha)
    const originalWidth = 840;
    const originalHeight = 1155;
    const infoHeight = 160;
    const legendWidth = 200;
    const padding = 20;
    
    const newWidth = originalWidth + legendWidth + (padding * 3);
    const newHeight = originalHeight + infoHeight + (padding * 2);
    
    clonedSvg.setAttribute('width', newWidth.toString());
    clonedSvg.setAttribute('height', newHeight.toString());
    clonedSvg.setAttribute('viewBox', `0 0 ${newWidth} ${newHeight}`);
    
    // Mover todo el contenido del mapa hacia abajo y a la izquierda para dar espacio a la leyenda
    const mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mapGroup.setAttribute('transform', `translate(${padding}, ${infoHeight + padding})`);
    
    // Mover todos los elementos existentes al grupo del mapa
    while (clonedSvg.firstChild) {
      mapGroup.appendChild(clonedSvg.firstChild);
    }
    clonedSvg.appendChild(mapGroup);
    
    // Crear fondo blanco para toda la imagen
    const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    backgroundRect.setAttribute('x', '0');
    backgroundRect.setAttribute('y', '0');
    backgroundRect.setAttribute('width', newWidth.toString());
    backgroundRect.setAttribute('height', newHeight.toString());
    backgroundRect.setAttribute('fill', '#ffffff');
    clonedSvg.insertBefore(backgroundRect, clonedSvg.firstChild);
    
    // Agregar información del usuario al SVG (en la parte superior)
    const infoGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    infoGroup.setAttribute('id', 'user-info');
    
    // Fondo para la información
    const infoBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    infoBg.setAttribute('x', padding.toString());
    infoBg.setAttribute('y', padding.toString());
    infoBg.setAttribute('width', (newWidth - (padding * 2)).toString());
    infoBg.setAttribute('height', (infoHeight - padding).toString());
    infoBg.setAttribute('fill', 'rgba(249, 250, 251, 0.95)');
    infoBg.setAttribute('stroke', '#e5e7eb');
    infoBg.setAttribute('stroke-width', '2');
    infoBg.setAttribute('rx', '12');
    infoGroup.appendChild(infoBg);

    // Título principal
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (padding + 20).toString());
    title.setAttribute('y', (padding + 35).toString());
    title.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    title.setAttribute('font-size', '20');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#111827');
    title.textContent = `Mapa de Viajes - Colombia`;
    infoGroup.appendChild(title);

    // Nombre del usuario
    const userText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    userText.setAttribute('x', (padding + 20).toString());
    userText.setAttribute('y', (padding + 60).toString());
    userText.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    userText.setAttribute('font-size', '16');
    userText.setAttribute('font-weight', '600');
    userText.setAttribute('fill', '#374151');
    userText.textContent = `👤 ${userName || 'Usuario'}`;
    infoGroup.appendChild(userText);

    // Puntaje total
    const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scoreText.setAttribute('x', (padding + 20).toString());
    scoreText.setAttribute('y', (padding + 85).toString());
    scoreText.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    scoreText.setAttribute('font-size', '14');
    scoreText.setAttribute('fill', '#4b5563');
    scoreText.textContent = `🏆 Puntaje Total: ${totalScore}`;
    infoGroup.appendChild(scoreText);

    // Progreso
    const progressText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    progressText.setAttribute('x', (padding + 20).toString());
    progressText.setAttribute('y', (padding + 105).toString());
    progressText.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    progressText.setAttribute('font-size', '14');
    progressText.setAttribute('fill', '#4b5563');
    progressText.textContent = `📍 Departamentos visitados: ${visitedCount}/${totalProvinces}`;
    infoGroup.appendChild(progressText);

    // Fecha y URL
    const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    dateText.setAttribute('x', (padding + 20).toString());
    dateText.setAttribute('y', (padding + 125).toString());
    dateText.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    dateText.setAttribute('font-size', '12');
    dateText.setAttribute('fill', '#9ca3af');
    dateText.textContent = `📅 ${new Date().toLocaleDateString('es-CO')} • https://colombia-travel-level-map.vercel.app/`;
    infoGroup.appendChild(dateText);

    // Agregar el grupo de información al SVG
    clonedSvg.appendChild(infoGroup);

    // Crear leyenda de colores en el lado derecho
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendGroup.setAttribute('id', 'color-legend');
    
    // Posición de la leyenda (lado derecho)
    const legendX = originalWidth + padding * 2;
    const legendY = infoHeight + padding + 20;
    
    // Fondo para la leyenda
    const legendBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    legendBg.setAttribute('x', legendX.toString());
    legendBg.setAttribute('y', legendY.toString());
    legendBg.setAttribute('width', (legendWidth - padding).toString());
    legendBg.setAttribute('height', '320');
    legendBg.setAttribute('fill', 'rgba(249, 250, 251, 0.95)');
    legendBg.setAttribute('stroke', '#e5e7eb');
    legendBg.setAttribute('stroke-width', '1');
    legendBg.setAttribute('rx', '8');
    legendGroup.appendChild(legendBg);

    // Título de la leyenda
    const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    legendTitle.setAttribute('x', (legendX + 15).toString());
    legendTitle.setAttribute('y', (legendY + 25).toString());
    legendTitle.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    legendTitle.setAttribute('font-size', '14');
    legendTitle.setAttribute('font-weight', 'bold');
    legendTitle.setAttribute('fill', '#111827');
    legendTitle.textContent = '🎨 Convenciones';
    legendGroup.appendChild(legendTitle);

    // Datos de los niveles (mismo orden que MENU_OPTIONS)
    const levelData = [
      { label: 'Viví ahí', color: '#e84c3d', symbol: '🏠' },
      { label: 'Me quedé ahí', color: '#d58337', symbol: '🛏️' },
      { label: 'Visité ahí', color: '#f3c218', symbol: '🔍' },
      { label: 'Aterricé ahí', color: '#30cc70', symbol: '✈️' },
      { label: 'Pasé por ahí', color: '#3598db', symbol: '🚩' },
      { label: 'Nunca estuve ahí', color: '#ffffff', symbol: '❌' }
    ];

    // Crear elementos de la leyenda
    levelData.forEach((level, index) => {
      const itemY = legendY + 50 + (index * 40);
      
      // Cuadrado de color
      const colorRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      colorRect.setAttribute('x', (legendX + 15).toString());
      colorRect.setAttribute('y', itemY.toString());
      colorRect.setAttribute('width', '20');
      colorRect.setAttribute('height', '20');
      colorRect.setAttribute('fill', level.color);
      colorRect.setAttribute('stroke', '#000000');
      colorRect.setAttribute('stroke-width', '1');
      colorRect.setAttribute('rx', '2');
      legendGroup.appendChild(colorRect);
      
      // Símbolo dentro del cuadrado
      const symbolText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      symbolText.setAttribute('x', (legendX + 25).toString());
      symbolText.setAttribute('y', (itemY + 14).toString());
      symbolText.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
      symbolText.setAttribute('font-size', '10');
      symbolText.setAttribute('text-anchor', 'middle');
      symbolText.setAttribute('fill', level.color === '#ffffff' ? '#000000' : '#ffffff');
      symbolText.textContent = level.symbol;
      legendGroup.appendChild(symbolText);
      
      // Etiqueta del nivel
      const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelText.setAttribute('x', (legendX + 45).toString());
      labelText.setAttribute('y', (itemY + 14).toString());
      labelText.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
      labelText.setAttribute('font-size', '12');
      labelText.setAttribute('fill', '#374151');
      labelText.textContent = level.label;
      legendGroup.appendChild(labelText);
    });

    // Agregar nota al final de la leyenda
    const noteText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    noteText.setAttribute('x', (legendX + 15).toString());
    noteText.setAttribute('y', (legendY + 300).toString());
    noteText.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    noteText.setAttribute('font-size', '10');
    noteText.setAttribute('fill', '#9ca3af');
    noteText.textContent = 'Haz clic en cualquier departamento';
    legendGroup.appendChild(noteText);
    
    const noteText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    noteText2.setAttribute('x', (legendX + 15).toString());
    noteText2.setAttribute('y', (legendY + 315).toString());
    noteText2.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    noteText2.setAttribute('font-size', '10');
    noteText2.setAttribute('fill', '#9ca3af');
    noteText2.textContent = 'para asignar tu experiencia';
    legendGroup.appendChild(noteText2);

    // Agregar la leyenda al SVG
    clonedSvg.appendChild(legendGroup);
    
    // Convertir SVG a string
    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    
    // Crear canvas para renderizar
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }
    
    // Configurar tamaño del canvas (alta resolución para mejor calidad)
    const scale = 2;
    canvas.width = newWidth * scale;
    canvas.height = newHeight * scale;
    ctx.scale(scale, scale);

    // Crear imagen desde SVG
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Fondo blanco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, newWidth, newHeight);
        
        // Dibujar el SVG en el canvas
        ctx.drawImage(img, 0, 0);
        
        // Convertir canvas a blob y descargar
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Error al generar la imagen'));
            return;
          }
          
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `mapa-colombia-${userName?.replace(/\s+/g, '-') || 'usuario'}-${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Limpiar URLs
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(downloadUrl);
          
          resolve();
        }, 'image/png', 0.95);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = url;
    });

  } catch (error) {
    console.error('Error descargando el mapa:', error);
    throw error;
  }
}

/**
 * Descarga los datos del mapa como archivo JSON
 * @param {string} userName - Nombre del usuario
 * @param {Array} provinceLevels - Datos de los niveles
 * @param {Object} stats - Estadísticas del usuario
 * @param {Array} provinces - Array de departamentos con sus nombres
 */
export function downloadMapData(userName: string, provinceLevels: number[], stats: {
  totalScore: number;
  visitedCount: number;
  totalProvinces: number;
  completionPercentage: number;
}, provinces: Array<{id: string, capital: string}>) {
  
  // Crear array con nombres de departamentos y sus niveles
  const departamentosConNiveles = provinceLevels.map((nivel, index) => {
    const departamento = provinces[index];
    return {
      departamento: departamento?.id || `Departamento_${index + 1}`,
      capital: departamento?.capital || 'N/A',
      nivel: nivel,
      experiencia: getNivelDescription(nivel)
    };
  });

  const data = {
    usuario: userName || 'Usuario',
    fecha: new Date().toISOString(),
    estadisticas: {
      puntajeTotal: stats.totalScore,
      departamentosVisitados: stats.visitedCount,
      totalDepartamentos: stats.totalProvinces,
      porcentajeCompletado: stats.completionPercentage
    },
    departamentos: departamentosConNiveles,
    // También mantener el formato anterior para compatibilidad
    datosDepartamentos: provinceLevels,
    leyenda: {
      niveles: [
        { nivel: 0, descripcion: 'Nunca estuve ahí', color: '#ffffff' },
        { nivel: 1, descripcion: 'Pasé por ahí', color: '#3598db' },
        { nivel: 2, descripcion: 'Aterricé ahí', color: '#30cc70' },
        { nivel: 3, descripcion: 'Visité ahí', color: '#f3c218' },
        { nivel: 4, descripcion: 'Me quedé ahí', color: '#d58337' },
        { nivel: 5, descripcion: 'Viví ahí', color: '#e84c3d' }
      ]
    },
    metadata: {
      version: '2.0',
      aplicacion: 'Mapa de Viajes Colombia',
      descripcion: 'Datos de experiencias de viaje por departamentos de Colombia',
      url: 'https://colombia-travel-level-map.vercel.app/'
    }
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `datos-mapa-colombia-${userName?.replace(/\s+/g, '-') || 'usuario'}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Obtiene la descripción del nivel de experiencia
 * @param {number} nivel - Nivel numérico (0-5)
 * @returns {string} - Descripción del nivel
 */
function getNivelDescription(nivel: number): string {
  const descripciones = {
    0: 'Nunca estuve ahí',
    1: 'Pasé por ahí',
    2: 'Aterricé ahí',
    3: 'Visité ahí',
    4: 'Me quedé ahí',
    5: 'Viví ahí'
  };
  return descripciones[nivel as keyof typeof descripciones] || 'Nivel desconocido';
}