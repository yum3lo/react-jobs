const Hero = ({
  title = 'Become a React Dev', 
  subtitle = 'Find the React job that fits your skill set'
}) => {
  return (
    <section className="bg-[var(--card)] py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold text-[var(--background)] md:text-5xl lg:text-6xl">
              { title }
            </h1>
            <p className="mt-12 text-xl text-[var(--background)]">
              { subtitle}  
            </p>
        </div>
      </div>
    </section>
  )
}

export default Hero