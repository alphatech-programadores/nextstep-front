// RUTA: src/components/ProtectedRoute.tsx
'use client';

import { useEffect, useRef } from 'react';
// ¡PUNTO CLAVE! Eliminamos 'useSearchParams' de la importación.
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    // ¡NUEVO! Añadimos searchParams a las props que el componente puede recibir.
    // Lo hacemos opcional por si usas este componente en otras partes donde no lo pasas.
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ProtectedRoute({ children, allowedRoles, searchParams = {} }: ProtectedRouteProps) {
    const { user, loadingUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    // ¡ELIMINADO! Ya no usamos el hook aquí.
    // const searchParams = useSearchParams(); 
    const toastDisplayedRef = useRef(false);

    useEffect(() => {
        toastDisplayedRef.current = false;
    }, [pathname]);


    useEffect(() => {
        if (loadingUser) {
            return;
        }

        // ¡CAMBIO CLAVE AQUÍ!
        // Leemos el parámetro 'fromLogout' directamente del objeto de props.
        const fromLogout = searchParams.fromLogout === 'true';

        if (!user) {
            if (!fromLogout && !toastDisplayedRef.current) {
                toast.error("Por favor, inicia sesión para acceder a esta página.");
                toastDisplayedRef.current = true;
            }
            router.push('/auth/login');
            return;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            if (!toastDisplayedRef.current) {
                toast.error("No tienes permisos para acceder a esta página.");
                toastDisplayedRef.current = true;
            }
            router.push('/dashboard');
            return;
        }

        // Eliminamos 'searchParams' de las dependencias porque ahora es una prop estable.
        // Aunque si quieres ser estricto, puedes dejarlo.
    }, [user, loadingUser, router, allowedRoles, searchParams]);

    // ... El resto del componente permanece igual ...
    if (loadingUser) {
        return <div>Cargando contenido seguro...</div>;
    }

    if (user && (!allowedRoles || allowedRoles.includes(user.role))) {
        return <>{children}</>;
    }

    return null;
}