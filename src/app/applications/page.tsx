// RUTA: src/app/applications/page.tsx

import { Suspense } from 'react';
import ApplicationsList from './ApplicationsList';
import styles from './ApplicationsPage.module.scss';

// PRUEBA DE DIAGNÓSTICO: Usamos 'any' para forzar a TypeScript
// a ignorar cualquier tipo conflictivo externo.
export default function ApplicationsPage({ searchParams }: { searchParams: any }) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Postulaciones</h1>

            <Suspense fallback={<div className={styles.loadingContainer}>Cargando postulaciones...</div>}>
                <ApplicationsList searchParams={searchParams} />
            </Suspense>
        </div>
    );
}