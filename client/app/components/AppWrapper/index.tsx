'use client';
import React, {ReactNode, useMemo} from 'react';
import {AuthProvider} from '@/app/contexts/AuthContext';
import {UserProvider} from '@/app/contexts/UserContext';
import {PropProvider, useProp} from '@/app/contexts/PropContext';
import {usePathname} from 'next/navigation';
import Menu from '@/app/components/Menu';
import ErrorPopUp from '@/app/components/AppWrapper/ErrorPopUp';
import LoadingScreen from '@/app/components/AppWrapper/LoadingScreen';
const MemoizedMenu = React.memo(Menu);


const AppWrapper = ({children} : {children:ReactNode}) => {
    const pathname = usePathname();
    const isLoggedIn = useMemo(() => {
        return !(pathname === '/login' || pathname === '/register' || pathname === '/logout' || pathname === '/');
    }, [pathname]);
    return (
        <PropProvider>
            <AuthProvider>
            <UserProvider>
                {children}
                <div className={`xl:max-w-[1280px] w-full  menu-container`}>
                    {isLoggedIn && <MemoizedMenu />}
                </div>
                    <ErrorPopUp />
                    <LoadingScreen />
            </UserProvider>
            </AuthProvider>
        </PropProvider>
    );
};

export default AppWrapper;