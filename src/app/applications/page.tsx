import { Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ApplicationsList from './ApplicationsList';
import styles from './ApplicationsPage.module.scss';

export default function ApplicationsPage() {
    return (
        <ProtectedRoute allowedRoles={['student']}>
            <div className={styles.container}>
                <h1 className={styles.title}>Mis Postulaciones</h1>

                <Suspense fallback={<div className={styles.loadingContainer}>Cargando postulaciones...</div>}>
                    <ApplicationsList />
                </Suspense>
            </div>
        </ProtectedRoute>
    );
}