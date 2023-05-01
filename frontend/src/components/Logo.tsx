const Logo = () => {
  const isMobile = window.screen.width < 800
  const size = isMobile ? window.screen.height * 0.25 : '280px';

  return (

      <img
        height={size}
        width={size}
        src={'/logo512.png'}
      />
  )
}

export default Logo
