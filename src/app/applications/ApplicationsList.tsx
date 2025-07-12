// RUTA: src/app/applications/ApplicationsList.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute'; // Importas tu componente de protección
import styles from './ApplicationsPage.module.scss';
import axiosInstance from '@/services/axiosConfig';
import { Application } from '@/types';

export default function ApplicationsList() {
    const { user, loadingUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchApplications = useCallback(async (page: number) => {
        if (!user) return; // Salimos si no hay usuario
        setLoadingApplications(true);
        try {
            const params = { status: statusFilter, page, per_page: 10 };
            const response = await axiosInstance.get('/apply/me', { params });
            setApplications(response.data.applications);
            setTotalPages(response.data.total_pages);
            setCurrentPage(page);
        } catch (err) {
            toast.error("Error al cargar las postulaciones.");
        } finally {
            setLoadingApplications(false);
        }
    }, [user, statusFilter]);

    useEffect(() => {
        if (!loadingUser && user) {
            fetchApplications(1);
        }
    }, [user, loadingUser, fetchApplications]);

    const handleFilterChange = () => {
        router.push(`/applications?status=${statusFilter}`);
    };

    const handleCancelApplication = async (applicationId: number) => {
        if (!confirm("¿Seguro que quieres cancelar esta postulación?")) return;
        try {
            await axiosInstance.patch(`/apply/${applicationId}/cancel`);
            toast.success("Postulación cancelada.");
            fetchApplications(currentPage);
        } catch (err) {
            toast.error("Error al cancelar la postulación.");
        }
    };

    // La protección ahora se aplica DENTRO del componente de cliente.
    return (
        <ProtectedRoute allowedRoles={['student']}>
            {loadingUser ? (
                <div className={styles.loadingContainer}>Verificando usuario...</div>
            ) : (
                <>
                    <div className={styles.filterSection}>
                        <label htmlFor="statusFilter">Filtrar por estado:</label>
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="revisada">Revisada</option>
                            <option value="entrevista">Entrevista</option>
                            <option value="aceptado">Aceptado</option>
                            <option value="rechazado">Rechazado</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                        <button onClick={handleFilterChange} className={styles.applyFilterButton}>Aplicar Filtro</button>
                    </div>

                    {loadingApplications ? (
                        <div className={styles.loadingContainer}>Cargando postulaciones...</div>
                    ) : applications.length === 0 ? (
                        <p className={styles.noApplications}>No tienes postulaciones con estos filtros.</p>
                    ) : (
                        <div className={styles.applicationsGrid}>
                            {applications.map((app) => (
                                <div key={app.id} className={styles.applicationCard}>
                                    <h2 className={styles.vacantTitle}>{app.vacant_title}</h2>
                                    <p className={styles.companyName}>{app.company_name}</p>
                                    <p className={styles.metaInfo}>📍 {app.vacant_location} | 💼 {app.vacant_modality}</p>
                                    <p className={styles.hoursInfo}>Horas/Salario: {app.vacant_hours}</p>
                                    <div className={styles.statusBadgeContainer}>
                                        <span className={`${styles.statusBadge} ${styles[app.status.toLowerCase()]}`}>{app.status}</span>
                                        <span className={styles.appliedAt}>Postulado: {new Date(app.applied_at).toLocaleDateString()}</span>
                                    </div>
                                    <Link href={`/vacancies/${app.vacant_id}`} className={styles.viewDetailsButton}>Ver Vacante</Link>
                                    {app.status !== 'aceptado' && app.status !== 'rechazado' && app.status !== 'cancelada' && (
                                        <button onClick={() => handleCancelApplication(app.id)} className={styles.cancelButton}>Cancelar</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && !loadingApplications && (
                        <div className={styles.pagination}>
                            <button onClick={() => fetchApplications(currentPage - 1)} disabled={currentPage === 1} className={styles.paginationButton}>Anterior</button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button onClick={() => fetchApplications(currentPage + 1)} disabled={currentPage === totalPages} className={styles.paginationButton}>Siguiente</button>
                        </div>
                    )}
                </>
            )}
        </ProtectedRoute>
    );
}