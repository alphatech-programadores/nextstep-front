// Este archivo será la única fuente de verdad para tus tipos de datos.

export interface Application {
    id: number;
    status: string;
    vacant_id: number;
    vacant_title: string;
    company_name: string;
    application_status: string;
    applied_at: string;
    vacant_location: string;
    vacant_modality: string;
    vacant_hours: string;
}

// Puedes añadir aquí otras interfaces que uses en varios lugares.