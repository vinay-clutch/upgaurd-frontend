'use client'

import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Menu, X } from 'lucide-react'
import { Button } from './button'
import { AnimatedGroup } from './animated-group'
import { cn } from '../../lib/utils'
import { useScroll } from 'framer-motion'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden bg-background">
                <section>
                    <div className="relative pt-24 min-h-screen flex items-center">
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
                        <div className="mx-auto max-w-5xl px-6">
                            <div className="sm:mx-auto lg:mr-auto">
                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                >
                                    <h1
                                        className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 text-white leading-tight">
                                        Monitor Your Digital Health with <span className="text-primary">UpGuard</span>
                                    </h1>
                                    <p
                                        className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground">
                                        The ultimate suite for uptime monitoring, real-time analytics, and incident management. Build trust with your users and resolve issues before they notice.
                                    </p>
                                    <div className="mt-12 flex items-center gap-4">
                                        <div
                                            className="bg-primary/10 rounded-[14px] border border-primary/20 p-0.5">
                                            <Button
                                                asChild
                                                size="lg"
                                                className="rounded-xl px-8 text-base bg-primary text-black hover:bg-primary/90">
                                                <Link to="/register">
                                                    <span className="text-nowrap">Start Building</span>
                                                </Link>
                                            </Button>
                                        </div>
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="ghost"
                                            className="h-[52px] rounded-xl px-8 text-base text-white hover:bg-white/5 border border-white/10">
                                            <Link to="/login">
                                                <span className="text-nowrap">View Dashboard</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>
                        
                        {/* Interactive UI Mockup */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 hidden lg:block pointer-events-none opacity-40">
                             <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 1.2,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}>
                                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-2xl">
                                    <div className="flex gap-2 mb-4">
                                        <div className="size-3 rounded-full bg-red-500/50" />
                                        <div className="size-3 rounded-full bg-yellow-500/50" />
                                        <div className="size-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 w-3/4 bg-white/5 rounded" />
                                        <div className="h-32 w-full bg-primary/5 rounded border border-primary/20 flex items-center justify-center">
                                            <div className="text-primary text-xs font-mono">LIVE_TRAFFIC_MONITOR</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="h-12 bg-white/5 rounded" />
                                            <div className="h-12 bg-white/5 rounded" />
                                            <div className="h-12 bg-white/5 rounded" />
                                        </div>
                                    </div>
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>

                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="text-center mb-12">
                            <p className="text-sm font-semibold tracking-widest text-primary uppercase">Trusted by leading teams</p>
                        </div>
                        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-12 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                             {['nvidia', 'github', 'openai', 'laravel'].map((logo) => (
                                <div key={logo} className="flex justify-center">
                                    <img
                                        className="h-8 w-auto invert opacity-50 transition-all hover:opacity-100"
                                        src={`https://html.tailus.io/blocks/customers/${logo}.svg`}
                                        alt={`${logo} Logo`}
                                    />
                                </div>
                             ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                className={cn('group fixed z-50 w-full transition-all duration-300 py-4', scrolled ? 'bg-background/80 backdrop-blur-3xl border-b border-white/5 py-3' : 'bg-transparent')}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-12">
                            <Link to="/" className="flex items-center space-x-2">
                                <span className="text-2xl">🛡️</span>
                                <span className="text-xl font-bold tracking-tighter text-white">UpGuard</span>
                            </Link>

                            <div className="hidden md:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={item.href}
                                                className="text-muted-foreground hover:text-white transition-colors">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button asChild variant="ghost" className="hidden sm:inline-flex text-white hover:bg-white/5">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="bg-primary text-black hover:bg-primary/90">
                                <Link to="/register">Sign Up</Link>
                            </Button>
                            
                            <button
                                onClick={() => setMenuState(!menuState)}
                                className="md:hidden text-white p-2">
                                {menuState ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {menuState && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-white/5 p-6 animate-in slide-in-from-top duration-300">
                        <ul className="space-y-4">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.href}
                                        onClick={() => setMenuState(false)}
                                        className="block text-lg text-muted-foreground hover:text-white">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-4 flex flex-col gap-2">
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button asChild className="w-full bg-primary text-black">
                                    <Link to="/register">Sign Up</Link>
                                </Button>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    )
}
