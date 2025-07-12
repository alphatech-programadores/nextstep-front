// RUTA: src/app/applications/page.tsx

import { Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ApplicationsList from './ApplicationsList'; // Asegúrate de que esta ruta es correcta
import styles from './ApplicationsPage.module.scss';

export default function ApplicationsPage() {
    return (
        <ProtectedRoute allowedRoles={['student']}>
            <div className={styles.container}>
                <h1 className={styles.title}>Mis Postulaciones</h1>

                {/* Aquí está la magia: Muestra un 'fallback' mientras espera al componente del cliente */}
                <Suspense fallback={<div className={styles.loadingContainer}>Cargando postulaciones...</div>}>
                    <ApplicationsList />
                </Suspense>
            </div>
        </ProtectedRoute>
    );
}