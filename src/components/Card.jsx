const Card = (
	{ children, bg = 'bg-[var(--hover)]' }
) => {
	return (
		<div className={`${bg} p-6 rounded-lg shadow-md`}>
      { children }
		</div>
	)
}

export default Card