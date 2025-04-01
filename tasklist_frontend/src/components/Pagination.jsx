import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  showPageNumbers = true,
  maxPageNumbers = 5,
  queryParamName = 'page',
  className = '',
}) => {
  const router = useRouter();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // If there's only 1 page, don't display pagination
  if (totalPages <= 1) {
    return null;
  }

  // Generate the pagination path with appropriate query params
  const getPageHref = (page) => {
    const query = { ...router.query, [queryParamName]: page };
    return { pathname: router.pathname, query };
  };

  // Calculate which page numbers to show
  const getVisiblePageNumbers = () => {
    if (totalPages <= maxPageNumbers) {
      // If we have fewer pages than the max, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first, last, current and some pages around current
    const halfMaxVisible = Math.floor((maxPageNumbers - 3) / 2);
    const showLeftDots = currentPage > halfMaxVisible + 2;
    const showRightDots = currentPage < totalPages - halfMaxVisible - 1;

    if (showLeftDots && showRightDots) {
      // Show both dots
      const middlePages = Array.from(
        { length: maxPageNumbers - 4 }, 
        (_, i) => currentPage - Math.floor((maxPageNumbers - 4) / 2) + i
      );
      return [1, '...', ...middlePages, '...', totalPages];
    } else if (showLeftDots) {
      // Show only left dots
      const endPages = Array.from(
        { length: maxPageNumbers - 2 }, 
        (_, i) => totalPages - maxPageNumbers + 3 + i
      );
      return [1, '...', ...endPages];
    } else {
      // Show only right dots or no dots
      const startPages = Array.from(
        { length: maxPageNumbers - 2 }, 
        (_, i) => i + 1
      );
      return [...startPages, '...', totalPages];
    }
  };

  // Generate page number buttons
  const renderPageNumbers = () => {
    if (!showPageNumbers) return null;

    return getVisiblePageNumbers().map((pageNum, index) => {
      if (pageNum === '...') {
        return (
          <span key={`dots-${index}`} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
            ...
          </span>
        );
      }

      const isActive = pageNum === currentPage;
      return (
        <Link
          key={`page-${pageNum}`}
          href={getPageHref(pageNum)}
          aria-current={isActive ? 'page' : undefined}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            isActive
              ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
          }`}
        >
          {pageNum}
        </Link>
      );
    });
  };

  return (
    <nav className={`flex items-center justify-between border-t border-gray-200 px-4 py-2 sm:px-0 ${className}`}>
      <div className="flex flex-1 w-0 -mt-px">
        {currentPage > 1 ? (
          <Link
            href={getPageHref(currentPage - 1)}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <ChevronLeftIcon className="mr-3 h-5 w-5" aria-hidden="true" />
            Previous
          </Link>
        ) : (
          <span className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-300">
            <ChevronLeftIcon className="mr-3 h-5 w-5" aria-hidden="true" />
            Previous
          </span>
        )}
      </div>
      
      {showPageNumbers && (
        <div className="hidden md:-mt-px md:flex">
          {renderPageNumbers()}
        </div>
      )}
      
      <div className="flex flex-1 justify-end w-0 -mt-px">
        {currentPage < totalPages ? (
          <Link
            href={getPageHref(currentPage + 1)}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <ChevronRightIcon className="ml-3 h-5 w-5" aria-hidden="true" />
          </Link>
        ) : (
          <span className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-300">
            Next
            <ChevronRightIcon className="ml-3 h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
};

export default Pagination;