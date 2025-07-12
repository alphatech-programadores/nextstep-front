// RUTA: src/app/applications/page.tsx

import { Suspense } from 'react';
import ApplicationsList from './ApplicationsList';
import styles from './ApplicationsPage.module.scss';

// Este es un Componente de Servidor. Recibe 'searchParams' como prop automáticamente.
export default function ApplicationsPage({ searchParams }: { searchParams: { status: string } }) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Postulaciones</h1>

            {/* Suspense es necesario para envolver el componente cliente que depende de datos */}
            <Suspense fallback={<div className={styles.loadingContainer}>Cargando postulaciones...</div>}>
                {/* ¡PUNTO CLAVE!
                  Aquí pasamos los 'searchParams' que recibimos en el servidor
                  directamente como una prop al componente de cliente.
                */}
                <ApplicationsList searchParams={searchParams} />
            </Suspense>
        </div>
    );
}