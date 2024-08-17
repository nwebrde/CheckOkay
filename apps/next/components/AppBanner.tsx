"use client"

import Link from "next/link"
import parser from 'ua-parser-js';
import Image from "next/image"
import imgSrc from 'app/design/assets/mobileLogo.png'
import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

export function AppBanner() {
    const [visible, setVisible] = useState(false);
    const [ios, setIos] = useState(false);
    const hide = () => {
        setVisible(false)
        document.cookie = `hideAppBar=true;max-age=2592000`
    }

    useEffect(() => {
        const ua = parser(navigator.userAgent);
        const os = ua.os.name;
        const browser = ua.browser.name;

        switch (os) {
            case "iOS":
                if(browser === "Mobile Safari" || browser === "Safari") {
                    setVisible(false)
                }
                else {
                    setIos(true)
                    if(!document.cookie.match(/^(.*;)?\s*hideAppBar\s*=\s*[^;]+(.*)?$/)) {
                        setVisible(true)
                    }
                }
                break;
            case "Android":
            case "Android-x86":
                if(!document.cookie.match(/^(.*;)?\s*hideAppBar\s*=\s*[^;]+(.*)?$/)) {
                    setVisible(true)
                }
                break;
            default:
                setVisible(false)
        }
    }, []);

    return (
        <div
            className={clsx("bg-primary gap-3 h-fit w-full bottom-0 fixed z-50 flex flex-row items-center justify-evenly p-3 overflow-hidden", !visible ? "hidden" : "")}>

            <div
                className="absolute bottom-[-200px] inset-x-0 m-auto h-80 max-w-lg bg-gradient-to-tr from-lime-400 via-teal-900 to-[#C084FC] opacity-50 md:opacity-100 blur-[11rem] dark:blur-[10rem]"></div>

            <svg xmlns="http://www.w3.org/2000/svg" onClick={hide} fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-6 stroke-slate-400 hover:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

            <div className="flex flex-row gap-3 items-center shrink">
                <Image
                    src={imgSrc}
                    width={150}
                    height={150}
                    priority
                    className="fill-primary rounded-xl h-10 w-10 shadow-sm border border-input"
                />
                <div className="flex flex-col">
              <span className="text-white text-md font-semibold leading-tight">
                CheckOkay
            </span>
                    <span className="text-slate-300 text-sm font-light">
                Deine Freunde beschützen dich
            </span>
                </div>
            </div>

            <div className="flex flex-col">

                <Link
                    href={ios ? process.env.IOS_APP_LINK : process.env.ANDROID_APP_LINK}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground border border-input bg-white shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-slate-900"
                >
                    <span className="hidden min-[400px]:block">{ios ? "im App Store" : "in Google Play"} laden</span>
                    <span className="min-[400px]:hidden">Laden</span>
                </Link>
            </div>
        </div>


    )
}