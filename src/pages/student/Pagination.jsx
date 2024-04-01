function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end">
      <div className="flex rounded-md">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`py-2 px-4 leading-tight border ${currentPage === page ? 'bg-black text-white' : 'border-gray-400 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        {/* Implement previous and next buttons if needed */}
      </div>
    </div>
  );
}
  
export default Pagination;