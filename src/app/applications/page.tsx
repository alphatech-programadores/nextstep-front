// RUTA: src/app/applications/page.tsx

import { Suspense } from 'react';
import ApplicationsList from './ApplicationsList';
import styles from './ApplicationsPage.module.scss';

// Los componentes de página en el App Router reciben 'searchParams' como prop automáticamente.
export default function ApplicationsPage({ searchParams }: { searchParams: { status: string } }) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mis Postulaciones</h1>

            <Suspense fallback={<div className={styles.loadingContainer}>Cargando postulaciones...</div>}>
                {/* Pasamos los searchParams al componente de cliente como una prop */}
                <ApplicationsList searchParams={searchParams} />
            </Suspense>
        </div>
    );
}