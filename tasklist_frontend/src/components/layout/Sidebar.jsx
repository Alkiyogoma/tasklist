
// components/layout/Sidebar.jsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, BuildingOffice2Icon, ListBulletIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
    const router = useRouter();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Properties', href: '/properties', icon: BuildingOffice2Icon },
        { name: 'Utility Bills', href: '/utility-bills', icon: ListBulletIcon },
        { name: 'Staffs', href: '/users', icon: UsersIcon },
    ];

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-0 flex-1 bg-gray-800">
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
                        <h1 className="text-white font-semibold text-lg">Property Manager</h1>
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navItems.map((item) => {
                                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }`}
                                    >
                                        <item.icon
                                            className={`mr-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                                                }`}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
