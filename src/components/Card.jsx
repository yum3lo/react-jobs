const Card = (
	{ children, bg = 'bg-[var(--background)]', className = '' }
) => {
	return (
		<div className={`${bg} px-6 py-8 rounded-lg shadow-md ${className}`}>
      { children }
		</div>
	)
}

export default Card