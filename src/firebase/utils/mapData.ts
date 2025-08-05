import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../client";

const db = getFirestore(app);

/**
 * Prueba la conexión a Firestore
 */
export async function testFirestoreConnection() {
  try {
    // Intenta leer un documento de prueba
    const testRef = doc(db, "test", "connection");
    await getDoc(testRef);
    console.log("✅ Conexión a Firestore exitosa");
    return true;
  } catch (error) {
    console.error("❌ Error de conexión a Firestore:", error);
    return false;
  }
}

/**
 * Guarda los datos del mapa de Colombia del usuario en Firestore
 * @param {string} userId - ID del usuario
 * @param {number[]} provinceLevels - Array con los niveles de cada provincia
 * @returns {Promise<boolean>} - true si se guardó exitosamente
 */
export async function saveUserMapData(userId: string, provinceLevels: number[]): Promise<boolean> {
  try {
    console.log('🔄 Intentando guardar datos para usuario:', userId);
    console.log('📊 Datos a guardar:', provinceLevels);
    
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      mapData: {
        provinceLevels: provinceLevels,
        lastUpdated: new Date().toISOString()
      }
    }, { merge: true });
    
    console.log("✅ Datos del mapa guardados exitosamente");
    return true;
  } catch (error: unknown) {
    console.error("❌ Error guardando datos del mapa:", error);
    if (error instanceof Error) {
      console.error("❌ Mensaje:", error.message);
    }
    if (typeof error === 'object' && error !== null && 'code' in error) {
      console.error("❌ Código de error:", (error as any).code);
    }
    return false;
  }
}

/**
 * Carga los datos del mapa de Colombia del usuario desde Firestore
 * @param {string} userId - ID del usuario
 * @returns {Promise<number[]|null>} - Array con los niveles de cada provincia o null si no existe
 */
export async function loadUserMapData(userId: string): Promise<number[] | null> {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.mapData && userData.mapData.provinceLevels) {
        console.log("✅ Datos del mapa cargados exitosamente");
        return userData.mapData.provinceLevels;
      }
    }
    
    console.log("ℹ️ No se encontraron datos guardados del mapa");
    return null;
  } catch (error) {
    console.error("❌ Error cargando datos del mapa:", error);
    return null;
  }
}

/**
 * Represents the statistics of a user's map.
 */
interface UserMapStats {
  totalScore: number;
  visitedCount: number;
  totalProvinces: number;
  completionPercentage: number;
}

/**
 * Obtiene estadísticas del usuario basadas en sus datos del mapa
 */
export function getUserMapStats(provinceLevels: number[]): UserMapStats {
  const totalScore = provinceLevels.reduce((sum: number, level: number) => sum + level, 0);
  const visitedCount = provinceLevels.filter((level: number) => level > 0).length;
  const totalProvinces = provinceLevels.length;
  const completionPercentage = Math.round((visitedCount / totalProvinces) * 100);
  
  return {
    totalScore,
    visitedCount,
    totalProvinces,
    completionPercentage
  };
}