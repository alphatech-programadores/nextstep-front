// RUTA: src/app/applications/page.tsx

import { Suspense } from 'react';
import ApplicationsList from './ApplicationsList';
import styles from './ApplicationsPage.module.scss';

//
// --- CAMBIO CLAVE AQUÍ ---
//
// 1. Definimos una interfaz para las props de nuestra página.
//    Esto hace el código más limpio y reutilizable.
interface ApplicationsPageProps {
    searchParams: {
        // 2. Usamos 'status?: string'. El '?' indica que la propiedad 'status'
        //    es opcional. Puede ser un string o puede no existir (undefined).
        //    Esto soluciona el error de tipado.
        status?: string;
    };
}

// 3. Usamos la nueva interfaz para tipar las props del componente.
export default function ApplicationsPage({ searchParams }: ApplicationsPageProps) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Postulaciones</h1>

            <Suspense fallback={<div className={styles.loadingContainer}>Cargando postulaciones...</div>}>
                <ApplicationsList searchParams={searchParams} />
            </Suspense>
        </div>
    );
}