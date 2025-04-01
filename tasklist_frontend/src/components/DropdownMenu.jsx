import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


const DropdownMenu = ({ title, items }) => {

    const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button 
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-indigo-950 bg-transparent focus:outline-none"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
    </svg>

      </button>

      <div 
        className={`absolute left-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 transition-all duration-200 ease-in-out ${
          isOpen 
            ? 'transform opacity-100 scale-100' 
            : 'transform opacity-0 scale-95 invisible'
        }`}
      >
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
           {items.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-200 hover:text-white'
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
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;