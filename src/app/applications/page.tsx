// RUTA: src/app/applications/page.tsx

import { Suspense } from 'react';
import ApplicationsList from './ApplicationsList';
import styles from './ApplicationsPage.module.scss';

export default function ApplicationsPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Postulaciones</h1>

            <Suspense fallback={<div className={styles.loadingContainer}>Cargando postulaciones...</div>}>
                <ApplicationsList />
            </Suspense>
        </div>
    );
}