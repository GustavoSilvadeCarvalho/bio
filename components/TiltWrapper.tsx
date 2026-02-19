"use client";

import React, { useEffect, useRef } from "react";

interface TiltWrapperProps {
    children: React.ReactNode;
    perspective?: number;
    maxRotate?: number;
    scale?: number;
    outerClassName?: string;
    outerStyle?: React.CSSProperties;
    innerClassName?: string;
    innerStyle?: React.CSSProperties;
}

export default function TiltWrapper({ children, perspective = 1000, maxRotate = 20, scale = 1.03, outerClassName, outerStyle, innerClassName, innerStyle }: TiltWrapperProps) {
    const outerRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = outerRef.current;
        const inner = innerRef.current;
        if (!el || !inner) return;
        let raf = 0 as number | undefined;

        const onMove = (ev: MouseEvent | TouchEvent) => {
            const rect = el.getBoundingClientRect();
            const clientX = (ev as MouseEvent).clientX ?? (ev as TouchEvent).touches?.[0]?.clientX;
            const clientY = (ev as MouseEvent).clientY ?? (ev as TouchEvent).touches?.[0]?.clientY;
            if (clientX == null || clientY == null) return;
            const x = (clientX - rect.left) / rect.width;
            const y = (clientY - rect.top) / rect.height;
            const rx = (0.5 - y) * maxRotate;
            const ry = (x - 0.5) * maxRotate;
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale}) translateZ(0)`;
            });
        };

        const onLeave = () => {
            if (raf) cancelAnimationFrame(raf);
            inner.style.transform = `rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)`;
        };

        const onDevice = (e: DeviceOrientationEvent) => {
            const gamma = e.gamma ?? 0;
            const beta = e.beta ?? 0;
            const ry = (gamma / 45) * maxRotate;
            const rx = -(beta / 45) * maxRotate;
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale}) translateZ(0)`;
            });
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('touchmove', onMove as EventListener, { passive: true });
        el.addEventListener('mouseleave', onLeave);
        el.addEventListener('touchend', onLeave as EventListener);
        window.addEventListener('deviceorientation', onDevice as EventListener);

        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('touchmove', onMove as EventListener);
            el.removeEventListener('mouseleave', onLeave);
            el.removeEventListener('touchend', onLeave as EventListener);
            window.removeEventListener('deviceorientation', onDevice as EventListener);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [maxRotate, scale]);

    return (
        <div ref={outerRef} className={outerClassName} style={{ perspective, ...outerStyle }}>
            <div ref={innerRef} className={innerClassName} style={innerStyle}>
                {children}
            </div>
        </div>
    );
}
