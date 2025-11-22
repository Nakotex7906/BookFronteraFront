import {
    FacebookLogoIcon,
    InstagramLogoIcon,
    XLogoIcon,
    YoutubeLogoIcon
} from "@phosphor-icons/react";

export function Footer() {
    return (
        <footer className="bg-[#111827] text-white">
            <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between lg:px-8">

                {/* Redes Sociales (Orden visual: Derecha en desktop, arriba en móvil si se desea, o abajo) */}
                <div className="flex justify-center gap-6 md:order-2">
                    <a href="https://www.facebook.com/ufro.temuco/?locale=es_LA" className="text-gray-400 hover:text-gray-300 transition-colors">
                        <span className="sr-only">Facebook</span>
                        <FacebookLogoIcon size={22} weight="fill" />
                    </a>
                    <a href="https://www.instagram.com/ufro.temuco/" className="text-gray-400 hover:text-gray-300 transition-colors">
                        <span className="sr-only">Instagram</span>
                        <InstagramLogoIcon size={22} weight="fill" />
                    </a>
                    <a href="https://x.com/UFrontera" className="text-gray-400 hover:text-gray-300 transition-colors">
                        <span className="sr-only">X</span>
                        <XLogoIcon size={22} weight="fill" />
                    </a>
                    <a href="https://www.youtube.com/user/UFRONTERA" className="text-gray-400 hover:text-gray-300 transition-colors">
                        <span className="sr-only">YouTube</span>
                        <YoutubeLogoIcon size={22} weight="fill" />
                    </a>
                </div>

                {/* Copyright */}
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-base leading-5 text-gray-400 md:text-left">
                        &copy; Proyecto BookFrontera.
                    </p>
                </div>
            </div>
        </footer>
    );
}