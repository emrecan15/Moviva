import {
  BsFilm,
  BsFacebook,
  BsTwitterX,
  BsInstagram,
  BsYoutube,
} from "react-icons/bs";
import { MdArrowRight } from "react-icons/md";
import Logo from "../../ui/Logo";

const socials = [
  { icon: BsFacebook, href: "#1" },
  { icon: BsTwitterX, href: "#2" },
  { icon: BsInstagram, href: "#3" },
  { icon: BsYoutube, href: "#4" },
];

const exploreLinks = [
  {
    text: "Tüm Filmler",
    href: "/filmler",
  },
  {
    text: "En Çok Beğenilenler",
    href: "/en-cok-begenilenler",
  },
  {
    text: "Yeni Eklenenler",
    href: "/new",
  },
  {
    text: "Kategoriler",
    href: "/categories",
  },
  {
    text: "Top 100",
    href: "/top100",
  },
];

const communityLinks = [
  {
    text: "Film Öner",
    href: "/filmoner",
  },
  {
    text: "Yorumlar",
    href: "/yorumlar",
  },
  {
    text: "Listeler",
    href: "/listeler",
  },
  {
    text: "Kullanıcılar",
    href: "/users",
  },
  {
    text: "Forum",
    href: "/forum",
  },
];

const supportLinks = [
  {
    text: "Hakkımızda",
    href: "/hakkimizda",
  },
  {
    text: "İletişim",
    href: "/iletisim",
  },
  {
    text: "Geri Bildirim",
    href: "/geri-bildirim",
  },
  {
    text: "SSS",
    href: "/sss",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden w-full border-t border-rating bg-cardbg">
      <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-background to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <FooterBrand />
          </div>

          <div className="lg:col-span-2">
            <FooterLinks title="Keşfet" links={exploreLinks} />
          </div>

          <div className="lg:col-span-2">
            <FooterLinks title="Topluluk" links={communityLinks} />
          </div>

          <div className="lg:col-span-2">
            <FooterLinks title="Destek" links={supportLinks} />
          </div>

          <div className="lg:col-span-2">
            <FooterTmdb />
          </div>
        </div>

        <div className="border-t border-rating py-5 text-center text-sm text-gray-500">
          © 2026 Moviva • Film verileri TMDB tarafından sağlanmaktadır.
        </div>
      </div>
    </footer>
  );
}

function FooterBrand() {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-2xl font-bold text-logo">
        <Logo />
      </h4>

      <p className="mt-4 text-sm leading-7 text-slogan">
        Topluluk tarafından önerilen en iyi filmleri keşfedin ve kendi
        önerilerinizi paylaşın. Film severlerin buluşma noktası.
      </p>

      <div className="mt-6 flex gap-3">
        {socials.map((social) => (
          <a
            key={social.href}
            href={social.href}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-rating bg-background text-slogan transition-all duration-300 hover:border-danger hover:bg-danger hover:text-white"
          >
            <social.icon />
          </a>
        ))}
      </div>
    </div>
  );
}

function FooterLinks({ title, links }) {
  return (
    <>
      <h5 className="text-lg font-semibold text-logo">{title}</h5>

      <div className="mt-2 mb-5 h-0.5 w-10 rounded-full bg-danger" />

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="group flex items-center gap-2 text-sm text-slogan transition-colors hover:text-danger"
            >
              <MdArrowRight className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                {link.text}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

function FooterTmdb() {
  return (
    <>
      <h5 className="text-lg font-semibold text-logo">Veri Kaynağı</h5>

      <div className="mt-2 mb-5 h-0.5 w-10 rounded-full bg-danger" />

      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-3 rounded-2xl border border-rating bg-background p-4 transition-all duration-300 hover:border-danger hover:shadow-lg"
      >
        <img
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
          alt="TMDB"
          className="h-11 w-11 rounded"
        />

        <span className="text-xs leading-5 text-slogan">
          Film verileri
          <br />
          <strong className="text-tmdb">TMDB</strong>
          <br />
          tarafından sağlanmaktadır.
        </span>
      </a>
    </>
  );
}
