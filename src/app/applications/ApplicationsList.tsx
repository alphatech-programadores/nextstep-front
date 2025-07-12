'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';
import styles from './ApplicationsPage.module.scss';
import axiosInstance from '@/services/axiosConfig';
import { Application } from '@/types'; // Asegúrate que la ruta a tus tipos es correcta

export default function ApplicationsList() {
    const { user, loadingUser } = useAuth();
    const searchParams = useSearchParams();

    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Lee el filtro de la URL. Si no existe, usa un string vacío.
    const statusFilter = searchParams.get('status') || '';

    const fetchApplications = useCallback(async (page: number = 1) => {
        if (loadingUser || !user || user.role !== 'student') return;

        setLoadingApplications(true);
        setError(null);
        try {
            const params = {
                status: statusFilter,
                page: page,
                per_page: 10,
            };

            const response = await axiosInstance.get('/apply/me', { params });
            setApplications(response.data.applications);
            setTotalPages(response.data.total_pages);
            setCurrentPage(response.data.current_page);
        } catch (err: unknown) {
            console.error("Error al cargar tus postulaciones.", err);
            let errorMessage = "Ocurrió un error al cargar las postulaciones.";

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.error || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoadingApplications(false);
        }
    }, [user, loadingUser, statusFilter]);

    useEffect(() => {
        if (!loadingUser && user && user.role === 'student') {
            fetchApplications(1);
        }
    }, [fetchApplications, loadingUser, user]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchApplications(newPage);
        }
    };

    const handleCancelApplication = async (applicationId: number) => {
        if (!confirm("¿Estás seguro de que quieres cancelar esta postulación?")) {
            return;
        }

        try {
            await axiosInstance.patch(`/apply/${applicationId}/cancel`);
            toast.success("Postulación cancelada correctamente.");
            fetchApplications(currentPage);
        } catch (err: unknown) {
            console.error("Error cancelling application:", err);
            let errorMessage = "Error al cancelar la postulación.";
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.error || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            toast.error(errorMessage);
        }
    };

    if (loadingApplications) {
        return <div className={styles.loadingContainer}>Cargando tus postulaciones...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }

    return (
        <>
            <div className={styles.filterSection}>
                <label htmlFor="statusFilter">Filtrar por estado:</label>
                {/* Este select ahora necesitará lógica para actualizar la URL, o un botón "Aplicar" */}
                <select
                    id="statusFilter"
                    defaultValue={statusFilter}
                    // onChange={(e) => router.push(`/applications?status=${e.target.value}`)} // Ejemplo de cómo funcionaría con router
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
                <button onClick={() => fetchApplications(1)} className={styles.applyFilterButton}>Aplicar Filtro</button>
            </div>

            {applications.length === 0 ? (
                <p className={styles.noApplications}>Aún no tienes postulaciones. ¡Es hora de explorar vacantes!</p>
            ) : (
                <div className={styles.applicationsGrid}>
                    {applications.map((app) => (
                        <div key={app.id} className={styles.applicationCard}>
                            <h2 className={styles.vacantTitle}>{app.vacant_title}</h2>
                            <p className={styles.companyName}>{app.company_name}</p>
                            <p className={styles.metaInfo}>
                                📍 {app.vacant_location} | 💼 {app.vacant_modality}
                            </p>
                            <p className={styles.hoursInfo}>Horas/Salario: {app.vacant_hours}</p>
                            <div className={styles.statusBadgeContainer}>
                                <span className={`${styles.statusBadge} ${styles[app.status.toLowerCase()]}`}>
                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                                <span className={styles.appliedAt}>Postulado el: {new Date(app.applied_at).toLocaleDateString()}</span>
                            </div>
                            <Link href={`/vacancies/${app.vacant_id}`} className={styles.viewDetailsButton}>
                                Ver Vacante
                            </Link>
                            {app.status !== 'aceptado' && app.status !== 'rechazado' && app.status !== 'cancelada' && (
                                <button
                                    onClick={() => handleCancelApplication(app.id)}
                                    className={styles.cancelButton}
                                >
                                    Cancelar Postulación
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={styles.paginationButton}
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={styles.paginationButton}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </>
    );
}