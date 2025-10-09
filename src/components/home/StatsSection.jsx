import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

const StatsSection = () => {
  const sectionRef = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const animationFrameRef = useRef(null)

  const statsData = useMemo(() => [
    {
      number: 500,
      suffix: '+',
      label: 'Wedding projects completed',
      icon: '⚘',
      color: 'from-[#D3FD50] to-[#b8e03e]',
      glowColor: 'rgba(211, 253, 80, 0.3)'
    },
    {
      number: 97,
      suffix: '%',
      label: 'Happy Clients',
      icon: '◉',
      color: 'from-[#D3FD50] to-[#a3d139]',
      glowColor: 'rgba(211, 253, 80, 0.4)'
    },
    {
      number: 8,
      suffix: '',
      label: 'Editors in our team',
      icon: '✎',
      color: 'from-[#b8e03e] to-[#D3FD50]',
      glowColor: 'rgba(184, 224, 62, 0.3)'
    },
    {
      number: 7,
      suffix: ' years',
      label: 'Post-production experience',
      icon: '⚝',
      color: 'from-[#a3d139] to-[#D3FD50]',
      glowColor: 'rgba(163, 209, 57, 0.35)'
    }
  ], [])

  gsap.registerPlugin(ScrollTrigger)

  // Optimized counter animation using requestAnimationFrame
  const animateCounter = useCallback((element, finalNumber, duration = 1500) => {
    const startTime = performance.now()
    const startValue = 0

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (easeOutQuad)
      const easedProgress = 1 - Math.pow(1 - progress, 2)
      const currentValue = Math.floor(startValue + (finalNumber - startValue) * easedProgress)

      element.textContent = currentValue.toLocaleString()

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  // Memoized hover handlers
  const handleMouseEnter = useCallback((index) => {
    setHoveredCard(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null)
  }, [])

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Simplified title animation
      gsap.fromTo('.stats-title',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: '.stats-title',
            start: 'top 80%',
            once: true
          }
        }
      )

      // Optimized card animations - reduced stagger
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 75%',
            once: true,
            onEnter: () => {
              if (!hasAnimated) {
                // Delay counter animations to avoid simultaneous heavy operations
                setTimeout(() => {
                  const counters = document.querySelectorAll('.counter-number')
                  counters.forEach((counter, index) => {
                    // Stagger counter animations
                    setTimeout(() => {
                      animateCounter(counter, statsData[index].number, 1200)
                    }, index * 80)
                  })
                  setHasAnimated(true)
                }, 200)
              }
            }
          }
        }
      )

      // Simplified line animations - batch process
      gsap.fromTo('.accent-line',
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 0.6,
          duration: 0.4,
          ease: "power1.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 70%',
            once: true
          }
        }
      )
    }, sectionRef)

    return () => {
      ctx.revert()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [hasAnimated, animateCounter, statsData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <section
      id="stats"
      ref={sectionRef}
      className='min-h-screen section-dark text-white relative depth-3 section-transition overflow-hidden'
    >
      {/* Simplified background effects - reduced blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D3FD50] opacity-[0.02] blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#b8e03e] opacity-[0.015] blur-[100px] rounded-full"></div>
      </div>

      <div className="cinematic-overlay"></div>

      <div className='container mx-auto section-padding relative z-10'>
        <div className='flex flex-col items-center justify-center text-center component-margin space-y-4 sm:space-y-6 lg:space-y-8 mx-auto'>
          <h2 className='stats-title font-[font2] heading-responsive-xl uppercase mb-4 sm:mb-6 lg:mb-8 leading-tight text-layer-3 text-glow relative'>
            <span className="relative inline-block">
              A Few Stats About Us
            </span>
          </h2>
        </div>

        <div className='stats-grid responsive-grid-2 max-width-content'>
          {statsData.map((stat, index) => {
            const isHovered = hoveredCard === index
            return (
            <div
              key={index}
              className='stat-card group relative text-center'
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`
                relative h-full
                bg-gradient-to-br from-black/40 via-black/30 to-black/40
                backdrop-blur-xl
                border rounded-[32px]
                p-8 sm:p-10 lg:p-12
                transition-all duration-300 ease-out
                ${isHovered ? 'stat-card-hover' : 'border-white/[0.08]'}
              `}>
                {/* Hover glow effect - optimized */}
                <div
                  className={`absolute inset-0 rounded-[32px] transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${stat.glowColor}, transparent 70%)`
                  }}
                ></div>

                {/* Top border highlight */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D3FD50] to-transparent transition-opacity duration-300 rounded-t-[32px] ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

                <div className='relative z-10'>
                  {/* Icon - simplified animation */}
                  <div className='stat-icon text-4xl sm:text-5xl lg:text-6xl mb-6 sm:mb-8 inline-block'>
                    <span className={`
                      inline-block
                      bg-gradient-to-br ${stat.color}
                      bg-clip-text text-transparent
                      transition-transform duration-200
                      ${isHovered ? 'scale-105' : 'scale-100'}
                    `}
                    style={{
                      filter: `drop-shadow(0 0 12px ${stat.glowColor})`
                    }}>
                      {stat.icon}
                    </span>
                  </div>

                  {/* Counter - optimized */}
                  <div className='mb-4 sm:mb-6 relative'>
                    <div className="inline-block relative">
                      <span
                        className={`
                          counter-number
                          font-[font2]
                          text-5xl sm:text-6xl lg:text-7xl
                          bg-gradient-to-br ${stat.color}
                          bg-clip-text text-transparent
                          inline-block
                          transition-transform duration-200
                          ${isHovered ? 'scale-105' : 'scale-100'}
                        `}
                        style={{
                          filter: `drop-shadow(0 0 16px ${stat.glowColor})`,
                          WebkitTextFillColor: 'transparent',
                          WebkitBackgroundClip: 'text',
                          willChange: isHovered ? 'transform' : 'auto'
                        }}
                      >
                        0
                      </span>
                      <span
                        className={`
                          font-[font2]
                          text-3xl sm:text-4xl lg:text-5xl
                          bg-gradient-to-br ${stat.color}
                          bg-clip-text text-transparent
                          inline-block
                        `}
                        style={{
                          filter: `drop-shadow(0 0 16px ${stat.glowColor})`,
                          WebkitTextFillColor: 'transparent',
                          WebkitBackgroundClip: 'text'
                        }}
                      >
                        {stat.suffix}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <p className='font-[font1] text-base sm:text-lg lg:text-xl leading-relaxed text-white/80 transition-colors duration-200 group-hover:text-white'>
                    {stat.label}
                  </p>

                  {/* Accent line - simplified */}
                  <div className='relative w-full h-[2px] mt-6 sm:mt-8 mx-auto overflow-hidden'>
                    <div
                      className={`
                        accent-line
                        absolute inset-0
                        bg-gradient-to-r from-transparent via-[#D3FD50] to-transparent
                        transition-all duration-200
                        ${isHovered ? 'opacity-100 scale-x-105' : 'opacity-60 scale-x-100'}
                      `}
                      style={{
                        filter: `drop-shadow(0 0 6px ${stat.glowColor})`,
                        willChange: isHovered ? 'transform' : 'auto'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      <style jsx>{`
        /* Hardware-accelerated hover effect */
        .stat-card-hover {
          border-color: rgba(211, 253, 80, 0.3);
          box-shadow: 0 0 40px rgba(211, 253, 80, 0.15);
        }

        /* Optimize for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .stat-card,
          .stat-icon,
          .counter-number,
          .accent-line {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Hover effects only on devices with fine pointers */
        @media (hover: hover) and (pointer: fine) {
          .stat-card:hover {
            transform: translateY(-6px) scale(1.01);
          }
        }

        /* Performance optimization for mobile */
        @media (max-width: 768px) {
          .stat-card {
            /* Reduce blur on mobile for better performance */
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }

          /* Disable hover transforms on touch devices */
          .stat-card:hover {
            transform: none;
          }
        }

        /* Use CSS containment for better rendering performance */
        .stat-card {
          contain: layout style paint;
        }
      `}</style>
    </section>
  )
}

export default StatsSection
