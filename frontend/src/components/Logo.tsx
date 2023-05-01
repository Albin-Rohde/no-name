const Logo = () => {
  const isMobile = window.screen.width < 800
  const size = isMobile ? '200vh' : '280vh';

  return (

      <img
        height={size}
        width={size}
        src={'/logo512.png'}
      />
  )
}

export default Logo
