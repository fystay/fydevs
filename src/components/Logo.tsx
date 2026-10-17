import Image from "next/image";
import logo from "../../public/brand/fydevs-logo-462.png";

/** The supplied FY Devs lockup (icon + wordmark), used unmodified. */
export function Logo({ preload = false }: { preload?: boolean }) {
  return <Image src={logo} alt="FY Devs" preload={preload} sizes="120px" />;
}
